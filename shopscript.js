
// Product Data
const products = [
    {
        id: 1,
        name: "Premium Headphones",
        category: "Electronics",
        price: 2499,
        rating: "★★★★★",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 2,
        name: "Classic Wrist Watch",
        category: "Accessories",
        price: 1899,
        rating: "★★★★★",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 3,
        name: "Stylish Backpack",
        category: "Fashion",
        price: 1499,
        rating: "★★★★☆",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },
    {
        id: 4,
        name: "Smart Camera",
        category: "Electronics",
        price: 4299,
        rating: "★★★★★",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Footwear",
        price: 2199,
        rating: "★★★★☆",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 6,
        name: "Modern Sunglasses",
        category: "Accessories",
        price: 999,
        rating: "★★★★★",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    },
    {
        id: 7,
        name: "Minimal Desk Lamp",
        category: "Home Decor",
        price: 1299,
        rating: "★★★★☆",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
    },
    {
        id: 8,
        name: "Travel Water Bottle",
        category: "Lifestyle",
        price: 599,
        rating: "★★★★★",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"
    }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// DOM Elements
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

// Format price
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN") + ".00";
}

// Display Products
function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">
            </div>

            <div class="product-info">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="rating">${product.rating}</div>

                <div class="product-bottom">
                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button class="add-btn"
                        onclick="addToCart(${product.id})">
                        + Add
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Save Cart
function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Add Product
function addToCart(id) {
    const product = products.find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
    showToast(product.name + " added to cart!");
}

// Increase / Decrease Quantity
function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(id);
        return;
    }

    saveCart();
    updateCart();
}

// Remove Product
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCart();

    showToast("Product removed from cart!");
}

// Update Cart
function updateCart() {
    cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty!</h3>
                <p>Add some products to get started.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity">
                        <button onclick="changeQuantity(${item.id}, -1)">−</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">+</button>

                        <button class="remove-btn"
                            onclick="removeItem(${item.id})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    const amount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    subtotal.textContent = formatPrice(amount);
    total.textContent = formatPrice(amount);
}

// Open Cart
function openCart() {
    cartPanel.classList.add("active");
    overlay.classList.add("active");
}

// Close Cart
function closeCart() {
    cartPanel.classList.remove("active");
    overlay.classList.remove("active");
}

// Toast Notification
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Event Listeners
document.getElementById("cartToggle").addEventListener(
    "click", openCart
);

document.getElementById("closeCart").addEventListener(
    "click", closeCart
);

overlay.addEventListener("click", closeCart);

// Checkout
document.getElementById("checkoutBtn").addEventListener(
    "click", function () {
        if (cart.length === 0) {
            showToast("Your cart is empty!");
            return;
        }

        alert("Thank you for shopping with ShopEase! Your cart is ready for checkout.");

    }
);

// Initial Setup
displayProducts();
updateCart();
