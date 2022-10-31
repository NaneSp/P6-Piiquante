/***********Création d'1 application Express************/

/*****packages utiles pour l'application*****/

//import framework (ensemble d'outils et de composants logiciel à la base d'1 logiciel ou d'1 application )express 
const express = require("express");

//import package de sécurité express rate limit permettant de limiter la demande de l'utilisateur (empêchant que la même adresse ip fasse trop de requetes ce qui aidera à prévenir les attaques comme la force brutes = bruteforce attack qui consiste à tester, l'une après l'autre, chaque combinaison possible d'un mot de passe ou d'une clé pour un identifiant donné afin de se connecter au service ciblé)
const expressRateLimit = require ("express-rate-limit");


/***gestion des erreurs CORS (cross origin ressouce sharing) = système de sécurité qui par défaut bloque les appels http entre des serveurs différents ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles. Dans notre cas nous avons deux origines : localhost:3000 et localhost:4200, et nous souhaiterions qu'elles puissent communiquer entre elles.Pour cela nous devons ajouter des headers à notre objet response***/  
const cors = require("cors");

//import du module node mongoose qui utilise des schémas pr modéliser les données. Il permet de définir des variables et de structurer les données (un peu comme si on définissait des tableaux en SQL)
const mongoose = require("mongoose");

//import de morgan (middleware au niveau des requêtes http, utile pour le débogage )
const morgan = require("morgan");

//import package dotenv pour les variables d'environnement 
const dotenv = require("dotenv");
dotenv.config();

//import pour accéder au path de notre serveur(gestion des chemins de stockage) 
const path = require("path");

//création d'un schema de limiteur de connexion 
const expressRL = expressRateLimit ({
    windowMs : 10 * 60 * 1000, //oblige a attendre 10min entre chaque demande
    max : 10, // limite chaque IP à 10 requêtes/connexion par fenêtre toutes les 15min
    standardHeaders : true, // retourne les infos de limite de débit ds les en-têtes RateLimit
    legacyHeaders : false, // désactive les en-têtes x ratelimit
});



/**** import des diverses routes****/
const sauceRoute = require ("./routes/sauce");
const userRoute = require("./routes/user");

//création de constante app en appelant méthode express
const app = express();




//nous voulons accéder au corps de la requête avec ce middleware mis à disposition avec le framework express qui intercepte TOUTES (get post put etc...) les requêtes (content-type) qui contiennent du json et nous met à disposition le coprs de la requête sur l'objet requête dans req.body  (on peut encore voir bodyParser qui est la même chose const bodyParser = require('body-parser');)
app.use(express.json());

//logger des requêtes  
app.use(morgan("dev"));

//utilisation de CORS 
app.use(cors());

// permet de connecter l'api à la bdd mongoDB NoSQL( util pour des application qui ont besoin d'évoluer rapidement)
mongoose.connect (process.env.DB_SRV,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Vous êtes connecté à MongoDB!!");
})
.catch((err) => {
    console.log("La connexion à MongoDB a échoué!!");
})



//enregistrement du routeur pour toutes les demandes effectuées vers /api/sauce
app.use("/api/sauces", sauceRoute);
//afin d'enregistrer les routes : racine de toutes les routes liées à l'authentification
app.use("/api/auth", userRoute);

//ajout d'une route pour image 
//on indique à Express qu'il faut gérer la ressource image de manière statique (un sous répertoire de notre répertoire de base, __dirname)à chaque fois qu'elle reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));


//export de l'application afin de pouvoir l'utiliser dans d'autres parties
module.exports = app;
