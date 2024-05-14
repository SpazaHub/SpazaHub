// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getDatabase, ref, onValue, push, set, update, get } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDP7N-NJ_PbOs41BbX6AgLZrBWdyP-odJU",
    authDomain: "espaza-login-final.firebaseapp.com",
    databaseURL: "https://espaza-login-final-default-rtdb.firebaseio.com",
    projectId: "espaza-login-final",
    storageBucket: "espaza-login-final.appspot.com",
    messagingSenderId: "358577580383",
    appId: "1:358577580383:web:af7778db3431aaa2c72eea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

auth.onAuthStateChanged((user) => {
    if (user) {
        const username = sessionStorage.getItem('username') || user.displayName || 'User';
        document.getElementById('username-display').textContent = `Welcome, ${username}`;
    } else {
        window.location.href = "customer-login.html";
    }
});

document.getElementById('sign-out-button').addEventListener('click', () => {
    signOut(auth).then(() => {
        sessionStorage.removeItem('username');
        window.location.href = "customer-login.html";
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
});

// Array to hold products fetched from Firebase
let products = [];

// Array to hold filtered products
let filteredProducts = [];

// Array to hold cart items with quantities
let cart = [];

// Fetch Products from Firebase and display them
function fetchProducts() {
    const productsRef = ref(database, 'Products');
    onValue(productsRef, (snapshot) => {
        products = snapshot.val() ? Object.entries(snapshot.val()).map(([id, product]) => ({ productId: id, ...product })) : [];
        console.log("Fetched products:", products); // This will show what's being fetched
        displayProducts(products);
    }, {
        onlyOnce: true
    });
}

// Load Products when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    attachRemoveEventHandlers(); // Ensure this is called after the DOM is fully loaded
});

document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        // Perform search operation with the searchTerm
        searchForProduct(searchTerm);
    } else {
        // Show all products if search input is empty
        displayAllProducts();
    }
});

document.getElementById('resetButton').addEventListener('click', () => {
    // Clear the search input
    document.getElementById('searchInput').value = '';

    // Display all products
    displayAllProducts();
});

function searchForProduct(searchTerm) {
    // Filter the array of products based on the search term
    filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    // Display the filtered products
    displayProducts(filteredProducts);
}

function displayAllProducts() {
    filteredProducts = products;
    displayProducts(products);
}

function displayProducts(productsToDisplay) {
    const root = document.getElementById('root');
    root.innerHTML = productsToDisplay.map((product, index) => {
        const imageUrl = product.imageUrl || 'path/to/default-image.jpg'; // Provide a default image path if imageUrl is undefined
        return `
            <div class='box' data-index='${index}'>
                <div class='img-box'>
                    <img class='images' src=${imageUrl} alt='Product Image'></img>
                </div>
                <div class='bottom'>
                    <p>${product.productName || 'No name'}</p>
                    <h2>R ${product.price || 0}</h2>
                    <button class="view-details-button">View Details</button>
                    <button class="add-to-cart-button">Add to cart</button>
                </div>
            </div>
        `;
    }).join('');

    // Attach event listeners to the generated buttons
    attachEventHandlers(productsToDisplay);
}

function attachEventHandlers(productsToDisplay) {
    document.querySelectorAll('.view-details-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.box').getAttribute('data-index');
            viewProductDetails(productsToDisplay, index);
        });
    });

    document.querySelectorAll('.add-to-cart-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.box').getAttribute('data-index');
            addToCart(productsToDisplay, index);
        });
    });
}

function viewProductDetails(productsToDisplay, index) {
    const product = productsToDisplay[index];
    document.getElementById('modalName').textContent = product.productName;
    document.getElementById('modalImage').src = product.imageUrl;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `Price: R ${product.price}`;
    document.getElementById('productModal').style.display = 'block';
}

// Add selected product to cart
function addToCart(productsToDisplay, index) {
    const product = productsToDisplay[index];
    const cartItem = cart.find(item => item.product.productName === product.productName);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    displayCart();
}

function displayCart() {
    let total = 0;
    const cartItemsContainer = document.getElementById('cartItem');
    document.getElementById("count").innerHTML = cart.length;
    cartItemsContainer.innerHTML = cart.length === 0 ? "Your cart is empty" : cart.map((item, index) => {
        const { imageUrl, productName, price } = item.product;
        const numericPrice = parseFloat(price?.replace('R', '') || 0);
        if (isNaN(numericPrice)) {
            console.error('Invalid price:', price);
            return '';
        }
        total += numericPrice * item.quantity;
        return `
            <div class='cart-item' data-index='${index}'>
                <div class='row-img'>
                    <img class='rowimg' src="${imageUrl}" alt="${productName}">
                </div>
                <p style='font-size:12px;'>${productName}</p>
                <h2 style='font-size:15px;'>R ${numericPrice.toFixed(2)}</h2>
                <div class='quantity-controls'>
                    <button class='decrease-quantity'>-</button>
                    <span class='quantity'>${item.quantity}</span>
                    <button class='increase-quantity'>+</button>
                </div>
                <button class='remove-from-cart'>Remove</button>
            </div>
        `;
    }).join('');

    document.getElementById("total").innerHTML = "R " + total.toFixed(2);

    attachCartEventHandlers(); // Attach event handlers after updating the cart
}

function attachCartEventHandlers() {
    document.querySelectorAll('.remove-from-cart').forEach((button, index) => {
        button.onclick = () => removeFromCart(index);
    });

    document.querySelectorAll('.increase-quantity').forEach((button, index) => {
        button.onclick = () => changeQuantity(index, 1);
    });

    document.querySelectorAll('.decrease-quantity').forEach((button, index) => {
        button.onclick = () => changeQuantity(index, -1);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart
    displayCart(); // Update the cart display
}

function changeQuantity(index, delta) {
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
    } else {
        cart.splice(index, 1); // Remove the item if quantity goes to zero or below
    }
    displayCart(); // Update the cart display
}

// Function to handle order placement
function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to the cart before placing an order.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to place an order.");
        return;
    }

    const order = {
        username: user.displayName || 'User',
        userId: user.uid,
        items: cart.map(item => ({
            productName: item.product.productName,
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.productId // Assuming each product has a unique productId
        })),
        totalAmount: document.getElementById("total").textContent,
        date: new Date().toISOString(),
        status: 'pending'
    };

    const orderRef = ref(database, 'Orders');
    const newOrderRef = push(orderRef);
    set(newOrderRef, order)
        .then(() => {
            alert("Order placed successfully!");
            document.getElementById('order-status').textContent = `Order placed successfully! Order ID: ${newOrderRef.key}`;
            decreaseStockQuantities(cart); // Decrease stock quantities
            cart = []; // Clear the cart after placing the order
            displayCart(); // Update the cart display
        })
        .catch((error) => {
            console.error("Error placing order:", error);
            alert("An error occurred while placing the order. Please try again.");
        });
}

// Function to decrease stock quantities
function decreaseStockQuantities(cart) {
    console.log("Decreasing stock quantities for cart items:", cart);
    cart.forEach(item => {
        const productRef = ref(database, `Products/${item.product.productId}`);
        get(productRef).then((snapshot) => {
            if (snapshot.exists()) {
                const currentQuantity = snapshot.val().quantity || 0;
                const newQuantity = currentQuantity - item.quantity;
                console.log(`Current quantity of ${item.product.productName}: ${currentQuantity}, new quantity: ${newQuantity}`);
                if (newQuantity < 0) {
                    alert(`Not enough stock for ${item.product.productName}.`);
                } else {
                    update(productRef, { quantity: newQuantity })
                        .then(() => {
                            console.log(`Stock updated for ${item.product.productName}`);
                        })
                        .catch((error) => {
                            console.error(`Error updating stock for ${item.product.productName}:`, error);
                        });
                }
            } else {
                console.error(`Product not found: ${item.product.productName}`);
            }
        }).catch((error) => {
            console.error("Error getting product data:", error);
        });
    });
}

// Modal close logic
document.querySelector('.modal .close').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Attach event listener to the Complete Order button
document.getElementById('place-order-button').addEventListener('click', placeOrder);
