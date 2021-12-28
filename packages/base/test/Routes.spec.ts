import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('basic response', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            routes: {
              'hello.ts': `
                export default function (req, res) {
                  res.send('Hello, World!')
                }`,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/hello')
      await expect(text).toBe('Hello, World!')
    },
  )
})

test('hot module reloading', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            routes: {
              'hello.ts': `
                export default function (req, res) {
                  res.send('Hello, World!')
                }`,
            },
          },
        ],
      ],
    },
    async ({ get, writeFile }) => {
      await writeFile(
        'app/routes/hello.ts',
        `
        export default function (req, res) {
          res.send('Hello, HMR!')
        }`,
      )

      const { text } = await get(page, '/hello')
      await expect(text).toBe('Hello, HMR!')
    },
  )
})

test('module overloading', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            routes: {
              'hello.ts': `
                export default function (req, res) {
                  res.send('Hello, World!')
                }`,
            },
          },
        ],
        [
          'app-overload',
          {
            routes: {
              'hello.ts': `
                export default function (req, res) {
                  res.send('Hello, Overload!')
                }`,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/hello')
      await expect(text).toBe('Hello, Overload!')
    },
  )
})

test('typescript', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            routes: {
              'hello.ts': `
                import type { RequestHandler } from 'express'
                const requestHandler: RequestHandler = (req, res) => {
                  res.send('Hello, World!')
                }
                export default requestHandler`,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/hello')
      await expect(text).toBe('Hello, World!')
    },
  )
})

test('dynamic parameters', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            routes: {
              api: {
                hello: {
                  '[name].ts': `
                    export default function (req, res) {
                      res.send(\`Hello, \${req.params.name}!\`)
                    }`,
                },
              },
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/api/hello/Adam')
      await expect(text).toBe('Hello, Adam!')
    },
  )
})
