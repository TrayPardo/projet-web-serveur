import { isNomValide, isCategorieValide, isPrixValide, isQuantiteValide, isIdValide } from '../public/js/validation.js';

export function nomValide(request, response, next) {
    if(isNomValide(request.body.nom)) {
        return next();
    }

    response.status(400).end();
}

export function categorieValide(request, response, next) {
    if(isCategorieValide(request.body.categorie)) {
        return next();
    }

    response.status(400).end();
}

export function prixValide(request, response, next) {
    if(isPrixValide(request.body.prix)) {
        return next();
    }

    response.status(400).end();
}

export function quantiteValide(request, response, next) {
    if(isQuantiteValide(request.body.quantite)) {
        return next();
    }

    response.status(400).end();
}

export function idValide(request, response, next) {
    if(isIdValide(Number(request.params.id))) {
        return next();
    }

    response.status(400).end();
}