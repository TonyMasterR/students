const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack.loaders');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';


module.exports = {
    entry: [
        './frontend/index.js', // your app's entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        loaders,
    },
    devServer: {
        contentBase: './public',
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
            },
            '/img': {
                target: 'http://localhost:3000/',
            },
        },
        host: HOST,
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true,
        }),
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            template: './frontend/template.html',
            files: {
                css: ['style.css'],
                js: ['bundle.js'],
            },
        }),
    ],
};