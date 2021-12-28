import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('serves static files from the public directory', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app',
          {
            public: {
              'a.txt': '1',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/a.txt')

      expect(text).toBe('1')
    },
  )
})

test('overrides files with same name', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app-a',
          {
            public: {
              'a.txt': '1',
            },
          },
        ],
        [
          'app-b',
          {
            public: {
              'a.txt': '2',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/a.txt')

      expect(text).toBe('2')
    },
  )
})

test('serves assets from previously non existent directory', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        [
          'app-a',
          {
            public: {
              'a.txt': '1',
            },
          },
        ],
        ['app-b', {}],
      ],
    },
    async ({ get, writeFile }) => {
      await writeFile('/app-b/public/a.txt', '3')

      const { text } = await get(page, '/a.txt')

      expect(text).toBe('3')
    },
  )
})
