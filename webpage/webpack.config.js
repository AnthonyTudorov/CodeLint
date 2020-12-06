const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.join(__dirname, '/static'),
        filename: 'bundle.min.js'
    },
    module: {
        rules: [{
			test: /\.js$|jsx/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './templates/index.html'
        })
    ]
}