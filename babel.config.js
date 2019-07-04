module.exports = function (api) {
    api.cache(true);

    const presets = [
        ["@babel/env", { "modules": false }],
    ];
    const plugins = [
        "@babel/transform-runtime",
    ];

    return {
        presets,
        plugins
    };
}
