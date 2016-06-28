const Promise = require('bluebird');
const exec    = require('child_process').exec;

const l = require('../../utils/logger');

// "npm install" task to install project module dependencies
module.exports = (dest = process.cwd()) => {
  return new Promise((resolve, reject) => {
    l.log(`${l.gray('[-log:]')} ${l.bold('Installing packages for tooling via npm...')}`);
    process.chdir(dest);

    return exec('npm install', (error, stdout, stderr) => {
      // Trigger when NPM installation fails, output error message in terminal
      if (error !== null) {
        stderr = typeof stderr === 'string' ? stderr : stderr.toString();
        l.errorLog('"npm install" failed dramatically.');
        l.errorLog('Need to manually fix the ERRORS, then do "npm install"');
        l.errorLog('Before the project is fully ready for development');
        reject(stderr);
      }
      resolve();
    });
  });
};
