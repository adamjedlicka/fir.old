import { test, expect } from '@playwright/test'
import { makeProject } from './Utils'

test('it renders meta tags', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
        [
          'my-package',
          {
            pages: {
              'index.vue': `
                <template>
                  <Head>
                    <title>My custom title</title>
                  </Head>
                  <h1>Hello, World!</h1>
                </template>
                <script>
                import Head from '@fir/base/components/Head.vue'
                export default {
                  components: {
                    Head,
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
      const response = await page.goto(url)
      await expect(await response?.text()).toContain('<title>My custom title</title>')
      await expect(await page.evaluate(() => document.title)).toBe('My custom title')
    },
  )
})
