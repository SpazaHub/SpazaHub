import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import{getDatabase, ref, set, get, child, update} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


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
  const db = getDatabase();


  let Username = document.getElementById('username');
  let Email = document.getElementById('email');
  let Permissions = document.getElementById('permissions');

  let RetBtn = document.getElementById('Retrieve-staff');
  let UpdatePassBtn = document.getElementById("Password-staff");
  let PermissionsBtn = document.getElementById("Permission-staff");
  
function clearFields() {
    document.getElementById('username').value = ''; // Clear username field
    document.getElementById('email').value = ''; // Clear email field]
    document.getElementById('permissions').value = ''; // Clear email field

}

  function RetData(){
    const dbRef = ref(db);

    get(child(dbRef, 'Staff/' + Username.value)).then((snapshot)=>{
        if(snapshot.exists()){
            Email.value = snapshot.val().email;
            Permissions.value = snapshot.val().permissions;
        }
        else{
            alert("No data found");
            clearFields(); // Clear fields if no data is found

        }
    })
    .catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

let ForgetPassword = ()=>{
    sendPasswordResetEmail(auth, Email.value)
    .then(()=>{
        alert('A password reset link has been sent to the staff memeber')
    })
    .catch((error)=>{
        console.log(error.code);
        console.log(error.message);
    })
}

function UpdateData(){
    update(ref(db, 'Staff/' + Username.value),{
        permissions : Permissions.value
    })
    .then(()=>{
        alert("Permissions/Roles updated successfully");
    })
    .catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}



RetBtn.addEventListener('click', RetData);
UpdatePassBtn.addEventListener('click', ForgetPassword);
PermissionsBtn.addEventListener('click', UpdateData);
