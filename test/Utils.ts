import path from 'path'
import fs from 'fs/promises'
import { Server } from 'http'
import { Application } from 'express'
import getPort from 'get-port'
import { Dev } from '@fir/core/src/Dev'

interface MakeProjectConfig {
  packages: (string | any[])[]
}

interface MakeProjectCallback {
  (opts: MakeProjectCallbackOptions): Promise<void>
}

interface MakeProjectCallbackOptions {
  app: Application
  server: Server
  url: string
  writeFile: (path: string, content: string) => Promise<void>
  rm: (path: string) => Promise<void>
}

export const makeProject = async (config: MakeProjectConfig, callback: MakeProjectCallback): Promise<void> => {
  await makeTempDir(async (dir) => {
    let dev: Dev | null = null
    let app: Application | null = null
    let server: Server | null = null

    try {
      for (const pkg of config.packages) {
        if (typeof pkg === 'string') continue

        await writePackage(dir, pkg[0], pkg[1])
      }

      dev = new Dev({
        dir,
        packages: config.packages.map((pkg) => {
          if (typeof pkg === 'string') return pkg

          return `./${pkg[0]}`
        }),
      })

      await dev.bootstrap()

      app = await dev.createServer()

      const port = await getPort()

      server = app.listen(port, 'localhost')

      await callback({
        app,
        server,
        url: `http://localhost:${port}`,
        writeFile: (_path, _content) => writeFile(path.join(dir, _path), _content),
        rm: (_path) => fs.rm(path.join(dir, _path), { recursive: true }),
      })
    } catch (e) {
      throw e
    } finally {
      await server?.close()
      await dev?.close()
    }
  })
}

const makeTempDir = async (fn: (string) => Promise<void>) => {
  await fs.mkdir('.test', { recursive: true })

  const dir = await fs.mkdtemp('.test/temp-')

  try {
    await fn(path.join(process.cwd(), dir))
  } catch (e) {
    throw e
  } finally {
    await fs.rm(dir, {
      recursive: true,
      force: true,
    })
  }
}

const writeFile = async (file: string, content: string): Promise<void> => {
  const dir = path.dirname(file)
  if (dir !== '.') await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(file, content, { encoding: 'utf-8' })
}

const writeDirectory = async (dir: string, structure: any) => {
  for (const [key, value] of Object.entries(structure)) {
    if (typeof value === 'string') {
      await writeFile(path.join(dir, key), value)
    } else {
      await writeDirectory(path.join(dir, key), value)
    }
  }
}

const writePackage = async (dir: string, name: string, structure: any = {}) => {
  await writeFile(path.join(dir, name, 'package.json'), `{ "name": "${name}", "version": "0.0.0" }`)

  await writeDirectory(path.join(dir, name), structure)
}
