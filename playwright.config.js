require('ts-node').register({ transpileOnly: true })

module.exports = {
  globalSetup: require.resolve('@fir-js/testing/setup'),
  globalTeardown: require.resolve('@fir-js/testing/teardown'),
}
