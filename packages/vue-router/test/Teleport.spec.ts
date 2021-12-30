import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('teleport to body', async ({ page }) => {
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
                  <div>
                    <h1>title</h1>
                    <teleport to="body">
                      <h2>teleported</h2>
                    </teleport>
                  </div>
                </template>
              `,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      await expect(text).toContain('teleported')
      await expect(page.locator('body > h2')).toHaveText('teleported')
      await expect(page.locator('body > h2')).toHaveCount(1)
    },
  )
})

// https://github.com/vuejs/vue-next/issues/4440
// https://github.com/vuejs/vue-next/pull/5187
test.skip('teleport to body in async component', async ({ page }) => {
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
                  <div>
                    <h1>title</h1>
                    <teleport to="body">
                      <h2>teleported</h2>
                    </teleport>
                  </div>
                </template>
                <script>
                export default {
                  async setup() {}
                }
                </script>
              `,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      await expect(text).toContain('teleported')
      await expect(page.locator('body > h2')).toHaveText('teleported')
      await expect(page.locator('body > h2')).toHaveCount(1)
    },
  )
})
