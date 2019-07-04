function isDataUri(url: string) {
    return url.match(/^data:/);
}

function isPercentage(str: string) {
    return str[str.length - 1] == '%';
}

function createImageData(width: number, height: number) {
    try {
        return new ImageData(width, height);
    }
    catch (e) {
        // Fallback for IE
        var canvas = document.createElement('canvas');
        return (canvas.getContext('2d') || new CanvasRenderingContext2D()).createImageData(width, height);
    }
}

function extractUrl(value: string) {
    var urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
    if (urlMatch == null) {
        return null;
    }

    return urlMatch[1];
}

function translateBackgroundPosition(value: string) {
    var parts = value.split(' ');

    if (parts.length === 1) {
        switch (value) {
            case 'center':
                return ['50%', '50%'];
            case 'top':
                return ['50%', '0'];
            case 'bottom':
                return ['50%', '100%'];
            case 'left':
                return ['0', '50%'];
            case 'right':
                return ['100%', '50%'];
            default:
                return [value, '50%'];
        }
    }
    else {
        return parts.map(function (part) {
            switch (value) {
                case 'center':
                    return '50%';
                case 'top':
                case 'left':
                    return '0';
                case 'right':
                case 'bottom':
                    return '100%';
                default:
                    return part;
            }
        });
    }
}

const transparentPixels = createImageData(32, 32);

interface Options {
    interactive?: boolean;

    resolution?: number;
    perturbance?: number;
    dropRadius?: number;

    crossOrigin?: string;
    imageUrl?: string;
}

interface Program {
    id: WebGLProgram;
    locations: { [key: string]: WebGLUniformLocation };
    uniforms: any
}

class WaterRipple {
    private canvas = document.createElement('canvas');
    private gl = (this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')) || new WebGLRenderingContext();

    private textures = new Array<(WebGLTexture)>();
    private framebuffers = new Array<(WebGLFramebuffer)>();
    private bufferWriteIndex = 0;
    private bufferReadIndex = 1;
    private quad!: WebGLBuffer;

    private dropProgram!: Program;
    private updateProgram!: Program;
    private renderProgram!: Program;

    private backgroundTexture!: WebGLTexture;

    private originalInlineCss!: string | null;
    private originalCssBackgroundImage?: string;
    private imageSource?: string;
    private backgroundWidth: number = 0;
    private backgroundHeight: number = 0;

    private visible = false;
    private running = false;
    private inited = false;
    private destroyed = false;

    el: HTMLElement;
    interactive: boolean;
    resolution: number;
    perturbance: number;
    dropRadius: number;
    crossOrigin: string;
    imageUrl: string;

    get textureDelta() {
        return new Float32Array([1 / this.resolution, 1 / this.resolution]);
    }
    get config() {
        const { gl } = this;
        if (!gl) {
            // Browser does not support WebGL.
            return null;
        }

        // Load extensions
        var extensions: { [key: string]: any } = {};
        [
            'OES_texture_float',
            'OES_texture_half_float',
            'OES_texture_float_linear',
            'OES_texture_half_float_linear'
        ].forEach(function (name) {
            var extension = gl.getExtension(name);
            if (extension) {
                extensions[name] = extension;
            }
        });

        // If no floating point extensions are supported we can bail out early.
        if (!extensions.OES_texture_float) {
            return null;
        }

        var configs = [];

        function createConfig(type: string, glType: any, arrayType: any) {
            var name = 'OES_texture_' + type,
                nameLinear = name + '_linear',
                linearSupport = nameLinear in extensions,
                configExtensions = [name];

            if (linearSupport) {
                configExtensions.push(nameLinear);
            }

            return {
                type: glType,
                arrayType: arrayType,
                linearSupport: linearSupport,
                extensions: configExtensions
            };
        }

        configs.push(
            createConfig('float', gl.FLOAT, Float32Array)
        );

        if (extensions.OES_texture_half_float) {
            configs.push(
                // Array type should be Uint16Array, but at least on iOS this breaks. In this case we
                // just initialize the textures with data=null, instead of data=new Uint16Array(...).
                // This makes initialization a tad slower, but it's still negligible.
                createConfig('half_float', extensions.OES_texture_half_float.HALF_FLOAT_OES, null)
            );
        }

        // Setup the texture and framebuffer
        var texture = gl.createTexture();
        var framebuffer = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Check for each supported texture type if rendering to it is supported
        var config = null;

        for (var i = 0; i < configs.length; i++) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, configs[i].type, null);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                config = configs[i];
                break;
            }
        }

        return config;
    }

    private compileSource(type: any, source: any) {
        const { gl } = this;
        const shader = gl.createShader(type);
        if (shader) {
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
            }
        }
        return shader;
    }

    createProgram(vertexSource: any, fragmentSource: any, uniformValues?: any) {
        console.log(this);
        const { gl } = this;

        const program: Program = {
            id: gl.createProgram() || new WebGLProgram(),
            locations: {},
            uniforms: {}
        };

        gl.attachShader(program.id, this.compileSource(gl.VERTEX_SHADER, vertexSource) || new WebGLShader());
        gl.attachShader(program.id, this.compileSource(gl.FRAGMENT_SHADER, fragmentSource) || new WebGLShader());
        gl.linkProgram(program.id);
        if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
            throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
        }

        // Fetch the uniform and attribute locations

        gl.useProgram(program.id);
        gl.enableVertexAttribArray(0);
        var match, name, regex = /uniform (\w+) (\w+)/g, shaderCode = vertexSource + fragmentSource;
        while ((match = regex.exec(shaderCode)) != null) {
            name = match[2];
            program.locations[name] = gl.getUniformLocation(program.id, name) || new WebGLUniformLocation();
        }

        return program;
    }

    bindTexture(texture: WebGLTexture, unit?: number) {
        const { gl } = this;
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    drop(x: number, y: number, radius: number, strength: number) {
        const { gl } = this;

        const elWidth = this.el.clientWidth;
        const elHeight = this.el.clientHeight;
        const longestSide = Math.max(elWidth, elHeight);

        radius = radius / longestSide;

        const dropPosition = new Float32Array([
            (2 * x - elWidth) / longestSide,
            (elHeight - 2 * y) / longestSide
        ]);

        if (gl) {
            gl.viewport(0, 0, this.resolution, this.resolution);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]);
            this.bindTexture(this.textures[this.bufferReadIndex]);

            gl.useProgram(this.dropProgram.id);
            gl.uniform2fv(this.dropProgram.locations.center, dropPosition);
            gl.uniform1f(this.dropProgram.locations.radius, radius);
            gl.uniform1f(this.dropProgram.locations.strength, strength);

            this.drawQuad();
            this.swapBufferIndices();
        }
    }

    private drawQuad() {
        const { gl } = this;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }


    private swapBufferIndices() {
        this.bufferWriteIndex = 1 - this.bufferWriteIndex;
        this.bufferReadIndex = 1 - this.bufferReadIndex;
    }

    dropAtPointer(pointer: MouseEvent | Touch, radius: number, strength: number) {
        const borderLeft = parseInt((this.el.style.borderLeftWidth || 0).toString());
        const borderTop = parseInt((this.el.style.borderTopWidth || 0).toString());

        this.drop(
            pointer.pageX - this.el.offsetLeft - borderLeft,
            pointer.pageY - this.el.offsetTop - borderTop,
            radius,
            strength
        );
    }

    private hideCssBackground() {

        // Check whether we're changing inline CSS or overriding a global CSS rule.
        var inlineCss = this.el.style.backgroundImage;

        if (inlineCss == 'none') {
            return;
        }

        this.originalInlineCss = inlineCss;

        this.originalCssBackgroundImage = this.el.style.backgroundImage || '';
        this.el.style.backgroundImage = 'none';
    }

    private updateSize() {
        const newWidth = this.el.clientWidth;
        const newHeight = this.el.clientHeight;

        if (newWidth != this.canvas.width || newHeight != this.canvas.height) {
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
        }
    }

    private initShaders() {
        const { gl } = this;
        const vertexShader = [
            'attribute vec2 vertex;',
            'varying vec2 coord;',
            'void main() {',
            'coord = vertex * 0.5 + 0.5;',
            'gl_Position = vec4(vertex, 0.0, 1.0);',
            '}'
        ].join('\n');

        this.dropProgram = this.createProgram(vertexShader, [
            'precision highp float;',

            'const float PI = 3.141592653589793;',
            'uniform sampler2D texture;',
            'uniform vec2 center;',
            'uniform float radius;',
            'uniform float strength;',

            'varying vec2 coord;',

            'void main() {',
            'vec4 info = texture2D(texture, coord);',

            'float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);',
            'drop = 0.5 - cos(drop * PI) * 0.5;',

            'info.r += drop * strength;',

            'gl_FragColor = info;',
            '}'
        ].join('\n'));

        this.updateProgram = this.createProgram(vertexShader, [
            'precision highp float;',

            'uniform sampler2D texture;',
            'uniform vec2 delta;',

            'varying vec2 coord;',

            'void main() {',
            'vec4 info = texture2D(texture, coord);',

            'vec2 dx = vec2(delta.x, 0.0);',
            'vec2 dy = vec2(0.0, delta.y);',

            'float average = (',
            'texture2D(texture, coord - dx).r +',
            'texture2D(texture, coord - dy).r +',
            'texture2D(texture, coord + dx).r +',
            'texture2D(texture, coord + dy).r',
            ') * 0.25;',

            'info.g += (average - info.r) * 2.0;',
            'info.g *= 0.995;',
            'info.r += info.g;',

            'gl_FragColor = info;',
            '}'
        ].join('\n'));

        gl.uniform2fv(this.updateProgram.locations.delta, this.textureDelta);

        this.renderProgram = this.createProgram([
            'precision highp float;',

            'attribute vec2 vertex;',
            'uniform vec2 topLeft;',
            'uniform vec2 bottomRight;',
            'uniform vec2 containerRatio;',
            'varying vec2 ripplesCoord;',
            'varying vec2 backgroundCoord;',
            'void main() {',
            'backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);',
            'backgroundCoord.y = 1.0 - backgroundCoord.y;',
            'ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;',
            'gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);',
            '}'
        ].join('\n'), [
            'precision highp float;',

            'uniform sampler2D samplerBackground;',
            'uniform sampler2D samplerRipples;',
            'uniform vec2 delta;',

            'uniform float perturbance;',
            'varying vec2 ripplesCoord;',
            'varying vec2 backgroundCoord;',

            'void main() {',
            'float height = texture2D(samplerRipples, ripplesCoord).r;',
            'float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;',
            'float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;',
            'vec3 dx = vec3(delta.x, heightX - height, 0.0);',
            'vec3 dy = vec3(0.0, heightY - height, delta.y);',
            'vec2 offset = -normalize(cross(dy, dx)).xz;',
            'float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);',
            'gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;',
            '}'
        ].join('\n'));

        gl.uniform2fv(this.renderProgram.locations.delta, this.textureDelta);
    }

    private initTexture() {
        const { gl } = this;
        this.backgroundTexture = gl.createTexture() || new WebGLTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    private loadImage() {
        const { gl } = this;

        var newImageSource = this.imageUrl ||
            extractUrl(this.originalCssBackgroundImage || '') ||
            extractUrl(this.el.style.backgroundImage || '');

        // If image source is unchanged, don't reload it.
        if (newImageSource == this.imageSource) {
            return;
        }

        this.imageSource = newImageSource || '';

        // Falsy source means no background.
        if (!this.imageSource) {
            this.setTransparentTexture();
            return;
        }

        // Load the texture from a new image.
        const image = new Image;
        image.onload = () => {
            // Only textures with dimensions of powers of two can have repeat wrapping.
            function isPowerOfTwo(x: number) {
                return (x & (x - 1)) == 0;
            }

            var wrapping = (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) ? gl.REPEAT : gl.CLAMP_TO_EDGE;

            gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            this.backgroundWidth = image.width;
            this.backgroundHeight = image.height;

            // Hide the background this we're replacing.
            this.hideCssBackground();
        };

        // Fall back to a transparent texture when loading the image failed.
        image.onerror = () => {
            this.setTransparentTexture();
        };

        // Disable CORS when the image source is a data URI.
        image.crossOrigin = isDataUri(this.imageSource) ? null : this.crossOrigin;

        image.src = this.imageSource;
    }

    private setTransparentTexture() {
        const { gl } = this;
        gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, transparentPixels);
    }

    private setupPointerEvents() {
        const pointerEventsEnabled = () => {
            return this.visible && this.running && this.interactive;
        }

        const dropAtPointer = (pointer: MouseEvent | Touch, big?: boolean) => {
            if (pointerEventsEnabled()) {
                this.dropAtPointer(
                    pointer,
                    this.dropRadius * (big ? 1.5 : 1),
                    (big ? 0.14 : 0.01)
                );
            }
        }

        this.el.addEventListener('mousemove', e => {
            dropAtPointer(e);
        });

        this.el.addEventListener('touchmove', e => {
            const touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                dropAtPointer(touches[i]);
            }
        });

        this.el.addEventListener('touchstart', e => {
            const touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                dropAtPointer(touches[i]);
            }
        });

        this.el.addEventListener('mousedown', e => {
            dropAtPointer(e, true);
        });
    }

    private step() {
        if (!this.visible) {
            return;
        }

        this.computeTextureBoundaries();

        if (this.running) {
            this.update();
        }

        this.render();
    };

    private computeTextureBoundaries() {
        var backgroundSize = this.el.style.backgroundSize || '';
        var backgroundAttachment = this.el.style.backgroundAttachment;
        var backgroundPosition = translateBackgroundPosition(this.el.style.backgroundPosition || '');

        // Here the 'container' is the element which the background adapts to
        // (either the chrome window or some element, depending on attachment)
        var container;
        if (backgroundAttachment == 'fixed') {
            container = { left: window.pageXOffset, top: window.pageYOffset, width: window.innerWidth, height: window.innerHeight };
        }
        else {
            container = {
                top: this.el.offsetTop,
                left: this.el.offsetLeft,
                width: this.el.clientWidth,
                height: this.el.clientHeight
            }
        }

        let backgroundWidth: number | string = '';
        let backgroundHeight: number | string = '';

        // TODO: background-clip
        if (backgroundSize == 'cover') {
            var scale = Math.max(container.width / this.backgroundWidth, container.height / this.backgroundHeight);

            backgroundWidth = this.backgroundWidth * scale;
            backgroundHeight = this.backgroundHeight * scale;
        }
        else if (backgroundSize == 'contain') {
            var scale = Math.min(container.width / this.backgroundWidth, container.height / this.backgroundHeight);

            backgroundWidth = this.backgroundWidth * scale;
            backgroundHeight = this.backgroundHeight * scale;
        }
        else {
            const backgroundSizeSplit = backgroundSize.split(' ');
            backgroundWidth = backgroundSizeSplit[0] || '';
            backgroundHeight = backgroundSizeSplit[1] || backgroundWidth;

            if (isPercentage(backgroundWidth)) {
                backgroundWidth = container.width * parseFloat(backgroundWidth) / 100;
            }
            else if (backgroundWidth != 'auto') {
                backgroundWidth = parseFloat(backgroundWidth);
            }

            if (isPercentage(backgroundHeight)) {
                backgroundHeight = container.height * parseFloat(backgroundHeight) / 100;
            }
            else if (backgroundHeight != 'auto') {
                backgroundHeight = parseFloat(backgroundHeight);
            }

            if (backgroundWidth == 'auto' && backgroundHeight == 'auto') {
                backgroundWidth = this.backgroundWidth;
                backgroundHeight = this.backgroundHeight;
            }
            else {
                if (backgroundWidth == 'auto') {
                    backgroundWidth = this.backgroundWidth * ((backgroundHeight as number) / this.backgroundHeight);
                }

                if (backgroundHeight == 'auto') {
                    backgroundHeight = this.backgroundHeight * (backgroundWidth / this.backgroundWidth);
                }
            }
        }

        // Compute backgroundX and backgroundY in page coordinates
        var backgroundX: string | number = backgroundPosition[0];
        var backgroundY: string | number = backgroundPosition[1];

        if (isPercentage(backgroundX)) {
            backgroundX = container.left + (container.width - backgroundWidth) * parseFloat(backgroundX) / 100;
        }
        else {
            backgroundX = container.left + parseFloat(backgroundX);
        }

        if (isPercentage(backgroundY)) {
            backgroundY = container.top + (container.height - backgroundHeight) * parseFloat(backgroundY) / 100;
        }
        else {
            backgroundY = container.top + parseFloat(backgroundY);
        }

        var elementOffset = {
            top: this.el.offsetTop,
            left: this.el.offsetLeft
        };

        this.renderProgram.uniforms.topLeft = new Float32Array([
            (elementOffset.left - backgroundX) / backgroundWidth,
            (elementOffset.top - backgroundY) / backgroundHeight
        ]);

        this.renderProgram.uniforms.bottomRight = new Float32Array([
            this.renderProgram.uniforms.topLeft[0] + this.el.clientWidth / backgroundWidth,
            this.renderProgram.uniforms.topLeft[1] + this.el.clientHeight / backgroundHeight
        ]);

        var maxSide = Math.max(this.canvas.width, this.canvas.height);

        this.renderProgram.uniforms.containerRatio = new Float32Array([
            this.canvas.width / maxSide,
            this.canvas.height / maxSide
        ]);
    }

    private update() {
        const { gl } = this;
        gl.viewport(0, 0, this.resolution, this.resolution);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]);
        this.bindTexture(this.textures[this.bufferReadIndex]);
        gl.useProgram(this.updateProgram.id);

        this.drawQuad();

        this.swapBufferIndices();
    }

    private render() {
        const { gl } = this;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        gl.enable(gl.BLEND);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.renderProgram.id);

        this.bindTexture(this.backgroundTexture, 0);
        this.bindTexture(this.textures[0], 1);

        gl.uniform1f(this.renderProgram.locations.perturbance, this.perturbance);
        gl.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft);
        gl.uniform2fv(this.renderProgram.locations.bottomRight, this.renderProgram.uniforms.bottomRight);
        gl.uniform2fv(this.renderProgram.locations.containerRatio, this.renderProgram.uniforms.containerRatio);
        gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
        gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);

        this.drawQuad();
        gl.disable(gl.BLEND);
    }

    constructor(el: HTMLElement, options: Options = {}) {
        this.el = el;
        this.interactive = options.interactive === undefined ? true : options.interactive;
        this.resolution = options.resolution || 512;

        this.perturbance = options.perturbance || 0.03;
        this.dropRadius = options.dropRadius || 20;

        this.crossOrigin = options.crossOrigin || '';
        this.imageUrl = options.imageUrl || '';

        const { gl, config, canvas } = this;

        if (config) {
            const { arrayType } = config;
            const textureData = arrayType ? new arrayType(this.resolution * this.resolution * 4) : null;

            for (let i = 0; i < 2; i++) {
                const texture = gl.createTexture();
                const framebuffer = gl.createFramebuffer();

                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.resolution, this.resolution, 0, gl.RGBA, config.type, textureData);

                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

                !!texture && this.textures.push(texture);
                !!framebuffer && this.framebuffers.push(framebuffer);
            }

            // 创建WebGL画布
            canvas.width = el.clientWidth;
            canvas.height = el.clientHeight;
            this.canvas = canvas;
            canvas.setAttribute('style', 'position: "absolute"; left: 0; top: 0; right: 0; bottom: 0; zIndex: -1；');

            this.el.classList.add('mp-water-ripple');
            this.el.appendChild(this.canvas);

            // WebGL插件
            config.extensions.forEach(function (name) {
                gl.getExtension(name);
            });

            // 监听窗口变化
            window.addEventListener('resize', () => {
                this.updateSize();
            })

            // 初始化GL
            this.quad = gl.createBuffer() || new WebGLBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                +1, -1,
                +1, +1,
                -1, +1
            ]), gl.STATIC_DRAW);

            this.initShaders();
            this.initTexture();
            this.setTransparentTexture();

            // Load the image either from the options or CSS rules
            this.loadImage();

            // Set correct clear color and blend mode (regular alpha blending)
            gl.clearColor(0, 0, 0, 0);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // Plugin is successfully initialized!
            this.visible = true;
            this.running = true;
            this.inited = true;
            this.destroyed = false;

            this.setupPointerEvents();

            const step = () => {
                if (!this.destroyed) {
                    this.step();
                    requestAnimationFrame(step);
                }

            }

            requestAnimationFrame(step);
        }

    }
}

export default WaterRipple;