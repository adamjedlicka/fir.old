import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('basic route', async ({ page }) => {
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

test('HMR', async ({ page }) => {
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
