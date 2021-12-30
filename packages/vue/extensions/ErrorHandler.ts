import { App } from 'vue'

export const before = async (app: App, ctx) => {
  app.config.errorHandler = (err) => {
    ctx.error = err
  }
}

export const after = async () => {}
