var Promise = require('bluebird');
var exec    = require('child_process').exec;
var gutil   = require('gulp-util');

var log  = gutil.log;
var gray = gutil.colors.gray;
var red  = gutil.colors.red;

// "npm install" task to install project module dependencies
module.exports = function npmInstaller (dest) {
  return new Promise(function (resolve, reject) {
    dest = dest || process.cwd();
    log(gray('[-log:]'), 'NPM is installing node packages...')
    process.chdir(dest);

    return exec('npm install', function (error, stdout, stderr) {
      if (error !== null) {
        stderr = typeof stderr === 'string' ? stderr : stderr.toString();
        npmInstallationFailLogger();
        reject(stderr);
      }
      resolve();
    });
  });
}

// Trigger when NPM installation fails, output error message in terminal
function npmInstallationFailLogger () {
  log(red('[-Error:] "npm install" failed dramatically.'));
  log(red('[-Error:] Need to manually fix the ERRORS, then do "npm install"'));
  log(red('[-Error:] Before the project is fully ready for development'));
}

// log(gray('[-log:]'), magenta('installing'), cyan(addonName));
