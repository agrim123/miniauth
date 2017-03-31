exports.login = function(req, res) {
	res.render('login.ejs', { message: req.flash('loginMessage') });
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};