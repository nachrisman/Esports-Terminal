var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must be logged in for that.');
	res.redirect('/login');
};

middlewareObj.isActiveAccount = function(req, res, next){
	if(req.user.active){
		return next();
	} else {
		req.flash('warning', 'Your account has not been confirmed! Please check your email.');
	}
};

middlewareObj.isAdmin = function(req, res, next){
	if(req.isAuthenticated() && (req.user.role === 'admin')){
		return next();
	}
	req.flash('error', 'You don\'t have permission to access that.');
	res.redirect('/news');
};

middlewareObj.usernameToLowerCase = function(req, res, next){
        req.body.username = req.body.username.toLowerCase();
        next();
};

module.exports = middlewareObj;