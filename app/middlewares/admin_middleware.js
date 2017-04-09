// route middleware to ensure user is admin in
var User = require('../models/user').User

function isAdmin (req, res, next) {
  User.findById(req.session.passport.user, (err, user) => {
    if (err) throw err
    if (user.role === 'admin') {
      return next()
    } else {
      res.redirect('/')
    }
  })
}

module.exports = isAdmin
