// ------------------
// Variables globales
// ------------------

const login_btn = document.getElementById("login_btn");
const logout_btn = document.getElementById("logout-btn");

// --------------------------------------------
// Initialisation des gestionnaires d'événement
// --------------------------------------------

login_btn.addEventListener("click", Login);
logout_btn.addEventListener("click", Logout);
document.addEventListener("DOMContentLoaded", onPageLoad)

// ----------- AUTHENTIFICATION

function Login(event){
    event.preventDefault();

    const username = document.getElementById("login").value + "@whatever.fr";
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result => {
        const user = result.user;
        Logging_in();
        Successfull_Login();
    })
    .catch(error => {
        console.log(error);
        Show_Invalid_Loggin();
    })
}

function Logout(event){
    event.preventDefault();

    firebase.auth().signOut().then(() => {
        Logging_out();
    })
}

// CSS CHANGE ON LOG STATUS

function Logging_in(){
    const login_container = document.getElementById("login-container");
    login_container.classList.remove("shown");
    login_container.classList.add("hidden");
}

function Show_Invalid_Loggin(){
    const login_form = document.getElementById("login_form");
    const inputs = login_form.querySelectorAll("input");
    for(const input of inputs){
        if(input.value === '' || input.id === "password"){
            input.classList.add("is-invalid");
            input.value = '';
        } else {
            input.classList.remove("is-invalid")
        }
    }
}

function Successfull_Login(){
    const login_form = document.getElementById("login_form");
    const inputs = login_form.querySelectorAll("input");
    for(const input of inputs){
        input.classList.remove("is-invalid");
        input.value = '';
    }
}

function Logging_out(){
    const login_container = document.getElementById("login-container");
    login_container.classList.remove("hidden");
    login_container.classList.add("shown");
}

function onPageLoad() {

    firebase.auth().onAuthStateChanged(user => {
        if(user === null){
            Logging_out();
        }
    })

}