/*
 * https://github.com/mattma/ng-addon
 *
 * Copyright (c) 2016 Matt Ma
 * Licensed under the MIT license.
 */

'use strict';

var program = require('commander');
var create = require('./create');
var commands = require('./commands');
var pkg = require('../../package.json');

program
  .version('ngg ' + pkg.version)
  .usage('[command] [options]\n\n  Command-Specific Help\n\n    ngg [command] --help');

program
  .command('new')
  .option('-T, --test',
  '# running in test mode. It won\'s fetch npm or init the git repo')
  .description('Creates a new Angular2 Addon package at [addOnName]')
  .usage('[ addOnName ]  # Make a new addon package and Scaffold required files' +
  '\n  Ex:    ngg new ng-markdown')
  .action(create);

program
  .command('s')
  .alias('serve')
  .description('To be implemented...')
  .action(commands);

program
  .command('b')
  .alias('build')
  .description('To be implemented...')
  .action(commands);

// must be before .parse() since node's emit() is immediate
program.on('--help', helpCommandInfo);

program.parse(process.argv);

function helpCommandInfo () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ ngg new [addOnName]' +
  '\n\n      @description generate an Angular 2 addon package' +
  '\n\n      @example  ngg new ng-markdown && cd ng-markdown');
  console.log('');
  console.log('');
}
