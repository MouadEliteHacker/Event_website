console.log("profile.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
    const profileInfoDiv = document.getElementById("profile-info");
    const logoutBtn = document.getElementById("logout-btn");
    const bookingsBtn = document.getElementById("bookings-btn");

    try {
        const response = await fetch("/active-user");    // ← was: http://localhost:3006/active-user
        if (response.ok) {
            const user = await response.json();
            profileInfoDiv.innerHTML = `
                <p><strong>First Name:</strong> ${user.firstName}</p>
                <p><strong>Last Name:</strong> ${user.lastName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
            `;
        } else {
            alert("Failed to retrieve user information.");
            window.location.href = "Login.html";
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred. Please try again.");
    }

    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/logout", {   // ← was: http://localhost:3006/logout
                method: "POST",
            });
            if (response.ok) {
                alert("You have been logged out.");
                window.location.href = "EVENTPROJECT.html";
            } else {
                alert("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    });

    bookingsBtn.addEventListener("click", () => {
        window.location.href = "Bookings.html";
    });
});