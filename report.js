import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';


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
const database = getDatabase(app);






function fetchAndDisplayStock() {
    const stockRef = ref(database, 'Products');
    onValue(stockRef, (snapshot) => {
        if (!snapshot.exists()) {
            console.log('No data found in Firebase.');
            return;
        }
        const products = snapshot.val();
        console.log("Fetched products:", products);  // Confirm data structure
        displayStock(products);
        displayLowInventory(products); 
    }, {
        onlyOnce: true
    });
}






function fetchAndDisplayOrders() {
    const ordersRef = ref(database, 'Orders');
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val();
        console.log('Orders:', orders);  // Detailed log of orders object
        if (!orders) {
            console.error('No orders found.');
            document.getElementById('orderList').innerHTML = '<p>No order data available.</p>';
            return;
        }
        displayOrders(orders);
    }, {
        onlyOnce: true
    });
}

function displayStock(products) {
    const container = document.getElementById('stockList');
    let html = products ? Object.values(products).map(product => 
        `<div>${product.productName} - Quantity: ${product.quantity}</div>`
    ).join('') : '<p>No stock data available.</p>';
    // Create a div, set its innerHTML, and append it
    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
}

function displayOrders(orders) {
    const container = document.getElementById('orderList');
    let html = Object.entries(orders).map(([orderId, order]) => {
        let itemsHtml = order.items ? order.items.map(item => 
            `<div> Product Id :${item.productId} - ${item.productName} - Quantity: ${item.quantity} - Price: ${item.price}</div>`
        ).join('') : '<div>No items in this order.</div>';
        return `<div class="order">
            <h3>Order ID: ${orderId}</h3>
            <p>Date: ${order.date}</p>
            ${itemsHtml}
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Status: ${order.status}</p>
            <p>User Id: ${order.userId}</p>
            <p>Username: ${order.username}</p>
        </div>`;
    }).join('');
    // Create a div, set its innerHTML, and append it
    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
}


document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayStock();
    fetchAndDisplayOrders();
});





function exportOrdersToCSV() {
    const container = document.getElementById('orderList');
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = container.querySelectorAll('.order'); // Assuming each order is wrapped in an element with class 'order'

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('div, h3, p'); // Adjust to match the containers of your data
        const cleanRow = Array.from(cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(",");
        csvContent += index < rows.length - 1 ? cleanRow + "\n" : cleanRow;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'Order_History.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function exportStockToCSV() {
    const container = document.getElementById('stockList');
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = container.querySelectorAll('div'); // Assuming each stock item is in a 'div' element

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('div'); // Adjust if your HTML structure is different
        const cleanRow = Array.from(cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(",");
        csvContent += index < rows.length - 1 ? cleanRow + "\n" : cleanRow;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'Stock_On_Hand.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



function exportLowInventoryToCSV() {
    const container = document.getElementById('lowInventory');
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = container.querySelectorAll('div'); // Assuming each low inventory item is in a 'div' element

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('div'); // Adjust if your HTML structure is different
        const cleanRow = Array.from(cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(",");
        csvContent += index < rows.length - 1 ? cleanRow + "\n" : cleanRow;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'Low_Inventory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function displayLowInventory(products) {
    const container = document.getElementById('lowInventory');
    const lowInventoryThreshold = 10;  // Set the threshold for low inventory

    // Filter products to find those with low inventory
    const lowInventoryItems = Object.values(products).filter(product => Number(product.quantity) <= lowInventoryThreshold);

    let html = lowInventoryItems.length > 0 
        ? lowInventoryItems.map(product => `<div>${product.productName} - Quantity: ${product.quantity}</div>`).join('')
        : '<p>All stock levels are sufficient.</p>';

    // Create a div, set its innerHTML, and append it
    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
}













document.addEventListener('DOMContentLoaded', () => {
    const exportStockButton = document.getElementById('export-stock-csv');
    const exportOrdersButton = document.getElementById('export-orders-csv');

    exportStockButton.addEventListener('click', exportStockToCSV);
    exportOrdersButton.addEventListener('click', exportOrdersToCSV);

    const exportLowInventoryButton = document.getElementById('export-low-inventory-csv');
    exportLowInventoryButton.addEventListener('click', exportLowInventoryToCSV);
});








