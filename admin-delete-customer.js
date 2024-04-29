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

    function getLoginType() {
        let loginTypeRadios = document.getElementsByName('loginType');
        for (let radio of loginTypeRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null; // Return null if no login type is selected
    }
    
    function DelData() {
        const emailToDelete = email.value;
        const usernameToDelete = username.value;
        const loginType = getLoginType(); // Get the selected login type
    
        if (!loginType) { // Check if a login type is selected
            alert("Please select a login type.");
            return; // Exit the function if no login type is selected
        }
    
        let isUserFound = false;
        const customersRef = ref(db, 'Customers');
    
        get(customersRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if ((loginType === 'Google' && childData.email === emailToDelete) || 
                    (loginType === 'Regular' && childData.email === emailToDelete && childData.username === usernameToDelete)) {
                    isUserFound = true;
                    remove(ref(db, 'Customers/' + childSnapshot.key))
                    .then(() => {
                        alert("Data deleted successfully");
                        email.value = ''; // Clear the email field
                        username.value = ''; // Clear the username field
                    })
                    .catch((error) => {
                        alert("Unsuccessful, could not delete customer");
                        console.error(error);
                    });
                    return true; // Exit the forEach loop
                }
            });
            if (!isUserFound) {
                alert("Error: No customer found with the provided credentials");
                email.value = ''; // Clear the email field
                username.value = ''; // Clear the username field
            }
        }).catch((error) => {
            alert("Unsuccessful, could not retrieve customer data");
            console.error(error);
            email.value = ''; // Clear the email field
            username.value = ''; // Clear the username field
        });
    }
    
    
    



    DelBtn.addEventListener('click', DelData);

