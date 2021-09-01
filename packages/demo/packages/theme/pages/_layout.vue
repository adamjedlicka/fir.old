<template>
  <Header />
  <main class="container mx-auto p-5 flex-grow">
    <slot />
  </main>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'tailwindcss/tailwind.css'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default defineComponent({
  components: {
    Header,
    Footer,
  },
})
</script>

<style>
body {
  overflow-y: scroll;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
