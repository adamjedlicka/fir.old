require('ts-node').register({ transpileOnly: true })

module.exports = {
  globalSetup: require.resolve('./test/setup'),
  globalTeardown: require.resolve('./test/teardown'),
}
