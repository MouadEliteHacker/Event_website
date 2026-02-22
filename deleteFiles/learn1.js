const cors = require('cors');
app.use(cors());  // Add this before your routes

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');




const app = express();
const port = 3001;



// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));



// Endpoint to handle registration
app.post('/register', (req, res) => {
    const { firstName, lastName } = req.body;

    let db = new sqlite3.Database('website.db');
    const query = "INSERT INTO learn_table (firstName, lastName) VALUES (?, ?)";
    db.run(query, [firstName, lastName], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error inserting data into the database.");
        } else {
            res.send("Registration successful");
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


