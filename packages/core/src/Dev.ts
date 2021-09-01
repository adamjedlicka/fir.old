import path from 'path'
import { createServer, mergeConfig } from 'vite'
import fs from 'fs/promises'
import express, { Application } from 'express'
import { Fir } from './Fir'
import Youch from 'youch'

export class Dev extends Fir {
  async createServer(): Promise<Application> {
    const viteDevServer = await createServer(
      this.buildConfig({
        server: { middlewareMode: true },
        clearScreen: false,
        root: this.getBuildDir(),
        logLevel: process.env.NODE_ENV === 'test' ? 'silent' : undefined,
      }),
    )

    const server = express()

    server.use(...(this.context.public ?? []))

    for (const [path, middleware] of Object.entries(this.context.routes ?? {})) {
      server.use(`/${path}`, middleware as Application)
    }

    server.use(viteDevServer.middlewares)

    server.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl

        const index = await fs.readFile(path.join(this.getBuildDir(), 'index.html'), { encoding: 'utf-8' })
        const template = await viteDevServer.transformIndexHtml(url, index)

        const { default: entry } = await viteDevServer.ssrLoadModule('/entry-server.ts')

        return await this.handleRequest(req, res, next, { template, entry })
      } catch (e) {
        viteDevServer.ssrFixStacktrace(e)

        const youch = new Youch(e, req)

        const html = await youch.toHTML()

        res.status(500).end(html)
      }
    })

    this.onClose(async () => {
      await viteDevServer.close()
    })

    return server
  }
}
