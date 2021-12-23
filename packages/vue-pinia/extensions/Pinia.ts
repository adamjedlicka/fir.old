import { App } from 'vue'
import { createPinia } from 'pinia'

export default async (app: App, ctx) => {
  const pinia = createPinia()

  app.use(pinia)
}
