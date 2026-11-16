/**
 //Valide un nom de produit.
 * @param {string} nom Le nom à valider.
 * @returns Une valeur indiquant si le nom est valide ou non.
 */
export const isNomValide = (nom) =>
    typeof nom === 'string' &&
    nom.trim() !== '';

/**
 * Valide une catégorie de produit.
 * @param {string} categorie La catégorie à valider.
 * @returns Une valeur indiquant si la catégorie est valide ou non.
 */
export const isCategorieValide = (categorie) =>
    typeof categorie === 'string' &&
    categorie.trim() !== '';

/**
 * Valide un prix.
 * @param {number} prix Le prix à valider.
 * @returns Une valeur indiquant si le prix est valide ou non.
 */
export const isPrixValide = (prix) =>
    typeof prix === 'number' &&
    prix >= 0;

/**
 * Valide une quantité.
 * @param {number} quantite La quantité à valider.
 * @returns Une valeur indiquant si la quantité est valide ou non.
 */
export const isQuantiteValide = (quantite) =>
    typeof quantite === 'number' &&
    Number.isInteger(quantite) &&
    quantite >= 0;

    /**
 * Valide un identifiant de produit.
 * @param {number} id L'identifiant à valider.
 * @returns Une valeur indiquant si l'identifiant est valide ou non.
 */
export const isIdValide = (id) =>
    typeof id === 'number' &&
    Number.isInteger(id) &&
    id > 0;