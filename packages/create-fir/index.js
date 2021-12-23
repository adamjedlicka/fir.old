#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const prompts = require('prompts')

const main = async () => {
  const responses = await prompts(
    {
      type: 'text',
      name: 'directory',
      message: 'Target directory',
      initial: 'fir',
    },
    {
      onCancel: () => {
        throw new Error('Cancelled')
      },
    },
  )

  const src = path.join(__dirname, 'template-vue')
  const dst = path.join(process.cwd(), responses.directory)

  console.log('')
  console.log('Scaffolding project in %s', dst)
  console.log('')

  await fs.copy(src, dst)

  console.log('Done. Now run:')
  console.log('')
  console.log(`  cd ${path.relative(process.cwd(), dst)}`)
  console.log('  yarn install')
  console.log('  yarn dev')
}

main().catch((e) => console.error(e.message))
