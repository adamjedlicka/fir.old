import path from 'path'
import { GeneratingConcept } from '@fir/core/src/GeneratingConcept'
import { Package } from '@fir/core/src/Package'

export default class Pages extends GeneratingConcept {
  directory() {
    return 'pages'
  }

  async generate(files) {
    const pages = files
      .filter((file) => file.ident !== '_layout')
      .sort((a, b) => {
        return a.priority - b.priority
      })

    const layout = files.find((file) => file.ident === '_layout')

    await this.renderTemplate('_Pages.ts.ejs', { pages, layout })
  }

  processFile(pkg: Package, file: string): any {
    const parsed = path.parse(file)
    const parts = [...parsed.dir.split('/').filter(Boolean), parsed.name]
    const component = this.getRelativePathForFile(pkg, file)

    return {
      ident: this.getIdent(parts),
      path: this.getPath(parts),
      priority: this.getPriority(parts),
      component,
    }
  }

  protected getIdent(parts: string[]): string {
    return parts.join('_')
  }

  protected getPath(parts: string[]): string {
    if (parts[0] === 'index') return '/'
    if (parts[0] === '_404') return '/:pathMatch(.*)*'

    const route = parts.map((part) => (part[0] == '_' ? `:${part.slice(1)}` : part)).join('/')

    return `/${route}`
  }

  protected getPriority(parts: string[]): number {
    if (parts[0] === 'index') return 1
    if (parts[0] === '_404') return 9001

    let priority = 10

    for (let part of parts) {
      if (part[0] === '_') {
        priority += 20
      } else {
        priority += 10
      }
    }

    return priority
  }
}
