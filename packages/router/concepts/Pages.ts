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

    await this.renderTemplate('Pages.ts.ejs', { pages, layout })
  }

  processFile(pkg: Package, file: string): any {
    const ident = path.parse(file).name
    const component = pkg.pathResolve(this.directory(), file)

    return {
      ident,
      path: this.getPath(ident),
      priority: this.getPriority(ident),
      component,
    }
  }

  protected getPath(ident) {
    if (ident === 'index') return '^\\/$'
    if (ident === '_404') return '^\\/.*$'

    return `^\\/${ident}$`
  }

  protected getPriority(ident) {
    if (ident === 'index') return 1
    if (ident === '_404') return 9001

    return 10
  }
}
