<template>
  <input v-model="name">
  <div v-for="book in books">
    <DisplayBook :book="book" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { booksByName } from './books-by-name'
import DisplayBook from './DisplayBook.vue'

const name = ref('')
const books = ref([])

const newSearch = () => {
  const lookup = booksByName[name.value.toLowerCase()]
  if (!lookup) { books.value = []; return }
  books.value = lookup
}

watch(name, () => newSearch)

onMounted(() => {
  const search = window.location.search
  if (!search.startsWith('?q=')) { return }
  const q = search.substring(3)
  if (!q) { return }
  name.value = q
  newSearch()
})
</script>

<style scoped></style>
