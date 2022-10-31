//import d'express
const express = require("express");

//création d'un routeur avec la méthode d'express Router
const router = express.Router();

//import du controlleur sauce  
const sauceCtrl = require("../controllers/sauce");

//import du middleware d'authentification
const auth = require("../middleware/auth");

//import de mutler
const multer = require("../middleware/multer-config");

//import du controller like
const likeCtrl = require("../controllers/like");



//mise en place des routeurs pour chaque type de route avec ajout du middleware d'authentification
router.post('/', auth, multer, sauceCtrl.createSauce);

router.post('/:id/like', auth, likeCtrl.evaluateSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.get('/', auth, sauceCtrl.getAllSauce);


//export du routeur
module.exports = router;