document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("form");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        // Validate input fields
        if (!username || !password || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // Regex for password validation: At least 8 characters and at least one special character
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(password)) {
            alert("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một ký tự đặc biệt!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        // Send POST request to the /register API
        fetch("http://localhost:5000/api/customers/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error); // Handle server-side validation errors
                }

                alert(data.message); // Show success message
                window.location.href = "login.html"; // Redirect to login page
            })
            .catch((error) => {
                console.error("Error during registration:", error);
                alert(error.message || "Đăng ký thất bại!");
            });
    });
});
