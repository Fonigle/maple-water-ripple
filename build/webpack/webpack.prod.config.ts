import * as path from 'path';
import * as merge from 'webpack-merge';

import * as baseCfg from './webpack.base.config';

import * as HtmlPlugin from 'html-webpack-plugin';

import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

module.exports = merge(baseCfg, {
    mode: 'production',
    entry: {
        'index': [path.resolve("dev/index.ts")]
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        chunkFilename: 'modules/[name].js',
        libraryTarget: 'umd'
    },
    devtool: false,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    safe: true
                },
            }),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlPlugin({
            filename: "index.html",
            template: path.resolve("dev/index.html"),
            showErrors: true
        }),
    ],
})
