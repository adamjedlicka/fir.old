#!/usr/bin/env node

require('ts-node').register({ transpileOnly: true })

const path = require('path')
const { Dev } = require('./src/Dev')
const { Build } = require('./src/Build')
const { Serve } = require('./src/Serve')
const { default: config } = require(path.join(process.cwd(), 'fir.config'))

const main = async () => {
  if (process.argv[2] === 'dev') {
    const cmd = new Dev(config)
    await cmd.bootstrap()
    const server = await cmd.createServer()
    server.listen(8080, () => console.log('Server listening on http://localhost:8080'))
  } else if (process.argv[2] === 'build') {
    const cmd = new Build(config)
    await cmd.bootstrap()
    await cmd.build()
  } else if (process.argv[2] === 'serve') {
    const cmd = new Serve(config)
    await cmd.bootstrap()
    const server = await cmd.createServer()
    server.listen(8080, () => console.log('Server listening on http://localhost:8080'))
  } else {
    throw 'Unknown command'
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
