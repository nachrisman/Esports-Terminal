var express 	= require('express'),
	router		= express.Router(),
	User 		= require('../models/user'),
	Event 		= require('../models/event'),
	Game 		= require('../models/game'),
	passport 	= require('passport'),
	middleware  = require('../middleware'),
	country		= require('countryjs');

var states = country.states('US');

router.get('/', middleware.isLoggedIn, function(req, res){
	res.render('account');
});

router.get('/info/', middleware.isLoggedIn, function(req, res){
	res.render('account_info', {states: states});
});

router.put('/info', middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash('error', 'Could not update your info. Please try again.');
			console.log(err);
		} else {
			req.flash('success', 'Update saved!');
			res.redirect('/account/info');
		}
	});
});

router.get('/meta-settings/', middleware.isLoggedIn, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log(err);
			return res.redirect('/myaccount');
		} else {
			res.render('account_meta_settings', {games: games});
		}
	});
});

router.put('/meta-settings', middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user.id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash('error', 'Could not update META. Please try again.');
			console.log(err);
		} else {
			req.flash('success', 'Your META has been updated!');
			res.redirect('/meta');
		}
	});
});

router.get('/security', middleware.isLoggedIn, function(req, res){
	res.render('account_security');
});

module.exports = router;