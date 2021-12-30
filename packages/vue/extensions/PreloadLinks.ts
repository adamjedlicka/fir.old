import { App } from 'vue'
import { isServer } from '@fir-js/core'

export const before = async () => {}

export const after = async (app: App, ctx, output) => {
  if (!isServer) return

  if (!ctx.manifest) ctx.manifest = {}

  output.html = output.html.replace('</head>', `${preloadLinks(ctx)}</head>`)
}

function preloadLinks(ctx): string {
  let links = ''

  const seen = new Set()

  for (const module of ctx.modules ?? []) {
    const files = ctx.manifest[module]

    if (!files) continue

    for (const file of files) {
      if (seen.has(file)) continue

      seen.add(file)

      links += renderPreloadLink(file)
    }
  }

  return links
}

function renderPreloadLink(file: string): string {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else {
    // TODO
    return ''
  }
}
