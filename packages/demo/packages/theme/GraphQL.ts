import { isServer } from '@fir-js/core'
import { createFetcher } from '@fir-js/vue/utils/CoreUtils'

const endpoint = isServer ? 'https://venia.magento.com' : ''

export const query = createFetcher({
  argsParser: (query, variables = () => undefined) => [
    query,
    typeof variables === 'function' ? variables() : variables,
  ],
  fetcher: async (query, variables = {}): Promise<any> => {
    const response = await fetch(`${endpoint}/graphql`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const json = await response.json()

    return json.data
  },
})
