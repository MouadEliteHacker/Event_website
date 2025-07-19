function confirmBooking(eventName) {
    if (confirm('Would you like to book tickets for ' + eventName + '?')) {
        console.log('Attempting to book:', eventName);
        
        // Test server connection first
        fetch('http://localhost:3002/test')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server not responding');
                }
                // If server is responding, proceed with booking
                return fetch('http://localhost:3002/book-ticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        eventName: eventName
                    })
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Booking request failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response:', data);
                if (data.success) {
                    alert('Booking successful! Your ticket has been added to the database.');
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

function getCurrentUserId() {
    return localStorage.getItem('userId') || '1';
}
