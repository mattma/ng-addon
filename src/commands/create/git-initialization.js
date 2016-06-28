const Promise = require('bluebird');
const exec    = require('child_process').exec;

const l = require('../../utils/logger');

// "git init" task to kick start a git project
module.exports = (dest = process.cwd()) => {
  const command = `git init && git add . && git commit -m 'Initial Commit @ ${getToday()}'`;

  return new Promise((resolve, reject) => {
    process.chdir(dest);

    return exec(command, (error, stdout, stderr) => {
      // Trigger when Git initialization fails, output error message in terminal
      if (error !== null) {
        stderr = typeof stderr === 'string' ? stderr : stderr.toString();
        l.errorLog('initialize "git" repository failed dramatically.');
        l.errorLog('Need to manually do');
        l.errorLog('"git init && git add . && git commit -m"');
        reject(stderr);
      }
      resolve();
    });
  });
};

function getToday () {
  const month      = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today      = new Date();
  const todayDate  = today.getDate();
  const todayMonth = month[today.getMonth()];
  const todayYear  = today.getFullYear();
  return `${todayMonth} ${todayDate}, ${todayYear}`;
}
