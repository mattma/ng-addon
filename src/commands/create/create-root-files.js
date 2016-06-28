const Promise = require('bluebird');
const path    = require('path');
const gulp    = require('gulp');
const rename  = require('gulp-rename');
const replace = require('gulp-replace');
const tap     = require('gulp-tap');

const stringUtils  = require('../../utils/string');
const pathResolver = require('../../utils/path-resolver');
const l            = require('../../utils/logger');

module.exports = (addonName, dest) => {
  // get the full path to the core of application. ( Server && Client )
  const skeletonTemplatePath = pathResolver('skeletons/templates/core');
  const dasherizeAddonName   = stringUtils.dasherize(addonName);
  const classifyAddonName    = stringUtils.classify(addonName);

  const fileList = [{
    // create root project entrypoint typescript file
    src:      `${skeletonTemplatePath}/root.ts`,
    dest:     dest,
    filename: dasherizeAddonName,
    ext:      '.ts'
  }, {
    // create a typescript file in src folder
    src:      `${skeletonTemplatePath}/src-index.ts`,
    dest:     `${dest}/src`,
    filename: `${dasherizeAddonName}.component`,
    ext:      '.ts'
  }, {
    // create a typescript file in tests folder
    src:      `${skeletonTemplatePath}/test-index.ts`,
    dest:     `${dest}/tests`,
    filename: `${dasherizeAddonName}.component.spec`,
    ext:      '.ts'
  }, {
    // create a gitignore file
    src:      `${skeletonTemplatePath}/gitignore`,
    dest:     dest,
    filename: '.gitignore',
    ext:      ''
  }];

  return new Promise((resolve, reject) => {
    fileList.forEach((file) => {
      gulp.src(file.src)
        .pipe(replace(/__PROJECT_NAME__/g, dasherizeAddonName))
        .pipe(replace(/__PROJECT_NAME_CLASSIFY__/g, classifyAddonName))
        .pipe(rename({
          basename: file.filename,
          extname:  file.ext
        }))
        .pipe(tap(logFilename))
        .on('error', reject)
        .on('end', resolve)
        .pipe(gulp.dest(file.dest));
    });
  });
}

function logFilename (file, t) {
  const filename = path.basename(file.path);

  if (filename.indexOf('component.ts') > -1) {
    l.log(`${l.green('create')} src/${filename}`);
  } else if (filename.indexOf('component.spec.ts') > -1) {
    l.log(`${l.green('create')} tests/${filename}`);
  } else {
    l.log(`${green('create')} ${filename}`);
  }

  return t;
}
