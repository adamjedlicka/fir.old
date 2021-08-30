import type { App } from 'vue'
import RouterLink from '@fir/router/components/RouterLink.vue'

export default async (app: App) => {
  app.component('RouterLink', RouterLink)
}
