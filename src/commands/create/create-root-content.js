var Promise = require('bluebird');
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var replace = require('gulp-replace');

var stringUtils    = require('../../utils/string');
var pathResolver = require('../../utils/path-resolver');

var log     = gutil.log;
var green   = gutil.colors.green;
var cyan    = gutil.colors.cyan;
var gray    = gutil.colors.gray;
var magenta = gutil.colors.magenta;

// Copy "skeletons/core" files to the destination
module.exports = function copyCoreContent (addonName, dest) {
  // get the full path to the core of application. ( Server && Client )
  var skeletonsCorePath = pathResolver('skeletons/core');
  var coreSrc            = [skeletonsCorePath + '/**/*'];
  var dasherizeAddonName = stringUtils.dasherize(addonName);

  return new Promise(function (resolve, reject) {
    // Scaffold the "core/" of the application.
    gulp.src(coreSrc, {dot: true})
      .pipe(replace(/__PROJECT_NAME__/g, dasherizeAddonName))
      .on('error', reject)
      .on('end', coreGenerationLogger(addonName, resolve))
      .pipe(gulp.dest(dest));
  });
}

// When all root files and core files has been generated from the scaffold folder
function coreGenerationLogger (addonName, resolve) {
  return function () {
    log(green('[-done:] A new Angular2 addon Package'), cyan(addonName),
      green('have been successfully created!'));
    log(gray('[-log:]'), magenta('installing'), cyan(addonName));
    resolve();
  };
}