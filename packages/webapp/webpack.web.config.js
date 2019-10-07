const common = require('./webpack.common.config');
const path = require('path');

function resolveModule(name) {
  return path.resolve(__dirname, `src/web/${name}`);
}

const config = {
  ...common,
  target: 'web',
  entry: [
    resolveModule('index.js')
  ],
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    disableHostCheck: true,
    port: 3000,
    proxy: {
      '/': 'http://localhost/'
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('static/js')
  }
};

module.exports = config;