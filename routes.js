var isLoggedIn = require('./app/middlewares/login_middleware.js');

var index = require('./app/controllers/index_controller.js');
var users = require('./app/controllers/users_controller.js');
var sessions = require('./app/controllers/sessions_controller.js');

module.exports = function(app, passport) {

var accounts = require('./app/controllers/accounts_controller.js')(passport);

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', index.index);

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, users.profile);

    // LOGOUT ==============================
    app.get('/logout', sessions.destroy);

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', sessions.new);

        // process the login form
        app.post('/login', accounts.login);

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', users.new);

        // process the signup form
        app.post('/signup', accounts.signup);

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', accounts.facebook_login);

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback', accounts.facebook_callback);

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', accounts.google_login);

        // the callback after google has authenticated the user
        app.get('/auth/google/callback', accounts.facebook_callback);

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', accounts.show_local);
        app.post('/connect/local', accounts.connect_local);

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', accounts.connect_facebook);

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback', accounts.connect_facebook_callback);

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', accounts.connect_google);

        // the callback after google has authorized the user
        app.get('/connect/google/callback', accounts.connect_google_callback);

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, users.unlink_local);

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, users.unlink_facebook);

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, users.unlink_google);


};
