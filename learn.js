// learn.js
async function Register_user(event) {
    event.preventDefault();  // Prevent the default form submission

    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;

    // ... existing Register_user function ...
    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName })
        });

        if (response.ok) {
            alert("User registered successfully!");
        } else {
            // Add error details from the response
            const errorData = await response.text();
            console.error("Registration failed:", response.status, errorData);
            alert(`Failed to register user. Status: ${response.status}. ${errorData}`);
        }
    } catch (error) {
        console.error("Error details:", error);
        alert(`An error occurred: ${error.message}`);
    }
}


