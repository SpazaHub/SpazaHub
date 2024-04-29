import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Initialize Firebase Admin SDK
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
      

    // Use Firebase Admin SDK

    // Example usage
    auth.fetchSignInMethodsForEmail("tammy@espazaadmin.co.za")
        .then((methods) => {
            console.log("Sign-in methods:", methods);
        })
        .catch((error) => {
            console.error("Error fetching sign-in methods:", error);
        });


