import path from 'path';
import webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules : [
        { test: /\.tsx?$/, use: 'ts-loader' },
        { test: /\.css$/, use: 'css-loader' }
  ]}
};

export default config;