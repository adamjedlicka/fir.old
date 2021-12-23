import path from 'path'
import { Express, RequestHandler } from 'express'
import { Package } from '@fir/core/src/Package'
import { Dev } from '@fir/core/src/Dev'
import { GeneratingConcept } from '@fir/core/src/GeneratingConcept'

export default class Routes extends GeneratingConcept {
  routes: Record<string, RequestHandler> = {}

  directory() {
    return 'routes'
  }

  async processFile(pkg: Package, file: string) {
    const { default: route } = await import(pkg.pathResolve(this.directory(), file))

    return {
      path: `/${path.parse(file).name}`,
      route,
    }
  }

  async generate(files: any[]): Promise<void> {
    this.routes = {}

    for (const file of files) {
      this.routes[file.path] = file.route
    }
  }

  async applyMiddleware(server: Express): Promise<void> {
    if (this.fir instanceof Dev) {
      server.use((req, res, next) => {
        const route = this.routes[req.originalUrl]

        if (!route) return next()

        return route(req, res, next)
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

    const { default: route } = await import(resolved)

    this.routes[`/${path.parse(file).name}`] = route
  }
}
