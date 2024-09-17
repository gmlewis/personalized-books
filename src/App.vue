<template>
  <div class="paragraphs">
    <p>Are you searching for the perfect personalized gift for someone who enjoys puzzles?</p>
    <p><strong>You found it!</strong></p>
    <p>What better way to surprise your friends, coworkers, or loved ones? Show them that you care by sending them their
      own personalized puzzle books today!</p>
    <p>Search for a name to see what books are available:</p>
  </div>
  <SearchBooks />
  <h1 class="top-space">Other Available Titles</h1>
  <div class="paragraphs">
    <div class="books">
      <div v-for="book in otherBooks" class="book">
        <DisplayBook :book="book" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { otherBooks } from './components/books-by-name.js'
import SearchBooks from './components/SearchBooks.vue'
import DisplayBook from './components/DisplayBook.vue'
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
