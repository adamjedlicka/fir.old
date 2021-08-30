import path from 'path'
import { GeneratingConcept } from '@fir/core/src/GeneratingConcept'
import { Package } from '@fir/core/src/Package'

export default class Templates extends GeneratingConcept {
  directory() {
    return 'templates'
  }

  async beforeAll() {
    this.fir.context.templates = {}
  }

  async afterAll() {
    await super.afterAll()

    await Promise.all([
      this.renderTemplate('App.vue.ejs', this.fir),
      this.renderTemplate('entry-client.ts.ejs', this.fir),
      this.renderTemplate('entry-server.ts.ejs', this.fir),
      this.renderTemplate('index.html.ejs', this.fir),
      this.renderTemplate('vite.config.ts.ejs', this.fir),
    ])
  }

  async generate(files) {
    for (const file of files) {
      this.fir.context.templates[path.basename(file)] = file
    }
  }

  async onChange(pkg: Package, file: string) {
    await this.renderTemplate(file)
  }
}
