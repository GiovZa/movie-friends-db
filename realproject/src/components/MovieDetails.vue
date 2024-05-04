<template>
  <div class="movies-container">
    <h2>Movies</h2>
    <div class="movie-cards">
      <div v-for="movie in movies" :key="movie.MovieID" class="movie-card">
        <strong>Title:</strong> {{ movie.Title }}<br>
        <strong>GenreID (TODO, link to GenreID):</strong> {{ movie.GenreID }}<br>
        <strong>Rating:</strong> {{ movie.Rating }}<br>
        <strong>Year:</strong> {{ movie.Year }}<br>
        <router-link :to="{ name: 'movie', params: { id: movie.MovieID }}">Details</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movies: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.movies-container {
  max-width: 100%;
}

.movie-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: -10px; /* Adjust margin */
}

.movie-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  flex: 0 0 calc(20% - 20px);
  max-width: calc(20% - 20px);
  box-sizing: border-box;
}
</style>
