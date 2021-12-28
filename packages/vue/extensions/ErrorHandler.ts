import { App } from 'vue'

export default async (app: App, ctx) => {
  app.config.errorHandler = (err) => {
    ctx.error = err
  }
}
