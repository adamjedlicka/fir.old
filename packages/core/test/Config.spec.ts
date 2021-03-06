import { test, expect } from '@playwright/test'
import { makeProject } from '@fir-js/testing/Utils'

test('vite config merging', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir-js/base',
        '@fir-js/vue',
        '@fir-js/vue-router',
        [
          'app',
          {
            'pages': {
              'index.vue': `
                <template>{{ test }}</template>
                <script>
                import test from '../test.test'
                export default {
                  setup() {
                    return {
                      test
                    }
                  }
                }
                </script>
              `,
            },
            'test.test': 'Hello, World!',
            'vite.config.ts': `
              export default {
                plugins: [
                  {
                    transform(code, id) {
                      if (id.endsWith('.test')) {
                        return 'export default \\\'' + code + '\\\''
                      }
                    },
                  },
                ]
              }
            `,
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('#app')).toHaveText('Hello, World!')
    },
  )
})
