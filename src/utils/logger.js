const gutil = require('gulp-util');

module.exports = {
  red: gutil.colors.red,
  cyan: gutil.colors.cyan,
  gray: gutil.colors.gray,
  green: gutil.colors.green,
  magenta: gutil.colors.magenta,
  bold: gutil.colors.bold,

  log(msg) {
    gutil.log(msg);
  },

  successLog(msg) {
    this.log(this.green(`[-done:] ${msg}`));
  },

  errorLog(msg) {
    this.log(this.red(`[-Error:] ${msg}`));
  }
};
