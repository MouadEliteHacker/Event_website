const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],  // Allow specific methods
    allowedHeaders: ['Content-Type', 'Accept']  // Allow specific headers
}));

app.use(express.json());
app.use(express.static('public'));

// Test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Server is running!' });
});

// Database connection - make sure this path matches your actual database file
const db = new sqlite3.Database('./website.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
        // Test database connection by running a simple query
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tickets'", [], (err, row) => {
            if (err) {
                console.error('Error checking tables:', err);
            } else {
                console.log('Found tickets table:', row);
            }
        });
    }
});

// Endpoint to handle ticket booking
app.post('/book-ticket', async (req, res) => {
    console.log('Received booking request for:', req.body.eventName);
    
    try {
        // First, check if we can query the users table
        db.get('SELECT email FROM users WHERE is_active = 1', [], (err, user) => {
            if (err) {
                console.error('Error querying users:', err);
                return res.json({ success: false, message: 'Database error checking user' });
            }
             
            if (!user) {
                console.log('No active user found');
                return res.json({ success: false, message: 'Please log in to book tickets' });
            }
            
            console.log('Found active user:', user.email);
            
            // Check for existing ticket
            db.get('SELECT ticket_number FROM tickets WHERE email = ? AND event_name = ?', 
                [user.email, req.body.eventName], 
                (err, ticket) => {
                    if (err) {
                        console.error('Error checking existing ticket:', err);
                        return res.json({ success: false, message: 'Error checking existing ticket' });
                    }
                    
                    if (ticket) {
                        console.log('User already has a ticket');
                        return res.json({ success: false, message: 'You already have a ticket for this event' });
                    }
                    
                    // Insert new ticket
                    db.run('INSERT INTO tickets (event_name, email) VALUES (?, ?)',
                        [req.body.eventName, user.email],
                        (err) => {
                            if (err) {
                                console.error('Error inserting ticket:', err);
                                return res.json({ success: false, message: 'Error creating ticket' });
                            }
                            
                            console.log('Ticket created successfully');
                            res.json({ success: true, message: 'Ticket booked successfully' });
                        });
                });
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.json({ success: false, message: 'An error occurred while booking: ' + error.message });
    }
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/test`);
    console.log(`Booking endpoint: http://localhost:${PORT}/book-ticket`);
});