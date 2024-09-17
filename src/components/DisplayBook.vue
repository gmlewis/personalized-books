<template>
  <div class="book-container">
    <a :href="shopifyUrl" @click.prevent="jumpTo">
      <img :src="book[3]" width="384" height="576">
      <span class="book-info">{{ book[0] }}
        (ISBN: {{ book[2] }})</span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: Array,
})

const shopifyUrl = computed(() => `https://on-demand-books.com/products/${url2handle(props.book[1])}`)

const url2handle = (url) => {
  return url.replace(/^.*product\-/, '').replace(/\.html$/, '')
}

const jumpTo = () => {
  window.parent.location = shopifyUrl.value
}
</script>

<style lang="scss" scoped>
.book-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;


  &>a {
    &>img {
      // from https://stackoverflow.com/questions/12991351/css-force-image-resize-and-keep-aspect-ratio#comment94032036_39039206
      object-fit: contain;
      width: 100%;
      height: 20rem;
      user-select: none;
    }

    &>.book-info {
      font-size: 1.2rem;

      &::selection {
        color: rgba(255, 255, 255, 0.87);
      }
    }
  }

}
</style>