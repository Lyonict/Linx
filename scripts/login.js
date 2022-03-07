import config from "../config.js";

console.log("hello")

// Initialisation de Firebase
// firebase.initializeApp(config);

// --------------------------------------------
// Initialisation des gestionnaires d'événement
// --------------------------------------------

document.getElementById("login_btn").addEventListener("click", LogingIn)

// $('#loginButtonGithub').on('click', githubLogin);
// $('#loginButtonGoogle').on('click', googleLogin);
// $('#loginForm').on('submit', emailPasswordLogin);
// $('#logout').on('click', logout);
// $(document).ready(onPageLoad);

// ----------------------------------------
// Définition des gestionnaires d'événement
// ----------------------------------------

function LogingIn() {
    console.log("test");
    document.getElementById("login-container").style.backgroundColor = "blue";
}