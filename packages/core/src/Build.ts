import path from 'path'
import { build } from 'vite'
import { Fir } from './Fir'

export class Build extends Fir {
  async build(): Promise<void> {
    await build({
      clearScreen: false,
      configFile: path.resolve(this.getBuildDir(), 'vite.config.ts'),
      root: this.getBuildDir(),
      build: {
        ssrManifest: true,
        outDir: path.join(this.getDistDir(), 'client'),
        emptyOutDir: true,
      },
    })

    await build({
      clearScreen: false,
      configFile: path.resolve(this.getBuildDir(), 'vite.config.ts'),
      root: this.getBuildDir(),
      build: {
        ssr: 'entry-server.ts',
        outDir: path.join(this.getDistDir(), 'server'),
        emptyOutDir: false,
      },
    })
  }
}
