!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var i in r)("object"==typeof exports?exports:e)[i]=r[i]}}(window,function(){return(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,function(e,t,r){},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},,function(t,e){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e){return"function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?t.exports=i=function(e){return r(e)}:t.exports=i=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":r(e)},i(e)}t.exports=i},,function(e,t,r){e.exports=r(11)},function(e,n,o){(function(e){var t=void 0!==e&&e||"undefined"!=typeof self&&self||window,r=Function.prototype.apply;function i(e,t){this._id=e,this._clearFn=t}n.setTimeout=function(){return new i(r.call(setTimeout,t,arguments),clearTimeout)},n.setInterval=function(){return new i(r.call(setInterval,t,arguments),clearInterval)},n.clearTimeout=n.clearInterval=function(e){e&&e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(t,this._id)},n.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},n.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},n._unrefActive=n.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;0<=t&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},o(8),n.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,n.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,o(2))},function(e,t,r){(function(e,p){!function(r,i){"use strict";if(!r.setImmediate){var n,o,t,a,s=1,u={},c=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,n="[object process]"==={}.toString.call(r.process)?function(e){p.nextTick(function(){h(e)})}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*")}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){h(e.data)},function(e){t.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(o=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){h(e),t.onreadystatechange=null,o.removeChild(t),t=null},o.appendChild(t)}):function(e){setTimeout(h,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var i={callback:e,args:t};return u[s]=i,n(s),s++},e.clearImmediate=f}function f(e){delete u[e]}function h(e){if(c)setTimeout(h,0,e);else{var t=u[e];if(t){c=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(i,r)}}(t)}finally{f(e),c=!1}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&h(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,r(2),r(9))},function(e,t){var r,i,n=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(t){if(r===setTimeout)return setTimeout(t,0);if((r===o||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:o}catch(e){r=o}try{i="function"==typeof clearTimeout?clearTimeout:a}catch(e){i=a}}();var u,c=[],l=!1,f=-1;function h(){l&&u&&(l=!1,u.length?c=u.concat(c):f=-1,c.length&&d())}function d(){if(!l){var e=s(h);l=!0;for(var t=c.length;t;){for(u=c,c=[];++f<t;)u&&u[f].run();f=-1,t=c.length}u=null,l=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===a||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function m(){}n.nextTick=function(e){var t=new Array(arguments.length-1);if(1<arguments.length)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];c.push(new p(e,t)),1!==c.length||l||s(d)},p.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=m,n.addListener=m,n.once=m,n.off=m,n.removeListener=m,n.removeAllListeners=m,n.emit=m,n.prependListener=m,n.prependOnceListener=m,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}},function(e,t,r){"use strict";var i=r(1);r.n(i).a},function(e,t,r){"use strict";r.r(t);var i=r(0);function d(e){return"%"==e[e.length-1]}function o(e){var t=/url\(["']?([^"']*)["']?\)/.exec(e);return null==t?null:t[1]}var n=function(t,r){try{return new ImageData(t,r)}catch(e){return(document.createElement("canvas").getContext("2d")||new CanvasRenderingContext2D).createImageData(t,r)}}(32,32);function a(e,t){var r=this;void 0===t&&(t={}),this.canvas=document.createElement("canvas"),this.gl=this.canvas.getContext("webgl")||this.canvas.getContext("experimental-webgl")||new WebGLRenderingContext,this.textures=new Array,this.framebuffers=new Array,this.bufferWriteIndex=0,this.bufferReadIndex=1,this.backgroundWidth=0,this.backgroundHeight=0,this.visible=!1,this.running=!1,this.inited=!1,this.destroyed=!1,this.el=e,this.interactive=void 0===t.interactive||t.interactive,this.resolution=t.resolution||512,this.perturbance=t.perturbance||.03,this.dropRadius=t.dropRadius||20,this.crossOrigin=t.crossOrigin||"",this.imageUrl=t.imageUrl||"";var i=this.gl,n=this.config,o=this.canvas;if(n){for(var a=n.arrayType,s=a?new a(this.resolution*this.resolution*4):null,u=0;u<2;u++){var c=i.createTexture(),l=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,l),i.bindTexture(i.TEXTURE_2D,c),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,n.linearSupport?i.LINEAR:i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,n.linearSupport?i.LINEAR:i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.resolution,this.resolution,0,i.RGBA,n.type,s),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,c,0),c&&this.textures.push(c),l&&this.framebuffers.push(l)}o.width=e.clientWidth,o.height=e.clientHeight,(this.canvas=o).setAttribute("style",'position: "absolute"; left: 0; top: 0; right: 0; bottom: 0; zIndex: -1；'),this.el.classList.add("mp-water-ripple"),this.el.appendChild(this.canvas),n.extensions.forEach(function(e){i.getExtension(e)}),window.addEventListener("resize",function(){r.updateSize()}),this.quad=i.createBuffer()||new WebGLBuffer,i.bindBuffer(i.ARRAY_BUFFER,this.quad),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,1]),i.STATIC_DRAW),this.initShaders(),this.initTexture(),this.setTransparentTexture(),this.loadImage(),i.clearColor(0,0,0,0),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),this.visible=!0,this.running=!0,this.inited=!0,this.destroyed=!1,this.setupPointerEvents();requestAnimationFrame(function e(){r.destroyed||(r.step(),requestAnimationFrame(e))})}}function s(){var e=this.$createElement;return(this._self._c||e)("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"app"},[this._v("11111111")])}var u=(Object.defineProperty(a.prototype,"textureDelta",{get:function(){return new Float32Array([1/this.resolution,1/this.resolution])},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"config",{get:function(){var r=this.gl;if(!r)return null;var s={};if(["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear"].forEach(function(e){var t=r.getExtension(e);t&&(s[e]=t)}),!s.OES_texture_float)return null;var e=[];function t(e,t,r){var i="OES_texture_"+e,n=i+"_linear",o=n in s,a=[i];return o&&a.push(n),{type:t,arrayType:r,linearSupport:o,extensions:a}}e.push(t("float",r.FLOAT,Float32Array)),s.OES_texture_half_float&&e.push(t("half_float",s.OES_texture_half_float.HALF_FLOAT_OES,null));var i=r.createTexture(),n=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,n),r.bindTexture(r.TEXTURE_2D,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);for(var o=null,a=0;a<e.length;a++)if(r.texImage2D(r.TEXTURE_2D,0,r.RGBA,32,32,0,r.RGBA,e[a].type,null),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,i,0),r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE){o=e[a];break}return o},enumerable:!0,configurable:!0}),a.prototype.compileSource=function(e,t){var r=this.gl,i=r.createShader(e);if(i&&(r.shaderSource(i,t),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS)))throw new Error("compile error: "+r.getShaderInfoLog(i));return i},a.prototype.createProgram=function(e,t,r){console.log(this);var i=this.gl,n={id:i.createProgram()||new WebGLProgram,locations:{},uniforms:{}};if(i.attachShader(n.id,this.compileSource(i.VERTEX_SHADER,e)||new WebGLShader),i.attachShader(n.id,this.compileSource(i.FRAGMENT_SHADER,t)||new WebGLShader),i.linkProgram(n.id),!i.getProgramParameter(n.id,i.LINK_STATUS))throw new Error("link error: "+i.getProgramInfoLog(n.id));i.useProgram(n.id),i.enableVertexAttribArray(0);for(var o,a,s=/uniform (\w+) (\w+)/g,u=e+t;null!=(o=s.exec(u));)a=o[2],n.locations[a]=i.getUniformLocation(n.id,a)||new WebGLUniformLocation;return n},a.prototype.bindTexture=function(e,t){var r=this.gl;r.activeTexture(r.TEXTURE0+(t||0)),r.bindTexture(r.TEXTURE_2D,e)},a.prototype.drop=function(e,t,r,i){var n=this.gl,o=this.el.clientWidth,a=this.el.clientHeight,s=Math.max(o,a);r/=s;var u=new Float32Array([(2*e-o)/s,(a-2*t)/s]);n&&(n.viewport(0,0,this.resolution,this.resolution),n.bindFramebuffer(n.FRAMEBUFFER,this.framebuffers[this.bufferWriteIndex]),this.bindTexture(this.textures[this.bufferReadIndex]),n.useProgram(this.dropProgram.id),n.uniform2fv(this.dropProgram.locations.center,u),n.uniform1f(this.dropProgram.locations.radius,r),n.uniform1f(this.dropProgram.locations.strength,i),this.drawQuad(),this.swapBufferIndices())},a.prototype.drawQuad=function(){var e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.quad),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLE_FAN,0,4)},a.prototype.swapBufferIndices=function(){this.bufferWriteIndex=1-this.bufferWriteIndex,this.bufferReadIndex=1-this.bufferReadIndex},a.prototype.dropAtPointer=function(e,t,r){var i=parseInt((this.el.style.borderLeftWidth||0).toString()),n=parseInt((this.el.style.borderTopWidth||0).toString());this.drop(e.pageX-this.el.offsetLeft-i,e.pageY-this.el.offsetTop-n,t,r)},a.prototype.hideCssBackground=function(){var e=this.el.style.backgroundImage;"none"!=e&&(this.originalInlineCss=e,this.originalCssBackgroundImage=this.el.style.backgroundImage||"",this.el.style.backgroundImage="none")},a.prototype.updateSize=function(){var e=this.el.clientWidth,t=this.el.clientHeight;e==this.canvas.width&&t==this.canvas.height||(this.canvas.width=e,this.canvas.height=t)},a.prototype.initShaders=function(){var e=this.gl,t=["attribute vec2 vertex;","varying vec2 coord;","void main() {","coord = vertex * 0.5 + 0.5;","gl_Position = vec4(vertex, 0.0, 1.0);","}"].join("\n");this.dropProgram=this.createProgram(t,["precision highp float;","const float PI = 3.141592653589793;","uniform sampler2D texture;","uniform vec2 center;","uniform float radius;","uniform float strength;","varying vec2 coord;","void main() {","vec4 info = texture2D(texture, coord);","float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);","drop = 0.5 - cos(drop * PI) * 0.5;","info.r += drop * strength;","gl_FragColor = info;","}"].join("\n")),this.updateProgram=this.createProgram(t,["precision highp float;","uniform sampler2D texture;","uniform vec2 delta;","varying vec2 coord;","void main() {","vec4 info = texture2D(texture, coord);","vec2 dx = vec2(delta.x, 0.0);","vec2 dy = vec2(0.0, delta.y);","float average = (","texture2D(texture, coord - dx).r +","texture2D(texture, coord - dy).r +","texture2D(texture, coord + dx).r +","texture2D(texture, coord + dy).r",") * 0.25;","info.g += (average - info.r) * 2.0;","info.g *= 0.995;","info.r += info.g;","gl_FragColor = info;","}"].join("\n")),e.uniform2fv(this.updateProgram.locations.delta,this.textureDelta),this.renderProgram=this.createProgram(["precision highp float;","attribute vec2 vertex;","uniform vec2 topLeft;","uniform vec2 bottomRight;","uniform vec2 containerRatio;","varying vec2 ripplesCoord;","varying vec2 backgroundCoord;","void main() {","backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);","backgroundCoord.y = 1.0 - backgroundCoord.y;","ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;","gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);","}"].join("\n"),["precision highp float;","uniform sampler2D samplerBackground;","uniform sampler2D samplerRipples;","uniform vec2 delta;","uniform float perturbance;","varying vec2 ripplesCoord;","varying vec2 backgroundCoord;","void main() {","float height = texture2D(samplerRipples, ripplesCoord).r;","float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;","float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;","vec3 dx = vec3(delta.x, heightX - height, 0.0);","vec3 dy = vec3(0.0, heightY - height, delta.y);","vec2 offset = -normalize(cross(dy, dx)).xz;","float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);","gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;","}"].join("\n")),e.uniform2fv(this.renderProgram.locations.delta,this.textureDelta)},a.prototype.initTexture=function(){var e=this.gl;this.backgroundTexture=e.createTexture()||new WebGLTexture,e.bindTexture(e.TEXTURE_2D,this.backgroundTexture),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR)},a.prototype.loadImage=function(){var r=this,i=this.gl,e=this.imageUrl||o(this.originalCssBackgroundImage||"")||o(this.el.style.backgroundImage||"");if(e!=this.imageSource)if(this.imageSource=e||"",this.imageSource){var n=new Image;n.onload=function(){function e(e){return 0==(e&e-1)}var t=e(n.width)&&e(n.height)?i.REPEAT:i.CLAMP_TO_EDGE;i.bindTexture(i.TEXTURE_2D,r.backgroundTexture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,n),r.backgroundWidth=n.width,r.backgroundHeight=n.height,r.hideCssBackground()},n.onerror=function(){r.setTransparentTexture()},n.crossOrigin=function(e){return e.match(/^data:/)}(this.imageSource)?null:this.crossOrigin,n.src=this.imageSource}else this.setTransparentTexture()},a.prototype.setTransparentTexture=function(){var e=this.gl;e.bindTexture(e.TEXTURE_2D,this.backgroundTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n)},a.prototype.setupPointerEvents=function(){function i(e,t){r.visible&&r.running&&r.interactive&&r.dropAtPointer(e,r.dropRadius*(t?1.5:1),t?.14:.01)}var r=this;this.el.addEventListener("mousemove",function(e){i(e)}),this.el.addEventListener("touchmove",function(e){for(var t=e.changedTouches,r=0;r<t.length;r++)i(t[r])}),this.el.addEventListener("touchstart",function(e){for(var t=e.changedTouches,r=0;r<t.length;r++)i(t[r])}),this.el.addEventListener("mousedown",function(e){i(e,!0)})},a.prototype.step=function(){this.visible&&(this.computeTextureBoundaries(),this.running&&this.update(),this.render())},a.prototype.computeTextureBoundaries=function(){var e,t=this.el.style.backgroundSize||"",r=this.el.style.backgroundAttachment,i=function(t){var e=t.split(" ");if(1!==e.length)return e.map(function(e){switch(t){case"center":return"50%";case"top":case"left":return"0";case"right":case"bottom":return"100%";default:return e}});switch(t){case"center":return["50%","50%"];case"top":return["50%","0"];case"bottom":return["50%","100%"];case"left":return["0","50%"];case"right":return["100%","50%"];default:return[t,"50%"]}}(this.el.style.backgroundPosition||"");e="fixed"==r?{left:window.pageXOffset,top:window.pageYOffset,width:window.innerWidth,height:window.innerHeight}:{top:this.el.offsetTop,left:this.el.offsetLeft,width:this.el.clientWidth,height:this.el.clientHeight};var n="",o="";if("cover"==t){var a=Math.max(e.width/this.backgroundWidth,e.height/this.backgroundHeight);n=this.backgroundWidth*a,o=this.backgroundHeight*a}else if("contain"==t)a=Math.min(e.width/this.backgroundWidth,e.height/this.backgroundHeight),n=this.backgroundWidth*a,o=this.backgroundHeight*a;else{var s=t.split(" ");n=s[0]||"",o=s[1]||n,d(n)?n=e.width*parseFloat(n)/100:"auto"!=n&&(n=parseFloat(n)),d(o)?o=e.height*parseFloat(o)/100:"auto"!=o&&(o=parseFloat(o)),"auto"==n&&"auto"==o?(n=this.backgroundWidth,o=this.backgroundHeight):("auto"==n&&(n=this.backgroundWidth*(o/this.backgroundHeight)),"auto"==o&&(o=this.backgroundHeight*(n/this.backgroundWidth)))}var u=i[0],c=i[1];u=d(u)?e.left+(e.width-n)*parseFloat(u)/100:e.left+parseFloat(u),c=d(c)?e.top+(e.height-o)*parseFloat(c)/100:e.top+parseFloat(c);var l=this.el.offsetTop,f=this.el.offsetLeft;this.renderProgram.uniforms.topLeft=new Float32Array([(f-u)/n,(l-c)/o]),this.renderProgram.uniforms.bottomRight=new Float32Array([this.renderProgram.uniforms.topLeft[0]+this.el.clientWidth/n,this.renderProgram.uniforms.topLeft[1]+this.el.clientHeight/o]);var h=Math.max(this.canvas.width,this.canvas.height);this.renderProgram.uniforms.containerRatio=new Float32Array([this.canvas.width/h,this.canvas.height/h])},a.prototype.update=function(){var e=this.gl;e.viewport(0,0,this.resolution,this.resolution),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffers[this.bufferWriteIndex]),this.bindTexture(this.textures[this.bufferReadIndex]),e.useProgram(this.updateProgram.id),this.drawQuad(),this.swapBufferIndices()},a.prototype.render=function(){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.enable(e.BLEND),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.useProgram(this.renderProgram.id),this.bindTexture(this.backgroundTexture,0),this.bindTexture(this.textures[0],1),e.uniform1f(this.renderProgram.locations.perturbance,this.perturbance),e.uniform2fv(this.renderProgram.locations.topLeft,this.renderProgram.uniforms.topLeft),e.uniform2fv(this.renderProgram.locations.bottomRight,this.renderProgram.uniforms.bottomRight),e.uniform2fv(this.renderProgram.locations.containerRatio,this.renderProgram.uniforms.containerRatio),e.uniform1i(this.renderProgram.locations.samplerBackground,0),e.uniform1i(this.renderProgram.locations.samplerRipples,1),this.drawQuad(),e.disable(e.BLEND)},a),c={inserted:function(e){new u(e)}};s._withStripped=!0;var l,f,h=r(4),p=r.n(h),m=r(3),g=(l=function(e,t){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}l(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),v=function(e,t,r,i){var n,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"===("undefined"==typeof Reflect?"undefined":p()(Reflect))&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;0<=s;s--)(n=e[s])&&(a=(o<3?n(a):3<o?n(t,r,a):n(t,r))||a);return 3<o&&a&&Object.defineProperty(t,r,a),a};function T(){return null!==f&&f.apply(this,arguments)||this}var E=(f=m.b,g(T,f),T=v([m.a],T)),b=(r(10),r(5)),x=Object(b.a)(E,s,[],!1,null,null,null);x.options.__file="dev/app.vue";var y=x.exports;i.a.directive("ripple",c);new i.a({el:"#app",render:function(e){return e(y)}})}],[[6,1,2]]])});