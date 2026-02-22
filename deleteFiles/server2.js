const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = 3003;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
// Connect to the SQLite database
const db = new sqlite3.Database("website.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
   
   

    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], async (err, row) => {
        if (err) {
            console.error("Error querying the database:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (!row) {
            return res.status(401).json({ error: "This email address doesn't exist" });
        }

        
        if (password === row.password) {
            const updateQuery = "UPDATE users SET is_active = 1 WHERE email = ?";
            db.run(updateQuery, [email], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating is_active status:", updateErr.message);
                    return res.status(500).json({ error: "Internal server error." });
                }
        
                console.log("User's is_active status updated successfully.");
                return res.status(200).json({ message: "Login successful!" });
            });
        } else {
            return res.status(401).json({ error: "Invalid password." });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});































/*const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

let db = new sqlite3.Database('website.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the website database.');
    }
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        if (results.length > 0) {
            const updateQuery = 'UPDATE users SET is_active = 1 WHERE email = ?';
            db.query(updateQuery, [email], (updateErr) => {
                if (updateErr) {
                    res.status(500).json({ success: false, message: 'Failed to update user status' });
                    return;
                }
                res.json({ success: true });
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(3003, () => {
    console.log('Server running on port 3003');
});*/