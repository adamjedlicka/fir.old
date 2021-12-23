import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('basic route', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        [
          'my-package',
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
        '@fir/base',
        [
          'my-package',
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
        'my-package/routes/hello.ts',
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
