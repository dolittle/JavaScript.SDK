<h1 align="center"><img src="https://raw.githubusercontent.com/dolittle/Runtime/master/Documentation/dolittle_negativ_horisontal_RGB.svg" alt="Dolittle"></h1>

<h4 align="center">
    <a href="https://dolittle.io">Documentation</a> |
    <a href="https://dolittle.io/docs/tutorials/getting_started/">Tutorial</a> |
    <a href="https://github.com/dolittle/Runtime">Runtime</a> |
    <a href="https://github.com/dolittle/DotNet.SDK">C# SDK</a>
</h4>

---

<p align="center">
    <a href="https://www.npmjs.com/package/@dolittle/sdk"><img src="https://img.shields.io/npm/v/@dolittle/sdk?logo=npm" alt="Latest Nuget package"></a>
    <a href="https://github.com/dolittle/JavaScript.SDK/actions?query=workflow%3A%22TypeScript+Library+CI%2FCD%22"><img src="https://github.com/dolittle/JavaScript.SDK/workflows/TypeScript%20Library%20CI%2FCD/badge.svg" alt="Build status"></a>
    <a href="https://github.com/dolittle/JavaScript.SDK/actions?query=workflow%3ACodeQL"><img src="https://github.com/dolittle/JavaScript.SDK/workflows/CodeQL/badge.svg" alt="CodeQL status"></a>
</p>

Dolittle is a decentralized, distributed, event-driven microservice platform built to harness the power of events.

This is our JS SDK, install it with:
```shell
$ npm install @dolittle/sdk 
```

# Get Started
- Try our [tutorials](https://dolittle.io/docs/tutorials/)
- Check out our [documentation](https://dolittle.io)

In the [./Samples/Tutorial](./Samples/Tutorial) folder you can find sample code on how to use the SDK. 

# Developing

## Building

This project relies on [NodeJS](https://nodejs.org/en/) `>= 14.16` and leverages [Yarn](http://yarnpkg.com/) `>= 1.22`.
The code is written using [TypeScript](http://www.typescriptlang.org) and transpiles
to JavaScript as part of its building.

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

## Adding a new package/sample

Add the new project to root `package.json`'s `"workspaces"` array, so that it gets built together with the others. Also add it to either `Source/tsconfig.json` or `Samples/tsconfig.json`, depending on if it's a new SDK package or sample package. After this, the new packages are linked for easier development.

# Issues and Contributing
Issues and contributions are always welcome!

To learn how to contribute, please read our [contributing](https://dolittle.io/docs/contributing/) guide.
