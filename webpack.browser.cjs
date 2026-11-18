const path = require('path');

module.exports = {
    target: 'web',
    entry: './src/index.ts',
    mode: 'production',
    output: {
        filename: 'corporate-taxid-checker.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'TaxidValidator',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
        },
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                }
            }
        ]
    }
};
