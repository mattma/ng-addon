var Promise = require('bluebird');
var exec    = require('child_process').exec;
var gutil   = require('gulp-util');

var log  = gutil.log;
var cyan = gutil.colors.cyan;
var gray = gutil.colors.gray;
var red  = gutil.colors.red;

// "git init" task to kick start a git project
module.exports = function gitInitializer (dest) {
  var command = 'git init && git add . && git commit -m \'Initial Commit @ ' + getToday() + '\'';

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

function getToday () {
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var today      = new Date();
  var todayDate  = today.getDate();
  var todayMonth = month[today.getMonth()];
  var todayYear  = today.getFullYear();
  return todayMonth + ' ' + todayDate + ', ' + todayYear;
}

// Trigger when Git initialization fails, output error message in terminal
function gitInitializerFailLogger () {
  log(red('[-Error:] initialize "git" repository failed dramatically.'));
  log(red('[-Error:] Need to manually do'));
  log(red('[-Error:] "git init && git add . && git commit -m"'));
}
