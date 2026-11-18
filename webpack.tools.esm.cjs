const path = require('path');

module.exports = {
  entry: './src/tools.ts',
  target: 'node',
  mode: 'production',
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'tools.mjs',
    path: path.resolve(__dirname, 'esm'),
    library: {
      type: 'module'
    },
    chunkFormat: 'module'
  },
  resolve: {
    extensions: ['.ts', '.js']
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
