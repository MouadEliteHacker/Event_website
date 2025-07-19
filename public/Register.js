console.log('Register.js is loaded and running');

async function Register_user(event) {
    console.log('Form submitted');
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    console.log('Form data:', formData);

    if (!formData.firstName || !formData.lastName || !formData.age || !formData.email || !formData.password) {
        alert("All fields are required!");
        return false;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/register1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                email: formData.email,
                password: formData.password
            })
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            alert("User registered successfully!");
            document.getElementById('registrationForm').reset();
            return true;
        } else {
            console.error("Registration failed:", data);
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
    console.log('DOM fully loaded');
    const form = document.getElementById('registrationForm');
    if (form) {
        console.log('Form found');
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', Register_user);
    } else {
        console.error('Form not found');
    }
});