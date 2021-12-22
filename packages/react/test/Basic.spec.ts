import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('serves React app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/base', '@fir/react'],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('Hello, Fir!')
      await expect(page.locator('#app')).toContainText('Hello, Fir!')
    },
  )
})

test('serves complex React app', async ({ page }) => {
  await makeProject(
    {
      packages: [
        '@fir/base',
        '@fir/react',
        [
          'my-package',
          {
            templates: {
              'App.jsx': `
                import { useState } from 'react'
                export default function App() {
                  const [count, setCount] = useState(0)

                  return <button onClick={() => setCount(count + 1)}>Count {count}</button>
                }
              `,
            },
          },
        ],
      ],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('0')
      await expect(page.locator('button')).toContainText('0')
      await page.locator('button').click()
      await expect(page.locator('button')).toContainText('1')
    },
  )
})
