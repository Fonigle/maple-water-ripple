import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import * as HtmlPlugin from 'html-webpack-plugin';

import * as baseConfig from './webpack.base.config';

import network from './network';
const { ip, port } = network;

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: {
        'index': [path.resolve("dev/index.ts")]
    },
    devServer: {
        host: ip,
        port: port,
        hot: true,
        open: true,
        historyApiFallback: true,
        quiet: true,
    },
    devtool: "#cheap-module-source-map",
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            filename: "index.html",
            template: path.resolve("dev/index.html"),
            showErrors: true
        }),
    ]
});
