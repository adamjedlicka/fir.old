<script lang="ts">
import { defineComponent, useSSRContext, watchEffect } from 'vue'
import { isServer } from '@fir-js/core'

export default defineComponent({
  setup(_, { slots }) {
    if (isServer) {
      const content = slots.default!()
        .map((vNode) => vNode.children)
        .join('')

      const ssrContext = useSSRContext()!

      ssrContext.head.title = content
    } else {
      watchEffect(() => {
        const content = slots.default!()
          .map((vNode) => vNode.children)
          .join('')

        document.title = content
      })
    }
  },

  render() {
    return null
  },
})
</script>
