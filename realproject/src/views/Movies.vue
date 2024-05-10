<template>
    <div>
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
        movies: []
      };
    },
    mounted() {
      this.fetchMovies();
    },
    methods: {
      async fetchMovies() {
        try {
          const response = await fetch(`${this.$hostname}/movies`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.movies = data;
        } catch (error) {
          console.error('Error fetching movies: ', error);
        }
      }
    }
  };
  </script>