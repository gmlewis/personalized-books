<template>
  <div class="paragraphs">
    <p>Are you searching for the perfect personalized gift for someone who enjoys puzzles?</p>
    <p><strong>You found it!</strong></p>
    <p>What better way to surprise your friends, coworkers, or loved ones? Show them that you care by sending them their
      own personalized puzzle books today!</p>
    <p>Search for a name to see what books are available:</p>
  </div>
  <SearchBooks />
</template>

<script setup>
import SearchBooks from './components/SearchBooks.vue'
</script>

<style lang="scss" scoped>
.paragraphs {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;

  &>p {
    max-width: 60rem;
  }
}

h2 {
  padding-bottom: 2rem;
}

strong {
  font-weight: 900;
  font-size: larger;
}

.top-space {
  padding-top: 4rem;
}

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
</style>
