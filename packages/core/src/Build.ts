import path from 'path'
import open from 'open'
import { build } from 'vite'
import rollupPluginVisualizer from 'rollup-plugin-visualizer'
import { Fir } from './Fir'

export class Build extends Fir {
  async build(): Promise<void> {
    const analyze = process.argv.includes('--analyze')

    await build(
      this.buildConfig({
        clearScreen: false,
        root: this.getBuildDir(),
        build: {
          ssrManifest: true,
          outDir: path.join(this.getDistDir(), 'client'),
          emptyOutDir: true,
          rollupOptions: {
            plugins: [
              analyze &&
                rollupPluginVisualizer({
                  filename: path.resolve(this.getDistDir(), 'client', 'stats.html'),
                }),
            ],
          },
        },
      }),
    )

    if (analyze) {
      open(path.resolve(this.getDistDir(), 'client', 'stats.html'))
    }

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
