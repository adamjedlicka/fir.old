import path from 'path'
import ejs from 'ejs'
import fs from 'fs/promises'
import { Express } from 'express'
import { Fir } from './Fir'
import { Package } from './Package'

interface RenderOptions {
  destination: string
}

export abstract class Concept {
  protected fir: Fir

  constructor(fir: Fir) {
    this.fir = fir
  }

  abstract directory(): string

  async beforeAll() {
    // Do nothing...
  }

  async run(pkg: Package) {
    // Do nothing...
  }

  async afterAll() {
    // Do nothing...
  }

  async applyMiddleware(server: Express): Promise<void> {
    // Do nothing...
  }

  async renderTemplate(name: string, data: Record<string, any> = {}): Promise<void> {
    const file = this.fir.context.templates[name]
    await this.renderFile(file, data)
  }

  async renderFile(file: string, data: Record<string, any> = {}): Promise<void> {
    const template = await fs.readFile(file, { encoding: 'utf-8' })
    await this.render(template, data, { destination: this.getDestinationFor(file) })
  }

  async render(template: string, data: Record<string, any> = {}, opts: RenderOptions): Promise<void> {
    const rendered = ejs.render(template, data)
    await fs.mkdir(path.join(this.fir.getBuildDir(), path.dirname(opts.destination)), { recursive: true })
    await fs.writeFile(path.join(this.fir.getBuildDir(), opts.destination), rendered, { encoding: 'utf-8' })
  }

  protected getDestinationFor(file: string): string {
    return path.join(path.basename(file.replace(/\.ejs$/, '')))
  }

  protected getRelativePathForFile(pkg: Package, file: string): string {
    return path.relative(this.fir.getBuildDir(), pkg.pathResolve(this.directory(), file))
  }
}
