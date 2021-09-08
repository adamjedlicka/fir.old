<template>
  <suspense>
    <component :is="layout">
      <component :is="page.component" />
    </component>
  </suspense>
</template>

<script>
import { computed, defineComponent, useSSRContext, ref, provide, reactive, watchEffect } from 'vue'
import { layout, pages } from '/Pages'

export default defineComponent({
  setup() {
    const path = ref(import.meta.env.SSR ? useSSRContext().req.originalUrl : window.location.pathname)

    const page = computed(() => {
      for (const page of pages) {
        if (page.path.test(path.value)) return page
      }
      return null
    })

    if (!import.meta.env.SSR) {
      window.onpopstate = () => {
        path.value = window.location.pathname
      }
    }

    const $router = {
      push(_path) {
        window.history.pushState('', '', _path)
        path.value = _path
      },
    }

    const $route = reactive({
      params: {},
    })

    watchEffect(() => {
      $route.params = path.value.match(page.value.path).groups || {}
    })

    provide('$router', $router)
    provide('$route', $route)

    return {
      path,
      layout,
      page,
    }
  },
})
</script>
