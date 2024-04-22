import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,  createUserWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
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

document.getElementById('staff-login-btn').addEventListener('click', function(e){
    e.preventDefault();

    const email = document.getElementById("staff-email").value;
    const password = document.getElementById("staff-password").value;

    // Authenticate user with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const username = email.substring(0, email.indexOf('@'));

            set(ref(db, 'Staff/' + username), {
                username: username,
                email: email,
            }).then(() => {
                console.log("User registered successfully.");
                window.location.href = "staff-landing.html";
            }).catch((error) => {
                console.error("Error updating database:", error);
                alert("Error updating database: " + error.message); 
            });
        })
        .catch((error) => {
            console.error("Authentication error:", error);
            alert("Invalid Login Credentials, please try again!");
        });
});








