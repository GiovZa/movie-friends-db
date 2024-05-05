// server.js

import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import util from 'util';

const app = express();
const PORT = 11451;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: '34.134.122.1',
  user: 'GioZ',
  password: 'u_.?ne;n^c#~z_Ke',
  database: 'testmysql',
  connectTimeout: 10000 
});

// Promisify the query method of connection
const query = util.promisify(connection.query).bind(connection);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});



app.get('/movies', async (req, res) => {
  try {
    // Query for movie details with a limit of 20
    const results = await query('SELECT * FROM Movies ORDER BY RAND() LIMIT 20');
    res.json(results);
  } catch (error) {
    console.error('Error executing query: ' + error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/movie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    // Query for movie details
    const movieResult = await query('SELECT * FROM Movies WHERE MovieID = ?', [movieId]);

    // Query for director details
    const directorResult = await query('SELECT * FROM Directors WHERE DirectorID IN (SELECT DirectorID FROM Movies WHERE MovieID = ?)', [movieId]);

    // Query for genre details
    const genreResult = await query('SELECT * FROM Genres WHERE GenreID IN (SELECT GenreID FROM Movies WHERE MovieID = ?)', [movieId]);

    // Query for movie actors
    const actorResult = await query('SELECT * FROM MovieActors WHERE MovieID = ?', [movieId]);

    // Query for actor details
    const actorDetailsResult = await query('SELECT * FROM Actors WHERE ActorID IN (SELECT ActorID FROM MovieActors WHERE MovieID = ?)', [movieId]);

    // Combine and return the results
    const response = {
      movie: movieResult[0],
      director: directorResult[0],
      genre: genreResult[0],
      actors: actorResult,
      actorDetails: actorDetailsResult
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/search-movies', async (req, res) => {
  try {
    const queryParam = req.body.query;

    const results = (await Promise.all([
      query('SELECT * FROM Movies WHERE Title LIKE ? LIMIT 20', ['%' + queryParam + '%']),
      query('SELECT * FROM Movies WHERE Year LIKE ? LIMIT 20', ['%' + queryParam + '%']),
      query('SELECT * FROM Movies WHERE DirectorID IN (SELECT DirectorID FROM Directors WHERE Name LIKE ?) LIMIT 20', ['%' + queryParam + '%']),
      query('SELECT * FROM Movies WHERE GenreID IN (SELECT GenreID FROM Genres WHERE Name LIKE ?) LIMIT 20', ['%' + queryParam + '%']),
      query('SELECT * FROM Movies WHERE MovieID IN (SELECT MovieID FROM MovieActors WHERE ActorID IN (SELECT ActorID FROM Actors WHERE Name LIKE ?)) LIMIT 20', ['%' + queryParam + '%'])
    ])).flat();
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/rank-user-movies', async (req, res) => {
  try {
    const userId = req.body.userId;
    const results = await query('CALL RankUserMovies(?)', [userId]);
    res.json(results);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
