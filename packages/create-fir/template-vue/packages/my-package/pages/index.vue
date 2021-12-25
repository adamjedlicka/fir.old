<template>
  <img src="../assets/logo.svg" />
  <h1>Hello, Fir!</h1>
  <button @click="increment">Click me: {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
