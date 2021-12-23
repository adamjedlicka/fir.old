import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('handles error during created hook', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              'index.vue': `
                <template>
                  <h1>Hello, World!</h1>
                </template>
                <script>
                export default {
                  created() {
                    throw new Error('error')
                  }
                }
                </script>`,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('error')
    },
  )
})
