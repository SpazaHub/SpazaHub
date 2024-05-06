import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
import { getDatabase, ref as dRef, push, set } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";


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

const form = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('productImage');
const progressMessage = document.getElementById('uploadProgressMessage');

const auth = getAuth(app);

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
                }).catch((error) => {
                    console.error('Error adding product: ', error);
                });
            });
        }
    );

    // Reset form fields
    form.reset();
});

      



