import { ref, watchEffect } from 'vue'
import { usePayload } from '../compositions/Payload'

interface FetcherOptions {
  fetcher: (...any) => Promise<any>
  argsParser?: (...any) => any[]
}

export const createFetcher =
  ({ argsParser = (...args) => args, fetcher }: FetcherOptions) =>
  (..._arguments) => {
    const payload = usePayload()

    let resolve

    const promise = new Promise((_resolve) => (resolve = _resolve))

    const response = {
      data: ref(),
      error: ref(),
      loading: ref(true),
    }

    // @ts-ignore
    if (import.meta.env.SSR) {
      const _args = argsParser(..._arguments)

      const _fetcher = () =>
        fetcher(..._args)
          .then((_data) => {
            payload.set({
              d: _data,
              e: null,
            })

            response.data.value = _data
            response.error.value = null
            response.loading.value = false

            resolve(response)
          })
          .catch((e) => {
            payload.set({
              d: null,
              e: e.message,
            })

            response.data.value = null
            response.error.value = e.message
            response.loading.value = false

            resolve(response)
          })

      return {
        ...response,
        then: (...args) => (_fetcher(), promise.then(...args)),
        catch: (...args) => (_fetcher(), promise.catch(...args)),
      }
    } else {
      let _isHydration = true

      watchEffect(async () => {
        const _args = argsParser(..._arguments)
        const _payload = _isHydration && payload.get()

        _isHydration = false

        if (_payload?.d) {
          response.data.value = _payload.d
          response.error.value = null
          response.loading.value = false

          resolve(response)
        } else if (_payload?.e) {
          response.error.value = _payload.e
          response.loading.value = false

          resolve(response)
        } else {
          try {
            response.loading.value = true

            const _data = await fetcher(..._args)

            response.loading.value = false

            response.data.value = _data
            response.error.value = null
          } catch (e) {
            response.data.value = null
            response.error.value = e
          } finally {
            resolve(response)
          }
        }
      })

      return {
        ...response,
        then: promise.then.bind(promise),
        catch: promise.catch.bind(promise),
      }
    }
  }
