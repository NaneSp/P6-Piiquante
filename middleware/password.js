//import du modele password
const passwordModel = require("../models/password");

//mise en place du middleware de vérification de la force du mot de passe 
module.exports = (req, res, next) =>{
    //Si le mot de passe est faux avec méthode validate 
    if(!passwordModel.validate(req.body.password)){
        res.status(400).json({ error : `Le mot de passe n'est pas assez robuste, voilà ce qui ne va pas : ${passwordModel.validate('req.body.password', {list :true})}`})
    }
    //Sinon si c'est ok
    else{
        next();
    }
};


/***************TEST POSTMAN SIGNUP
 * signup = route POST http://localhost:3000/api/auth/signup 
 * body
 * raw
 * json
 * {
 * "email":"unemail@gmail.com",
 * "password":"unpassword"
 * }
 * 
************ résultat = SI ko (mot de passe ne correspond pas au model demandé dans models/password ----->

// Longueur minimale 8 caractères
// Longueur max 50 caractères
// Doit contenir 1 lettre majuscule
// Doit contenir des lettres minuscules
// Doit contenir au moins 2 chiffres
// Ne doit pas contenir d'espace 
// Liste noire de password (ne doit pas être passw0rd ou password123 car trop commun))
exemple : 
{
    "email":"test1@gmail.com",
    "password":"charlie"
}
{
    "error": "Le mot de passe n'est pas assez robuste, voilà ce qui ne va pas : uppercase,digits"
}


*et dans bdd mongoDb = dans users pas de nouvel utilisateur créé 

*************résultat = Si OK (mdp correspond au model souhaité)

{
    "email":"test1@gmail.com",
    "password":"Charlie76"
}

dans postman :
{
    "message": "La création de l'utilisateur est réussie !! "
}
dans mongoDB = création d'un user avec email et mdp crypté


 ***************************************************/