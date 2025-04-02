document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  if (!userData) {
    alert("Vui lòng đăng nhập để xem giỏ hàng của bạn");
    window.location.href = "login.html";
    return;
  }

  fetchCartItems(userData.user_id);
  setupEventListeners();
  
});

function fetchCartItems(userId) {
  fetch(`http://localhost:5000/api/carts/items/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderCartItems(data.items);
      updateCartTotals(data.totals);
    })
    .catch((error) => {
      console.error("Error fetching cart:", error);
      renderCartItems(data.items);
    });
}

function renderCartItems(items) {
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = "";

  if (items.length === 0) {
    document.querySelector(".cart-section .container").innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-4x mb-3 text-muted"></i>
                <h3>Giỏ hàng của bạn đang trống</h3>
                <p class="text-muted">Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                <a href="products.html" class="btn btn-primary mt-3">Tiếp tục mua sắm</a>
            </div>
        `;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.itemId = item.cart_item_id;
    row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image_url}" alt="${
      item.name
    }" class="cart-img me-3" style="width: 80px; height: 80px; object-fit: cover;">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <div class="input-group" style="width: 120px;">
                    <button class="btn btn-outline-secondary quantity-btn" data-action="decrease" type="button">-</button>
                    <input type="text" class="form-control text-center quantity-input" value="${
                      item.quantity
                    }" readonly>
                    <button class="btn btn-outline-secondary quantity-btn" data-action="increase" type="button">+</button>
                </div>
            </td>
            <td>${formatCurrency(item.item_total)}</td>
            <td>
                <button class="btn btn-link text-danger remove-item-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

function updateCartTotals(totals) {
  const totalSection = document.querySelector(".card-body");
  totalSection.innerHTML = `
        <h5 class="card-title">Tổng giỏ hàng</h5>
        <div class="d-flex justify-content-between mb-2">
            <span>Tạm tính:</span>
            <span>${formatCurrency(totals.subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển:</span>
            <span>${formatCurrency(totals.shipping)}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-3">
            <strong>Tổng cộng:</strong>
            <strong>${formatCurrency(totals.total)}</strong>
        </div>
        <button class="btn btn-primary w-100">Thanh toán</button>
    `;
}

function setupEventListeners() {
  // Event delegation for quantity buttons and remove buttons
  document.addEventListener("click", function (event) {
    const quantityBtn = event.target.closest(".quantity-btn");
    const removeBtn = event.target.closest(".remove-item-btn");

    if (quantityBtn) {
      handleQuantityButton(quantityBtn);
    } else if (removeBtn) {
      handleRemoveButton(removeBtn);
    }
  });
}

function handleQuantityButton(button) {
  const row = button.closest("tr");
  const itemId = row.dataset.itemId;
  const input = row.querySelector(".quantity-input");
  let quantity = parseInt(input.value);

  if (button.dataset.action === "increase") {
    quantity += 1;
  } else if (button.dataset.action === "decrease" && quantity > 1) {
    quantity -= 1;
  }

  input.value = quantity;
  updateCartItemQuantity(itemId, quantity);
}

function handleRemoveButton(button) {
  const row = button.closest("tr");
  const itemId = row.dataset.itemId;

  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    removeCartItem(itemId);
  }
}

function updateCartItemQuantity(itemId, quantity) {
  const userData = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  fetch(`http://localhost:5000/api/carts/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      fetchCartItems(userData.user_id);
    })
    .catch((error) => {
      console.error("Error updating quantity:", error);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
    });
}

function removeCartItem(itemId) {
  const userData = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  fetch(`http://localhost:5000/api/carts/items/${itemId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Refresh cart to show updated cart
      fetchCartItems(userData.user_id);
    })
    .catch((error) => {
      console.error("Error removing item:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    });
}

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function addToCart(productId) {
  productId = parseInt(productId, 10);

  const userId =
    localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

  if (!userId) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
    window.location.href = "login.html";
    return;
  }

  fetch(`http://localhost:5000/api/carts/user/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const cartId = data.cart_id;

      return fetch("http://localhost:5000/api/carts/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: cartId,
          product_id: productId,
          quantity: 1,
        }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    });
}
