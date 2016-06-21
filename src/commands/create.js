'use strict';

var Promise     = require('bluebird');
var path        = require('path');
var fs          = require('fs');
var exec        = require('child_process').exec;
var tildify     = require('tildify');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var rename      = require('gulp-rename');
var replace     = require('gulp-replace');
var stringUtils = require('../utils/string');

// Promises for each task...

// Copy "skeletons/core" files to the destination
function copyCoreContent (addonName, dest) {
  // get the full path to the core of application. ( Server && Client )
  var skeletonsCorePath  = pathResolver('skeletons/core');
  var coreSrc            = [skeletonsCorePath + '/**/*'];
  var dasherizeAddonName = stringUtils.dasherize(addonName);

  return new Promise(function (resolve, reject) {
    // Scaffold the "core/" of the application.
    gulp.src(coreSrc, {dot: true})
      .pipe(replace(/__PROJECT_NAME__/g, dasherizeAddonName))
      .on('error', reject)
      .on('end', coreGenerationLogger(resolve))
      .pipe(gulp.dest(dest));
  });
}

function createCoreFiles (addonName, dest) {
  // get the full path to the core of application. ( Server && Client )
  var skeletonTemplatePath = pathResolver('skeletons/templates/core');
  var dasherizeAddonName   = stringUtils.dasherize(addonName);
  var classifyAddonName    = stringUtils.classify(addonName);

  var fileList = [{
    // create root project entrypoint typescript file
    src:      skeletonTemplatePath + '/root.ts',
    dest:     dest,
    filename: dasherizeAddonName,
    ext:      '.ts'
  }, {
    // create a typescript file in src folder
    src:      skeletonTemplatePath + '/src-index.ts',
    dest:     dest + '/src',
    filename: dasherizeAddonName + '.component',
    ext:      '.ts'
  }, {
    // create a typescript file in tests folder
    src:      skeletonTemplatePath + '/test-index.ts',
    dest:     dest + '/tests',
    filename: dasherizeAddonName + '.component.spec',
    ext:      '.ts'
  }];

  return new Promise(function (resolve, reject) {
    fileList.forEach(function (file) {
      gulp.src(file.src)
        .pipe(replace(/__PROJECT_NAME__/g, dasherizeAddonName))
        .pipe(replace(/__PROJECT_NAME_CLASSIFY__/g, classifyAddonName))
        .pipe(rename({
          basename: file.filename,
          extname:  file.ext
        }))
        .on('error', reject)
        .on('end', resolve)
        .pipe(gulp.dest(file.dest));
    });
  });
}

// "npm install" task to install project module dependencies
function npmInstaller (dest) {
  return new Promise(function (resolve, reject) {
    dest = dest || process.cwd();
    gutil.log(gutil.colors.gray('[-log:]'), 'NPM is installing node packages...');
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

// "git init" task to kick start a git project
function gitInitializer (dest) {
  gutil.log(
    gutil.colors.gray('[-log:]'),
    gutil.colors.cyan('ngg'), 'is doing REALLY hard to initialize your repo ...'
  );

  var month      =
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var today      = new Date();
  var todayDate  = today.getDate();
  var todayMonth = month[today.getMonth()];
  var todayYear  = today.getFullYear();
  var command    = 'git init && git add . && git commit -m \'Initial Commit @ ' +
    todayMonth + ' ' + todayDate + ', ' + todayYear + '\'';

  return new Promise(function (resolve, reject) {
    dest = dest || process.cwd();
    process.chdir(dest);

    return exec(command, function (error, stdout, stderr) {
      if (error !== null) {
        stderr = typeof stderr === 'string' ? stderr : stderr.toString();
        gitInitializerFailLogger();
        reject(stderr);
      }
      resolve();
    });
  });
}

function isBinaryExist (bin) {
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
}

// Step 2: installation step: internet access is required
// Flow Control: execute serial tasks: npm install, git init
function installerTasks (addonName, dest) {
  var tasks = [
    isBinaryExist('git'),
    npmInstaller(dest),
    gitInitializer(dest)
  ];

  Promise.all(tasks)
    .then(function () {
      successInfoLogger(addonName);
    })
    .catch(function (err) {
      // output error for individual task
      failureInfoLogger(err);
    });
}

// Step 1: run sequentially tasks to scaffold addon packages: copy addon core skeleton
function runTasks (addonName, options) {
  var dest          = path.resolve(addonName);
  // check for the mode, is running test or not
  var isRunningTest = options.test || false;

  gutil.log(
    gutil.colors.gray('[-log:]'), 'Starting to generate an application at',
    gutil.colors.magenta(tildify(dest))
  );

  var tasks = [
    copyCoreContent(addonName, dest),
    createCoreFiles(addonName, dest) // generate required root typescript files
  ];

  Promise.all(tasks)
  // switch to the newly generated folder
    .then(function () {
      process.chdir(dest);
    })
    // Running initialization tasks: npm install,
    // .then(function () {
    //   if (!isRunningTest) {
    //     installerTasks(addonName, dest);
    //   }
    // })
    .catch(function () {
      gutil.log(
        gutil.colors.red('[-Error:]'),
        'ng-addon could not generate an addon package due to the error above!');
      process.exit(0);
    });
}

// Create command entry point function
function create (addonName, options) {
  if (!addonName || typeof addonName !== 'string') {
    gutil.log(gutil.colors.red('[-Error:] Missing addon package name.'), 'ex: ngg new markdown');
    gutil.log(gutil.colors.red('[-Error:]'), 'See \'ngg new --help\'');
    process.exit(0);
  }

  // Create the folder if it is not existed
  // If existed, do what? maybe just empty it and start scaffolding???
  if (fs.existsSync(addonName)) {
    gutil.log(
      gutil.colors.red('[-Error:]'), 'The addon package name',
      gutil.colors.red(addonName), 'has existed in this directory tree!'
    );
    process.exit(0);
  } else {
    // Create a new directory name what user passed in
    fs.mkdirSync(addonName);
    fs.mkdirSync(addonName + '/src');
    fs.mkdirSync(addonName + '/tests');
  }
  // Orchestration, copy the source files into the newly create folder
  runTasks(addonName, options);
}

module.exports = create;

// Resolve project paths start...

function pathResolver (relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

// Logger functions start...

// Trigger when NPM installation fails, output error message in terminal
function npmInstallationFailLogger () {
  gutil.log(gutil.colors.red('[-Error:] "npm install" failed dramatically.'));
  gutil.log(gutil.colors.red('[-Error:] Need to manually fix the ERRORS, then do "npm install"'));
  gutil.log(gutil.colors.red('[-Error:] Before the project is fully ready for development'));
}

// Trigger when Git initialization fails, output error message in terminal
function gitInitializerFailLogger () {
  gutil.log(gutil.colors.red('[-Error:] initialize "git" repository failed dramatically.'));
  gutil.log(gutil.colors.red('[-Error:] Need to manually do'));
  gutil.log(gutil.colors.red('[-Error:] "git init && git add . && git commit -m"'));
}

// When `em new` command succeed and output successfully message to user
function successInfoLogger (addonName) {
  gutil.log(
    gutil.colors.green('[-done:] Initialized a new git repo and did a first commit')
  );
  gutil.log(
    gutil.colors.bold('[-copy:] =>'),
    gutil.colors.cyan('cd ' + addonName),
    gutil.colors.gray('# navigate to the newly created addon package')
  );
  gutil.log(
    gutil.colors.bold('[-copy:] =>'),
    gutil.colors.cyan('ngg serve'),
    gutil.colors.gray(' # kick start the server, open project in favorite browser,'),
    gutil.colors.gray('auto watch file changes and rebuild the package')
  );
}

function failureInfoLogger (err) {
  gutil.log(gutil.colors.red('[-Error:] ' + err));
}

// When all root files and core files has been generated from the scaffold folder
function coreGenerationLogger (resolve) {
  return function () {
    gutil.log(
      gutil.colors.green('[-done:] A new'),
      gutil.colors.cyan('Angular 2 Addon Package'),
      gutil.colors.green('have been successfully created!')
    );
    gutil.log(
      gutil.colors.gray('[-log:]'),
      gutil.colors.magenta('It may take up to 1 minute and half!')
    );
    gutil.log(
      gutil.colors.gray('[-log:]'),
      gutil.colors.magenta('Be patient, fetching packages from internet ...')
    );
    resolve();
  };
}
