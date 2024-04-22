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

//Customer Login Authentication
const submit = document.getElementById('customer-login-btn');
submit.addEventListener("click", function(event) {
    event.preventDefault();

    const email = document.getElementById('customer-login-email').value;
    const password = document.getElementById('customer-login-password').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = "customer-landing.html";

    })
    .catch((error) =>{
        const errorMessage = error.message;
        console.log(errorMessage);
        alert("Invalid Login Credentials, please try again!");
    });
});


// Function to handle Google sign-in
const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const additionalUserInfo = result.additionalUserInfo;

            window.location.href = "customer-landing.html";

        })
        .catch((error) => {
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            alert("Google-in failed: " +errorMessage);
        });
};

// Add event listener to Google sign-in button
const googleLoginBtn = document.getElementById('google-login-btn');
googleLoginBtn.addEventListener("click", (event) => {
    if (auth.currentUser) {
        window.location.href = "customer-landing.html";
    } else {
        handleGoogleSignIn();
    }
});


//Customer Registration to DB
document.getElementById('register-btn').addEventListener('click', function(e){
   e.preventDefault();

   const username = document.getElementById("username").value;
   const email = document.getElementById("register-email").value;
   const password = document.getElementById("register-password").value;

   checkUsernameExists(username)
       .then((exists) => {
           if (!exists) {
               createUserWithEmailAndPassword(auth, email, password)
                   .then((userCredential) => {
                       saveUserToDatabase(username, email);
                       window.location.href = "customer-login.html";
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