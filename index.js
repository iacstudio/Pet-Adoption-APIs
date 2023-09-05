const express = require('express')
const app = express();
var connection = require("./db/config")

app.use(express.json())



app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if the email already exists in the database
    const checkQuery = 'SELECT * FROM auth WHERE email = ?';
    connection.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else if (results.length > 0) {
        res.status(400).send('Email already exists');
      } else {
        // Insert the new user into the database
        const insertQuery = 'INSERT INTO auth (name, email, password) VALUES (?, ?, ?)';
        connection.query(insertQuery, [name, email, password], (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Server error');
          } else {
            res.status(200).send('User registered successfully');
          }
        });
      }
    });
  });



  // User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Check if the email and password match a user in the database
    const query = 'SELECT * FROM auth WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else if (results.length === 0) {
        res.status(401).send('Invalid email or password');
      } else {
        res.status(200).send(results);
      }
    });
  });
  // Add pet details

  app.post('/pets', (req, res) => {
    const { imgUrl, name, gender, price, age, description, weight, UID } = req.body;
  
    // Check if the publisher (UID) exists in the auth table
    const userQuery = 'SELECT * FROM auth WHERE id = ?';
    connection.query(userQuery, [UID], (userErr, userResults) => {
      if (userErr) {
        console.error(userErr);
        res.status(500).send('Server error');
      } else if (userResults.length === 0) {
        res.status(400).send('Invalid publisher ID');
      } else {
        // Insert pet details into the database
        const petQuery = 'INSERT INTO pets (imgUrl, name, gender, price, age, description, weight, UID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(petQuery, [imgUrl, name, gender, price, age, description, weight, UID], (petErr) => {
          if (petErr) {
            console.error(petErr);
            res.status(500).send('Server error');
          } else {
            res.status(200).send('Pet details added successfully');
          }
        });
      }
    });
  });



  // Get pets in chunks
app.get('/pets', (req, res) => {

    const { page } = req.query;
    const pageSize = 10;
  
    // Calculate the starting index of the chunk
    const startIndex = (page - 1) * pageSize;
  
    // Fetch pets from the database
    const query = 'SELECT * FROM pets LIMIT ?, ?';
    connection.query(query, [startIndex, pageSize], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        res.status(200).json(results);
      }
    });
  });





// Update password
app.put('/update-password', (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  // Check if the old password matches the password in the table
  const checkQuery = 'SELECT * FROM auth WHERE id = ? AND password = ?';
  connection.query(checkQuery, [id, oldPassword], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(401).send('Invalid old password');
    } else {
      // Update the password
      const updateQuery = 'UPDATE auth SET password = ? WHERE id = ?';
      connection.query(updateQuery, [newPassword, id], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).send('Server error');
        } else {
          res.status(200).send('Password updated successfully');
        }
      });
    }
  });
});



  
  

app.listen(3000)