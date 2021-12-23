import path from 'path'
import { Package } from '@fir-js/core/src/Package'
import { Concept } from '@fir-js/core/src/Concept'

export default class Extensions extends Concept {
  directory() {
    return 'extensions'
  }

  async beforeAll() {
    this.fir.context.extensions = {}
  }

  async run(pkg: Package) {
    for (const file of await pkg.getFiles(this.directory())) {
      const extension = this.getRelativePathForFile(pkg, file)

      this.fir.context.extensions[path.parse(file).name] = extension
    }
  }
}
