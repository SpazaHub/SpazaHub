import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
    
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

    import{getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

    const db=getDatabase();

    let username = document.getElementById('username');

    let email = document.getElementById('email');

    let DelBtn = document.getElementById('delete-btn');

    
    
    function DelData() {
        const usernameToDelete = username.value;
        const emailToDelete = email.value; 
        let isUserFound = false;
        const staffRef = ref(db, 'Customers');
        
        get(staffRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                // Check both the username and email
                if(childData.username === usernameToDelete && childData.email === emailToDelete) {
                    isUserFound = true; // Set the flag to true if user is found
                    // When found, delete the customer member using the key
                    remove(ref(db, 'Customers/' + childSnapshot.key))
                    .then(() => {
                        alert("Customer deleted successfully");
                        username.value = ''; // Clear the username field after successful deletion
                        email.value = ''; // Also clear the email field
                    })
                    .catch((error) => {
                        alert("Unsuccessful, could not delete Customer");
                        console.error(error);
                    });
                    // Return true if using Firebase forEach to stop iteration 
                    return isUserFound;
                }
            });
            if (!isUserFound) {
                alert("Error: No Customer found with the provided username and email");
                username.value = ''; // Clear the username field if user is not found
                email.value = ''; // Also clear the email field
            }
        }).catch((error) => {
            alert("Unsuccessful, could not retrieve Customer data");
            console.error(error);
            username.value = ''; // Clear the username field in case of any error during retrieval
            email.value = ''; // Also clear the email field
        });
    }
    
    
    



    DelBtn.addEventListener('click', DelData);

