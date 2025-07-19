console.log('choice.js is loaded and running');

document.addEventListener("DOMContentLoaded", () => {
    // Select the Profile link by its ID
    const profileLink = document.getElementById("choicelink");

    // Check if the Profile link exists in the DOM
    if (profileLink) {
        // Add event listener for click on the Profile link
        profileLink.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent the default behavior of navigating to the Profile link

            try {
                const response = await fetch('http://localhost:3008/choice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                // Log response for debugging
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                // If the response is successful, redirect to the Profile page
                if (response.ok) {
                    window.location.href = "Profile.html"; // Redirect to the Profile page
                } else {
                    window.location.href = "Login.html"; // Redirect to Login page if not successful
                }
            } catch (error) {
                console.error("Error during showing Profile:", error);
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
});
