/*********création du serveur Node (un programme qui va écouter/attendre des requetes http et qui va y répondre)**********/


//import le package http de node (node utilise le système du module CommonJS, donc pour importer le contenu d'un module JS on utilise le mot clé 'require', il nous permet d'importer les modules de base de Node sans spécifier le chemin exact du fichier.Node sait qu'il doit imporer un module de base quand on ne spécifie pas un chemin relatif. Et require ns permet aussi d'omettre l'extension .js)
const http = require('http');
//import de notre application (import du app.js qui est ds le même dossier)
const app = require('./app');

//import de dotenv pour utiliser les variables d'environnement (protection des données sensibles)
const dotenv = require("dotenv");
dotenv.config();//j'utilise dotenv sans config particulière  


//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'un chaîne
const normalizePort = val => {
    // exécute parseInt, qui convertit essentiellement la valeur en entier, si possible 
    const port = parseInt(val, 10);

    if (isNaN(port)) {
    //vérifie si la valeur n'est pas un nombre
    return val;
    }
    if (port >= 0) {
    //vérifie si c'est une valeur de port valide    
        return port;
    }
    return false;
};
//création d'une constante reprenant la variable d'environnement à utiliser plus tard
const port = normalizePort(process.env.PORT);
//on dit à l'application express sur quel port elle va fonctionner
//méthode app.set (on set le port)sur l'environnement sur lequel tourne notre server ( = variable d'environnement)SINON par défaut utilise le port 3000
app.set('port', process.env.PORT);

//la fonction errorhandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
    throw error;
    }
    const address = server.address();
    //est-ce que l'adresse est de type string? si oui alors on écrit pipe + adress SINON on écrit port+port
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
    //EACCES(Autorisation refusée) : une tentative d'accès à un fichier d'une manière interdite par ses autorisations d'accès au fichier a été effectuée.    
    case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
    //EADDRINUSE(Adresse déjà utilisée) : Une tentative de liaison d'un serveur ( net, http, ou https) à une adresse locale a échoué car un autre serveur sur le système local occupait déjà cette adresse.       
    case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
    default:
        throw error;
    }
        //Donc on écoute le bon port, on affiche un message dans la console si tout s'est bien passé, et si il y a une erreur, on gère l'erreur en affichant un message spécifique ds la console
};

//création d'une constante avec méthode createServer à qui l'on va passer notre application (l'appli crée par express (app.js) est une f° qui va recevoir la req et la réponse et qui va les modifier)
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('On écoute le ' + bind);
});


//un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.listen(port);