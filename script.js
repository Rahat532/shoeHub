// Show Sign-Up Form
function showSignUp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

// Show Login Form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Handle Signup
document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
    }
});

// Handle Login
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.message}. Welcome, ${data.user.name}!`);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

// Handle Logout
document.getElementById('logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
});
