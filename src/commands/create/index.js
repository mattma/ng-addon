const Promise     = require('bluebird');
const resolvePath = require('path').resolve;
const tildify     = require('tildify');

const createRootContent = require('./create-root-content');
const createRootFiles   = require('./create-root-files');
const npmInstall        = require('./npm-install');
const gitInitialization = require('./git-initialization');
const isBinaryExist     = require('../../utils/is-binary-exist');

const l = require('../../utils/logger');

// Step 2: installation step: internet access is required
// Flow Control: execute serial tasks: npm install, git init
function installerTasks (addonName, dest) {
  const gitTasks = [
    isBinaryExist('git'),
    gitInitialization(dest)
  ];

  const npmTasks = [
    npmInstall(dest)
  ];

  // git initialization task
  Promise.all(gitTasks)
    .then(() => l.successLog('Successfully initialized git.'))
    .catch(l.errorLog);

  // npm installation task
  Promise.all(npmTasks)
    .then(() => {
      l.successLog('Installed packages for tooling via npm.');
      l.log(`${l.bold('[-copy:] =>')} ${l.cyan('cd')} ${l.cyan(addonName)} ${l.gray('# navigate to the new addon package')}`);
      l.log(`${l.bold('[-copy:] =>')} ${l.cyan('ngg serve')} ${l.gray('watch file changes and rebuild the addon')}`);
    })
    .catch(l.errorLog);
}

// Step 1: run sequentially tasks to scaffold addon packages: copy addon core skeleton
module.exports = (addonName, options) => {
  const dest          = resolvePath(addonName);
  // check for the mode, is running test or not
  const isRunningTest = options.test || false;

  l.log(`${l.gray('[-log:]')} installing an addon ${l.cyan(addonName)} at ${l.magenta(tildify(dest))}`);

  const tasks = [
    createRootContent(addonName, dest),
    createRootFiles(addonName, dest) // generate required root typescript files
  ];

  Promise.all(tasks)
    // switch to the newly generated folder
    .then(() => process.chdir(dest))
    // Running initialization tasks: npm install,
    .then(() => {
      if (!isRunningTest) {
        installerTasks(addonName, dest);
      }
    })
    .catch(() => {
      l.errorLog('ng-addon could not generate an addon package due to the error above!');
      process.exit(0);
    });
}
