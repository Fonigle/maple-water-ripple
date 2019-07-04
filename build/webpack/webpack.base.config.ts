/// <reference path="../@types/packages.d.ts" />

import * as path from 'path';
import * as VueLoaderPlugin from 'vue-loader/lib/plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import buddha from './buddha';
import network from './network';
const { ip, port } = network;

const isProduction = process.env.MODE === "production"

module.exports = {
    output: {
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".vue", ".json", ".ts"],
        alias: {
            "vue$": "vue/dist/vue.runtime.esm.js",
            "@": path.resolve("src"),
            "mixins": path.resolve("src/mixins"),
            "utils-scss": path.resolve("src/utils/scss/utils-scss.scss")
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader"
        },
        {
            test: /\.js$/,
            loader: "babel-loader",
            include: [
                path.resolve("src"),
            ]
        },
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
                "babel-loader",
                {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        transpileOnly: true
                    }
                }
            ]
        },
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                "babel-loader",
                {
                    loader: "ts-loader",
                    options: {
                        appendTsxSuffixTo: [/\.vue$/],
                        transpileOnly: true
                    }
                }
            ]
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: !isProduction,
                    },
                },
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: !isProduction
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: !isProduction
                    }
                },
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            include: /image/,
            loader: "url-loader",
            query: {
                limit: 1,
                name: "asset/images/[hash:16].[ext]"
            }
        },
        {
            test: /\.(ttf|woff2?|eot|svg)$/,
            include: /icon|font/,
            loader: "url-loader",
            query: {
                limit: 1,
                name: "asset/fonts/[name].[hash:7].[ext]"
            }
        }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: 5,
            maxAsyncRequests: 5,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    name: "vendors/library",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                "vendors/vue-bucket": {
                    name: "vendors/vue-bucket",
                    test: /[\\/]node_modules[\\/]vue/,
                    priority: -9
                }
            }
        },
        runtimeChunk: {
            name: "vendors/manifest"
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: !isProduction,
            vue: true,
        }),
        new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: isProduction ? '[name].[contenthash].css' : '[name].css'
        }),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [
                    ...buddha
                ],
                notes: isProduction ? [] : [`Your app is running at: http://${ip}:${port}`,]
            },
            clearConsole: false
        }),
    ]
};
