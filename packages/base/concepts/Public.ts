import express, { RequestHandler } from 'express'
import { Package } from '@fir-js/core/src/Package'
import { Concept } from '@fir-js/core/src/Concept'

export default class Public extends Concept {
  protected middleware: RequestHandler[] = []

  directory() {
    return 'public'
  }

  async run(pkg: Package) {
    this.middleware.unshift(express.static(pkg.pathResolve('public')))
  }

  async applyMiddleware(server: express.Express): Promise<void> {
    server.use(...this.middleware)
  }
}
