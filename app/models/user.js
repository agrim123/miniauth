// load the things we need
var mongoose = require('mongoose')

var usersHelper = require('../../app/helpers/users_helper.js')

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    photo: String,
    gender: String,
    link: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  role: String
})

// generating a hash
userSchema.methods.hashPassword = usersHelper.hashPassword

// checking if password is valid
userSchema.methods.validPassword = usersHelper.validPassword

// create the model for users and expose it to our app
exports.User = mongoose.model('User', userSchema)
