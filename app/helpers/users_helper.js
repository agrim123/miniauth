var bcrypt   = require('bcrypt-nodejs');

exports.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};