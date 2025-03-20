// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'project.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.style.color = '#0ebf40'; // Highlight active link in green
        }
    });

    // Add hover effect for nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '#0ebf40';
            }
        });

        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });
});
