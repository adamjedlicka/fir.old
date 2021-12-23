import { useSSRContext, getCurrentInstance } from 'vue'
import type { AppContext } from '@fir-js/core/src/Fir'

const pointers = {}

export const usePayload = () => {
  const id = getId()
  const payload = getPayload() ?? {}

  return {
    get: () => payload[id],
    set: (data) => (payload[id] = data),
  }
}

const getId = () => {
  const self = getCurrentInstance()

  // @ts-ignore
  if (import.meta.env.SSR) {
    const id = useSSRContext<AppContext>()?.id()

    if (self?.attrs.__id) {
      self.attrs.__id += `|${id}`
    } else if (self?.attrs) {
      self.attrs.__id = id
    }

    return id
  } else {
    try {
      const _id = self?.vnode.el?.getAttribute('__id')

      if (_id) {
        if (!pointers[_id]) pointers[_id] = 0

        return _id.split('|')[pointers[_id]++]
      }
    } catch {
      console.error('Fetch inside rootless component NOT supported!')
    }
  }
}

const getPayload = () => {
  // @ts-ignore
  return import.meta.env.SSR ? useSSRContext()?.payload : window.__PAYLOAD__
}
