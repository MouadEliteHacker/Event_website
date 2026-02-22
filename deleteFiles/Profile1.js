const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3006;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database("website.db", (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Route to get active user
app.get("/active-user", (req, res) => {
    const query = "SELECT * FROM users WHERE is_active = 1 LIMIT 1";
    db.get(query, (err, row) => {
        if (err) {
            console.error("Error querying the database:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: "No active user found." });
        }
    });
});

// Route to log out
app.post("/logout", (req, res) => {
    const query = "UPDATE users SET is_active = 0 WHERE is_active = 1";
    db.run(query, (err) => {
        if (err) {
            console.error("Error updating the database:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }
        res.status(200).json({ message: "Logout successful." });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
