
// Read the event name from the URL: event.html?name=Yeat
const params = new URLSearchParams(window.location.search);
const eventName = params.get('name');

const loadingEl = document.getElementById('loading-state');
const errorEl   = document.getElementById('error-state');
const mainEl    = document.getElementById('main-content');

async function loadEvent() {
    if (!eventName) {
        showError();
        return;
    }

    try {
        const response = await fetch(`/event?name=${encodeURIComponent(eventName)}`);

        if (!response.ok) {
            showError();
            return;
        }

        const event = await response.json();

        // Populate the page
        document.getElementById('page-title').textContent   = event.speaker_name;
        document.getElementById('event-name').textContent   = event.speaker_name;
        document.getElementById('event-description').textContent = event.event_description;

        const img = document.getElementById('event-image');
        img.src = event.image_path;
        img.alt = event.speaker_name;

        // Wire up the Book button
        document.getElementById('book-btn').addEventListener('click', (e) => {
            e.preventDefault();
            confirmBooking(event.speaker_name);
        });

        // Show the page
        loadingEl.style.display = 'none';
        mainEl.style.display    = 'block';

    } catch (err) {
        console.error('Error loading event:', err);
        showError();
    }
}

function showError() {
    loadingEl.style.display = 'none';
    errorEl.style.display   = 'flex';
}



function confirmBooking(eventName) {
    if (confirm('Would you like to book tickets for ' + eventName + '?')) {
        console.log('Attempting to book:', eventName);

        fetch('/test')                                  
            .then(response => {
                if (!response.ok) throw new Error('Server not responding');
                return fetch('/book-ticket', {         
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ eventName: eventName })
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('Booking request failed');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Booking successful! Your ticket has been added.');
                } else {
                    alert(data.message || 'Booking failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Booking error:', error);
                if (error.message === 'Failed to fetch') {
                    alert('Cannot connect to server. Please make sure the server is running.');
                } else {
                    alert('Error: ' + error.message);
                }
            });
    }
}

loadEvent();