import path from 'path'
import express, { Express, RequestHandler, Router } from 'express'
import { Package } from '@fir-js/core/src/Package'
import { Dev } from '@fir-js/core/src/Dev'
import { GeneratingConcept } from '@fir-js/core/src/GeneratingConcept'

export default class Routes extends GeneratingConcept {
  router: Router
  routes: Record<string, RequestHandler> = {}

  directory() {
    return 'routes'
  }

  async processFile(pkg: Package, file: string) {
    const { default: route } = await import(pkg.pathResolve(this.directory(), file))

    const { dir, name } = path.parse(file)

    const joined = dir ? `/${dir}/${name}` : `/${name}`
    const replaced = joined.replace(/\[(.+?)\]/g, (_, $1) => `:${$1}`)

    return {
      path: replaced,
      route,
    }
  }

  async generate(files: any[]): Promise<void> {
    this.routes = {}

    for (const file of files) {
      this.routes[file.path] = file.route
    }

    if (this.fir instanceof Dev) this.generateRouter()
  }

  async applyMiddleware(server: Express): Promise<void> {
    if (this.fir instanceof Dev) {
      server.use((req, res, next) => {
        this.router(req, res, next)
      })
    } else {
      for (const [path, route] of Object.entries(this.routes)) {
        server.use(path, route)
      }
    }
  }

  async onChange(pkg: Package, file: string): Promise<void> {
    const resolved = pkg.pathResolve(this.directory(), file)

    delete require.cache[resolved]

    const { path, route } = await this.processFile(pkg, file)

    this.routes[path] = route

    this.generateRouter()
  }

  private generateRouter() {
    this.router = express.Router()

    for (const [path, route] of Object.entries(this.routes)) {
      this.router.use(path, route)
    }
  }
}
