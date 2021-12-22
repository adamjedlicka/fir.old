import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('vite config merging', async ({ page }) => {
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
                }
              `,
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
