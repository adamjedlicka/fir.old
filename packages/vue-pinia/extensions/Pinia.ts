import { App } from 'vue'
import devalue from 'devalue'
import { createPinia } from 'pinia'
import { isServer } from '@fir-js/core'

export const before = async (app: App, ctx) => {
  const pinia = createPinia()

  app.use(pinia)

  if (isServer) {
    ctx.pinia = pinia
  } else {
    pinia.state.value = window.__PINIA__
  }
}

export const after = async (app: App, ctx, output) => {
  if (!isServer) return

  output.html = output.html.replace(
    '<!--after-app-->',
    `<!--after-app--><script>window.__PINIA__ = ${devalue(ctx.pinia.state.value)}</script>`,
  )
}
