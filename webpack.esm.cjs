const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'index.mjs',
    path: path.resolve(__dirname, 'esm'),
    library: {
      type: 'module'
    },
    chunkFormat: 'module'
  },
  externals: {
    axios: 'axios',
    cheerio: 'cheerio',
    jsonpack: 'jsonpack'
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
          loader: 'swc-loader',
        }
      },
      {
        test: /\.compressed$/,
        use: 'raw-loader',
      }
    ]
  }
};
