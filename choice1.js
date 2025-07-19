const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3008;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database("website.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Login endpoint
app.post("/choice", (req, res) => {
    const query = "SELECT * FROM users WHERE is_active = 1";
    db.get(query, (err, row) => {
        if (err) {
            console.error("Error querying the database:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (row) {
            return res.status(200).json({ message: "User is active" });
        } else {
            return res.status(404).json({ error: "User is not active" });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
