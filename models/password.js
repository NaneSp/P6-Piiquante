//import package de sécurité  password validator permettant de valider un mot de passe 
const passwordValidator = require ("password-validator");


//création d'un modèle que doit respecter le mot de passe
const  passwordModel = new passwordValidator();

//ajout des propriétés à valider
passwordModel 
.is()
.min(8)                                         // Longueur minimale 8 caractères
.is().max(40)                                  // Longueur max 50 caractères
.has().uppercase()                              // Doit contenir 1 lettre majuscule
.has().lowercase()                              // Doit contenir des lettres minuscules
.has().digits(2)                                // Doit contenir au moins 2 chiffres
.has().not().spaces()                           // Ne doit pas contenir d'espace 
.is().not().oneOf(['Passw0rd', 'Password123']); // Liste noire de password (ne doit pas être passw0rd ou password123 car trop commun)

//console.log(schemaPwd);//retourne bien la structure défini ds le schema
module.exports = passwordModel;