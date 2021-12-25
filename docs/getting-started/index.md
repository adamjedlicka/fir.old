# Getting started

## Creating your first Fir project

::: tip Compatibility Note
Fir requires [Node.js](https://nodejs.org/en/) version >=14.
:::

With NPM:

```bash
$ npm init fir@latest
```

With Yarn:

```bash
$ yarn create fir
```

## Directory structure

Fir application is made of packages to improve maintainability of large projects. By default, Fir creates general `app` which you can use as is, rename or remove completely.

Packages should have similar directory structure. Most of your packages should have directories like `components`, `pages`, `assets` and so on. Each package thus represents one domain of your application. So if you are building an eshop, you will have packages like `homepage`, `catalog` and `checkout`.

Fir packages are not only for organizing your application. They can also enhance or add functionality to the Fir framework. This mean that Fir is made from small number of core functionalities and the rest is provided by packages. Your project has few of them turned on by default in addition of your `app` package.

## fir.config.ts

Your newly created application also contains `fir.config.ts` file which functions as the primary configuration file for the whole project. Most importantly, it specifies which packages and in which order should be loaded.
