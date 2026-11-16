import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { existsSync } from 'node:fs';

// Vérifie si le fichier de base de données est 
// nouveau (n'existe pas encore)
const IS_NEW = !existsSync(process.env.DB_FILE);

// Connexion à la base de données. Vous devez 
// spécifier le nom du fichier de base de données 
// dans le fichier .env
let db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Création de la table si elle n'existe pas, on 
// peut écrire du code SQL pour initialiser les 
// tables et données dans la fonction exec()
if(IS_NEW) {
    await db.exec(`
        PRAGMA foreign_keys = ON;
         CREATE TABLE produit (
            id_produit INTEGER PRIMARY KEY,
            nom TEXT NOT NULL,
            categorie TEXT NOT NULL,
            prix REAL NOT NULL,
            quantite INTEGER NOT NULL,
            en_promotion INTEGER NOT NULL
        );

        INSERT INTO produit (nom, categorie, prix, quantite, en_promotion) VALUES
            ('Carnet de notes', 'Papeterie', 5.99, 12, 0),
            ('Tasse', 'Cuisine', 12.50, 30, 0),
            ('Chandail', 'Vêtements', 15.25, 0, 0),
            ('T-shirt', 'Vêtements', 9.25, 12, 0),
            ('Sac a dos', 'Accessoires', 45.25, 24, 1);

    `);
}

export { db }