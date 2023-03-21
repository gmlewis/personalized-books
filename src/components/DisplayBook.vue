<template>
  <div class="book-container">
    <a :href="`https://lulu.com/${book[1]}`">
      <img :src="book[3]" width="384" height="576">
      <span class="book-info">{{ book[0] }}
        (ISBN: {{ book[2] }})</span>
    </a>
  </div>
</template>

<script setup>
const props = defineProps({
  book: Array,
})

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
    }

    &>.book-info {
      font-size: 1.2rem;
    }
  }

}
</style>