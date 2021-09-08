import path from 'path'
import { Package } from '@fir/core/src/Package'
import { Concept } from '@fir/core/src/Concept'

export default class Routes extends Concept {
  directory() {
    return 'routes'
  }

  async beforeAll() {
    this.fir.context.routes = {}
  }

  async run(pkg: Package) {
    for (const file of await pkg.getFiles(this.directory())) {
      const { default: route } = await import(pkg.pathResolve(this.directory(), file))

      this.fir.context.routes[path.parse(file).name] = route
    }
  }
}
