import path from 'path'
import chokidar from 'chokidar'
import { debounce } from 'lodash'
import { Concept } from './Concept'
import { Dev } from './Dev'
import { Package } from './Package'

export abstract class GeneratingConcept extends Concept {
  protected packages: [Package, Record<string, any>][] = []
  protected _generate = debounce(this.generate, 100)

  abstract directory(): string

  async beforeAll() {
    // Do nothing...
  }

  async run(pkg: Package) {
    const files = {}

    for (const file of await pkg.getFiles(this.directory())) {
      files[file] = this.processFile(pkg, file)
    }

    this.packages.push([pkg, files])

    if (this.fir instanceof Dev) {
      const watcher = chokidar.watch(pkg.pathResolve(this.directory()), {
        ignoreInitial: true,
      })

      watcher.on('add', async (_path) => {
        const file = path.basename(_path)

        files[file] = this.processFile(pkg, file)

        await this.onAdd(pkg, file)
      })

      watcher.on('change', async (_path) => {
        const file = path.basename(_path)

        await this.onChange(pkg, file)
      })

      watcher.on('unlink', async (_path) => {
        const file = path.basename(_path)

        delete files[file]

        await this.onUnlink(pkg, file)
      })

      this.fir.onClose(async () => {
        await watcher.close()
      })
    }
  }

  async afterAll() {
    await this.generate(this.getFiles())
  }

  async generate(files: any[]) {
    // Do nothing...
  }

  processFile(pkg: Package, file: string): any {
    return pkg.pathResolve(this.directory(), file)
  }

  async onAdd(pkg: Package, file: string) {
    await this._generate(this.getFiles())
  }

  async onChange(pkg: Package, file: string) {}

  async onUnlink(pkg: Package, file: string) {
    await this._generate(this.getFiles())
  }

  getFiles() {
    const files = {}

    for (const pkg of this.packages) {
      for (const [key, value] of Object.entries(pkg[1])) {
        files[key] = value
      }
    }

    return Object.values(files)
  }
}
