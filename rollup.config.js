'use strict';

var input = 'src/index.js'

var config = {
  input: input,
  output: {
    format: 'umd',
    name: 'shoal',
    exports: 'named'
  },
  plugins: []
}

module.exports = config
