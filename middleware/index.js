var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must be logged in for that.');
	res.redirect('/login');
};

middlewareObj.isAdmin = function(req, res, next){
	if(req.isAuthenticated() && (req.user.role === 'admin')){
		return next();
	}
	req.flash('error', 'You don\'t have permission to access that.');
	res.redirect('/news');
};

module.exports = middlewareObj;