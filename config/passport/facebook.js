var FacebookStrategy = require('passport-facebook').Strategy
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
              newUser.role = 'user'
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
}
