import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import{getDatabase, ref, set, get, child} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDP7N-NJ_PbOs41BbX6AgLZrBWdyP-odJU",
    authDomain: "espaza-login-final.firebaseapp.com",
    projectId: "espaza-login-final",
    storageBucket: "espaza-login-final.appspot.com",
    messagingSenderId: "358577580383",
    appId: "1:358577580383:web:af7778db3431aaa2c72eea"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const provider = new GoogleAuthProvider();

//Customer Registration to DB
document.getElementById('admin-register-shopper-btn').addEventListener('click', function(e){
   e.preventDefault();

   const username = document.getElementById("admin-shopper-register-username").value;
   const email = document.getElementById("admin-shopper-register-email").value;
   const password = document.getElementById("admin-shopper-register-password").value;

   checkUsernameExists(username)
       .then((exists) => {
           if (!exists) {
               createUserWithEmailAndPassword(auth, email, password)
                   .then((userCredential) => {
                       saveUserToDatabase(username, email);
                       document.getElementById("admin-shopper-register-username").value = "";
                       document.getElementById("admin-shopper-register-email").value = "";
                       document.getElementById("admin-shopper-register-password").value = "";
                       alert("New Shopper created!");
                   })
                   .catch((error) =>{
                       console.error("Error creating user:", error);
                       alert("Error creating user: " + error.message);
                   });
           } else {
               alert("Username already exists. Please choose a different username.");
           }
       })
       .catch((error) => {
           console.error("Error checking username:", error);
           alert("An error occurred. Please try again later.");
       });
});

function checkUsernameExists(username) {
    return new Promise((resolve, reject) => {
        const userRef = ref(db, 'Customers/' + username);
        get(userRef)
            .then((snapshot) => {
                resolve(snapshot.exists());
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function saveUserToDatabase(username, email) {
    set(ref(db, 'Customers/' + username), {
        username: username,
        email: email,
    });
}
