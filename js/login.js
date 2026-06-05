// js/login.js

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    const demoEmail = "admin@gmail.com";
    const demoPassword = "12345";

    if (email === demoEmail && password === demoPassword) {
        if (rememberMe) {
            localStorage.setItem("weatherUserLoggedIn", "true");
        } else {
            sessionStorage.setItem("weatherUserLoggedIn", "true");
        }

        showLoginMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } else {
        showLoginMessage("Invalid email or password");
    }
}

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".password-toggle");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

function forgotPassword() {
    showLoginMessage("Demo password is 12345");
}

function showLoginMessage(message, type = "error") {
    const oldToast = document.querySelector(".login-toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `login-toast ${type === "success" ? "success" : ""}`;
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn =
        localStorage.getItem("weatherUserLoggedIn") === "true" ||
        sessionStorage.getItem("weatherUserLoggedIn") === "true";

    if (isLoggedIn) {
        window.location.href = "dashboard.html";
    }
});