import { App } from 'vue'
import { isServer } from '@fir-js/core'

export const before = async () => {}

export const after = async (app: App, ctx, output) => {
  if (!isServer) return

  output.html = output.html.replace('</head>', `${renderHead(ctx.head)}</head>`)
}

function renderHead(head: Record<string, any>): string {
  let rendered = ''

  for (const [key, value] of Object.entries(head)) {
    rendered += `<${key}>${value}</${key}>`
  }

  return rendered
}
