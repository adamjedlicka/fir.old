import path from 'path'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import { Package } from './Package'
import { Concept } from './Concept'
import { mergeConfig, UserConfig } from 'vite'
import { Request, Response } from 'express'

global.fetch = fetch

interface Config {
  dir: string
  packages?: string[]
}

interface RequestInput {
  template: string
  req: Request
  manifest?: Record<string, string[]>
}

interface RequestOutput {
  html: string
  error: Error | null
}

type Entry = (requestInput: RequestInput) => Promise<RequestOutput>

export abstract class Fir {
  protected dir: string
  protected packages: string[]
  protected closeHandlers: (() => Promise<void>)[] = []
  protected loadedPackages: Record<string, Package> = {}
  protected loadedConcepts: Record<string, Concept> = {}

  public context: Record<string, any> = {}

  public viteConfig: UserConfig = {
    plugins: [
      {
        name: 'fir',
        transform(code, _, { ssr } = {}) {
          return code.replace(/__FIR__IS_SERVER__/, String(ssr))
        },
      },
    ],
  }

  constructor(config?: Config) {
    this.dir = config?.dir ?? process.cwd()
    this.packages = config?.packages ?? []
  }

  async bootstrap(): Promise<boolean> {
    await fs.mkdir(this.getBuildDir(), { recursive: true })

    for (const pkg of this.packages) {
      const resolved = await this.resolvePackage(pkg)
      const loaded = await this.loadPackage(resolved)

      this.loadedPackages[loaded.getId()] = loaded

      this.viteConfig = mergeConfig(this.viteConfig, await loaded.getViteConfig())

      for (const concept of await this.loadConcepts(loaded)) {
        this.loadedConcepts[concept.directory()] = concept
      }
    }

    for (const concept of Object.values(this.loadedConcepts)) {
      await concept.beforeAll()

      for (const pkg of Object.values(this.loadedPackages)) {
        await concept.run(pkg)
      }

      await concept.afterAll()
    }

    return true
  }

  async handleRequest(entry: Entry, requestInput: RequestInput, res: Response) {
    const { html, error } = await entry(requestInput)

    if (error) throw error

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  }

  protected buildConfig(viteConfig: UserConfig): Record<string, any> {
    const config = mergeConfig(this.viteConfig, viteConfig, true)

    config.cacheDir = path.join(this.dir, '.vite')

    return config
  }

  async close() {
    for (const closeHandler of this.closeHandlers) {
      await closeHandler()
    }
  }

  onClose(closeHandler: () => Promise<void>) {
    this.closeHandlers.push(closeHandler)
  }

  getRootDir(): string {
    return this.dir
  }

  getBuildDir(): string {
    return path.join(this.getRootDir(), '.fir')
  }

  getDistDir(): string {
    return path.join(this.getBuildDir(), 'dist')
  }

  protected async resolvePackage(pkg: string): Promise<string> {
    if (pkg.startsWith('.')) {
      return require.resolve(path.join(this.dir, pkg, 'package.json'))
    } else {
      return require.resolve(path.join(pkg, 'package.json'))
    }
  }

  protected async loadPackage(resolved: string): Promise<Package> {
    const meta = require(resolved)

    return new Package({
      meta,
      path: path.dirname(resolved),
    })
  }

  protected async loadConcepts(loaded: Package): Promise<Concept[]> {
    const concepts: Concept[] = []

    for (const file of await loaded.getFiles('concepts')) {
      const _Concept = require(loaded.pathResolve('concepts', file)).default

      concepts.push(new _Concept(this) as Concept)
    }

    return concepts
  }
}
