console.log('choice.js is loaded and running');

document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.getElementById("choicelink");

    if (profileLink) {
        profileLink.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                const response = await fetch('/choice', {   // ← was: http://localhost:3008/choice
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = "Profile.html";
                } else {
                    window.location.href = "Login.html";
                }
            } catch (error) {
                console.error("Error during showing Profile:", error);
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
});