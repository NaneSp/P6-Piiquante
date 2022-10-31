//import de mongoose pour créer le schéma de données 
const mongoose = require('mongoose');


//création du schéma de données en utilisant la fonction schéma du package mongoose auquel on va passer un objet qui va dicter les différents champs nécessaires au schéma (cf voir app.js)
const sauceSchema = mongoose.Schema({
	    //_id généré automatiquement par mongoDB
    //clé(nom du champ)+ création de l'objet avec son type + champs requis (sans ce champs on ne pourra pas enregistrer le schéma dans la bdd)
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true }, 
	heat: { type: Number, required: true },
	likes: { type: Number, default: 0 },//par défaut la valeur est à 0 (personne n'a voté pour la sauce)
	dislikes: { type: Number, default: 0 },
	usersLiked: { type: [String] },//création d'un tableau utilisateurs qui ont aimé (qui laissera une trace dans la bdd l'utiliateur qui a aimé en se reconnectant pourra voir qu'il a aimé )
	usersDisliked: { type: [String] }//création d'un tableau utilisateurs qui n'ont pas aimé
});

//export du schéma afin de l'exploiter (lire/enregistré) ds la bdd
//méthode modèle avec en 1er argument le nom du modèle et le 2nd le schéma que ns venons de créer
module.exports = mongoose.model("Sauce", sauceSchema);