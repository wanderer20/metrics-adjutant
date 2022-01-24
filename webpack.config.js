const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    target: "web",
    entry: {
        main: path.resolve(__dirname, './src/js/index.js')
    },
    output: {
        path: path.resolve(__dirname, './examples'),
        filename: '[name].js'
    },
    mode: "development",
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, './examples')
        },
        open: true,
        compress: true,
        liveReload: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'metricsAdjutant.js',
            template: path.resolve(__dirname, './src/html/index.html'),
            filename: "index.html"
        }),
    ]
}