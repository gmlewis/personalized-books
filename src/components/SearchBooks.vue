<template>
  <span class="input">
    <input v-model="name" placeholder="Name">
    <span></span>
  </span>
  <div v-if="!!shortcut" class="shortcut">Shortcut: <a :href="shortcut">{{ shortcut }}</a></div>
  <div class="books">
    <div v-for="book in books" class="book">
      <DisplayBook :book="book" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { booksByName } from './books-by-name.js'
import DisplayBook from './DisplayBook.vue'

const name = ref('')
const books = ref([])
const shortcut = ref('')

const newSearch = () => {
  name.value = name.value.replace(/[^a-z]+/ig, '')
  const lookup = booksByName[name.value.toLowerCase()]
  if (!lookup) {
    books.value = []
    document.title = `Personalized books by Glenn Lewis`
    shortcut.value = ''
    return
  }
  books.value = lookup
  document.title = `Personalized books for ${name.value} by Glenn Lewis`
  const queryName = name.value.charAt(0).toUpperCase() + name.value.slice(1)
  shortcut.value = `https://gmlewis.github.io/personalized-books/?q=${queryName}`
}

watch(name, () => newSearch())

onMounted(() => {
  const search = window.location.search
  if (!search.startsWith('?q=')) { return }
  const q = search.substring(3).replace(/[^a-z]+/ig, '')
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

// from: https://codepen.io/rikschennink/pen/rpNGyy
// also: https://css-tricks.com/css-link-hover-effects/#aa-the-rainbow-underline-link-hover-effect
.input {
  position: relative;
  background:
    linear-gradient(to right,
      rgba(255, 0, 0, 1),
      rgba(255, 0, 180, 1),
      rgba(0, 100, 200, 1)),
    linear-gradient(to right,
      rgba(100, 200, 200, 1),
      rgba(100, 200, 200, 1));
  padding: 0.25rem;
  display: inline-block;
  margin: 0.75rem auto auto;
  border-radius: 9999em;

  &>input {
    background-color: #101010;
    font: inherit;
    line-height: inherit;
    min-width: 12rem;
    position: relative;
    display: inherit;
    border-radius: inherit;
    margin: 0;
    border: none;
    outline: none;
    padding: 0.15rem 0.75rem;
    z-index: 1;

    &:focus+span {
      opacity: 1;
      transform: scale(1);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &>span {
    transform: scale(.993, .94);
    transition: transform .5s, opacity .25s;
    opacity: 0;
    position: absolute;
    z-index: 0;
    margin: 0.2rem;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 0 3px #f00,
      0 0 0 4px #f00,
      -3px 3px 30px rgba(0, 100, 200, 1),
      3px -3px 30px rgba(255, 0, 0, 1);
  }
}
</style>
