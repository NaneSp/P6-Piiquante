const jwt = require('jsonwebtoken');


//export de la fonction middleware (qui permettra d'extraire les info contenues ds le token pr voir si il est valide et va le transmettre aux autres middlewares ou aux autres gestionnaires de routes)
module.exports = (req, res, next) => {
    
    //il faut récupérer le token mais il peut y avoir des erreurs donc utilisation de try/catch
    try{
        //récupération du header et le spliter (diviser la chaine de caractères en un tableau autour de l'espace qui se trouve entre notre mot clé "Bearer" et le token, et c'est bien le token qui est en 2eme que ns voulons récupérer )
        const token = req.headers.authorization.split(' ')[1];
        //décodage du token avec méthode vérify de jwt (en cas d'erreur pr décoder le token on se trouvera ds le catch)
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        //on récupère le userId en particulier
        const userId = decodedToken.userId;
        //console.log(token, decodedToken, userId);
        //on rajoute cette valeur à l'objet requête qui lui est transmis aux routes qui seront appelées par la suite
        req.auth = {
            userId 
        };
        
    }
    catch(error){
        res.status(401).json({ message : "Erreur d'authentification !"});
    }
    //utilisation de next pour permettre au middleware de poursuivre ses actions sinon erreur 
    next();
};