<template>
  <input v-model="name">
  <div v-for="book in books">
    <DisplayBook :book="book" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { booksByName } from './books-by-name'
import DisplayBook from './DisplayBook.vue'

const name = ref('')
const books = ref([])

watch(name, () => {
  const lookup = booksByName[name.value]
  if (!lookup) { books.value = []; return }
  books.value = lookup
})
</script>

<style scoped></style>
