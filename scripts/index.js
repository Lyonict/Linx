

const add_card_btn = document.getElementById("add-btn");
const add_card_popin = document.getElementById("pop-in");
add_card_btn.addEventListener("click", () => {
    add_card_popin.style.zIndex = 1;
});
    
// Appuis du bouton "ajouter un carte" 
const submit_card_btn = document.getElementById("submit-card-btn");
submit_card_btn.addEventListener("click", (event) =>{
    event.preventDefault();
    const title = document.getElementById("add-title");
    const link = document.getElementById("add-link");
    const desc = document.getElementById("add-desc");
    AddCardTo_Base(title, link, desc);
    title.value = "";
    link.value = "";
    desc.value = "";
    add_card_popin.style.zIndex = -1;
})

// FIRESTORE SECTION

import config from '../config.js';

// Initialisation de Firebase
firebase.initializeApp(config);

// Ajoute les infos de la nouvelle carte à la base de donnée
function AddCardTo_Base (title, link, desc) {
    firebase.firestore().collection('links').add({
        name : title.value,
        link : link.value,
        desc : desc.value
    }).then(() => {location.reload()})
}

// Génération des cartes
const cardRef = firebase.firestore().collection('links');

cardRef.get().then((querySnapshot) => {
    querySnapshot.forEach(doc => {
        let cardTarget = document.getElementById("cards-container");
        let linkCard = document.createElement('article');
        linkCard.setAttribute('id', doc.id);
        linkCard.classList.add("col-lg-4", "col-md-6", "col-sm-12", "p-3");
        linkCard.innerHTML = 
        `
        <div class="card h-100 p-3">
            <div class="d-flex">
                <h2 class="flex-grow-1">${doc.data().name}</h2>
                <div class="ms-2">
                    <button class="btn p-2">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn p-2">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <a href="${doc.data().link}">${doc.data().link}</a>
            <p>
                ${doc.data().desc}
            </p>
        </div>
        `
        cardTarget.appendChild(linkCard);
    });
});

// Supprime une carte de la database
const cards_container = document.getElementById("cards-container");

cards_container.addEventListener('click', (event) =>{
    const target = event.target
    const article = target.closest('article');
    if(article !== null && target.classList.contains('fa-trash')){
        cardRef.doc(article.id).delete().then(() => {
            console.log("Document successfully deleted!");
            location.reload();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
})