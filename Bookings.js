document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log('Attempting to fetch bookings...');
        
        const response = await fetch('http://localhost:3004/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const data = await response.json();
        console.log('Response data:', data);

        // Access the bookings array
        const bookings = data.bookings;
        console.log('Retrieved bookings:', bookings);

        if (!bookings || bookings.length === 0) {
            console.log('No bookings found.');
            return;
        }

        // Retrieve all image-wrapper divs
        const allImageWrappers = document.querySelectorAll('.image-wrapper');

        // Iterate over the bookings and divs using the double loop
        for (const booking of bookings) {
            let matchFound = false;
            for (const div of allImageWrappers) {
                if (div.id === booking.event_name) {
                    div.style.visibility = 'visible'// Make the matching div visible
                    matchFound = true;
                }
            }

            if (!matchFound) {
                console.log(`No match found for booking with event name: ${booking.event_name}`);
            }
        }

        // Hide any divs not matched to a booking
        allImageWrappers.forEach(div => {
            const isBookingMatched = bookings.some(booking => booking.event_name === div.id);
            if (!isBookingMatched) {
                div.style.display = 'none';
                console.log(`Hiding div with ID: ${div.id}`);
            }
        });
        
        

    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
});
