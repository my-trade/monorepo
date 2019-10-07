const common = require('./webpack.common.config');
const path = require('path');

function resolveModule(name) {
  return path.resolve(__dirname, `src/server/${name}`);
}

const config = {
  ...common,
  target: 'node',
  entry: [
    resolveModule('index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve('build/server')
  },
};

module.exports = config;