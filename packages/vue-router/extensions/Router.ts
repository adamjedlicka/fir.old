import { App } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { isServer } from '@fir-js/core'
import { routes } from '/_Pages'

export const before = async (app: App, ctx) => {
  const router = createRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    routes,
  })

  router.push(isServer ? ctx.req.url : window.location.pathname)

  await router.isReady()

  app.use(router)
}
