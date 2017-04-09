module.exports = (passport) => {
  return {
    new: (req, res) => {
      res.render('users/new.ejs', { message: req.flash('signupMessage') })
    },

    profile: (req, res) => {
      res.render('users/show.ejs', {
        user: req.user
      })
    },

    show_local: (req, res) => {
      res.render('accounts/connect-local.ejs', { message: req.flash('loginMessage') })
    },

    create: passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }),

    connect_local: passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/connect/local',
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

    google_login: passport.authenticate('google', { scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read']
    }),

    connect_facebook: passport.authorize('facebook', { scope: ['email', 'public_profile'] }),

    connect_google: passport.authenticate('google', { scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read']
    }),

    unlink_local: (req, res) => {
      var user = req.user
      user.local.email = undefined
      user.local.password = undefined
      user.save((err) => {
        if (err) {
          throw err
        }
        res.redirect('/profile')
      })
    },

    unlink_google: (req, res) => {
      var user = req.user
      user.google.token = undefined
      user.save((err) => {
        if (err) {
          throw err
        }
        res.redirect('/profile')
      })
    },

    unlink_facebook: (req, res) => {
      var user = req.user
      user.facebook.token = undefined
      user.save((err) => {
        if (err) {
          throw err
        }
        res.redirect('/profile')
      })
    }
  }
}
