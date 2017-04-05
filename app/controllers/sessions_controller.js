module.exports = (passport) => {
  return {
    new: (req, res) => {
      res.render('sessions/new.ejs', { message: req.flash('loginMessage') })
    },

    create: passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }),

    destroy: (req, res) => {
      req.logout()
      res.redirect('/')
    }
  }
}
