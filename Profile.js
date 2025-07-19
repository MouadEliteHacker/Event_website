console.log("profile.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
    const profileInfoDiv = document.getElementById("profile-info");
    const logoutBtn = document.getElementById("logout-btn");
    const bookingsBtn = document.getElementById("bookings-btn");

    try {
        // Fetch the active user's information
        const response = await fetch("http://localhost:3006/active-user");
        if (response.ok) {
            const user = await response.json();
            // Display user information
            profileInfoDiv.innerHTML = `
                <p><strong>First Name:</strong> ${user.firstName}</p>
                <p><strong>Last Name:</strong> ${user.lastName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
            `;
        } else {
            alert("Failed to retrieve user information.");
            window.location.href = "Login.html"; // Redirect if no active user
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred. Please try again.");
    }

    // Logout functionality
    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:3006/logout", {
                method: "POST",
            });
            if (response.ok) {
                alert("You have been logged out.");
                window.location.href = "EVENTPROJECT.html"; // Redirect to main page
            } else {
                alert("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    });

    // Navigate to bookings page
    bookingsBtn.addEventListener("click", () => {
        window.location.href = "Bookings.html";
    });
});
