const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2'
  },
  externals: {
    axios: 'commonjs2 axios',
    cheerio: 'commonjs2 cheerio',
    jsonpack: 'commonjs2 jsonpack'
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
            },
        },
        {
            test: /\.compressed$/,
            use: 'raw-loader',
        },
    ]
  }
};
