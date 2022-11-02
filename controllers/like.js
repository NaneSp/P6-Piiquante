/*création du controller LIke*/

//--> les différents états à obtenir :

/*  like vaut 1 (like = +1)
    like vaut -1 (dislike = +1)
    like vaut 0 (like/dislike = 0, pas de vote, pouce désactivé) */

//import du models Sauce de la bdd
const Sauce = require("../models/Sauce");

exports.evaluateSauce = (req, res, next) => {
	//je vais chercher l'objet dans la bdd avec la méthode findOne
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			//utilisation de l'instruction switch afin de vérifier la valeur de l'objet
			switch (req.body.like) {
				//cas n°1 J'aime :
				case 1: 
					if (req.body.like === 1) {
						if (
							sauce.usersLiked.includes(req.body.userId) ||
							sauce.usersDisliked.includes(req.body.userId)
						) {
							if (sauce.usersLiked.includes(req.body.userId)) {
								Sauce.updateOne(
									{ _id: req.params.id },
									{
										$inc: { likes: 0 },
									}
								)
									.then(() =>
										res.status(201).json({
											message: "vous avez déjà liké ! Vote nul !",
										})
									)
									.catch((error) => res.status(400).json({ error }));
							}
							if (sauce.usersDisliked.includes(req.body.userId)) {
								Sauce.updateOne(
									{ _id: req.params.id },
									{
										$inc: { dislikes: -1 },
										$pull: { usersDisliked: req.body.userId },
									}
								)
									.then(() =>
										res.status(201).json({
											message: "vous aviez disliké ! Vote remis à 0 !",
										})
									)
									.catch((error) => res.status(400).json({ error }));
							}
						} else {
							Sauce.updateOne(
								{ _id: req.params.id },
								{
									$inc: { likes: 1 },
									$push: { usersLiked: req.body.userId },
								}
							)
								.then(() =>
									res.status(201).json({
										message: "Vous aimez cette Sauce!! YOoouuuHhOOoUUu!!",
									})
								)
								.catch((error) => res.status(400).json({ error }));
						}
					}
					break;

				//cas n°2 Je n'aime pas :
				case -1: 
					if (req.body.like === -1) {
						if (
							sauce.usersLiked.includes(req.body.userId) ||
							sauce.usersDisliked.includes(req.body.userId)
						) {
							if (sauce.usersLiked.includes(req.body.userId)) {
								Sauce.updateOne(
									{ _id: req.params.id },
									{
										$inc: { likes: -1 },
										$pull: { usersLiked: req.body.userId },
									}
								)
									.then(() =>
										res.status(201).json({
											message:
												"vous aviez déjà liké ! Vote remis à 0 !",
										})
									)
									.catch((error) => res.status(400).json({ error }));
							}
							if (sauce.usersDisliked.includes(req.body.userId)) {
								Sauce.updateOne(
									{ _id: req.params.id },
									{
										$inc: { dislikes: 0 },
									}
								)
									.then(() =>
										res.status(201).json({
											message: "vous avez déjà disliké ! Vote nul !",
										})
									)
									.catch((error) => res.status(400).json({ error }));
							}
						} else {
							Sauce.updateOne(
								{ _id: req.params.id },
								{
									$inc: { dislikes: 1 },
									$push: { usersDisliked: req.body.userId },
								}
							)
								.then(() =>
									res.status(201).json({
										message:
											"Vous n'aimez pas cette Sauce!! EUuuUUUrrrkkKKK !!",
									})
								)
								.catch((error) => res.status(400).json({ error }));
						}
					}
					break;

				//cas n°3 Je n'aime plus et je ne dislike plus
				case 0: 
					//traitement du like
					if (sauce.usersLiked.includes(req.body.userId)) {
						
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { likes: -1 },
								$pull: { usersLiked: req.body.userId },
							}
						)
							.then(() =>
								res
									.status(201)
									.json({ message: "Vous venez d'annuler votre vote" })
							)
							.catch((error) => res.status(400).json({ error }));
					}
					//traitement du dislike
					if (sauce.usersDisliked.includes(req.body.userId)) {
						
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { dislikes: -1 },
								$pull: { usersDisliked: req.body.userId },
							}
						)
							.then(() =>
								res
									.status(201)
									.json({ message: "Vous venez d'annuler votre vote" })
							)
							.catch((error) => res.status(400).json({ error }));
					}
			}
		})
		.catch((error) => res.status(404).json({ error }));
};
