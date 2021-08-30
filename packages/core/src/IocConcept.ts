import path from 'path'
import { GeneratingConcept } from './GeneratingConcept'
import { Package } from './Package'

const template = `
<%_ for (const file of files) { _%>
export { default as <%- file.ident -%> } from '<%- file.path -%>'
<%_ } _%>
`

export abstract class IocConcept extends GeneratingConcept {
  async generate(files: any[]) {
    const destination = path.join('ioc', this.directory() + '.ts')

    await this.render(template, { files }, { destination })
  }

  processFile(pkg: Package, file: string): any {
    return {
      ident: path.parse(file).name,
      path: pkg.pathResolve(this.directory(), file).replace(/\..+$/, ''),
    }
  }
}
