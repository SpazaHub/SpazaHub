


// Function to sign out
const signOutBtn = document.getElementById('sign-out-btn');
signOutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = "customer-login.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            alert("An error occurred. Please try again later.");
        });
});
