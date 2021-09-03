import { App } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { isServer } from '@fir/core'
import { routes } from '/Pages'

export default async (app: App, ctx) => {
  const router = createRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    routes,
  })

  if (isServer) {
    router.push(ctx.req.url)
  } else {
    router.push(window.location.pathname)
  }

  await router.isReady()

  app.use(router)
}
