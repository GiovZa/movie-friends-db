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
  host: '34.122.167.103',
  user: 'kaifeng3',
  password: '#--QIj*cO1xnVb,:',
  database: 'testmysql'
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
    res.json(results[0]);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).send(error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // This query needs to be adjusted based on your actual database schema
    const query = 'SELECT * FROM Users WHERE Username = ? AND PW = ?';
    connection.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      if (results.length > 0) {
        const user = results[0];
        // Assuming the login is successful
        res.json({ 
          success: true,
          userId: user.UserID,
        });
      } else {
        // No user found with the given username and password
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(userId)

    // Query for basic user details
    const userResult = await query('SELECT * FROM Users WHERE UserID = ?', [userId]);

    const friendsResult = await query(
     `SELECT 
        CASE
        WHEN F.User1ID = ? THEN U.Username
        ELSE U.Username
      END AS FriendUsername
      FROM Friends AS F
      JOIN Users AS U ON U.UserID = CASE
                                    WHEN F.User1ID = ? THEN F.User2ID 
                                    ELSE F.User1ID
                                  END
      WHERE F.User1ID = ? OR F.User2ID = ?;
      `, 
    [userId,userId,userId,userId]);

    console.log(userId)

    const genrePrefResult = await query('SELECT GP.GenreID, GP.Rating FROM GenrePreferences AS GP WHERE UserID = ?', [userId]);

    const actorPrefResult = await query('SELECT AP.ActorID, AP.Rating FROM ActorPreferences AS AP WHERE UserID = ?', [userId]);

    const watchHistoryResult = await query('SELECT WH.MovieID, WH.DateWatched, WH.UserRating FROM WatchHistory as WH WHERE UserID = ?', [userId]);

    console.log(userId)

    // Combine and return the results
    const response = {
      user: userResult[0], // Assuming only one record per user
      friends: friendsResult,
      genrePref: genrePrefResult,
      actorPref: actorPrefResult,
      watchHistory: watchHistoryResult
    };
    console.log(response)
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server error' });
  }
});

app.put('/user/updatePassword', async (req, res) => {
  const { newPassword, userId } = req.body;
  if (!newPassword || !userId) {
    return res.status(400).json({ error: "New password and user ID are required" });
  }

  try {
    // Update the user's password using the existing query function
    await query('UPDATE Users SET Password = ? WHERE UserID = ?', [newPassword, userId]);
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});


app.put('/user/updateEmail', async (req, res) => {
  const { email, userId } = req.body;
  if (!email || !userId) {
    return res.status(400).json({ error: "Email and user ID are required" });
  }

  try {
    await query('UPDATE Users SET Email = ? WHERE UserID = ?', [email, userId]);
    res.status(200).json({ message: 'Email updated successfully!' });
  } catch (error) {
    console.error('Failed to update email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

app.post('/signup', async (req, res) => {
  const { userId, username, password, email } = req.body;
  if (!userId || !username || !password || !email) {
    return res.status(400).json({ error: 'User ID, username, password, and email are required' });
  }

  try {
    // Check if the UserId already exists
    const existingUserCheck = 'SELECT * FROM Users WHERE UserID = ?';
    connection.query(existingUserCheck, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error during user ID check');
      }
      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'User ID already taken' });
      }

      // Insert a new user into the database if UserId is unique
      const query = 'INSERT INTO Users (UserID, Username, PW, Email) VALUES (?, ?, ?, ?)';
      connection.query(query, [userId, username, password, email], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error during signup');
        }
        res.json({ success: true, message: 'User registered successfully', userId: userId });
      });
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).send('Internal server error during signup');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});