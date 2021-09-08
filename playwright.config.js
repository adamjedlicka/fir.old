require('ts-node').register({ transpileOnly: true })

module.exports = {
  globalSetup: require.resolve('@fir/testing/setup'),
  globalTeardown: require.resolve('@fir/testing/teardown'),
}
