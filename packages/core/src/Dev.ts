import path from 'path'
import { createServer } from 'vite'
import fs from 'fs/promises'
import express, { Application } from 'express'
import { Fir } from './Fir'
import Youch from 'youch'

export class Dev extends Fir {
  async createServer(): Promise<Application> {
    const config = this.buildConfig({
      server: { middlewareMode: true },
      clearScreen: false,
      root: this.getBuildDir(),
      logLevel: process.env.NODE_ENV === 'test' ? 'silent' : undefined,
    })

    const viteDevServer = await createServer(config)

    const server = express()

    for (const concept of Object.values(this.loadedConcepts)) {
      await concept.applyMiddleware(server)
    }

    server.use(viteDevServer.middlewares)

    server.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl

        const index = await fs.readFile(path.join(this.getBuildDir(), 'index.html'), { encoding: 'utf-8' })
        const template = await viteDevServer.transformIndexHtml(url, index)

        const { default: entry } = await viteDevServer.ssrLoadModule('/entry-server')

        const ctx = {
          req,
          res,
        }

        return await this.handleRequest(entry, { template, ctx }, res)
      } catch (e) {
        viteDevServer.ssrFixStacktrace(e)

        if (process.env.NODE_ENV === 'test') {
          next(e)
        } else {
          const youch = new Youch(e, req)

          const html = await youch.toHTML()

          res.status(500).end(html)
        }

        viteDevServer.restart()
      }
    })

    this.onClose(async () => {
      await viteDevServer.close()
    })

    return server
  }
}
