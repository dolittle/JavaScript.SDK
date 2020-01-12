# JavaScript SDK

[![Build Status](https://dolittle.visualstudio.com/Dolittle%20open-source%20repositories/_apis/build/status/dolittle-runtime.JavaScript.SDK?branchName=master)](https://dolittle.visualstudio.com/Dolittle%20open-source%20repositories/_build/latest?definitionId=60&branchName=master)

The repository holds the SDK for working with Dolittle for JavaScript.

## Requirements

This project relies on [NodeJS](https://nodejs.org/en/) and leverages [Yarn](http://yarnpkg.com/).
The code is written using [TypeScript](http://www.typescriptlang.org) and transpiles
to JavaScript as part of its building.

## Building

At the root level of the repository, to restore all node modules, run the following:

```shell
$ yarn
```

To build, run the following at the root level of the repository:

```shell
$ yarn build
```

To run the test harness:

```shell
$ yarn test
```
