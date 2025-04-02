document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const rememberMeCheckbox = document.getElementById("remember-me");

    togglePasswordBtn.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin đăng nhập!");
            return;
        }

        fetch("http://localhost:5000/api/customers/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                }

                // Store user_id and user data in localStorage or sessionStorage
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("user_id", data.user.user_id);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem("user_id", data.user.user_id);
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                }

                alert("Đăng nhập thành công!");
                window.location.href = "project.html"; // Redirect to project.html
            })
            .catch((error) => {
                alert(error.message || "Đăng nhập thất bại!");
            });
    });
});
