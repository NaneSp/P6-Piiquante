*P6_Piiquante*

# Construisez une API sécurisée pour une application d'avis gastronomiques 

![16275605596354_PiiquanteLogo](https://user-images.githubusercontent.com/102465985/194336198-a9167c40-7a8f-4ecb-b5a3-e17174c6f2e5.png)


*Les sauces piquantes sont de plus en plus populaires, en grande partie grâce à la série YouTube « Hot Ones ». C'est pourquoi ce nouveau client, la marque de condiments à base de piment Piquante, veut développer une application web de critique des sauces piquantes appelée « Hot Takes ».*





## INSTALLATION DU PROJET :

### Front

Créer un dossier Piiquante
Depuis ce dossier cloner le repo :
https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6 (modifier le nom en FrontEnd)
Puis taper les commandes :
1. "cd Frontend" 
2. "npm install" 
3. "npm run start" = lancement du serveur localhost 4200 :   http://localhost:4200

### Back

Depuis le dossier Piiquante 
Cloner le repo : https://github.com/NaneSp/P6_PIIQUANTE.git 
Puis taper les commandes : 
1. "cd Backend" 
2. "npm install"

*Installer les packages npm suivant pour un bon fonctionnement de l'api : 
"nodemon"
"bcrypt"
"cors"
"dotenv"
"express"
"fs"
"jsonwebtoken"
"mongoose"
"mongoose-unique-validator"
"morgan"
"multer " 
"path"
"crypto-js"
"express-rate-limit"
"password-validator"

Puis tapez la commande :
1. "nodemon server" = lancement du serveur localhost 3000 : http://localhost:3000 



### ...Afin de facilité la soutenance les codes secret du fichier caché .env seront fournis en dehors de ce repo...

# Quelques tips pour contrôler sur l'outil POSTMAN 



### SIGNUP
TEST POSTMAN SIGNUP

 signup = route POST http://localhost:3000/api/auth/signup 
 body
 raw
 json
 {"email":"unemail@gmail.com",
  "password":"unpassword"}
 
SI ko (mot de passe ne correspond pas au model demandé dans models/password avec le package password-validator----->

// Longueur minimale 8 caractères
// Longueur max 50 caractères
// Doit contenir 1 lettre majuscule
// Doit contenir des lettres minuscules
// Doit contenir au moins 2 chiffres
// Ne doit pas contenir d'espace 
// Liste noire de password (ne doit pas être passw0rd ou password123 car trop commun))

exemple : 

{"email":"test1@gmail.com",
 "password":"charlie"}
    
{"error": "Le mot de passe n'est pas assez robuste, voilà ce qui ne va pas : uppercase,digits" (= manque :au minimum 1 majuscule et 2 chiffres)}

et dans bdd mongoDb = dans users pas de nouvel utilisateur créé 

Si OK (mdp correspond au model souhaité)

{"email":"test1@gmail.com",
 "password":"Charlie76"}

résultat=
{"message": "La création de l'utilisateur est réussie !! "}
    
et dans mongoDB = création d'un user avec email et mdp crypté


 
 
 
 ### LOGIN
TEST POSTMAN LOGIN 

login = route POST http://localhost:3000/api/auth/login 
body
raw
json
 
REMETTRE MEME EMAIL ET MEME MDP QUE PR LE SIGNUP
{"email":"test1@gmail.com",
 "password":"Charlie76"}
    
résultat = 
{"userId": "633e91859474a2c91a64cef0",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzNlOTE4NTk0NzRhMmM5MWE2NGNlZjAiLCJpYXQiOjE2NjUwNDQ5NTEsImV4cCI6MTY2NTEzMTM1MX0.qEOOb6v3aLqqs_0iSCbg0TxgVg2hS-EmelEby5aQcHM"}

et dans bdd mongoDb = idem que signup 
 
 
 
 ### CREATE
TEST POSTMAN CREATE

create = route POST http://localhost:3000/api/sauces 
authorization
bearer Token : token créé au login 
puis
body
form-data 
key : sauce  Value : 
       {"userId": "633ecbdb7397fb39ce0f1932",
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
        "__v": 0}
        
résultat = {"message": "Votre sauce est créée !"}

et dans bdd mongoDb = dans sauces nouvelle sauce créé 
 
 
 ### VOIR TOUTES LES SAUCES = getAllSauce
TEST POSTMAN getAllSauce 
 
getAllSauce = route GET http://localhost:3000/api/sauces 
authorization
bearer Token : token créé au login 
puis
résultat = retourne toutes les sauces présentes sur le site
      
       {"_id": "633ecf8e7397fb39ce0f1939",
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
        "__v": 0},
        
    {.  "_id": "633ed5f87397fb39ce0f193e",
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
        "__v": 0}

 
 
 
 
 ### VOIR UNE SAUCE SELECTIONNÉE DEPUIS LA PAGE "TOUTES LES SAUCES" = getOneSauce
TEST POSTMAN getOneSauce 

getOneSauce = route GET http://localhost:3000/api/sauces/id de la sauce sélectionnée 
authorization
bearer Token : token créé au login 
puis
résultat = retourne la sauce sélectionnée{  "_id": "633ed5f87397fb39ce0f193e",
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
                                              "__v": 0 }


 
 
 
 ### MODIFY
 TEST POSTMAN MODIFY 
 
 modify = route PUT http://localhost:3000/api/sauces/id de la sauce à modifier 
 authorization
 bearer Token : token créé au login 
 puis
 body
 form-data 
 key : sauce  Value : { "userId": "633ecbdb7397fb39ce0f1932",
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
                        "__v": 0}
    
 résultat = {"message": "Sauce modifiée!"}

 et dans bdd mongoDb = dans sauces modif de la sauce sélectionnée
 
 
 
 
 ### DELETE
 TEST POSTMAN DELETE 
 
  delete = route DELETE http://localhost:3000/api/sauces/id de la sauce à supprimer 
 
  authorization
  bearer Token : token créé au login 


 résultat = {"message": "Votre sauce est bien supprimée !"}

 et dans bdd mongoDb = dans sauces msuppression de la sauce sélectionnée
 















