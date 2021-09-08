<template>
  <a :href="to" @click.prevent="onClick"><slot /></a>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  props: {
    to: String,
  },

  setup(props) {
    const router = inject('$router') as any

    const onClick = () => {
      router.push(props.to)
    }

    return {
      onClick,
    }
  },
})
</script>
