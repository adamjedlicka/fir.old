# Introduction

Fir is a framework agnostic meta-framework for complex server-side rendered applications with emphasis on performance. What does it mean?

## Framework agnostic

Framework agnostic means you can use any frontend JavaScript framework you like and love. Vue, React, Svelte, Solid, ... Only two requirements are plugin for Vite and support for server-side rendering.

## Meta-framework

Meta-framework is framework for frameworks. Main framework does client-side rendering, reactivity, state management and so on. Meta-framework does all of the supporting stuff. Provides infrastructure for server-side rendering and backend logick like server middleware, sets best practices, contains scaffolding to allow easy project creation and so on.

Ofcourse, you can use framework without a meta-framework but you will have to do yourself a lot of things other people already figgured out and is supplied out of the box with meta-framework.

## For complex applications

This is the reason why Fir came to existence. There are a lot of ther meta-frameworks fro server-side rendered applications like Nuxt for Vue or Next for React. But none of them are made for complex applications like Fir.

How to clasify complex application? When more than few people are working on it full time? Once it reaches few hundred thousands lines of code? Though to say, it depends a lot on multiple conditions, but I would say most real-world applications which are being continuously developed fall into this category.

So why is Fir better for complex applications compared to other meta-frameworks? Two reasons.

### Modularity

Applications built on top Fir are made of modules. These modules are basically small applications. So each module might have `components/` directory and `pages/` directory and `stores/` directory. Each module represents only one domain of the whole application. So if you are building an e-shop, you might have `homepage` module and `catalog` module and `checkout` module. This structure of code is extremely flexible, allows better orientation in whole codebase and can support multiple teams working on the application at the same time.

Everything in Fir is made of these modules. By default, Fir can't do much. So if you want to develop a Vue application, you enable `@fir/vue` module. Do you want your application to support routing and have multiple pages? Easy. Just enable `@fir/vue-router` module. Do you need state management? There is a module for it.

This also means if you are missing some functionality, you can create your own module wich will add it. And enabling/disabling these modules means you can easilly change the behaviout of the whole application.

### Inversion of Control

Inversion of control goes hand in hand with its system of modules. When you import anything in Fir, you don't use realtive paths, but import it from some magical space called dependency injection container. So if you want to import component called `Button` you wouldn't import it like this `import Button from '../components/Button'` but import it like this `import { Button } from '~/components'`. This means you don't specify from where exactly is this component imported. So why is this useful? Because you can have module overriding behaviour of other modules. Imagine this `Button` component is in module `theme`. Now if you create new `Button` component with for example blue background and put it in `button-blue` module which overrides the `theme` module, whole application will now have buttons with blue background without having to change anything except adding new module.

This system is extremely powerful. It is usefull especially when you want to change some functionality in third party module. Imagine you found some module or library on the internet which almost exactly does the thing you need except one small thing. In Fir it's non-issue because you can easilly change basically anything thanks to built-in inversion of control.

## Server-side rendered applications

A lot of business still need server-side rendered applications due to better SEO. Crawlers have easier time indexing properly rendered HTML compared to JS only apps. Server-side rendering also improves performance and user experience.

## Empahis on performance

Fir is also extremly focused on squeezing maximum out of the web technologies. No long load times, large JS chunks or slow applications. Everything in Fir is made to be three-shaken, code-splited, lazy-loaded and minimized as much as possible. No unnecessary JavaScript, CSS or HTML.
