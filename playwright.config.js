require('ts-node').register({ transpileOnly: true })

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  globalSetup: require.resolve('@fir-js/testing/setup'),
  globalTeardown: require.resolve('@fir-js/testing/teardown'),
}
