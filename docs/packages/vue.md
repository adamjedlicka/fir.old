# Vue

Package `@fir-js/vue` adds ability to use `.vue` components. It takes `templates/App.vue` component as an entry point.

::: tip Multiple pages
If you want your application to have multiple pages, use [@fir-js/vue-router](/packages/vue-router) package.
:::

## Data fetching

For asynchronous data fetching use `useFetch` hook from `@fir-js/vue/compositions/Fetch`. It fetches the data on the server and transfers them to the client serialized inside rendered HTML page. This way browser doesn't need to do any additional data fetching during initial visit.

```vue
// components/Todo.vue
<template>
  <div>{{ data.title }}</div>
</template>

<script>
import { useFetch } from '@fir-js/vue/compositions/Fetch'

export default {
  props: ['id'],

  async setup(props) {
    const { data } = await useFetch(() => `https://jsonplaceholder.typicode.com/todos/${props.id}`)

    return {
      data,
    }
  },
}
</script>
```
