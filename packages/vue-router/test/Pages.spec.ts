import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('supports pages concept', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              'index.vue': '<template>Hello from index!</template>',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('Hello from index!')
      await expect(page.locator('#app')).toContainText('Hello from index!')
    },
  )
})

test('supports multiple pages', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              'index.vue': '<template>Hello from index!</template>',
              'a.vue': '<template>Hello from A!</template>',
              'b.vue': '<template>Hello from B!</template>',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/b')
      expect(text).toContain('Hello from B!')
      await expect(page.locator('#app')).toContainText('Hello from B!')
    },
  )
})

test('has default 404', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              'index.vue': '<template>Hello from index!</template>',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/b')
      expect(text).toContain('404')
      await expect(page.locator('#app')).toContainText('404')
    },
  )
})

test('supports layouts', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              '_layout.vue': '<template><h1>Hello from layout!</h1><slot/></template>',
              'index.vue': '<template>Hello from index!</template>',
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('Hello from layout!')
      expect(text).toContain('Hello from index!')
      await expect(page.locator('#app')).toContainText('Hello from layout!')
      await expect(page.locator('#app')).toContainText('Hello from index!')
    },
  )
})

test('navigation between pages', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              '_layout.vue': `
                <template>
                  <router-link id="a" to="/a">1</router-link>
                  <router-link id="b" to="/b">b</router-link>
                  <slot/>
                </template>`,
              'index.vue': '<template>Page index</template>',
              'a.vue': '<template>Page A</template>',
              'b.vue': '<template>Page B</template>',
            },
          },
        ],
      ],
    },
    async ({ url }) => {
      await page.goto(url)

      await expect(page.locator('#app')).toContainText('Page index')
      await expect(page.locator('#app')).not.toContainText('Page A')
      await expect(page.locator('#app')).not.toContainText('Page B')

      await page.locator('#a').click()

      await expect(page.locator('#app')).not.toContainText('Page index')
      await expect(page.locator('#app')).toContainText('Page A')
      await expect(page.locator('#app')).not.toContainText('Page B')

      await page.locator('#b').click()

      await expect(page.locator('#app')).not.toContainText('Page index')
      await expect(page.locator('#app')).not.toContainText('Page A')
      await expect(page.locator('#app')).toContainText('Page B')
    },
  )
})

test('nested routes', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              a: {
                'b.vue': '<template>Page AB</template>',
              },
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/a/b')
      expect(text).toContain('Page AB')
      await expect(page.locator('#app')).toContainText('Page AB')
    },
  )
})

test('dynamic parameters', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              user: {
                '_id.vue': '<template>User detail</template>',
              },
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/user/1234')
      expect(text).toContain('User detail')
      await expect(page.locator('#app')).toContainText('User detail')
    },
  )
})

test('route with wildcard has lower priority than fully fixed route', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              user: {
                '_id.vue': '<template>User detail</template>',
                'detail.vue': '<template>User fixed detail</template>',
              },
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/user/detail')
      expect(text).toContain('User fixed detail')
      await expect(page.locator('#app')).toContainText('User fixed detail')
    },
  )
})

test('route params can be rendered', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/vue',
        '@fir/vue-router',
        [
          'my-package',
          {
            pages: {
              user: {
                '_id.vue': '<template>{{ $route.params.id }}</template>',
              },
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/user/12345')
      expect(text).toContain('12345')
      await expect(page.locator('#app')).toContainText('12345')
    },
  )
})
