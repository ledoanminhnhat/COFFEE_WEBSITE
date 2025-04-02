document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user_id from localStorage or sessionStorage
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    if (!userId) {
        alert("User not logged in.");
        window.location.href = "login.html"; // Redirect to login page if no user ID is found
        return;
    }

    // Fetch user data from the API
    fetch(`http://localhost:5000/api/customers/profile/${userId}`)
        .then(response => response.json())
        .then(userData => {
            if (userData.error) {
                throw new Error(userData.error);
            }

            // Display user's full name and address on the profile page
            document.getElementById("userFullName").textContent = userData.full_name || "-";
            document.getElementById("userAddress").textContent = userData.address || "-";
        })
        .catch(error => {
            console.error("Error fetching profile data:", error);
            alert("Unable to fetch profile data.");
        });
});
document.querySelector('.btn-edit').addEventListener('click', function () {
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    const fullName = prompt('Enter your full name:', document.getElementById('userFullName').textContent);
    const address = prompt('Enter your address:', document.getElementById('userAddress').textContent);

    if (!fullName || !address) {
        alert('Fullname and address cannot be empty.');
        return;
    }

    fetch(`http://localhost:5000/api/customers/profile/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ full_name: fullName, address: address })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            alert(data.message);
            document.getElementById('userFullName').textContent = fullName;
            document.getElementById('userAddress').textContent = address;
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile.');
        });
});
