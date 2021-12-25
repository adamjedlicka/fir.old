import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('it works', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        '@fir-js/vue',
        '@fir-js/vue-router',
        '@fir-js/vue-pinia',
        [
          'app',
          {
            pages: {
              'index.vue': '<template><h1>Hello, Pinia!</h1></template>',
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('#app')).toHaveText('Hello, Pinia!')
    },
  )
})

test.skip('it transfers state', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        '@fir-js/vue',
        '@fir-js/vue-router',
        '@fir-js/vue-pinia',
        [
          'app',
          {
            pages: {
              'index.vue': `
                <template>
                  <div>{{ store.count }}</div>
                </template>
                <script>
                import { useStore } from '../stores/main'

                export default {
                  setup() {
                    const store = useStore()

                    return {
                      store
                    }
                  }
                }
                </script>
              `,
            },
            stores: {
              'main.ts': `
                import { defineStore } from 'pinia'
                export const useStore = defineStore('main', {
                  state: () => ({
                    count: 0,
                  }),
                  actions: {
                    increment() {
                      this.count++
                    }
                  }
                })
                `,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      await get(page, '/')
      await expect(page.locator('#app')).toContainText('1')
    },
  )
})
