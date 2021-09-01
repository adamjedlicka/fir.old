import path from 'path'
import fs from 'fs/promises'
import devalue from 'devalue'
import fetch from 'node-fetch'
import { Package } from './Package'
import { Concept } from './Concept'
import { mergeConfig, UserConfig } from 'vite'
import { Request, Response, RequestHandler } from 'express'

global.fetch = fetch
global.__require = require

interface Config {
  dir: string
  packages?: string[]
}

export interface AppContext {
  req: Request
  payload: Record<string, any>
  id: () => string
}

interface RequestOptions {
  template: string
  entry: (ctx: AppContext) => Promise<string>
  manifest?: Record<string, string[]>
}

export abstract class Fir {
  protected dir: string
  protected packages: string[]
  protected closeHandlers: (() => Promise<void>)[] = []

  public context: Record<string, any> = {}

  public viteConfig: UserConfig = {
    plugins: [
      {
        name: 'fir',
        transform(code, id, ssr) {
          if (id.endsWith(path.join('core', 'index.ts'))) {
            return code.replace(/__IS_SERVER__/, String(ssr))
          }

          return code
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

    const packages: Record<string, Package> = {}
    const concepts: Record<string, Concept> = {}

    for (const pkg of this.packages) {
      const resolved = await this.resolvePackage(pkg)
      const loaded = await this.loadPackage(resolved)

      packages[loaded.getId()] = loaded

      this.viteConfig = mergeConfig(this.viteConfig, await loaded.getViteConfig())

      for (const concept of await this.loadConcepts(loaded)) {
        concepts[concept.directory()] = concept
      }
    }

    for (const concept of Object.values(concepts)) {
      await concept.beforeAll()

      for (const pkg of Object.values(packages)) {
        await concept.run(pkg)
      }

      await concept.afterAll()
    }

    return true
  }

  async handleRequest(req: Request, res: Response, next: RequestHandler, opts: RequestOptions) {
    let _id = 0

    const ctx: AppContext = {
      req,
      payload: {},
      id: () => String(++_id),
    }

    const appHtml = await opts.entry(ctx)

    const preloadLinks = this.preloadLinks(ctx, opts.manifest)

    const payload = `<script>window.__PAYLOAD__ = ${devalue(ctx.payload)}</script>`

    const html = opts.template
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--payload-->`, payload)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  }

  protected buildConfig(viteConfig: UserConfig): Record<string, any> {
    return mergeConfig(this.viteConfig, viteConfig, true)
  }

  protected preloadLinks(ctx, manifest = {}): string {
    let links = ''

    const seen = new Set()

    for (const module of ctx.modules) {
      const files = manifest[module]

      if (!files) continue

      for (const file of files) {
        if (seen.has(file)) continue

        seen.add(file)

        links += this.renderPreloadLink(file)
      }
    }

    return links
  }

  protected renderPreloadLink(file: string): string {
    if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
      return `<link rel="stylesheet" href="${file}">`
    } else {
      // TODO
      return ''
    }
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
