import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
import { getDatabase, ref as dRef, push, set, update, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"; // Only import getDatabase once
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";





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
    const productsRef = ref(database, 'Products');
    onValue(productsRef, (snapshot) => {
        products = snapshot.val() ? Object.values(snapshot.val()) : [];
        console.log("Fetched products:", products); // This will show what's being fetched
        displayProducts(products);
    }, {
        onlyOnce: true
    });
  }

const form = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('productImage');
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
    const price = 'R' + priceInput.value;
    const imageFile = imageInput.files[0];

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
                    imageUrl: downloadURL
                }).then(() => {
                    console.log('Product added successfully');
                    // Reset form fields
                    form.reset();
                }).catch((error) => {
                    console.error('Error adding product: ', error);
                });
            });
        }
    );
});

// Function to retrieve and display stock data
// Function to retrieve and display stock data
function displayStockData() {
    const stockBody = document.getElementById('stockBody');
    stockBody.innerHTML = ''; // Clear existing rows

    // Query Realtime Database to get stock data
    const productsRef = dRef(db, 'Products');
    return get(productsRef)
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const productData = childSnapshot.val();
                const productName = productData.productName;
                const price = productData.price;
                const quantity = productData.quantity || 0; // Assuming quantity field exists
                // Create table row for each product
                const row = `
                    <tr>
                        <td>${productName}</td>
                        <td>${price}</td>
                        <td>${quantity}</td>
                        <td>
                            <button onclick="removeQuantity('${childSnapshot.key}')">Remove Quantity</button>
                        </td>
                    </tr>
                `;
                stockBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch((error) => {
            console.error('Error getting stock data:', error);
        });
}

// Function to remove quantity from stock
window.removeQuantity = function(productId) {
    // Get a reference to the product node in the database
    const productRef = dRef(db, `Products/${productId}`);

    // Fetch the current quantity from the database
    get(productRef).then((snapshot) => {
        const currentQuantity = snapshot.val().quantity || 0;

        // Ensure quantity doesn't go below 0
        const newQuantity = Math.max(currentQuantity - 1, 0);

        // Update the quantity in the database
        update(productRef, { quantity: newQuantity })
            .then(() => {
                console.log('Quantity removed successfully');
                // Update the displayed stock data after removing quantity
                displayStockData();
            })
            .catch((error) => {
                console.error('Error removing quantity:', error);
            });
    }).catch((error) => {
        console.error('Error fetching current quantity:', error);
    });
}



// Call displayStockData function when the page loads
window.addEventListener('load', displayStockData);

