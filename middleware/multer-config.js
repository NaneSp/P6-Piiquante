/*création du "middleware" action de multer dans le cors de la requête*/ 

//pour faciliter la gestion de fichiers envoyés avec des requêtes http vers notre API on utilise le package multer 
const multer = require("multer");

//préparation de l'objet dictionnaire Mime_types de types de fichiers 
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

//on crée un objet de configuration pour multer, on utilise la fonction diskStorage pr dire qu'on va l'enregistrer sur le disk avec deux éléments la destination ( = fonction qui explique ds quel dossier enregistrer les fichiers) + filename (= fonction qui explique comment s'appelle le fichier)   
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        //null = il n'y a pas eu d'erreur  + nom du dossier
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        // on génére le nom du fichier (avant l'extension) en signalant le nom du fichier d'origine et on élimine les espaces dans les noms en les remplaçants par les _ 
        const name = file.originalname.split(" ").join("_");
        //on applique une extension au fichier, on va utiliser les mimetype (cf ci-dessus)
        const extention = MIME_TYPES[file.mimetype];
        //on appelle le callback avec null pour dire qu'il n'y a pas d'erreur, on crée le filename entier avec le name du dessus +  un timestamp (compteur de temps)avec date.now (pour le rendre unique ce fichier) on ajoute un . et l'extension 
        callback(null, name + Date.now() + "." + extention);
    },
});

//export du middleware multer avec l'objet storage avec méthode single en expliquant à multer qu'il s'agit de fichiers images seulement
module.exports = multer({ storage }).single("image");