<template>
  <div>
    <a :href="`https://lulu.com/${book[1]}`">
      <img :src="book[3]">
      {{ book[0] }}
      (ISBN: {{ book[2] }})
    </a>
  </div>
</template>

<script setup>
const props = defineProps({
  book: Array,
})

</script>

<style lang="scss" scoped></style>