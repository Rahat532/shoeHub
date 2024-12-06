document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.querySelector("#user-table tbody");
    const addUserModal = document.getElementById("add-user-modal");
    const updatePasswordModal = document.getElementById("update-password-modal");
    const addUserBtn = document.getElementById("add-user-btn");
    const closeModalButtons = document.querySelectorAll(".modal .close");
    const addUserForm = document.getElementById("add-user-form");
    const updatePasswordForm = document.getElementById("update-password-form");
    const logoutButton = document.getElementById("logout-button");
    const mainPageButton = document.getElementById("main-page-button");

    const API_BASE_URL = "http://localhost:5000";

    // Fetch Users from Database
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const users = await response.json();

            userTableBody.innerHTML = ""; // Clear existing rows
            users.forEach((user) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.email}</td>
                    <td>${user.name}</td>
                    <td>${user.password || "N/A"}</td> <!-- Include password -->
                    <td>
                        <button class="update-password-btn" data-email="${user.email}">Update Password</button>
                        <button class="delete-btn" data-email="${user.email}">Delete</button>
                    </td>
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
                fetchUsers();
            } else {
                alert(result.message || "Failed to add user.");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        }
    };

    // Update Password
    const updatePassword = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${email}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.message || "Failed to update password.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password. Please try again.");
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
                fetchUsers();
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

    // Close Modals
    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            addUserModal.style.display = "none";
            updatePasswordModal.style.display = "none";
        });
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

    // Handle Update Password Form Submission
    updatePasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = updatePasswordForm.dataset.email;
        const password = document.getElementById("new-password").value;

        updatePassword(email, password);
        updatePasswordModal.style.display = "none";
        updatePasswordForm.reset();
    });

    // Handle Update Password Button Click
    userTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("update-password-btn")) {
            const email = e.target.getAttribute("data-email");
            updatePasswordModal.style.display = "block";
            updatePasswordForm.dataset.email = email;
        }

        if (e.target.classList.contains("delete-btn")) {
            const email = e.target.getAttribute("data-email");
            if (confirm(`Are you sure you want to delete ${email}?`)) {
                deleteUser(email);
            }
        }
    });

    // Handle Logout Button Click
    logoutButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "login.html";
        }
    });

    // Handle Main Page Button Click
    mainPageButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Fetch users on page load
    fetchUsers();
});
