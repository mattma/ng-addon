'use strict';

var Promise     = require('bluebird');
var resolvePath = require('path').resolve;
var tildify     = require('tildify');
var gutil       = require('gulp-util');

var createRootContent = require('./create-root-content');
var createRootFiles   = require('./create-root-files');
var npmInstall        = require('./npm-install');
var gitInitialization = require('./git-initialization');
var isBinaryExist     = require('../../utils/is-binary-exist');

var log     = gutil.log;
var green   = gutil.colors.green;
var red     = gutil.colors.red;
var cyan    = gutil.colors.cyan;
var gray    = gutil.colors.gray;
var magenta = gutil.colors.magenta;
var bold    = gutil.colors.bold;

// Step 2: installation step: internet access is required
// Flow Control: execute serial tasks: npm install, git init
function installerTasks (dest) {
  var gitTasks = [
    isBinaryExist('git'),
    gitInitialization(dest),
  ];

  var npmTasks = [
    npmInstall(dest)
  ];

  // git initialization task
  Promise.all(gitTasks)
    .then(function () {
      successLogger('Successfully initialized git.');
    })
    .catch(errorLogger);

  // npm installation task
  log(gray('[-log:]'), 'Installing packages for tooling via npm...');

  Promise.all(npmTasks)
    .then(function () {
      successLogger('Installed packages for tooling via npm.');
      log(bold('[-copy:] =>'),
        cyan('cd ' + addonName), gray('# navigate to the newly created addon package'));
      log(bold('[-copy:] =>'), cyan('ngg serve'), gray('watch file changes and rebuild the addon'));
    })
    .catch(errorLogger);
}

// Step 1: run sequentially tasks to scaffold addon packages: copy addon core skeleton
module.exports = function runTasks (addonName, options) {
  var dest          = resolvePath(addonName);
  // check for the mode, is running test or not
  var isRunningTest = options.test || false;

  log(gray('[-log:]'), 'installing an addon', cyan(addonName), 'at', magenta(tildify(dest)));

  var tasks = [
    createRootContent(addonName, dest),
    createRootFiles(addonName, dest) // generate required root typescript files
  ];

  Promise.all(tasks)
  // switch to the newly generated folder
    .then(function () {
      process.chdir(dest);
    })
    // Running initialization tasks: npm install,
    .then(function () {
      if (!isRunningTest) {
        installerTasks(dest);
      }
    })
    .catch(function () {
      errorLogger('ng-addon could not generate an addon package due to the error above!');
      process.exit(0);
    });
}

function successLogger (msg) {
  log(green('[-done:] ' + msg));
}

function errorLogger (msg) {
  log(red('[-Error:] ' + msg));
}
