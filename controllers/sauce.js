/*stockage de la logique métier*/

//import du modèle Sauce 
const Sauce = require ('../models/Sauce');

//import du package fs de Node file system, il donne accès aux fonctions qui ns permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers)
const fs = require ('fs');


/* Création de la route POST pour recevoir les infos du site vers le serveur*/   /*ECRITURE*/
//export du controllers créant les sauces  
exports.createSauce = (req, res) => {
    // on parse l'objet requête (qui va être envoyé en format jSOn mais sous forme de chaine de caractères)
	const sauceObject = JSON.parse(req.body.sauce);
    //ns supprimons deux champs (_id puisque généré par la bdd et _userId car ns ne voulons pas faire confiance au client on utilise le userId du token d'authentication car celui ci est valide avec certitude)
	delete sauceObject._id;
	delete sauceObject._userId;
    //création de l'objet  avec ce qui ns a été passé - les 2 champs delete 
	const sauce = new Sauce({
		...sauceObject,
        //et ns allons généré l'url de l'image on utilise la propriété de l'objet requete avec le protocol le nom d'hote et le nom du fichier donné précédemment par multer
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
	});
	sauce
    //on enregistre l'objet dans le bdd avec save  
		.save()
		.then(() => res.status(201).json({ message: "Votre sauce est créée !" }))
		.catch((error) => res.status(400).json({ error }));
};

/***************TEST POSTMAN CREATE 
 * create = route POST http://localhost:3000/api/sauces 
 * authorization
 * bearer Token : token créé au login 
 * puis
 * body
 * form-data 
key : sauce  Value : {
        "userId": "633ecbdb7397fb39ce0f1932",
        "name": "Carribe",
        "manufacturer": "Fa",
        "description": "feaze",
        "mainPepper": "fezarazr",
        "imageUrl": "https://ilmondodelbarbecue.kleecks-cdn.com/6544-pdt_540/traeger-sugar-lips-glaze-salse-e-rub.jpg",
        "heat": 10,
        "likes": 0,
        "dislikes": 0,
        "usersLiked": [],
        "usersDisliked": [],
        "__v": 0
    }
* résultat = {
    "message": "Votre sauce est créée !"
}
*et dans bdd mongoDb = dans sauces nouvelle sauce créé 
 ***************************************************/


/*création de la route PUT (pour modification d'un objet existant*/  /*MODIFICATION*/
//export du controllers pour modifier les sauces
exports.modifySauce = (req, res) =>{
    //on crée un objet SauceObject qui regarde si req.file existe ou non. s'il existe, on traite la nvelle image; s'il n'existe pas, on traite sumplement l'objet entrant. On crée ensuite une instance Sauce à partir de sauceObject, puis on effectue la modification  
        const sauceObject = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    //on supprime le champ userId envoyé par le client afin d'éviter de changer de propriétaire et nous avons vérifié que le requérant est bien le propriétaire de l'id  
        delete sauceObject._userId;
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                //si l'utilisateur n'est pas le créateur de la sauce il ne peut pas la modifier 
                if (sauce.userId != req.auth.userId) {
                    res.status(401).json({ message : 'Modification non autorisée !'});
                } else {
                    //SINON 
                    //utilisation de la méthode updateOne pour la mise à jour d'une sauce 
                    //1er argument objet de comparaison (celui dont l'id est = à l'id qui est envoyé ds les paramètres de requête) et le 2nd argument est la nouvelle version de l'objet (avec spread Opérator pour récupérer la sauce qui est dans le corps de la requête)on doit venir dire que l'id correspond à celui des paramètres (pour être sûr que c'est le même dans premier argument et 2nd) avec retour d'une promise succès ou erreur 
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    
    };

/***************TEST POSTMAN MODIFY 
 * modify = route PUT http://localhost:3000/api/sauces/id de la sauce à modifier 
 * authorization
 * bearer Token : token créé au login 
 * puis
 * body
 * form-data 
key : sauce  Value : {
        "userId": "633ecbdb7397fb39ce0f1932",
        "name": "Carribe",
        "manufacturer": "Fa",
        "description": "feaze",
        "mainPepper": "fezarazr",
        "imageUrl": "https://ilmondodelbarbecue.kleecks-cdn.com/6544-pdt_540/traeger-sugar-lips-glaze-salse-e-rub.jpg",
        "heat": 10,
        "likes": 0,
        "dislikes": 0,
        "usersLiked": [],
        "usersDisliked": [],
        "__v": 0
    }
* résultat = {
    "message": "Sauce modifiée!"
}
*et dans bdd mongoDb = dans sauces modif de la sauce sélectionnée
 ***************************************************/


/*création de la route DELETE (de suppression d'objet existant)*/  /*SUPPRESSION*/
//export du controllers pour supprimer une sauce     
exports.deleteSauce = (req, res, next) => {
    //on utilise l'id que ns recevons comme paramètre pour accéder à l'objet sauce correspondant ds la bdd
	Sauce.findOne({ _id: req.params.id })
	.then(sauce => {
		if (sauce.userId != req.auth.userId) {
			res.status(401).json({ message: "Non autorisé!" });
		} else {
        //on  utilise le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier 
            const filename = sauce.imageUrl.split('/images/')[1];
        //on utilise la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé 
			fs.unlink(`images/${filename}`, () => {
            //ds le callback ns implémentons la logique d'orignie en supprimant l'objet sauce de la bdd 
				Sauce.deleteOne({ _id: req.params.id })
				.then(() => res.status(200).json({ message: "Votre sauce est bien supprimée !" }))
				.catch((error) => res.status(401).json({ error }));
			})
		}
	})
	.catch((error) => res.status(500).json({ error }));
};

/***************TEST POSTMAN DELETE 
 * delete = route DELETE http://localhost:3000/api/sauces/id de la sauce à supprimer 
 * authorization
 * bearer Token : token créé au login 

* résultat = {
    "message": "Votre sauce est bien supprimée !"
}
*et dans bdd mongoDb = dans sauces msuppression de la sauce sélectionnée
 ***************************************************/



/*création des  routes GET*/ /*LECTURE*/
//on veut trouver un seul objet dans la bdd par son identifiant 
//premier segment dynamique (" : " dit a express que cette partie est dynamique avce un accès avec l'objet req.params)le FE va envoyer l'id de l'objet et pour pouvoir aller chercher celui-ci on utilise cette méthode
//export du controllerts qui récupère UNE seule sauce 
exports.getOneSauce = (req, res, next) => {
    //modèle mongoose méthode findOne (pour en trouver 1 seul on y passe l'objet de comparaison on veut que l'id de l'objet en vente soit le même que le paramètre de requête ) qui renverra une promise en réponse 200 succès de la requête avec le thing dedans sinon erreur 404 objet non trouvé

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error}));
};

/***************TEST POSTMAN getOneSauce 
 * getOneSauce = route GET http://localhost:3000/api/sauces/id de la sauce sélectionnée 
 * authorization
 * bearer Token : token créé au login 
 * puis

* résultat = retourne la sauce sélectionnée{
    "_id": "633ed5f87397fb39ce0f193e",
    "userId": "633ecbdb7397fb39ce0f1932",
    "name": "Carribe",
    "manufacturer": "Fa",
    "description": "feaze",
    "mainPepper": "fezarazr",
    "imageUrl": "http://localhost:3000/images/traeger-sugar-lips-glaze-salse-e-rub.jpeg1665062823272.jpg",
    "heat": 10,
    "likes": 0,
    "dislikes": 0,
    "usersLiked": [],
    "usersDisliked": [],
    "__v": 0
}

 ***************************************************/

//export du controllers qui récupère TOUTES les sauces
exports.getAllSauce = (req, res, next) => {
//on utilise la méthode find pour récupérer la liste complète qui nous retourne une promise (on récupère le tableau de toutes les sauces retourné par la bdd et on renverra en réponse code 200 succès de la requête le tableau des sauces reçu depuis la bdd ou un catch erreur
    Sauce.find()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};    

/***************TEST POSTMAN getAllSauce 
 * getAllSauce = route GET http://localhost:3000/api/sauces 
 * authorization
 * bearer Token : token créé au login 
 * puis

* résultat = retourne toutes les sauces présentes sur le site{
        "_id": "633ecf8e7397fb39ce0f1939",
        "userId": "633ecbdb7397fb39ce0f1932",
        "name": "Carribean Curry",
        "manufacturer": "Fat Cat",
        "description": "eaze",
        "mainPepper": "ezarazr",
        "imageUrl": "http://localhost:3000/images/71jXy1NAnTL._SX425_.jpg1665060750811.jpg",
        "heat": 4,
        "likes": 0,
        "dislikes": 0,
        "usersLiked": [],
        "usersDisliked": [],
        "__v": 0
    },
    {
        "_id": "633ed5f87397fb39ce0f193e",
        "userId": "633ecbdb7397fb39ce0f1932",
        "name": "Carribe",
        "manufacturer": "Fa",
        "description": "feaze",
        "mainPepper": "fezarazr",
        "imageUrl": "http://localhost:3000/images/traeger-sugar-lips-glaze-salse-e-rub.jpeg1665062823272.jpg",
        "heat": 10,
        "likes": 0,
        "dislikes": 0,
        "usersLiked": [],
        "usersDisliked": [],
        "__v": 0
    }

 ***************************************************/