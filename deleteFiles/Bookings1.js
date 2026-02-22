const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require('cors');
const app = express();
const PORT = 3004;

app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],  // Allow specific methods
    allowedHeaders: ['Content-Type', 'Accept']  // Allow specific headers
}));

const db = new sqlite3.Database("./website.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Middleware to parse JSON
app.use(express.json());

app.post("/bookings", (req, res) => {
    console.log("Received request for bookings...");

    const queryActiveUser = "SELECT email FROM users WHERE is_active = 1";

    db.get(queryActiveUser, (err, user) => {
        if (err) {
            console.error("Error fetching active user:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (!user) {
            console.log("No active user found.");
            return res.status(401).json({ error: "No active user found." });
        }

        const queryBookings = `SELECT DISTINCT event_name FROM tickets WHERE email = ?`;

        db.all(queryBookings, [user.email], (err, rows) => {
            if (err) {
                console.error("Error fetching bookings:", err.message);
                return res.status(500).json({ error: "Internal server error." });
            }

            if (rows && rows.length > 0) {
                console.log("Fetched bookings:", rows);
                return res.status(200).json({ bookings: rows });
            } else {
                console.log("No bookings found.");
                return res.status(200).json({ message: "No bookings found." });
            }
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
