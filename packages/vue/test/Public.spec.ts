import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('serves static files from public directory', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/vue',
        [
          'my-package',
          {
            public: {
              'a.txt': '1',
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      const response = await page.goto(url + '/a.txt')

      expect(await response?.text()).toBe('1')
    },
  )
})

test('overrides files with same name', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/vue',
        [
          'my-package-a',
          {
            public: {
              'a.txt': '1',
            },
          },
        ],
        [
          'my-package-b',
          {
            public: {
              'a.txt': '2',
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      const response = await page.goto(url + '/a.txt')

      expect(await response?.text()).toBe('2')
    },
  )
})
