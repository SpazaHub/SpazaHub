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

    let email = document.getElementById('username');

    let DelBtn = document.getElementById('delete-btn');

    //let Username = document.getElementById('username');
    


    function DelData() {
        const emailToDelete = email.value;
        let isUserFound = false;
        const customersRef = ref(db, 'Staff');
    
        get(customersRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if(childData.email === emailToDelete && !isUserFound) {
                    isUserFound = true; // Set the flag to true if user is found
                    // When found, delete the customer using the key
                    remove(ref(db, 'Staff/' + childSnapshot.key))
                    .then(() => {
                        alert("Data deleted successfully");
                        email.value = ''; // Clear the email field after successful deletion
                    })
                    .catch((error) => {
                        alert("Unsuccessful, could not delete Staff User");
                        console.error(error);
                    });
                    return true; // Stop iterating through the rest of the children
                }
            });
            if (!isUserFound) {
                alert("Error: No Staff User found with the provided email");
                email.value = ''; // Clear the email field if user is not found
            }
        }).catch((error) => {
            alert("Unsuccessful, could not retrieve Staff User data");
            console.error(error);
            email.value = ''; // Clear the email field in case of any error during retrieval
        });
    }
    



    DelBtn.addEventListener('click', DelData);

