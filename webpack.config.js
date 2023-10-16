const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'shtml.min.js',
    path: __dirname + '/www',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};