// load all the things we need
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// load up the user model
var User = require('../app/models/user').User

// load the auth variables
var configAuth = require('./auth') // use this one for testing

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

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  var fbStrategy = configAuth.facebookAuth
  fbStrategy.passReqToCallback = true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  passport.use(new FacebookStrategy(fbStrategy,
    (req, token, refreshToken, profile, done) => {
      // asynchronous
      process.nextTick(() => {
        if (!req.user) {
          User.findOne({ 'facebook.id': profile.id }, (err, user) => {
            if (err) {
              return done(err)
            }
            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.facebook.token) {
                user.facebook.token = token
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                user.facebook.email = (profile.emails[0].value || '').toLowerCase()
                user.save((err) => {
                  if (err) {
                    return done(err)
                  }
                  return done(null, user)
                })
              }
              return done(null, user)
            } else {
              var newUser = new User()
              newUser.facebook.id = profile.id
              newUser.facebook.token = token
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
              newUser.facebook.email = (profile.emails[0].value || '').toLowerCase()
              newUser.facebook.photo = profile.photos[0].value || ''
              newUser.facebook.gender = profile.gender
              newUser.facebook.link = profile.profileUrl
              newUser.save((err) => {
                if (err) {
                  return done(err)
                }
                return done(null, newUser)
              })
            }
          })
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user // pull the user out of the session
          user.facebook.id = profile.id
          user.facebook.token = token
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
          user.facebook.email = (profile.emails[0].value || '').toLowerCase()

          user.save((err) => {
            if (err) {
              return done(err)
            }
            return done(null, user)
          })
        }
      })
    }))

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  (req, token, refreshToken, profile, done) => {
    // asynchronous
    process.nextTick(() => {
      // check if the user is already logged in
      if (!req.user) {
        User.findOne({ 'google.id': profile.id }, (err, user) => {
          if (err) {
            return done(err)
          }
          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.google.token) {
              user.google.token = token
              user.google.name = profile.displayName
              user.google.email = (profile.emails[0].value || '').toLowerCase() // pull the first email
              user.save((err) => {
                if (err) {
                  return done(err)
                }
                return done(null, user)
              })
            }
            return done(null, user)
          } else {
            var newUser = new User()
            newUser.google.id = profile.id
            newUser.google.token = token
            newUser.google.name = profile.displayName
            newUser.google.email = (profile.emails[0].value || '').toLowerCase() // pull the first email
            newUser.save((err) => {
              if (err) {
                return done(err)
              }
              return done(null, newUser)
            })
          }
        })
      } else {
        var user = req.user // pull the user out of the session
        user.google.id = profile.id
        user.google.token = token
        user.google.name = profile.displayName
        user.google.email = (profile.emails[0].value || '').toLowerCase()
        user.save((err) => {
          if (err) {
            return done(err)
          }
          return done(null, user)
        })
      }
    })
  }))
}
