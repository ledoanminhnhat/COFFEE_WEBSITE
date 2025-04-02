document.addEventListener("DOMContentLoaded", function () {
  const currentPage =
    window.location.pathname.split("/").pop() || "project.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.style.color = "#0ebf40";
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.color = "#0ebf40";
      }
    });

    link.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.color = "";
      }
    });
  });

  if (currentPage === "project.html" || currentPage === "products.html") {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; 

        if (data.length === 0) {
          productList.innerHTML =
            '<p class="text-center">Không có sản phẩm nào.</p>';
          return;
        }

        const itemsToDisplay =
          currentPage === "project.html" ? data.slice(0, 3) : data;

        itemsToDisplay.forEach((product) => {
          const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text"><strong>Giá: ${product.price} VNĐ</strong></p>
                                <button class="btn btn-primary add-to-cart" data-product-id="${product.product_id}">Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                `;
          productList.innerHTML += productCard; 
        });
        
        addToCartEventListeners();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        const productList = document.getElementById("product-list");
        productList.innerHTML =
          '<p class="text-center">Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>';
      });
  }
  
  // Function to add event listeners to "Add to cart" buttons
  function addToCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        addToCart(productId);
      });
    });
  }
  
  // Function to add a product to the cart
  function addToCart(productId) {
    productId = parseInt(productId, 10);
    console.log("Product ID:", productId);

    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    console.log("User ID:", userId);

    if (!userId) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:5000/api/carts/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            const cartId = data.cart_id;
            console.log("Cart ID:", cartId);

            return fetch('http://localhost:5000/api/carts/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    product_id: productId,
                    quantity: 1
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            alert('Sản phẩm đã được thêm vào giỏ hàng!');
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        });
}



});
