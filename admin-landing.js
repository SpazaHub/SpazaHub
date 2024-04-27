import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

const signOutBtn = document.getElementById('sign-out-btn-admin');
signOutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = "admin-login.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            alert("An error occurred. Please try again later.");
        });
});

const registerShopper = document.getElementById('register-shopper-btn-admin');
registerShopper.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = "admin-create-shopper.html";
        })
        .catch((error) => {
            console.error("Error going to admin create shopper page:", error);
            alert("An error occurred. Please try again later.");
        });
});

const registerStaff = document.getElementById('register-staff-btn-admin');
registerStaff.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = "admin-create-staff.html";
        })
        .catch((error) => {
            console.error("Error going to admin create staff page:", error);
            alert("An error occurred. Please try again later.");
        });
});
