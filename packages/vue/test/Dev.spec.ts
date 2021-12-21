import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('serves an app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/base', '@fir/vue'],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('#app')).toHaveText('Hello, Fir!')
    },
  )
})

test('supports payload', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/vue',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>Hello, World!</div>
                </template>
                <script>
                import { usePayload } from '@fir/vue/compositions/Payload'
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
        '@fir/vue',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>some {{ data }} here</div>
                </template>
                <script>
                import { createFetcher } from '@fir/vue/utils/CoreUtils'
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
        '@fir/vue',
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
