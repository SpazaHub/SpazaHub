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
        console.log("Fetched products:", products); // Debugging line
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

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productName = productNameInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const imageFile = imageInput.files[0];
    const stockQuantity = parseInt(stockQuantityInput.value);

    const storageRef = sRef(storage, 'Product_Images/' + imageFile.name);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressMessage.textContent = 'Upload is ' + Math.round(progress) + '% done';
        },
        (error) => {
            console.error('Error uploading image: ', error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const productsRef = push(dRef(db, 'Products'));
                set(productsRef, {
                    productName: productName,
                    description: description,
                    price: price,
                    imageUrl: downloadURL,
                    quantity: stockQuantity
                }).then(() => {
                    console.log('Product added successfully');
                    form.reset();
                    fetchProducts();
                }).catch((error) => {
                    console.error('Error adding product: ', error);
                });
            });
        }
    );
});

function displayStockData(products) {
    const stockBody = document.getElementById('stockBody');
    stockBody.innerHTML = ''; 

    products.forEach((product) => {
        const productName = product.productName;
        const price = product.price;
        const quantity = product.quantity || 0;
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

function updateStockQuantity(productId, quantityToAdd) {
    const productRef = dRef(db, `Products/${productId}`);
    get(productRef).then((snapshot) => {
        if (snapshot.exists()) {
            const currentQuantity = snapshot.val().quantity || 0;
            const newQuantity = currentQuantity + quantityToAdd;
            update(productRef, { quantity: newQuantity })
                .then(() => {
                    console.log('Stock added successfully');
                    fetchProducts();
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

function fetchOrders() {
    const ordersRef = dRef(db, 'Orders');
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val() ? Object.entries(snapshot.val()).map(([id, order]) => ({ orderId: id, ...order })) : [];
        console.log("Fetched orders:", orders);
        displayOrderData(orders);
    });
}

function displayOrderData(orders) {
    const orderBody = document.getElementById('orderBody');
    orderBody.innerHTML = ''; 

    orders.forEach((order) => {
        const { orderId, username, totalAmount, status } = order;
        const row = `
            <tr>
                <td>${orderId}</td>
                <td>${username}</td>
                <td>${totalAmount}</td>
                <td>${status}</td>
                <td>
                    <select onchange="updateOrderStatus('${orderId}', this.value)">
                        <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
                        <option value="shipped" ${status === "shipped" ? "selected" : ""}>Shipped</option>
                        <option value="delivered" ${status === "delivered" ? "selected" : ""}>Delivered</option>
                        <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
        orderBody.insertAdjacentHTML('beforeend', row);
    });
}

window.updateOrderStatus = function(orderId, newStatus) {
    const orderRef = dRef(db, `Orders/${orderId}`);
    update(orderRef, { status: newStatus })
        .then(() => {
            console.log(`Order ${orderId} status updated to ${newStatus}`);
            fetchOrders();
        })
        .catch((error) => {
            console.error('Error updating order status:', error);
        });
}

window.addEventListener('load', () => {
    fetchProducts(); // Fetch and display products when the page loads
    fetchOrders();   // Fetch and display orders when the page loads
});

// Event listener for the report button
document.getElementById('report-btn').addEventListener('click', () => {
    window.location.href = 'report.html';
});
