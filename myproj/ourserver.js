const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 80;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '34.122.167.103',
  user: 'kaifeng',
  password: '123456',
  database: 'testmysql'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
});

app.use(express.urlencoded({ extended: true }));

// Render the HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MySQL Query</title>
      </head>
      <body>
        <h1>Enter MySQL Query</h1>
        <form method="POST" action="/query">
          <textarea name="query" rows="5" cols="50" placeholder="Enter your MySQL query"></textarea>
          <br>
          <input type="submit" value="Execute">
        </form>
      </body>
    </html>
  `);
});

// Handle the form submission
app.post('/query', (req, res) => {
  const query = req.body.query;

  // Execute the MySQL query
  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.send(`<h1>Error executing query:</h1><pre>${err}</pre>`);
    } else {
      res.send(`<h1>Query Result:</h1><pre>${JSON.stringify(result, null, 2)}</pre>`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
