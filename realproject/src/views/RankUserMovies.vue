<template>
    <div>
      <input type="number" v-model="userId" placeholder="Enter User ID" @change="fetchRankedMovies" />
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
        userId: 0,
        movies: []
      };
    },
    methods: {
        async fetchRankedMovies() {
            if (!this.userId) {
                this.movies = [];
                return;
            }
            try {
                console.log('Request URL:', `${this.$hostname}/rank-user-movies`);
                console.log(JSON.stringify({ userId: this.userId })); // Log to verify

                const response = await fetch(`${this.$hostname}/rank-user-movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: this.userId })  // Ensure the body is a JSON string
                });

                const data = await response.json();
                this.movies = data;
            } catch (error) {
                console.error('Error fetching ranked movies:', error);
                this.movies = [];
            }
            }
    }
  };
  </script>
  