const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './api/index.js', // Replace with the entry point of your server
  target: 'node', // Ensures compatibility with Node.js environment
  externals: [nodeExternals()], // Excludes Node.js modules from the bundle
  output: {
    path: path.resolve(__dirname, 'build-pro'), // Output directory
    filename: 'server.js', // Output file name
  },
  mode: 'production', // Ensures minification by Webpack
  optimization: {
    minimize: true, // Enable minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // Remove comments
          },
          compress: true, // Compress the output
        },
        extractComments: false, // Do not extract comments to a separate file
      }),
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true, // Load system-level environment variables
    }),
  ],
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: ['@babel/preset-env'],
    //       },
    //     },
    //   },
    // ],
  },
  devtool: false, // Disable source maps for security in production
};
