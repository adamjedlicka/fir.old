import path from 'path'
import { GeneratingConcept } from '@fir-js/core/src/GeneratingConcept'
import { Package } from '@fir-js/core/src/Package'

export default class Templates extends GeneratingConcept {
  directory() {
    return 'templates'
  }

  async beforeAll() {
    this.fir.context.templates = {}
  }

  async afterAll() {
    await super.afterAll()

    await Promise.all(
      Object.keys(this.fir.context.templates)
        .filter((template) => !template.startsWith('_'))
        .map((template) => this.renderTemplate(template, this.fir)),
    )
  }

  async generate(files) {
    for (const file of files) {
      this.fir.context.templates[path.basename(file)] = file
    }
  }

  async onChange(pkg: Package, file: string) {
    await this.renderTemplate(file, this.fir)
  }
}
