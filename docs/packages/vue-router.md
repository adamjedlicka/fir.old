# Vue Router

The `@fir-js/vue-router` adds client side routing functionality.

## Pages

Components inside the `pages/` directory are used as pages in your application. Their filesystem path corresponds to the URL in the browser. Meaning that `pages/hello.vue` will be available under `/hello` URL and `pages/hello/world.vue` under `/hello/world` URL.

### Dynamic parameters

Components can use `[param]` placeholders in their path names to serve as dynamic URL parameters.

For example component with name `pages/hello/[name].vue` will be available at any URL matching this pattern (for example `/hello/World`). You can also have multiple dynamic parameters: `pages/api/v[version]/[language]/[greeting]-[name].vue`. Such component will be for example available under `/api/v1/en/hello-world` URL.

You can then use API from the `vue-router` package to get these parameters. More info [here](https://next.router.vuejs.org/).

```vue
// pages/hello-[name].vue
<template>
  <div>Hello, {{ $route.params.name }}!</div>
</template>
```

### Layouts

Special component with the name `pages/$layout.vue` can be used as global layout component. It uses `<slot />` to render the matched page.

```vue
// pages/$layout.vue
<template>
  <header>Some header</header>
  <slot />
  <footer>Some footer</footer>
</template>
```

### 404

When no page is matched, Fir displays 404 page. This page can be configured via the `pages/$404.vue` component.

```vue
// pages/$404.vue
<template>
  <h1>404 - Page not found</h1>
</template>
```
