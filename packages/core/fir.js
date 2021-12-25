#!/usr/bin/env node

require('ts-node').register({ transpileOnly: true, skipIgnore: true })

const path = require('path')
const minimist = require('minimist')
const { Dev } = require('./src/Dev')
const { Build } = require('./src/Build')
const { Serve } = require('./src/Serve')
const { default: config } = require(path.join(process.cwd(), 'fir.config'))

const argv = minimist(process.argv.slice(2))

const main = async () => {
  const cmd = argv._[0]

  const host = argv.host ?? 'localhost'
  const port = argv.port ?? '8080'

  if (cmd === 'dev') {
    const cmd = new Dev(config)
    await cmd.bootstrap()
    const server = await cmd.createServer()
    server.listen(port, () => console.log(`Server listening on http://${host}:${port}`))
  } else if (cmd === 'build') {
    const cmd = new Build(config)
    await cmd.bootstrap()
    await cmd.build()
  } else if (cmd === 'serve') {
    const cmd = new Serve(config)
    await cmd.bootstrap()
    const server = await cmd.createServer()
    server.listen(port, () => console.log(`Server listening on http://${host}:${port}`))
  } else {
    throw 'Unknown command'
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
