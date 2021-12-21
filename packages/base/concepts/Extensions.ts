import path from 'path'
import { Package } from '@fir/core/src/Package'
import { Concept } from '@fir/core/src/Concept'

export default class Extensions extends Concept {
  directory() {
    return 'extensions'
  }

  async beforeAll() {
    this.fir.context.extensions = {}
  }

  async run(pkg: Package) {
    for (const file of await pkg.getFiles(this.directory())) {
      const extension = pkg.pathResolve(this.directory(), file)

      this.fir.context.extensions[path.parse(file).name] = extension
    }
  }
}
