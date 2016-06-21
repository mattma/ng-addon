'use strict';

// exports.lab = require('../helpers/test-helper').lab;
var describe = require('../helpers/test-helper').describe;
var it = require('../helpers/test-helper').it;
var expect = require('../helpers/test-helper').expect;
var afterEach = require('../helpers/test-helper').afterEach;

var exec = require('child_process').exec;
var fs = require('fs');
var rm = require('rimraf');
var helpers = require('../helpers/utils');

describe('Command `ngg new`', function () {
  it('should require a addOnName argument', function (done) {
    exec('./bin/ngg new', function (error, stdout, stderr) {
      // need to test the program should successfully shut down
      expect(stdout).to.include('[-Error:]');
      expect(stdout).to.include('Missing addon package name.');
      expect(stdout).to.include('See \'ngg new --help\'');
      done();
    });
  });
});

describe('Created directory', function () {
  afterEach(function (done) {
    rm('./ng-markdown', done);
  });

  it('should exit the program when the addOnName has been existed', function (done) {
    fs.mkdirSync('ng-markdown');
    exec('./bin/ngg new ng-markdown', function (error, stdout, stderr) {
      // need to test the program should successfully shut down
      expect(stdout).to.include('[-Error:]');
      expect(stdout).to.include('The folder name ng-markdown has existed in this directory tree!');
      done();
    });
  });

  it('should scaffold a bunch of directories', function (done) {
    exec('./bin/ngg new ng-markdown --test', function () {
      helpers.assertFoldersExist([
        // server folder
        'ng-markdown/src',
        'ng-markdown/tests'
      ], done);
    });
  });

  it('should scaffold a bunch of files', function (done) {
    exec('./bin/ngg new ng-markdown --test', function () {
      helpers.assertPathsExist([
        'ng-markdown/.gitignore',
        'ng-markdown/.npmignore',
        'ng-markdown/.travis.yml',
        'ng-markdown/.karma.conf.js',
        'ng-markdown/.karma-test-shim.js',
        'ng-markdown/.LICENSE.md',
        'ng-markdown/make.js',
        'ng-markdown/package.json',
        'ng-markdown/README.md',
        'ng-markdown/tsconfig.json',
        'ng-markdown/tslint.json',
        'ng-markdown/typings.json',
        'ng-markdown/ng-markdown.ts',
        'ng-markdown/src/ng-markdown.component.ts',
        'ng-markdown/tests/ng-markdown.component.spec.ts'
      ], done);
    });
  });
});
