import { isNomValide, isCategorieValide, isPrixValide, isQuantiteValide } from './validation.js';

const formAjout = document.getElementById('form-ajout');

formAjout.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Préparer les données (les noms doivent être EXACTEMENT ceux du serveur)
    const data = {
        nom: document.getElementById('nom').value,
        categorie: document.getElementById('categorie').value,
        prix: parseFloat(document.getElementById('prix').value),
        quantite: parseFloat(document.getElementById('quantite').value),
    };

        let valide = true;

    if (isNomValide(data.nom)) {
        document.getElementById('erreur-nom').textContent = '';
    } else {
        document.getElementById('erreur-nom').textContent = 'Le nom est obligatoire.';
        valide = false;
    }

    if (isCategorieValide(data.categorie)) {
        document.getElementById('erreur-categorie').textContent = '';
    } else {
        document.getElementById('erreur-categorie').textContent = 'La catégorie est obligatoire.';
        valide = false;
    }

    if (isPrixValide(data.prix)) {
        document.getElementById('erreur-prix').textContent = '';
    } else {
        document.getElementById('erreur-prix').textContent = 'Le prix doit être un nombre supérieur ou égal à 0.';
        valide = false;
    }

    if (isQuantiteValide(data.quantite)) {
        document.getElementById('erreur-quantite').textContent = '';
    } else {
        document.getElementById('erreur-quantite').textContent = 'La quantité doit être un nombre entier supérieur ou égal à 0.';
        valide = false;
    }

    // Si un champ est invalide, on n'envoie rien au serveur
    if (!valide) {
        return;
    }

    const response = await fetch('/api/produit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const produit = await response.json();
        creerCarte(produit);
        formAjout.reset();
    }
});

const listeProduits = document.getElementById('liste-produits');

// Crée la carte d'un produit (même structure que dans home.handlebars)
function creerCarte(produit) {
    // <article class="carte" data-id="{{id_produit}}">
    const carte = document.createElement('article');
    carte.className = 'carte';
    carte.dataset.id = produit.id_produit;

    // <span class="badge">Prix régulier</span>
    // (un nouveau produit n'est jamais en promotion)
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Prix régulier';

    // <h3 class="carte__titre">{{nom}}</h3>
    const titre = document.createElement('h3');
    titre.className = 'carte__titre';
    titre.textContent = produit.nom;

    // <p class="carte__infos">{{categorie}} · Stock : {{quantite}}</p>
    const infos = document.createElement('p');
    infos.className = 'carte__infos';
    infos.textContent = `${produit.categorie} · Stock : ${produit.quantite}`;

    // <p class="prix">{{prix}} $</p>
    const prix = document.createElement('p');
    prix.className = 'prix';
    prix.textContent = `${produit.prix} $`;

    // <button class="btn btn--etat btn-promotion">Mettre en promo</button>
    const btnPromo = document.createElement('button');
    btnPromo.className = 'btn btn--etat btn-promotion';
    btnPromo.textContent = 'Mettre en promo';

    // <button class="btn btn--danger btn-supprimer">Supprimer</button>
    const btnSupprimer = document.createElement('button');
    btnSupprimer.className = 'btn btn--danger btn-supprimer';
    btnSupprimer.textContent = 'Supprimer';

    // <div class="carte__actions"> ... les 2 boutons ... </div>
    const actions = document.createElement('div');
    actions.className = 'carte__actions';
    actions.append(btnPromo, btnSupprimer);

    // Assembler la carte, puis l'ajouter à la fin de la liste
    carte.append(badge, titre, infos, prix, actions);
    listeProduits.append(carte);
}

listeProduits.addEventListener('click', async (event) => {
    // Trouver la carte qui contient l'élément cliqué
    const carte = event.target.closest('article');
    if (!carte) return;

    // Lire l'id du produit sur la carte
    const id = carte.dataset.id;

    //  clic sur le bouton Supprimer 
    if (event.target.classList.contains('btn-supprimer')) {
        const response = await fetch(`/api/produit/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Retirer la carte de la page
            carte.remove();
        }
    }

        // clic sur le bouton promotion 
    if (event.target.classList.contains('btn-promotion')) {
        const response = await fetch(`/api/produit/${id}`, {
            method: 'PATCH'
        });

        if (response.ok) {
            // Le serveur renvoie le produit modifié
            const produit = await response.json();

            const badge = carte.querySelector('.badge');
            const enPromo = produit.en_promotion === 1;

            // 1. La carte
            carte.classList.toggle('carte--promo', enPromo);

            // 2. Le badge
            badge.classList.toggle('badge--promo', enPromo);
            badge.textContent = enPromo ? '🔥 En promotion' : 'Prix régulier';

            // 3. Le bouton
            event.target.textContent = enPromo ? 'Retirer la promo' : 'Mettre en promo';
        }
    }
});