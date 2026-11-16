import { db } from '../db/db.js';

export async function getAllProduits() {
    const produits = await db.all(
        `SELECT * FROM produit`
    );

    return produits;
}

export async function addProduits(nom, categorie, prix, quantite) {
    // Crée un nouveau produit
    const resultat = await db.run(
        `INSERT INTO produit (nom, categorie, prix, quantite, en_promotion) 
        VALUES (?, ?, ?, ?,0 );`,
        [nom, categorie, prix, quantite]
    );

    // Retourne l'id du nouveau produit
    return resultat.lastID;
}

//Inverse l'état en_promotion d'un produit (0 -> 1, 1 -> 0).

export async function modifierPromotion(id) {
    const resultat = await db.run(
        `UPDATE produit
         SET en_promotion = 1 - en_promotion
         WHERE id_produit = ?`,
        [id]
    );
    // Retourne le produit modifié, ou undefined s'il n'existe pas.
    if (resultat.changes === 0) {
        return undefined;
    }

    const produit = await db.get(
        `SELECT id_produit, nom, categorie, prix, quantite, en_promotion
         FROM produit
         WHERE id_produit = ?`,
        [id]
    );
    return produit;
}

export async function deleteProduit(id_produit) {
    // Supprime un element
    const resultat = await db.run(
        `DELETE FROM produit 
       WHERE id_produit = ?`,
        [id_produit]
    );
    // Retourne le nombre de lignes affectées
    return resultat.changes;
}

