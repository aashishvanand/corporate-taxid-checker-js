const path = require('path');

module.exports = {
    target: 'web',
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'corporate-taxid-checker.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'TaxidValidator',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.compressed$/,
                use: 'raw-loader',
            }
        ]
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
         },
        extensions: ['.js', '.json']
    }
};