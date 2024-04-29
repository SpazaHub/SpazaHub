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
document.getElementById('admin-register-staff-btn').addEventListener('click', function(e){
   e.preventDefault();
   const username = document.getElementById("admin-staff-register-username").value; 
   const email = document.getElementById("admin-staff-register-email").value;
   const password = document.getElementById("admin-staff-register-password").value;

   checkUsernameExists(username)
       .then((exists) => {
           if (!exists) {
               createUserWithEmailAndPassword(auth, email, password)
                   .then((userCredential) => {
                       saveUserToDatabase(username, email);
                       document.getElementById("admin-staff-register-username").value = "";
                       document.getElementById("admin-staff-register-email").value = "";
                       document.getElementById("admin-staff-register-password").value = "";
                       alert("New Staff Member Created!");
                   })
                   .catch((error) =>{
                       console.error("Error creating staff:", error);
                       alert("Error creating staff: " + error.message);
                   });
           } else {
               alert("Email already exists. Please choose a different email.");
           }
       })
       .catch((error) => {
           console.error("Error checking email:", error);
           alert("An error occurred. Please try again later.");
       });
});

function checkUsernameExists(username) {
    return new Promise((resolve, reject) => {
        const userRef = ref(db, 'Staff/' + username);
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
    set(ref(db, 'Staff/' + username), {
        username: username,
        email: email,
    });
}