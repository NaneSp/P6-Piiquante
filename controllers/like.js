/*création du controller LIke*/

//--> les différents états à obtenir :

/*  like vaut 1 (like = +1)
    like vaut -1 (dislike = +1)
    like vaut 0 (like/dislike = 0, pas de vote, pouce désactivé) */


//import du models Sauce de la bdd
const Sauce = require("../models/Sauce");

exports.evaluateSauce = (req, res, next) => {


/********************TESTS POSTMAN*******************/
//console.log("!!!!!!!!!!!!!!!!!test de controllers LIKE!!!!!!!!!!!"); //test de la route (ok)

//console.log(req.body); // = { userId: '6336a0826bf232ab8f3196af' }

//console.log(req.body.userId);// = 6336a0826bf232ab8f3196af

console.log("valeur du LIKE POSTMAN",req.body.like);//retourne like/dislike indiqué ds le body de la requete postman 

//console.log(req.params);//retourne l'id sans le _
//{ id: '6336a1276bf232ab8f3196b6' }

/*transforme l'id en _id*/
//console.log({_id : req.params.id});//{ id: '6336a1276bf232ab8f3196b6' }{ _id: '6336a1276bf232ab8f3196b6' }

/***************************************************/

//je vais chercher l'objet dans la bdd avec la méthode findOne
Sauce.findOne({_id : req.params.id})
    .then((sauce) =>{
        //utilisation de l'instruction switch afin de vérifier la valeur de l'objet
        switch (req.body.like) {
            //cas n°1 J'aime : 
            case 1 : //si le userId n'est pas inclus dans le tableau usersLikedet ET que dans la requête on envoie un like strictement égal 1 alors je vais ajouter son like avec +1 et le userId ds le tableau de usersLiked  
                if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                    //mise à jour de la bdd MongoDB avec ses opérateurs inc qui incrémente et push qui ajoute la valeur spécifiée 
                    Sauce.updateOne(
                        {_id:req.params.id},
                        {
                            $inc: {likes : 1},
                            $push: { usersLiked: req.body.userId},
                        }
                    )
                        .then(() => res.status(201).json({ message : "Vous aimez cette Sauce!! YOoouuuHhOOoUUu!!"}))
                        .catch((error) => res.status(400).json({error}));
                } //else {console.log("FALSE");}
                break;

            //cas n°2 J'aime pas :
            case -1: //si le userId n'est pas inclus dans le tableau usersDisliked ET que ds la requête on envoie un dislike strictement égale à -1 alors je vais ajouter un dislike avec +1 et le userId ds le tableau usersDisliked
                if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                    //mise à jour de la bdd MongoDB avec ses opérateurs
                    Sauce.updateOne(
                        {_id:req.params.id},
                        {
                            $inc: {dislikes: 1},
                            $push: {usersDisliked : req.body.userId},
                        }
                    )
                        .then(() => res.status(201).json({ message : "Vous n'aimez pas cette Sauce!! EUuuUUUrrrkkKKK !!"}))
                        .catch((error) => res.status(400).json({error}));
                }
                break;

            //cas n°3 Je n'aime plus et je ne dislike plus 
            case 0: //si le userId est présent ds le tableau usersLiked ou usersDisliked = le user a déjà liké ou disliké et le client veut modifier son vote 
            //traitement du like 
                if (sauce.usersLiked.includes(req.body.userId)){
                    //mise à jour de la bdd MongoDB avec ses opérateurs inc qui incrémente et pull qui supprime la valeur du tableau
                    Sauce.updateOne(
                        {_id:req.params.id},
                        {
                            $inc: {likes : -1},
                            $pull: {usersLiked : req.body.userId},
                        }
                    )
                    .then(() => res.status(201).json({ message : "Vous venez d'annuler votre vote"}))
                    .catch((error) => res.status(400).json({error}));
                }
                //traitement du dislike
                if (sauce.usersDisliked.includes(req.body.userId)){
                    //mise à jour de la bdd MongoDB avec ses opérateurs inc qui incrémente et pull qui supprime la valeur du tableau
                    Sauce.updateOne(
                        {_id:req.params.id},
                        {
                            $inc: {dislikes : -1},
                            $pull: {usersDisliked : req.body.userId},
                        }
                    )
                    .then(() => res.status(201).json({ message : "Vous venez d'annuler votre vote"}))
                    .catch((error) => res.status(400).json({error}));
                }
        }
    })
    .catch((error) => res.status(404).json({error}));
};
