var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
        ]
    }
}