document.addEventListener('DOMContentLoaded', function () {
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'project.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.style.color = '#0ebf40';
        }
    });

    // Add hover effect for nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.color = '#0ebf40';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });

    // Fetch products from the API (only on the homepage)
    if (currentPage === 'project.html'||currentPage === 'products.html') {
        fetch('http://localhost:5000/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = ''; 

                if (data.length === 0) {
                    productList.innerHTML = '<p class="text-center">Không có sản phẩm nào.</p>';
                    return;
                }

                // Loop through the products and create HTML for each product
                data.forEach(product => {
                    const productCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text"><strong>Giá: ${product.price} VNĐ</strong></p>
                                    <button class="btn btn-primary">Thêm vào giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.innerHTML += productCard; // Add the product card to the list
                });
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                const productList = document.getElementById('product-list');
                productList.innerHTML = '<p class="text-center">Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>';
            });
    }
});