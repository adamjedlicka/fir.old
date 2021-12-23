<template>
  <section class="text-gray-600 body-font">
    <Title>{{ category.name }}</Title>

    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-wrap w-full mb-20">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            {{ category.name }}
          </h1>
          <div class="h-1 w-20 bg-green-500 rounded"></div>
        </div>
      </div>

      <div class="flex flex-wrap -m-4">
        <div v-for="product in category.products.items" :key="product.url_key" class="lg:w-1/4 md:w-1/2 p-4 w-full">
          <router-link :to="`/product/${product.url_key}`" class="block relative h-48 rounded overflow-hidden">
            <img
              alt="ecommerce"
              class="object-contain object-center w-full h-full block"
              :src="product.thumbnail.url"
            />
          </router-link>
          <div class="mt-4">
            <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">{{ product.sku }}</h3>
            <h2 class="text-gray-900 title-font text-lg font-medium">{{ product.name }}</h2>
            <p class="mt-1">$16.00</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Title from '@fir-js/vue/components/Title.vue'
import CategoriesByUrlKey from '../../gql/queries/CategoriesByUrlKey.gql'
import { query } from '../../GraphQL'

export default defineComponent({
  components: {
    Title,
  },

  async setup() {
    const $route = useRoute()

    const { data } = await query(CategoriesByUrlKey, { urlKey: $route.params.urlKey })

    return {
      category: computed(() => data.value.categories.items[0]),
    }
  },
})
</script>
