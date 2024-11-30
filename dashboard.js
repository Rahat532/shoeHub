document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.querySelector("#user-table tbody");
    const addUserModal = document.getElementById("add-user-modal");
    const addUserBtn = document.getElementById("add-user-btn");
    const closeModal = document.querySelector(".modal .close");
    const addUserForm = document.getElementById("add-user-form");

    const API_BASE_URL = "http://localhost:5000";

    // Fetch Users from Database
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const users = await response.json();

            // Render Users in the Table
            userTableBody.innerHTML = ""; // Clear existing rows
            users.forEach((user, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.email}</td>
                    <td>${user.name}</td>
                    <td>${user.password}</td>
                    <td><button class="delete-btn" data-email="${user.email}">Delete</button></td>
                `;
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users. Please try again.");
        }
    };

    // Add User
    const addUser = async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchUsers(); // Refresh the table
            } else {
                alert(result.message || "Failed to add user.");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        }
    };

    // Delete User
    const deleteUser = async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${email}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchUsers(); // Refresh the table
            } else {
                alert(result.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    };

    // Open Add User Modal
    addUserBtn.addEventListener("click", () => {
        addUserModal.style.display = "block";
    });

    // Close Modal
    closeModal.addEventListener("click", () => {
        addUserModal.style.display = "none";
    });

    // Handle Add User Form Submission
    addUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        addUser(name, email, password);
        addUserModal.style.display = "none";
        addUserForm.reset();
    });

    // Handle Delete Button Click
    userTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const email = e.target.getAttribute("data-email");
            if (confirm(`Are you sure you want to delete ${email}?`)) {
                deleteUser(email);
            }
        }
    });

    // Fetch users on page load
    fetchUsers();
});
document.addEventListener("DOMContentLoaded", () => {
    // Existing code...

    // Handle Logout Button
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "login.html"; // Redirect to the login page
        }
    });

    // Handle Main Page Button
    const mainPageButton = document.getElementById("main-page-button");
    mainPageButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Redirect to the main page
    });

    // Existing user management code...
});
