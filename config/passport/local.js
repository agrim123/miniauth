var LocalStrategy = require('passport-local').Strategy

var User = require('../../app/models/user').User

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
  // =========================================================================
  // LOCAL LOGIN ============================================================
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    if (email) {
      email = email.toLowerCase() // Use lower-case e-mails to avoid case-sensitive e-mail matching
    }
    process.nextTick(() => {
      User.findOne({ 'local.email': email }, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found.'))
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
        } else {
          return done(null, user)
        }
      })
    })
  }))

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    if (email) {
      email = email.toLowerCase() // Use lower-case e-mails to avoid case-sensitive e-mail matching
    }
    // asynchronous
    process.nextTick(() => {
      // if the user is not already logged in:
      if (!req.user) {
        User.findOne({ 'local.email': email }, (err, user) => {
          // if there are any errors, return the error
          if (err) {
            return done(err)
          }
          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
          } else {
            // create the user
            var newUser = new User()
            newUser.local.email = email
            newUser.local.password = newUser.hashPassword(password)
            newUser.role = 'user'
            newUser.save((err) => {
              if (err) {
                return done(err)
              }
              return done(null, newUser)
            })
          }
        })
        // if the user is logged in but has no local account...
      } else if (!req.user.local.email) {
        // ...presumably they're trying to connect a local account
        // BUT let's check if the email used to connect a local account is being used by another user
        User.findOne({ 'local.email': email }, (err, user) => {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(null, false, req.flash('loginMessage', 'That email is already taken.'))
            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
          } else {
            user = req.user
            user.local.email = email
            user.local.password = user.hashPassword(password)
            user.save((err) => {
              if (err) {
                return done(err)
              }
              return done(null, user)
            })
          }
        })
      } else {
        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
        return done(null, req.user)
      }
    })
  }))
}
