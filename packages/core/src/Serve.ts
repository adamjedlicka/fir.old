import path from 'path'
import fs from 'fs/promises'
import express, { Application } from 'express'
import compression from 'compression'
import Youch from 'youch'
import { Fir } from './Fir'

export class Serve extends Fir {
  async createServer(): Promise<Application> {
    const template = await fs.readFile(path.join(this.getDistDir(), 'client', 'index.html'), { encoding: 'utf-8' })

    const { default: entry } = await import(path.join(this.getDistDir(), 'server', 'entry-server.js'))

    const { default: manifest } = await import(path.join(this.getDistDir(), 'client', 'ssr-manifest.json'))

    const server = express()

    server.use(compression())

    server.use('/assets', express.static(path.join(this.getDistDir(), 'client', 'assets')))

    if (this.context.public) server.use(...(this.context.public ?? []))

    for (const [path, middleware] of Object.entries(this.context.routes ?? {})) {
      server.use(`/${path}`, middleware as Application)
    }

    server.get('*', async (req, res) => {
      try {
        return await this.handleRequest(entry, { template, req, manifest }, res)
      } catch (e) {
        const youch = new Youch(e, req)

        const html = await youch.toHTML()

        res.status(500).end(html)
      }
    })

    return server
  }
}
