//import mongoose
const mongoose = require('mongoose');

//import du package mongoose-unique-validator (plugin)
const uniqueValidator = require('mongoose-unique-validator');


//création du schema avec methode schema de mongoose
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

//appel de la méthode plugin avec argument uniqueValidator
userSchema.plugin(uniqueValidator);


//export du model User
module.exports = mongoose.model('User', userSchema);