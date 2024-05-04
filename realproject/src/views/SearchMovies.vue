<template>
  <div>
    <input type="text" v-model="searchQuery" @input="search" placeholder="Search movies">
    <MovieDetails :movies="movies" />
  </div>
</template>

<script>
import MovieDetails from '../components/MovieDetails.vue';

export default {
  components: {
    MovieDetails
  },
  data() {
    return {
      searchQuery: '',
      movies: []
    };
  },
  methods: {
    async search() {
      if (!this.searchQuery.trim()) {
        this.movies = [];
        return;
      }
      try {
        const response = await fetch(`${this.$hostname}/search-movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: this.searchQuery.trim() })
        });
        const data = await response.json();
        // Assuming data returned is an array of movie titles, adjust as per your API response
        this.movies = data;
      } catch (error) {
        console.error('Error fetching search results:', error);
        this.movies = [];
      }
    }
  }
};
</script>
