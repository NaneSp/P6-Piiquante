/***************création du Routeur et import de celui-ci dans l'application*******************/

//import d'express
const express = require('express');
//création d'un routeur avec fonction routeur d'express
const router = express.Router();

//pr associer les fonctions au différentes routes création d'un controleur
const userCtrl = require('../controllers/user');

//import du middleware de contôle de password 
const passwordValidator = require("../middleware/password");

//création de deux routes POST(car le Front end enverra aussi des infos l'email et le mdp)
router.post('/signup', passwordValidator, userCtrl.signup);

router.post('/login', userCtrl.login);


//exportation du routeur
module.exports = router;