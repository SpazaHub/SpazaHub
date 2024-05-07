// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

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

// Array to hold products fetched from Firebase
let products = [];

// Fetch Products from Firebase and display them
function fetchProducts() {
  const productsRef = ref(database, 'Products');
  onValue(productsRef, (snapshot) => {
      products = snapshot.val() ? Object.values(snapshot.val()) : [];
      console.log("Fetched products:", products); // This will show what's being fetched
      displayProducts(products);
  }, {
      onlyOnce: true
  });
}
// customer-cart.js

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

function searchForProduct(searchTerm) {
  // Filter the array of products based on the search term
  const filteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );

  // Display the filtered products
  displayProducts(filteredProducts);
}

// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', () => {
  // Clear the search input
  document.getElementById('searchInput').value = '';

  // Display all products
  displayAllProducts();
});


function displayAllProducts() {
  displayProducts(products);
}



function displayProducts(products) {
  const root = document.getElementById('root');
  root.innerHTML = products.map((product, index) => {
      const imageUrl = product.imageUrl || 'path/to/default-image.jpg'; // Provide a default image path if imageUrl is undefined
      return `
          <div class='box'>
              <div class='img-box'>
                  <img class='images' src=${imageUrl} alt='Product Image'></img>
              </div>
              <div class='bottom'>
                  <p>${product.productName || 'No name'}</p>
                  <h2>$ ${product.price || 0}</h2>
                  <button id="add-to-cart-${index}">Add to cart</button>
              </div>
          </div>
      `;
  }).join('');

  // Attach event listeners to the generated buttons
  attachEventHandlers();
}


// Attach event listeners to each Add to Cart button
function attachEventHandlers() {
    products.forEach((product, index) => {
        document.getElementById(`add-to-cart-${index}`).addEventListener('click', () => addToCart(index));
    });
}



// Add selected product to cart
var cart = []; // This holds the cart items
function addToCart(index) {
    cart.push(products[index]);
    displayCart();
}




function displayCart() {
  let total = 0;
  const cartItemsContainer = document.getElementById('cartItem');
  document.getElementById("count").innerHTML = cart.length;
  cartItemsContainer.innerHTML = cart.length === 0 ? "Your cart is empty" : cart.map((item, index) => {
      const { imageUrl, productName, price } = item;
      const numericPrice = parseFloat(price.replace('R', ''));
      if (isNaN(numericPrice)) {
          console.error('Invalid price:', price);
          return '';
      }
      total += numericPrice;
      return `
          <div class='cart-item' data-index='${index}'>
              <div class='row-img'>
                  <img class='rowimg' src="${imageUrl}" alt="${productName}">
              </div>
              <p style='font-size:12px;'>${productName}</p>
              <h2 style='font-size:15px;'>R ${numericPrice.toFixed(2)}</h2>
              <button class='remove-from-cart'>Remove</button>
          </div>
      `;
  }).join('');

  document.getElementById("total").innerHTML = "R " + total.toFixed(2);

  attachRemoveEventHandlers(); // Attach event handlers after updating the cart
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

// Load Products when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  attachRemoveEventHandlers(); // Ensure this is called after the DOM is fully loaded
});

function attachRemoveEventHandlers() {
  const removeButtons = document.querySelectorAll('.remove-from-cart');
  removeButtons.forEach((button, index) => {
      button.onclick = () => removeFromCart(index);
  });
}


function removeFromCart(index) {
  cart.splice(index, 1); // Remove the item from the cart
  displayCart(); // Update the cart display
}



// Load Products when the document is ready
document.addEventListener('DOMContentLoaded', fetchProducts);



