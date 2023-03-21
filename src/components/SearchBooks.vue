<template>
  <input v-model="name">
  <div v-if="!!shortcut" class="shortcut">Shortcut: <a :href="shortcut">{{ shortcut }}</a></div>
  <div class="books">
    <div v-for="book in books" class="book">
      <DisplayBook :book="book" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { booksByName } from './books-by-name'
import DisplayBook from './DisplayBook.vue'

const name = ref('')
const books = ref([])
const shortcut = ref('')

const newSearch = () => {
  const lookup = booksByName[name.value.toLowerCase()]
  if (!lookup) {
    shortcut.value = ''
    books.value = []
    return
  }
  books.value = lookup
  shortcut.value = `https://gmlewis.github.io/personalized-books/?q=${name.value}`
}

watch(name, () => newSearch())

onMounted(() => {
  const search = window.location.search
  if (!search.startsWith('?q=')) { return }
  const q = search.substring(3)
  if (!q) { return }
  name.value = q
  newSearch()
})
</script>

<style lang="scss" scoped>
.books {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.book {
  width: 30%;
}

.shortcut {
  margin: 1rem auto;
}

input {
  font: inherit;
}
</style>
