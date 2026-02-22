const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Database ─────────────────────────────────────────────────────────────────
const db = new sqlite3.Database('./website.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// ════════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES  (was: port 3003 - login1.js, port 3000 - register1.js)
// ════════════════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'EVENTPROJECT.HTML'));
});
// POST /register
app.post('/register', (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !age || !email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO users (firstName, lastName, age, email, password, is_active)
                   VALUES (?, ?, ?, ?, ?, 0)`;

    db.run(query, [firstName, lastName, age, email, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Error inserting data into the database" });
        }
        res.json({ message: "Registration successful", userId: this.lastID });
    });
});

// POST /login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        if (!row) {
            return res.status(401).json({ error: "This email address doesn't exist" });
        }

        if (password === row.password) {
            db.run("UPDATE users SET is_active = 1 WHERE email = ?", [email], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ error: "Internal server error." });
                }
                return res.status(200).json({ message: "Login successful!" });
            });
        } else {
            return res.status(401).json({ error: "Invalid password." });
        }
    });
});

// ════════════════════════════════════════════════════════════════════════════════
// USER / PROFILE ROUTES  (was: port 3006 - profile1.js, port 3008 - choice1.js)
// ════════════════════════════════════════════════════════════════════════════════

// GET /active-user  — fetch the currently logged-in user's profile
app.get('/active-user', (req, res) => {
    db.get("SELECT * FROM users WHERE is_active = 1 LIMIT 1", (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: "No active user found." });
        }
    });
});

// POST /logout
app.post('/logout', (req, res) => {
    db.run("UPDATE users SET is_active = 0 WHERE is_active = 1", (err) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        res.status(200).json({ message: "Logout successful." });
    });
});

// POST /choice  — check if a user is logged in (used before redirecting to Profile)
app.post('/choice', (req, res) => {
    db.get("SELECT * FROM users WHERE is_active = 1", (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        if (row) {
            return res.status(200).json({ message: "User is active" });
        } else {
            return res.status(404).json({ error: "User is not active" });
        }
    });
});

// ════════════════════════════════════════════════════════════════════════════════
// BOOKING ROUTES  (was: port 3002 - book1.js, port 3004 - bookings1.js)
// ════════════════════════════════════════════════════════════════════════════════

// GET /test  — health check (kept from original book server)
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// POST /book-ticket
app.post('/book-ticket', (req, res) => {
    db.get('SELECT email FROM users WHERE is_active = 1', [], (err, user) => {
        if (err) {
            return res.json({ success: false, message: 'Database error checking user' });
        }
        if (!user) {
            return res.json({ success: false, message: 'Please log in to book tickets' });
        }

        db.get(
            'SELECT ticket_number FROM tickets WHERE email = ? AND event_name = ?',
            [user.email, req.body.eventName],
            (err, ticket) => {
                if (err) {
                    return res.json({ success: false, message: 'Error checking existing ticket' });
                }
                if (ticket) {
                    return res.json({ success: false, message: 'You already have a ticket for this event' });
                }

                db.run(
                    'INSERT INTO tickets (event_name, email) VALUES (?, ?)',
                    [req.body.eventName, user.email],
                    (err) => {
                        if (err) {
                            return res.json({ success: false, message: 'Error creating ticket' });
                        }
                        res.json({ success: true, message: 'Ticket booked successfully' });
                    }
                );
            }
        );
    });
});

// POST /bookings  — get all bookings for the active user
app.post('/bookings', (req, res) => {
    db.get("SELECT email FROM users WHERE is_active = 1", (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        if (!user) {
            return res.status(401).json({ error: "No active user found." });
        }

        db.all(
            "SELECT DISTINCT event_name FROM tickets WHERE email = ?",
            [user.email],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: "Internal server error." });
                }
                if (rows && rows.length > 0) {
                    return res.status(200).json({ bookings: rows });
                } else {
                    return res.status(200).json({ message: "No bookings found." });
                }
            }
        );
    });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`   All routes available on a single port — no more port juggling!`);
});