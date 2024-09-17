<template>
  <span class="input">
    <input v-model="name" placeholder="Name">
    <span></span>
  </span>
  <div v-if="!!similarMatches" class="shortcut">{{ similarMatches }}</div>
  <div class="books" v-if="!!books.length">
    <div v-for="book in books" class="book">
      <DisplayBook :book="book" />
    </div>
  </div>
  <div v-if="!books.length">
    <div class="top-space">Other Available Titles</div>
    <div class="books">
      <div v-for="book in otherBooks.slice(0, 9)" class="book">
        <DisplayBook :book="book" />
      </div>
    </div>
  </div>
</template>

<script setup>
// <div v-if="!!shortcut" class="shortcut">Shortcut: <a :href="shortcut">{{ shortcut }}</a></div>

import { onMounted, ref, watch } from 'vue'
import DisplayBook from './DisplayBook.vue'
import { otherBooks } from './books-by-name.js'

// const searchUrl = 'http://localhost:3000/search'
const searchUrl = 'https://on-demand-books-com-kzfxdscz.fermyon.app/search'

const name = ref('')
const books = ref([])
const shortcut = ref('')
const similarMatches = ref('')

const newSearch = async () => {
  name.value = name.value.replace(/[^a-z]+/ig, '')
  // const lookup = booksByName[name.value.toLowerCase()]
  const lookup = await fetchName(name.value.toLowerCase())
  if (!lookup?.length) {
    books.value = []
    document.title = `Personalized books`
    shortcut.value = ''
    similarMatches.value = ''
    return
  }
  books.value = lookup
  const queryName = name.value.charAt(0).toUpperCase() + name.value.slice(1)
  if (lookup.length === 9 && lookup[0][0].includes(` ${queryName} `)) {
    document.title = `Personalized books for ${name.value}`
    shortcut.value = `https://gmlewis.github.io/personalized-books/?q=${queryName}`
    similarMatches.value = ''
  } else {
    shortcut.value = ''
    similarMatches.value = 'Similar matches:'
  }
}

watch(name, async () => await newSearch())

onMounted(async () => {
  const search = window.location.search
  if (!search.startsWith('?q=')) { return }
  const q = search.substring(3).replace(/[^a-z]+/ig, '')
  if (!q) { return }
  name.value = q
  await newSearch()
})

const fetchName = async (name) => {
  const url = `${searchUrl}/${encodeURIComponent(name)}`
  return await getJsonHttpsCall({ url })
}

// Adapted from: https://dmitripavlutin.com/timeout-fetch-request/
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8000 } = options  // 8000 ms = 8 seconds

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
}

const executeHttpsCall = async ({ url, fetchParams }) => {
  try {
    // console.log(`fetchParams.body=${fetchParams.body}`)
    const response = await fetchWithTimeout(url, fetchParams)
    // console.log('response:', response)
    if (!response.ok) {
      const text = await response.text()
      const msg = `HTTP error, status=${response.status}, text=${text}`
      return { error: msg }
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return {}  // successful call with no JSON response (e.g. a 'PUT' call)
    }
    const result = await response.json()
    // console.log('result:', result)
    if (!result) {
      return { error: 'no result' }
    }
    return result
  } catch (e) {
    if (e.name === 'AbortError') {
      return { error: 'timeout error' }
    } else {
      return { error: e }
    }
  }
}

const getJsonHttpsCall = async ({ url, timeout }) => {
  const fetchParams = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      // Authorization: 'Bearer ' + window.parent.access_token,
      'Content-Type': 'application/json',
    },
    timeout,
  }

  return await executeHttpsCall({ url, fetchParams })
}
</script>

<style lang="scss" scoped>
.books {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
}

.book {
  width: 30%;
}

.top-space {
  padding-top: 2rem;
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
