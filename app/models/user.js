// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var users_helper  =require('../../app/helpers/users_helper.js');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String,
        gender       : String,
        link         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.hashPassword = users_helper.hashPassword;

// checking if password is valid
userSchema.methods.validPassword = users_helper.validPassword;

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
