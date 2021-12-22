import { test, expect } from '@playwright/test'
import { makeProject } from '@fir/testing/Utils'

test('serves Solid app', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/base', '@fir/solid'],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('Hello, Fir!')
      await expect(page.locator('#app')).toContainText('Hello, Fir!')
    },
  )
})

test('clicking increment button increases count', async ({ page }) => {
  await makeProject(
    {
      packages: ['@fir/base', '@fir/solid'],
    },
    async ({ get }) => {
      const { text } = await get(page, '/')
      expect(text).toContain('0')
      await expect(page.locator('button')).toContainText('0')
      await page.locator('button').click({ button: 'left' })
      await expect(page.locator('button')).toContainText('1')
    },
  )
})
