import config from '../config.js';

// Initialisation de Firebase
firebase.initializeApp(config);

// ------------------
// Variables globales
// ------------------

const submit_card_btn = document.getElementById("submit-card-btn");
const cancel_add_btn = document.getElementById('cancel-add');
const add_card_btn = document.getElementById("add-btn");
const add_card_popin = document.getElementById("pop-in");
const cards_container = document.getElementById("cards-container");


// --------------------------------------------
// Initialisation des gestionnaires d'événement
// --------------------------------------------

// Gère l'apparition/disparition du popIn d'ajout de carte
add_card_btn.addEventListener("click", () => {
    add_card_popin.style.zIndex = 1;
});
cancel_add_btn.addEventListener("click", (event) =>{
    event.preventDefault();
    Cancel_AddCardTo_Base();
    add_card_popin.style.zIndex = -1;
})

// Appuis du bouton "ajouter une carte" 
submit_card_btn.addEventListener("click", (event) =>{
    event.preventDefault();
    Form_Validation(event);
})

// Appuis du bouton "supprimer une carte"
cards_container.addEventListener('click', event => {
    Delete_Card(event)
});

// Appuis du bouton "modifier une carte"
cards_container.addEventListener('click', Modify_Card);

// ----------------------------------------
// Définition des gestionnaires d'événement
// ----------------------------------------

// Verifie si les champs "Titre" et "Lien" sont renseignés
function Form_Validation(event){
    // Sert à compter le nombre de champs valides
    let tally = 0;
    const add_card_form = document.getElementById('add_card_form');
    const add_inputs = add_card_form.querySelectorAll('input');
    for(const input of add_inputs){
        if(input.id != "add-desc" && input.value === ''){
            input.classList.add('is-invalid');
            tally = 0;
        } else if(input.id != "add-desc" && input.value != ''){
            input.classList.remove('is-invalid');
            tally++;
        }
    }
    if(tally === 2){
        AddCardTo_Base(event);
        add_card_popin.style.zIndex = -1;
    }
}

// Ajoute les infos de la nouvelle carte à la base de donnée
function AddCardTo_Base(event) {
    event.preventDefault();
    const title = document.getElementById("add-title");
    const link = document.getElementById("add-link");
    const desc = document.getElementById("add-desc");
    firebase.firestore().collection('links').add({
        name : title.value,
        link : link.value,
        desc : desc.value
    });
    Empty_Imput(["add-title", "add-link", "add-desc"]);
}

// Vide les champs et retire le style "invalide"
function Cancel_AddCardTo_Base(){
    Empty_Imput(["add-title", "add-link", "add-desc"]);
    const add_card_form = document.getElementById('add_card_form');
    const add_inputs = add_card_form.querySelectorAll('input');
    for(const input of add_inputs){
        input.classList.remove('is-invalid');
    }
}

// Génération des cartes
const cardRef = firebase.firestore().collection('links');

cardRef.orderBy("name");

cardRef.onSnapshot(querySnapshot => {
    // Container ou on va push "template"
    const cardContainer = document.getElementById('cards-container');
    // String que l'on va mettre en "innerHTML" du container
    let template = '';
    // Boucle sur la base de donnée et rajoute une "carte" à template
    querySnapshot.forEach(item => {

        let {name, link, desc} = item.data();
        let docID = item.id;

        template += 
        `
        <article id=${docID} class="col-lg-4 col-md-6 col-sm-12 p-3">
            <div class="card p-3 h-100">
                <div class="d-flex">
                    <h2 class="flex-grow-1">${name}</h2>
                    <div class="ms-2">
                        <button class="btn delete-btn p-2">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <a target="_blank" href="${link}">${link}</a>                
                <p>
                    ${desc}
                </p>
            </div>
        </article>
        `
    })
    cards_container.innerHTML = template;
})

// Supprime une carte de la database
function Delete_Card(event){
    const target = event.target
    const article = target.closest('article');
    if(article !== null && (target.classList.contains('fa-trash') || target.classList.contains('delete-btn') )){
        cardRef.doc(article.id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}

// Modification d'une carte de la database
// NON FONCTIONNEL
function Modify_Card(event){
    const target = event.target
    const article = target.closest('article');
    if(article !== null && (target.classList.contains('fa-pen-to-square') || target.classList.contains('modify-btn'))){
        const id = article.id;
        add_card_popin.style.zIndex = 1;
        const docRef = firebase.firestore().collection('links').doc(id);
        docRef.get()
            .then((truc) => {
                console.log(truc)
            })
    }
}

function Empty_Imput(array){
    for(let i = 0 ; i < array.length ; i++){
        let imputToEmpty = document.getElementById(array[i]);
        imputToEmpty.value = '';
    }
}