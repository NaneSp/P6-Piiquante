//import du model user (on va enregistrer et lire des users ds ses middleware)
const User = require("../models/User");

//import du package d'authentification jsonwebtoken (les tokens permettent aux utilisateurs de se connecter une seule fois à leur compte. Au moment de se connecter, ils recevront leur token et le renverront automatiquement à haque requête par la suite. Ceci permettra au BE de vérifier que la requête est authentifiée)
const jwt = require("jsonwebtoken");

//cryptage de l'email pour éviter le piratage de l'email sur la bdd (pour le RGPD règlement général sur la protection des données)
const cryptoJs = require ("crypto-js");
//console.log(cryptoJs);//retourne les infos sur package

//import du package de chiffrement/ cryptage  bcrypt
const bcrypt = require("bcrypt");

//import du package dotenv pour les variables d'environnement
const dotenv = require("dotenv");
dotenv.config();


//fonction signup pr enregistrement de nveaux utilisateurs
//fonction asynchrone (qui prend du temps)qui va hasher le mot de passe et avec le hash créé par bcrypt on enregistrera le user dans la base de donnée
exports.signup = (req, res, next) => {
//cryptage de l'email avant envoi ds la bdd
const emailCryptoJs = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTO_MAIL}`).toString();
console.log(emailCryptoJs);


//on appelle la fonction pr hasher le mdp on lui passe le mdp du corps de la requete qui sera passé par le FE, on demande à l'algorythme de faire 10 tours (cela suffit pr créer un mdp sécurisé + long +sécurisé)
    bcrypt.hash(req.body.password, 10)
//on récupére le hash du mdp qu'on va ensuite enregistrer dans un nveau user qu'on enregistrera dans la basse de donnée 
    .then(hash => {
        //on crée le nvel utilisateur avec le modèle mongoose 
        const user = new User({
        //en email on utilise le mail fourni ds le corps de la requête
        email: emailCryptoJs,
        password: hash
        });
        //on utilise la méthode save pr enregistrer dans la bdd
        user.save()
            //la promise renverra si réussite message 201 "succès de la requête et création d'un document"
            .then(() => res.status(201).json({ message: "La création de l'utilisateur est réussie !! "}))
            //on capte l'erreur 400 "demande erronée" on envoie l'erreur ds un objet json
            .catch((error) => res.status(400).json({ error }));
    })
    //on capte l'erreur serveur 500 on envoie l'erreur ds un objet json
    .catch(error => res.status(500).json({ error }));
};
/***************TEST POSTMAN SIGNUP 
cf doc middleware/password.js
 ***************************************************/




//fonction login  de connexion qui permet de vérifier si l'utilisateur existe dans notre bdd et si le mdp correspond à cet utilisateur
exports.login = (req, res, next) => {
//cryptage de l'email avant envoi ds la bdd
const emailCryptoJs = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTO_MAIL}`).toString();
console.log(emailCryptoJs);


    //on utilise la méthode findOne de notre class User et ns lui passons un objet qui va servir de filtre /sélecteur avec un champ email et la valeur qui ns a été transmise par le client
    User.findOne({ email : emailCryptoJs})
         //si la requête se passe bien, on récupère l'enregistrement dans la bdd et vérifier si l'utilisateur a bien été trouvé puis si il est bien trouvé vérifié que le mdp saisi est ok
        .then(user => {
            //si la valeur trouvée par la requête est nulle, (l'utilisateur = inconnu dans la bdd)
            if (user === null) {
            res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte'});
            }
             //sinon l'utilisateur est connu dans la bdd on comparera le mdp de la bdd avec le mdp tapé, on utilise méthode compare de bcrypt qui compare un string à un hash 
            else{
            //on compare ce que l'utilisateur vient de taper à ce que nous avons dans la bdd
            bcrypt
                .compare(req.body.password, user.password)
                //cela retourne une promesse si ok
                .then( valid => {
                    //si la valeur n'est pas vraie (= erreur d'authentification)
                    if(!valid){
                    res.status(401).json({ message : 'Paire indentifiant/mot de passe incorrecte'})
                    }
                    //sinon si le mdp est correcte
                    else{
                    //retourne un code 200 (succès de la requête)avec un objet contenant les infos nécessaires à l'authentifaction des requêtes émises par la suite par le client cad le user id et le token (système plus sécurisé ) 
                    res.status(200).json({
                        
                        userId : user._id,
                        //fonction sign de jwt qui prendra des arguments (1er données qu'on veut encoder = payload)
                        token: jwt.sign(
                            //objet avec userID  = identifiant utilisateur du user comme ça on est sûre que cette requête correspond bien à ce userID
                            { userId : user._id },
                            //second argument clé secrète pour l'encodage( en prod chaine de caractère plus longue et aléatoire pr  + de sécurité)
                            process.env.JWT_KEY,
                            //troisième argument de configuation pr un délai d'expiration du token
                            { expiresIn : process.env.JWT_EXPIRATION_KEY}
                        )
                    });
                }
            })
            //ou une erreur de server
            .catch(error => res.status(500).json({error}));
        }
    })
    //on capte l'erreur serveur 500 on envoie l'erreur ds un objet json
    .catch(error => res.status(500).json({error}));
};

/***************TEST POSTMAN LOGIN 
cf doc middleware/password.js
 ***************************************************/