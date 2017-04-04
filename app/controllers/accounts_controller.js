module.exports = function (passport) {
  return {
    show_local: function (req, res) {
      res.render('accounts/connect-local.ejs', { message: req.flash('loginMessage') })
    },
    connect_local: passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/connect/local',
      failureFlash: true
    }),
    login: passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }),
    signup: passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }),
    facebook_login: passport.authenticate('facebook', { scope: ['email', 'public_profile'] }),
    facebook_callback: passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }),
    google_callback: passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }),
    google_login: passport.authenticate('google', { scope: ['profile', 'email'] }),
    connect_facebook: passport.authorize('facebook', { scope: 'email' }),
    connect_google: passport.authorize('google', { scope: ['profile', 'email'] }),
    connect_facebook_callback: passport.authorize('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }),
    connect_google_callback: passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  }
}
