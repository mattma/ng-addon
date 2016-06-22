var Promise = require('bluebird');
var path    = require('path');
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var replace = require('gulp-replace');
var tap     = require('gulp-tap');

var stringUtils  = require('../../utils/string');
var pathResolver = require('../../utils/path-resolver');

var log         = gutil.log;
var green       = gutil.colors.green;
var ignoreFiles = ['.DS_Store', 'src', 'tests', '.gitkeep'];

// Copy "skeletons/core" files to the destination
module.exports = function copyCoreContent (addonName, dest) {
  // get the full path to the core of application. ( Server && Client )
  var skeletonsCorePath  = pathResolver('skeletons/core');
  var coreSrc            = [skeletonsCorePath + '/**/*'];
  var dasherizeAddonName = stringUtils.dasherize(addonName);

  return new Promise(function (resolve, reject) {
    // Scaffold the "core/" of the application.
    gulp.src(coreSrc, {dot: true})
      .pipe(replace(/__PROJECT_NAME__/g, dasherizeAddonName))
      .pipe(tap(logFilename))
      .on('error', reject)
      .on('end', resolve)
      .pipe(gulp.dest(dest));
  });
}

function logFilename (file, t) {
  var filename = path.basename(file.path);
  if (ignoreFiles.indexOf(filename) === -1) {
    log(green('create'), filename);
  }
  return t;
}
