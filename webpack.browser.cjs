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
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: 'axios'
        },
        cheerio: {
            commonjs: 'cheerio',
            commonjs2: 'cheerio',
            amd: 'cheerio',
            root: 'cheerio'
        }
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
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
        extensions: ['.ts', '.js', '.json']
    }
};
