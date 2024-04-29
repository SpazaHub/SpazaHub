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

    let email = document.getElementById('email');

    let DelBtn = document.getElementById('delete-btn');

    //let Username = document.getElementById('username');

    function DelData() {
        const emailToDelete = email.value;
        let isUserFound = false; // Flag to keep track if the user is found
        const customersRef = ref(db, 'Customers');
        
        get(customersRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if(childData.email === emailToDelete) {
                    isUserFound = true; // Set the flag to true if user is found
                    // When found, delete the customer using the key
                    remove(ref(db, 'Customers/' + childSnapshot.key))
                    .then(() => {
                        alert("Data deleted successfully");
                        emailInput.value = '';
                    })
                    .catch((error) => {
                        alert("Unsuccessful, could not delete customer");
                        console.error(error);
                    });
                }
            });
            if (!isUserFound) { // Check the flag after iterating through all customers
                // If the user wasn't found, show an error message
                alert("Error: No customer found with the provided email");
            }
        }).catch((error) => {
            alert("Unsuccessful, could not retrieve customer data");
            console.error(error);
        });
    }
    
    



    DelBtn.addEventListener('click', DelData);

