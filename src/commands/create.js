'use strict';

var fs    = require('fs');
var gutil = require('gulp-util');

var runTasks = require('./create/index');

var mkdir  = fs.mkdirSync;
var exists = fs.existsSync;
var log    = gutil.log;
var red    = gutil.colors.red

// Create command entry point function
module.exports = function create (addonName, options) {
  if (!addonName || typeof addonName !== 'string') {
    log(red('[-Error:] Missing addon package name.'), 'ex: ngg new ng-markdown');
    log(red('[-Error:]'), 'See \'ngg new --help\'');
    process.exit(0);
  }

  // Create the folder if it is not existed
  if (exists(addonName)) {
    log(red('[-Error:]'),
      'The addon package name', red(addonName), 'has existed in this directory tree!');
    process.exit(0);
  } else {
    // Create a new directory name what user passed in
    mkdir(addonName);
    mkdir(addonName + '/src');
    mkdir(addonName + '/tests');
  }
  // Orchestration, copy the source files into the newly create folder
  runTasks(addonName, options);
};
