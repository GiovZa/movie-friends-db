<template>
  <div>
    <input type="number" v-model="userId" placeholder="Enter User ID" @input="fetchRankedMovies" />
    <p v-if="loading">Loading movies...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <table v-if="movies.length">
      <thead>
        <tr>
          <th>Title</th>
          <th>Avg Actor Rating</th>
          <th>Genre Rating</th>
          <th>Director Rating</th>
          <th>Overall Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in movies" :key="movie.MovieID">
          <td>{{ movie.Title }}</td>
          <td>{{ movie.AvgActorRating }}</td>
          <td>{{ movie.GenreRating }}</td>
          <td>{{ movie.DirectorRating }}</td>
          <td>{{ movie.PreferenceValue }}</td>
        </tr>
      </tbody>
    </table>
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
      userId: -1,
      movies: []
    };
  },
  methods: {
      async fetchRankedMovies() {
          if (!this.userId && this.userId!=0) {
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
  