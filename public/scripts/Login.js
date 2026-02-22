console.log('Login.js is loaded and running');

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    try {
        const response = await fetch('/login', {          // ← was: http://localhost:3003/login
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "EVENTPROJECT.html";
        } else {
            alert(`Login failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert(`An error occurred: ${error.message}`);
    }
});