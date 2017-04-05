var isLoggedIn = require('./app/middlewares/login_middleware.js')

var index = require('./app/controllers/index_controller.js')

module.exports = function (app, passport) {
  var sessions = require('./app/controllers/sessions_controller.js')(passport)
  var users = require('./app/controllers/users_controller.js')(passport)

  app.get('/', index.index)

  app.get('/profile', isLoggedIn, users.profile)

  app.get('/logout', sessions.destroy)

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

app.get('/login', sessions.new)

app.post('/login', sessions.create)

// SIGNUP =================================
// show the signup form
app.get('/signup', users.new)

// process the signup form
app.post('/signup', users.create)

// facebook -------------------------------

// send to facebook to do the authentication
app.get('/auth/facebook', users.facebook_login)

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback', users.facebook_callback)

// google ---------------------------------

// send to google to do the authentication
app.get('/auth/google', users.google_login)

// the callback after google has authenticated the user
app.get('/auth/google/callback', users.facebook_callback)

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
app.get('/connect/local', users.show_local)
app.post('/connect/local', users.connect_local)

// facebook -------------------------------

// send to facebook to do the authentication
app.get('/connect/facebook', users.connect_facebook)

// handle the callback after facebook has authorized the user
app.get('/connect/facebook/callback', users.connect_facebook_callback)

// google ---------------------------------

// send to google to do the authentication
app.get('/connect/google', users.connect_google)

// the callback after google has authorized the user
app.get('/connect/google/callback', users.connect_google_callback)
//  =========================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
app.get('/unlink/local', isLoggedIn, users.unlink_local)

// facebook -------------------------------
app.get('/unlink/facebook', isLoggedIn, users.unlink_facebook)

// google ---------------------------------
app.get('/unlink/google', isLoggedIn, users.unlink_google)
}
