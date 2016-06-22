var Promise = require('bluebird');
var exec    = require('child_process').exec;

module.exports = function isBinaryExist (bin) {
  var command = bin + ' --help';

  return new Promise(function (resolve, reject) {
    return exec(command, function (error) {
      if (error !== null) {
        var err = '"' + bin + '" executable is not existed in your system!\n' +
          '           [-Error:] Application scaffolding process has failed!';
        reject(err);
      }
      resolve();
    });
  });
};
