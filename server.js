// Chargement du fichier de configuration
import 'dotenv/config'

// Importations générales du projet
import express, { json } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression';
import { engine } from 'express-handlebars';
import { getAllProduits, addProduits, modifierPromotion, deleteProduit } from './model/produits.js';
import { nomValide, categorieValide, prixValide, quantiteValide, idValide } from './middlewares/validation.js';

// Création du serveur
const app = express(
);

// Initialisation des engins
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Ajout des middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(express.static('public'));

// Programmation des routes de rendu
app.get('/', async (request, response) => {
    const produits = await getAllProduits();
    response.status(200).render('home', {
        title: 'Inventaire Boutique',
        styles: ['/css/style.css'],
        scripts: ['/js/main.js'],
        produits: produits
    });
});

// Ajouter un produit
app.post('/api/produit',
    nomValide,
    categorieValide,
    prixValide,
    quantiteValide,
    async (request, response) => {
        const nom = request.body.nom;
        const categorie =request.body.categorie;
        const prix = request.body.prix;
        const quantite = request.body.quantite;

        const id_produit = await addProduits(nom, categorie, prix, quantite);

        response.status(201).json({
            id_produit,
            nom,
            categorie,
            prix,
            quantite,
            en_promotion: 0
        });
    });

// Modifier un produit (mettre / retirer en promotion)
app.patch('/api/produit/:id', idValide, async (request, response) => {
    // Lire l'id dans l'URL (ex : /api/produit/3 → 3)
    const id = Number(request.params.id);

    // Appeler la fonction du modèle avec cet id
    const produit = await modifierPromotion(id);

    if (!produit) {
        return response.status(404).end();
    }

    //Renvoyer le produit modifié
    response.status(200).json(produit);
});

// Supprimer un produit
app.delete('/api/produit/:id', idValide, async (request, response) => {
    // Lire l'id dans l'URL (ex : /api/produit/3 → 3)
    const id = Number(request.params.id);

    const Supprimer = await deleteProduit(id);

    if (Supprimer === 0) {
        return response.status(404).json({ erreur: 'Produit introuvable.' });
    }
    response.status(200).end();
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré:');
console.log('http://localhost:' + process.env.PORT);