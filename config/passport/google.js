// load all the things we need
var GoogleStrategy = require('passport-google-oauth2').Strategy

// load up the user model
var User = require('../../app/models/user').User

// load the auth variables
var configAuth = require('./../auth') // use this one for testing

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  var googleStrategy = configAuth.googleAuth
  googleStrategy.passReqToCallback = true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  passport.use(new GoogleStrategy(googleStrategy, (req, token, refreshToken, profile, done) => {
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
