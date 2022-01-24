const path = require ('path')

module.exports = {
    entry: path.join(__dirname, 'src/js/metricsAdjutant', 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "index.js",
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
    resolve: {
        extensions: ['.js']
    }
}