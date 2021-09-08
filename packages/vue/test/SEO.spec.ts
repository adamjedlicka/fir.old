import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('title', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              'index.vue': `
                <template>
                  <Title>My custom title</Title>
                  <h1>Hello, World!</h1>
                </template>
                <script>
                import Title from '@fir/vue/components/Title.vue'
                export default {
                  components: {
                    Title,
                  }
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
      expect(text).toContain('<title>My custom title</title>')
      await expect(page.locator('title')).toContainText('My custom title')
    },
  )
})

test('title updates when navigating pages', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              '_id.vue': `
                <template>
                  <Title>{{ $route.params.id }}</Title>
                  <h1>Hello, World!</h1>
                  <RouterLink to="/second">link</RouterLink>
                </template>
                <script>
                import Title from '@fir/vue/components/Title.vue'
                export default {
                  components: {
                    Title,
                  }
                }
                </script>
              `,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      await get(page, '/first')
      await expect(page.locator('title')).toContainText('first')
      await page.locator('a').click()
      await expect(page.locator('title')).toContainText('second')
    },
  )
})
