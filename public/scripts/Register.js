console.log('Register.js is loaded and running');

async function Register_user(event) {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    if (!formData.firstName || !formData.lastName || !formData.age || !formData.email || !formData.password) {
        alert("All fields are required!");
        return false;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    try {
        const response = await fetch('/register', {      
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("User registered successfully!");
            document.getElementById('registrationForm').reset();
            window.location.href = "Login.html";
            return true;
        } else {
            alert(`Failed to register user: ${data.error || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert(`An error occurred: ${error.message}`);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', Register_user);
    } else {
        console.error('Form not found');
    }
});