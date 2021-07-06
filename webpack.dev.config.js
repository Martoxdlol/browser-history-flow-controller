var path = require('path')
var webpack = require('webpack')

module.exports = {
 entry: './src/index.js',
 mode: 'development',
 target: ['web', 'es5'],
 output: {
   path: path.resolve(__dirname, 'dist'),
   filename: 'browser-history-flow-controller.js',
   libraryTarget: 'umd',
 },
 module: {
   rules: [
     { test: /\.js/, use: 'babel-loader' },
   ]
 },
 devtool: 'source-map',
   devServer: {
    contentBase: path.join(__dirname, 'test'),
    compress: true,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
 },
 stats: {
     colors: true
 },
}
