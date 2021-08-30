import { test, expect } from '@playwright/test'
import { makeProject } from './Utils'

test('serves an app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/base'],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('#app')).toHaveText('Hello, Fir!')
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
            templates: {
              'App.vue.ejs': `
                <template>
                  <h1>A</h1>
                </template>
              `,
            },
          },
        ],
      ],
    },
    async ({ url, writeFile }) => {
      const response1 = await page.goto(url)
      await expect(await response1?.text()).toContain('A')

      await writeFile(
        'my-package/templates/App.vue.ejs',
        `
          <template>
            <h1>B</h1>
          </template>
        `,
      )

      const response2 = await page.goto(url)
      await expect(await response2?.text()).toContain('B')
    },
  )
})

test('supports payload', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>Hello, World!</div>
                </template>
                <script>
                import { usePayload } from '@fir/base/compositions/Payload'
                export default {
                  setup: () => {
                    const payload = usePayload()
                    payload.set('some payload data')
                  }
                }
                </script>
              `,
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('body')).toContainText('some payload data')
    },
  )
})

test('supports custom fetchers', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>some {{ data }} here</div>
                </template>
                <script>
                import { createFetcher } from '@fir/base/utils/CoreUtils'
                const useFetcher = createFetcher({
                  fetcher: async () => 'data'
                })
                export default {
                  setup: async () => {
                    const { data } = await useFetcher()
                    return {
                      data
                    }
                  }
                }
                </script>
              `,
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('body')).toContainText('some data here')
      await expect(page.locator('body')).toContainText('"data"')
    },
  )
})

test('supports ejs templates', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        [
          'my-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <h1><%= "A" %></h1>
                </template>
              `,
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('h1')).toHaveText('A')
    },
  )
})
