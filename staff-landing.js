import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { getDatabase, ref as dRef, push, set, update, get, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDP7N-NJ_PbOs41BbX6AgLZrBWdyP-odJU",
    authDomain: "espaza-login-final.firebaseapp.com",
    databaseURL: "https://espaza-login-final-default-rtdb.firebaseio.com",
    projectId: "espaza-login-final",
    storageBucket: "espaza-login-final.appspot.com",
    messagingSenderId: "358577580383",
    appId: "1:358577580383:web:af7778db3431aaa2c72eea"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);
const auth = getAuth(app);

let products = [];

function fetchProducts() {
    const productsRef = dRef(db, 'Products');
    onValue(productsRef, (snapshot) => {
        products = snapshot.val() ? Object.entries(snapshot.val()).map(([id, product]) => ({ productId: id, ...product })) : [];
        console.log("Fetched products:", products);
        displayStockData(products);
    });
}

const form = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('productImage');
const stockQuantityInput = document.getElementById('stockQuantity');
const progressMessage = document.getElementById('uploadProgressMessage');

const signOutBtn = document.getElementById('sign-out-btn-staff');
signOutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = "staff-login.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            alert("An error occurred. Please try again later.");
        });
});

// Function to add a new product
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productName = productNameInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const imageFile = imageInput.files[0];
    const stockQuantity = parseInt(stockQuantityInput.value);

    // Upload image to Firebase Storage
    const storageRef = sRef(storage, 'Product_Images/' + imageFile.name);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressMessage.textContent = 'Upload is ' + Math.round(progress) + '% done';

        },
        (error) => {
            // Handle unsuccessful uploads
            console.error('Error uploading image: ', error);
        },
        () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                
                // Add product details to Realtime Database
                const productsRef = push(dRef(db, 'Products'));
                set(productsRef, {
                    productName: productName,
                    description: description,
                    price: price,
                    imageUrl: downloadURL,
                    quantity: stockQuantity // Set initial quantity
                }).then(() => {
                    console.log('Product added successfully');
                    // Reset form fields
                    form.reset();
                    fetchProducts(); // Refresh the product list
                }).catch((error) => {
                    console.error('Error adding product: ', error);
                });
            });
        }
    );
});

// Function to retrieve and display stock data
function displayStockData(products) {
    const stockBody = document.getElementById('stockBody');
    stockBody.innerHTML = ''; // Clear existing rows

    products.forEach((product) => {
        const productName = product.productName;
        const price = product.price;
        const quantity = product.quantity || 0;
        // Create table row for each product
        const row = `
            <tr>
                <td>${productName}</td>
                <td>${price}</td>
                <td>${quantity}</td>
                <td>
                    <button onclick="showAddStockForm('${product.productId}')">Add Stock</button>
                </td>
            </tr>
        `;
        stockBody.insertAdjacentHTML('beforeend', row);
    });
}

// Function to show add stock form
window.showAddStockForm = function(productId) {
    const product = products.find(p => p.productId === productId);
    if (product) {
        const newStockQuantity = prompt(`Add stock for ${product.productName}. Current stock: ${product.quantity}`, "0");
        if (newStockQuantity !== null && !isNaN(newStockQuantity)) {
            const quantityToAdd = parseInt(newStockQuantity);
            if (quantityToAdd > 0) {
                updateStockQuantity(productId, quantityToAdd);
            }
        }
    }
}

// Function to update stock quantity
function updateStockQuantity(productId, quantityToAdd) {
    const productRef = dRef(db, `Products/${productId}`);

    get(productRef).then((snapshot) => {
        if (snapshot.exists()) {
            const currentQuantity = snapshot.val().quantity || 0;
            const newQuantity = currentQuantity + quantityToAdd;

            update(productRef, { quantity: newQuantity })
                .then(() => {
                    console.log('Stock added successfully');
                    fetchProducts(); // Refresh the product list
                })
                .catch((error) => {
                    console.error('Error adding stock:', error);
                });
        } else {
            console.error('Product not found:', productId);
        }
    }).catch((error) => {
        console.error('Error fetching product data:', error);
    });
}

// Call fetchProducts function when the page loads
window.addEventListener('load', fetchProducts);
