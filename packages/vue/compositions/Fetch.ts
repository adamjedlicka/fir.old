import { createFetcher } from '../utils/CoreUtils'

export const useFetch = createFetcher({
  fetcher: async (url) => {
    const response = await fetch(url)
    const json = await response.json()

    return json
  },
  argsParser: (url) => [typeof url === 'function' ? url() : url],
})
