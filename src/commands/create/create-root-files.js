var Promise     = require('bluebird');
var gulp        = require('gulp');
var rename      = require('gulp-rename');
var replace     = require('gulp-replace');

var stringUtils    = require('../../utils/string');
var pathResolver = require('../../utils/path-resolver');

module.exports = function createCoreFiles (addonName, dest) {
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
  }, {
    // create a gitignore file
    src:      skeletonTemplatePath + '/gitignore',
    dest:     dest,
    filename: '.gitignore',
    ext:      ''
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
