module.exports = function(passport) {
	return {
		show_local: function(req, res) {
			res.render('accounts/connect-local.ejs', { message: req.flash('loginMessage') });
		},
		connect_local: passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
		login: passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
		signup: passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
		facebook_login: passport.authenticate('facebook', { scope : ['email', 'public_profile'] }),
		facebook_callback: passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}),
		google_callback: passport.authenticate('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}),
		google_login: passport.authenticate('google', { scope : ['profile', 'email'] }),
		connect_facebook: passport.authorize('facebook', { scope : 'email' }),
		connect_google: passport.authorize('google', { scope : ['profile', 'email'] }),
		connect_facebook_callback: passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}),
		connect_google_callback: passport.authorize('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}),
	}
}