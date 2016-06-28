const gutil = require('gulp-util');

module.exports = {
  red: gutil.colors.red,
  cyan: gutil.colors.cyan,
  gray: gutil.colors.gray,

  log(msg) {
    gutil.log(msg);
  }
};
