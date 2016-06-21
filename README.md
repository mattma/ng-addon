# ng-addon ( a.k.a ngg) 

[![NPM][npm-badge-image]][npm-badge-url] [![NPM download](http://img.shields.io/npm/dm/ng-addon.svg?style=flat)](https://www.npmjs.org/package/ng-addon)

[![NPM version][npm-image]][npm-url]   [![Build Status][travis-image]][travis-url]   [![Dependency Status][dependency-image]][dependency-url]


> An Angular command line utility (ngg) to generate addon packages.


## Getting Started

```bash
    npm install -g ng-addon
```

After the installation, you should have a global command `ngg` available. 
Try `ngg --help`, you should see a list of helper information. 
  
## Quick Start

```bash
    ngg new ng-markdown          # generate an Angular 2 addon package named **ng-markdown**
    cd ng-markdown              # switch to addon folder, ready to build next big thing
```

## Usage

```bash
    ngg [command] [options]

    Commands:

        new [options]      # Creates a new ember application at [dirName]
       
    Options:

        -h, --help     output usage information
        -V, --version  output the version number

    Command-Specific Help:

        ngg [command] --help
```



## Contributing
Anyone can help make this project better - check out the [Contributing guide](./CONTRIBUTING.md). 


## Changelog

check out the [Changelog](./CHANGELOG.md). 


## License

Copyright (c) 2016 [Matt Ma](http://mattmadesign.com)

Ember Rocks is [MIT Licensed](./LICENSE.md).

[npm-badge-url]: https://nodei.co/npm/ng-addon/
[npm-badge-image]: https://nodei.co/npm/ng-addon.png?global=true

[npm-url]: https://www.npmjs.org/package/ng-addon
[npm-image]: http://img.shields.io/npm/v/npm.svg

[travis-image]: https://travis-ci.org/mattma/ng-addon.svg?branch=master
[travis-url]: https://travis-ci.org/mattma/ng-addon

[dependency-image]: https://david-dm.org/mattma/ng-addon.svg
[dependency-url]: https://david-dm.org/mattma/ng-addon
