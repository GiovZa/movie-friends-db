<template>
    <div class="movie-details">
      <a @click="$router.go(-1)">back</a>
      <h1>{{ movie.Title }}</h1>
      <p><strong>Director:</strong> {{ director.Name }}</p>
      <p><strong>Genre:</strong> {{ genre.Name }}</p>
      <p><strong>Rating:</strong> {{ movie.Rating }}</p>
      <p><strong>Year:</strong> {{ movie.Year }}</p>
      <h2>Actors</h2>
      <ul>
        <li v-for="actor in actors" :key="actor.ActorID">
            <strong>Name:</strong> {{ actor.Name }}<br>
            <strong>Role:</strong> <ul><li v-for="role in actor.Role">{{ role }}</li></ul>
            <strong>Birth Year:</strong> {{ actor.BirthYear }}<br>
            <strong>Country:</strong> {{ actor.Country }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Movie',
    data() {
      return {
        movie: {},
        director: {},
        genre: {},
        actors: []
      };
    },
    created() {
      // Fetch movie data here
      this.fetchMovieDetails();
    },
    methods: {
      async fetchMovieDetails() {
        try {
          const response = await fetch(`${this.$hostname}/movie/${this.$route.params.id}`);
          const data = await response.json();
          this.movie = data.movie;
          this.director = data.director;
          this.genre = data.genre;
          this.actors = data.actors.map(
            // find relevant fields in data.actorDetails
            // "actorDetails":[{"ActorID":"nm1527293","Name":"Lucy Black","BirthYear":0,"Country":null}]
            actor => {
              return {
                ActorID: actor.ActorID,
                Role: JSON.parse(actor.Role),
                Name: data.actorDetails.find(
                  actorDetails => actorDetails.ActorID === actor.ActorID
                )?.Name,
                BirthYear: data.actorDetails.find(
                  actorDetails => actorDetails.ActorID === actor.ActorID
                )?.BirthYear,
                Country: data.actorDetails.find(
                  actorDetails => actorDetails.ActorID === actor.ActorID
                )?.Country
              };
            }
          );
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your CSS styles here */
  .movie-details {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  