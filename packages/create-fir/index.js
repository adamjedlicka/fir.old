#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const prompts = require('prompts')
const minimist = require('minimist')
const { green, red } = require('kolorist')

const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()

const main = async () => {
  const responses = await getResponses()

  const src = path.join(__dirname, 'template-vue')
  const dst = path.join(cwd, responses.directory)

  console.log(`\nScaffolding project in ${dst}...`)

  if (responses.overwrite) await fs.emptyDir(dst)

  await fs.copy(src, dst)

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\n${green('✔')} Done. Now run:\n`)
  if (dst != cwd) {
    console.log(`  cd ${path.relative(cwd, dst)}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log('')
}

async function getResponses() {
  const targetDir = argv._[0]

  try {
    return await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'directory',
          message: 'Target directory',
          initial: 'fir-app',
        },
        {
          type: (_, { directory }) => (fs.existsSync(directory) && !isEmpty(directory) ? 'confirm' : null),
          name: 'overwrite',
          message: (_, { directory }) =>
            (directory === '.' ? 'Current directory' : `Target directory "${directory}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) {
              throw new Error(`${red('✖')} Operation cancelled`)
            }
            return null
          },
          name: 'overwriteChecker',
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} Operation cancelled`)
        },
      },
    )
  } catch (e) {
    console.log(e.message)
    process.exit(0)
  }
}

function isEmpty(path) {
  return fs.readdirSync(path).length === 0
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

main().catch(console.error)
