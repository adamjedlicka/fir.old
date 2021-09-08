import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('serves React app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/react'],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('Hello, Fir!')
      await expect(page.locator('#app')).toContainText('Hello, Fir!')
    },
  )
})
