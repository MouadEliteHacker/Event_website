const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// Create the express app first
const app = express();
const port = 3000;

// At the top of your file, after requiring modules
let db = new sqlite3.Database('website.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the website database.');
    }
});


// Then add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.html'));
});

app.post('/register1', (req, res) => {
    console.log('Received registration request:', req.body);
    
    const { firstName, lastName, age, email, password } = req.body;
    
    // Debug log to check values
    console.log('Validation check:', { firstName, lastName, age, email, password });
    
    // Improved validation that checks for empty strings and zero values
    if (!firstName?.trim() || !lastName?.trim() || !age || !email?.trim() || !password?.trim()) {
        console.error('Missing required fields');
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO users (firstName, lastName, age, email, password, is_active) 
                  VALUES (?, ?, ?, ?, ?, 0)`;
    
    db.run(query, [firstName, lastName, age, email, password], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            if (err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(400).json({ error: "Email already exists" });
            }
            
            return res.status(500).json({ error: "Error inserting data into the database" });
        }
        
        console.log(`A new user has been added with ID: ${this.lastID}`);
        res.json({ 
            message: "Registration successful",
            userId: this.lastID 
        });
    });
});

// Serve static files
app.get('/Register.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.js'));
});

app.get('/Register.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.css'));
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});