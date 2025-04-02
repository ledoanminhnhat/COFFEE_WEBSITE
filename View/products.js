document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    if (userId) {
        console.log(`User ID: ${userId}`);
        document.getElementById("welcome-message").innerText = `Welcome, User ID: ${userId}`;
    } else {
        console.log("No user ID found.");
        window.location.href = "login.html";
    }
});
