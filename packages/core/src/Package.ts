import path from 'path'
import glob from 'glob'
import util from 'util'

const _glob = util.promisify(glob)

interface Config {
  meta: any
  path: string
}

export class Package {
  protected meta: any
  protected path: string

  constructor(config: Config) {
    this.meta = config.meta
    this.path = config.path
  }

  async getFiles(dir: string): Promise<string[]> {
    const files = await _glob('**/*.*', {
      cwd: path.join(this.path, dir),
    })

    return files.map((file) => file.replace(/\\/g, '/'))
  }

  async getViteConfig(): Promise<Record<string, any>> {
    try {
      const { default: viteConfig } = await import(path.join(this.path, 'vite.config'))

      return viteConfig
    } catch {
      return {}
    }
  }

  pathResolve(...paths: string[]) {
    return path.join(this.path, ...paths)
  }

  getId(): string {
    return `${this.getName()}@${this.getVersion()}`
  }

  getName(): string {
    return this.meta.name
  }

  getVersion(): string {
    return this.meta.version
  }

  getPath(): string {
    return this.path
  }
}
