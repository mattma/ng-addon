var path        = require('path');

module.exports = function pathResolver (relativePath) {
  return path.resolve(__dirname, '..', relativePath);
};
