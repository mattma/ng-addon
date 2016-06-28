const Promise = require('bluebird');
const path    = require('path');
const gulp    = require('gulp');
const replace = require('gulp-replace');
const tap     = require('gulp-tap');

const stringUtils  = require('../../utils/string');
const pathResolver = require('../../utils/path-resolver');
const l            = require('../../utils/logger');
const ignoreFiles  = ['.DS_Store', 'src', 'tests', '.gitkeep'];

// Copy "skeletons/core" files to the destination
module.exports = (addonName, dest) => {
  // get the full path to the core of application. ( Server && Client )
  const skeletonsCorePath  = pathResolver('skeletons/core');
  const coreSrc            = [`${skeletonsCorePath}/**/*`];
  const dasherizeAddonName = stringUtils.dasherize(addonName);

  return new Promise((resolve, reject) => {
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
  const filename = path.basename(file.path);
  if (ignoreFiles.indexOf(filename) === -1) {
    l.log(`${l.green('create')} ${filename}`);
  }
  return t;
}
