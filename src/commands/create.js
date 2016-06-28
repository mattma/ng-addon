const fs = require('fs');

const runTasks = require('./create/index');
const l        = require('../utils/logger');

const mkdir  = fs.mkdirSync;
const exists = fs.existsSync;

// Create command entry point function
module.exports = (addonName, options) => {
  if (!addonName || typeof addonName !== 'string') {
    l.log(`${l.red('[-Error:] Missing addon package name.')} ex: ngg new ng-markdown`);
    l.log(`${l.red('[-Error:]')} See 'ngg new --help'`);
    process.exit(0);
  }

  // Create the folder if it is not existed
  if (exists(addonName)) {
    l.log(`${l.red('[-Error:]')} ${l.cyan(addonName)} has existed in the directory!`);
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
