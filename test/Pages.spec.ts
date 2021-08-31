import { test, expect } from '@playwright/test'
import { makeProject } from './Utils'

test('supports pages concept', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      await page.goto(url)
      await expect(page.locator('#app')).toHaveText('Hello from index!')
    },
  )
})

test('supports multiple pages', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      await page.goto(url + '/b')
      await expect(page.locator('#app')).toHaveText('Hello from B!')
    },
  )
})

test('has default 404', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      await page.goto(url + '/b')
      await expect(page.locator('#app')).toHaveText('404')
    },
  )
})

test('supports layouts', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      await page.goto(url + '/')
      await expect(page.locator('#app')).toHaveText('Hello from layout!Hello from index!')
    },
  )
})

test('HMR', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url, writeFile, rm }) => {
      await page.goto(url + '/a')

      await expect(page.locator('#app')).toHaveText('404')

      await writeFile('my-package/pages/a.vue', '<template>A</template>')

      await expect(page.locator('#app')).toHaveText('A')

      await rm('my-package/pages/a.vue')

      await expect(page.locator('#app')).toHaveText('404')
    },
  )
})

test('navigation between pages', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      const response = await page.goto(url + '/a/b')

      expect(await response?.text()).toContain('Page AB')

      await expect(page.locator('#app')).toContainText('Page AB')
    },
  )
})

test('dynamic parameters', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      const response = await page.goto(url + '/user/1234')

      expect(await response?.text()).toContain('User detail')

      await expect(page.locator('#app')).toContainText('User detail')
    },
  )
})

test('route with wildcard has lower priority than fully fixed route', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      const response1 = await page.goto(url + '/user/detail')

      expect(await response1?.text()).toContain('User fixed detail')

      await expect(page.locator('#app')).toContainText('User fixed detail')
    },
  )
})

test('route params can be rendered', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/router',
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
    async ({ url }) => {
      const response1 = await page.goto(url + '/user/1234')

      expect(await response1?.text()).toContain('1234')

      await expect(page.locator('#app')).toContainText('1234')
    },
  )
})
