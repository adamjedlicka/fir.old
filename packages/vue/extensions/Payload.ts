import { App } from 'vue'
import devalue from 'devalue'
import { isServer } from '@fir-js/core'

export const before = async () => {}

export const after = async (app: App, ctx, output) => {
  if (!isServer) return

  output.html = output.html.replace(
    '<!--after-app-->',
    `<!--after-app--><script>window.__PAYLOAD__ = ${devalue(ctx.payload)}</script>`,
  )
}
