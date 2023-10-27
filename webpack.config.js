const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'taxid-validator.js', // Output bundle name
        path: path.resolve(__dirname, 'dist'), // Output directory
        library: 'TaxidValidator', // The name of the global variable for the browser
        libraryTarget: 'umd', // Universal module definition
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Use Babel for .js files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
