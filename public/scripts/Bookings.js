document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log('Fetching bookings...');

        const response = await fetch('/bookings', {      // ← was: http://localhost:3004/bookings
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const bookings = data.bookings;

        if (!bookings || bookings.length === 0) {
            console.log('No bookings found.');
            return;
        }

        const allImageWrappers = document.querySelectorAll('.image-wrapper');

        for (const booking of bookings) {
            let matchFound = false;
            for (const div of allImageWrappers) {
                if (div.id === booking.event_name) {
                    div.style.visibility = 'visible';
                    matchFound = true;
                }
            }
            if (!matchFound) {
                console.log(`No match found for: ${booking.event_name}`);
            }
        }

        allImageWrappers.forEach(div => {
            const isMatched = bookings.some(b => b.event_name === div.id);
            if (!isMatched) {
                div.style.display = 'none';
            }
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
});