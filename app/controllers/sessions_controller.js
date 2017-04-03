exports.new = function(req, res) {
	res.render('sessions/new.ejs', { message: req.flash('loginMessage') });
};

exports.destroy = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.create = function(req,res) {

}