
exports.profile = function(req, res) {
	res.render('profile.ejs', {
		user : req.user
	});
}

exports.new = function(req, res) {
	res.render('signup.ejs', { message: req.flash('signupMessage') });
};

exports.unlink_local = function(req,res) {
	var user            = req.user;
	user.local.email    = undefined;
	user.local.password = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};

exports.unlink_google = function(req,res) {
	var user          = req.user;
	user.google.token = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};

exports.unlink_facebook = function(req,res) {
	var user            = req.user;
	user.facebook.token = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};