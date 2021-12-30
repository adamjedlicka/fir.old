import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('teleport to body', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        '@fir-js/vue',
        [
          'app',
          {
            templates: {
              'App.vue': `
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
