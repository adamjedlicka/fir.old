import path from 'path'
import { createServer } from 'vite'
import fs from 'fs/promises'
import express, { Application } from 'express'
import { Fir } from './Fir'
import Youch from 'youch'

export class Dev extends Fir {
  async createServer(): Promise<Application> {
    const config = this.buildConfig({
      server: { middlewareMode: true, hmr: false },
      clearScreen: false,
      root: this.getBuildDir(),
      logLevel: process.env.NODE_ENV === 'test' ? 'silent' : undefined,
    })

    const viteDevServer = await createServer(config)

    const server = express()

    if (this.context.public) {
      server.use(...(this.context.public ?? []))
    }

    for (const [path, middleware] of Object.entries(this.context.routes ?? {})) {
      server.use(`/${path}`, middleware as Application)
    }

    server.use(viteDevServer.middlewares)

    server.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl

        const index = await fs.readFile(path.join(this.getBuildDir(), 'index.html'), { encoding: 'utf-8' })
        const template = await viteDevServer.transformIndexHtml(url, index)

        const { default: entry } = await viteDevServer.ssrLoadModule('/entry-server')

        return await this.handleRequest(req, res, next, { template, entry })
      } catch (e) {
        const youch = new Youch(e, req)

        const [html, json] = await Promise.all([youch.toHTML(), youch.toJSON()])

        console.error(json.error.message)

        res.status(500).end(html)
      }
    })

    this.onClose(async () => {
      await viteDevServer.close()
    })

    return server
  }
}
