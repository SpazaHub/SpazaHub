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
    const staffRef = ref(db, 'Customers');
    
    get(staffRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if(childData.email === emailToDelete) {
                // When found, delete the staff member using the key
                remove(ref(db, 'Customers/' + childSnapshot.key))
                .then(() => {
                    alert("Data deleted successfully");
                })
                .catch((error) => {
                    alert("Unsuccessful, could not delete staff member");
                    console.error(error);
                });
            }
        });
    }).catch((error) => {
        alert("Unsuccessful, could not retrieve staff data");
        console.error(error);
    });
}



    DelBtn.addEventListener('click', DelData);

