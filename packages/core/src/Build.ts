import path from 'path'
import { build } from 'vite'
import { Fir } from './Fir'

export class Build extends Fir {
  async build(): Promise<void> {
    await build(
      this.buildConfig({
        clearScreen: false,
        root: this.getBuildDir(),
        build: {
          ssrManifest: true,
          outDir: path.join(this.getDistDir(), 'client'),
          emptyOutDir: true,
        },
      }),
    )

    await build(
      this.buildConfig({
        clearScreen: false,
        root: this.getBuildDir(),
        build: {
          ssr: 'entry-server.ts',
          outDir: path.join(this.getDistDir(), 'server'),
          emptyOutDir: false,
        },
      }),
    )
  }
}
