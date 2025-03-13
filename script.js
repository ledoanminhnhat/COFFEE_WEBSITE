// Load navbar
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            setActiveNavLink();
        });
});

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'project.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}
