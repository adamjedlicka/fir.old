# Getting started

## Creating your first Fir project

::: tip Compatibility Note
Fir requires [Node.js](https://nodejs.org/en/) version >=14
:::

With NPM:

```bash
$ npm init fir@latest
```

With Yarn:

```bash
$ yarn create fir
```

## Packages

Fir application is made of packages to improve maintainability of large projects. By default, Fir creates general `app` package which you can use as is, rename it or remove it completely.

Packages should have similar directory structure. Most of your packages should have directories like `components`, `pages`, `assets` and so on. Each package thus represents one domain of your application. So if you are building an e-shop, you will have packages like `homepage`, `catalog` and `checkout`.

Fir packages are not only for organizing your application. They can also enhance or add functionality to the Fir framework. This mean that Fir is made from small number of core functionalities and the rest is provided by packages. Your project has few of them turned on by default in addition of your `app` package.

Each package can also have its own `vite.config.ts` for configuring Vite. More info [here](https://vitejs.dev/config/).

## Concepts

Directories like `components`, `pages` and `assets` in your packages are called concepts and they might have special functionality. For example `pages` concept will automatically create application router from the directory structure, or the `public` concept will server all of the files as public static assets.

There is one special concept called `concepts`. This directory contains functionality for other concepts. So for example the `@fir-js/base` packages has `concepts/Public.ts` file which crawls `public` directories of other packages and serves their files as static assets.

## Configuration

Your newly created application also contains `fir.config.ts` file which functions as the primary configuration file for the whole project. Most importantly, it specifies which packages and in which order should be loaded.

```javascript
// fir.config.ts
export default {
  packages: [
    // @fir-js/base package provides basic functionality like the public concept
    '@fir-js/base',
    // @fir-js/vue package adds support for the Vue framework
    '@fir-js/vue',
    // @fir-js/router package installs vue-router and creates router from the contents of the pages directory
    '@fir-js/vue-router',
    // This is local package containing basis of our application
    './packages/app',
  ],
}
```

### Order of packages matters

Now you may ask what happens if there are two packages both with the `public` directory containing `logo.png` file. Concepts in Fir generally adhere to the rule that later loaded packages have higher priority then packages loaded before them. So in this case, Fir would server `logo.png` file from the package that is on higher index in the `packages` array in the `fir.config.ts` configuration file.

This is used a lot in Fir applications as a functionality overriding. Imagine you are distributing your application in multiple countries and in some, you want footer of the application to be different. In Fir you can create new package, for example `custom-footer` which will contain customized footer component. This package is then turned only in those countries that need that custom footer. During build it will override the original footer and the original footer won't end up in the final application bundle decreasing application size and increasing its maintainability.
