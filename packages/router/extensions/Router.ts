import { App } from 'vue'
import RouterLink from '@fir/router/components/RouterLink.vue'
import RouterView from '@fir/router/components/RouterView.vue'

export default async (app: App) => {
  app.component('RouterLink', RouterLink)
  app.component('RouterView', RouterView)

  app.mixin({
    inject: {
      $router: {
        default: null,
      },
      $route: {
        default: null,
      },
    },
  })
}
