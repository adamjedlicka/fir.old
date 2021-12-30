export const before = () => {}

export const after = (app, ctx, output) => {
  if (!ctx.teleports) return

  for (const [key, html] of Object.entries(ctx.teleports)) {
    const locator = new RegExp(`<${key}>`)

    output.html = output.html.replace(locator, (match) => match + html)
  }
}
