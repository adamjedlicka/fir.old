import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('serves an app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir-js/base', '@fir-js/vue'],
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
        '@fir-js/base',
        '@fir-js/vue',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>Hello, World!</div>
                </template>
                <script>
                import { usePayload } from '@fir-js/vue/compositions/Payload'
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
        '@fir-js/base',
        '@fir-js/vue',
        [
          'ma-package',
          {
            templates: {
              'App.vue.ejs': `
                <template>
                  <div>some {{ data }} here</div>
                </template>
                <script>
                import { createFetcher } from '@fir-js/vue/utils/CoreUtils'
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
        '@fir-js/base',
        '@fir-js/vue',
        [
          'app',
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

test('HMR', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        '@fir-js/vue',
        '@fir-js/vue-router',
        [
          'app',
          {
            pages: {
              'index.vue': `
                <template>
                  <h1>Hello, A!</h1>
                </template>
              `,
            },
          },
        ],
      ],
    },
    async ({ url, writeFile }) => {
      await page.goto(url)
      await writeFile(
        'app/pages/index.vue',
        `
        <template>
          <h1>Hello, B!</h1>
        </template>`,
      )
      await expect(page.locator('h1')).toHaveText('Hello, B!')
    },
  )
})
