var express 	= require('express'),
	router		= express.Router(),
	User 		= require('../models/user'),
	Game 		= require('../models/game'),
	middleware  = require('../middleware'),
	country		= require('countryjs'),
	countryList = require('country-list')();

var states	  = country.states('US'),
	countries = countryList.getNames();
	
// function isVerified(req, res, next){
// 	if(req.user.active == true){
// 		return next();
// 	} else {
// 		req.flash('warning', 'Please check your email to activate your account!');
// 		return next();
// 	}
// }

router.get('/', middleware.isLoggedIn, function(req, res){
	res.redirect('/account/meta-settings');
});

router.get('/info', middleware.isLoggedIn, function(req, res){
	res.render('account_info', {states: states, countries: countries});
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

router.get('/meta-settings', middleware.isLoggedIn, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log(err);
			return res.redirect('/account');
		} else {
			res.render('account_meta_settings', {games: games});
		}
	});
});

router.put('/meta-settings', middleware.isLoggedIn, function(req, res){
	var updatedMeta = [],
		updatedTitles = req.body.title,
		events = false,
		news = false;

	for(var i=0; i < updatedTitles.length; i++){
		if(req.body.events[i] == 'yes'){
			events = true;
		}
		
		if(req.body.news[i] == 'yes'){
			news = true;
		}
		
		updatedMeta.push({
			game: updatedTitles[i],
			events: events,
			news: news
		});
	}

	User.findByIdAndUpdate(req.user._id, {$set: {meta: updatedMeta} }, function(err, updatedUser){
		if(err){
			req.flash('error', 'Could not update META. Please try again.');
			console.log(err);
		} else {
			req.flash('success', 'Your META has been updated!');
			res.redirect('/account/meta-settings');
		}
	});
});

router.get('/security', middleware.isLoggedIn, function(req, res){
	res.render('account_security');
});

router.put('/security', middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, {$set: {newsletter: req.body.news, stream: req.body.stream} }, function(err, updatesUser){
		if(err){
			console.log(err);
			res.redirect('/account/security');
		} else {
			req.flash('success', 'Your settings have been updated!');
			res.redirect('/account/security');
		}
	});	
});

router.get('/deactivate', middleware.isLoggedIn, function(req, res){
	res.render('account_deactivate');	
});

router.put('/deactivate', middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, {$set: {active: false} }, function(err, foundUser){
		if(err){
			console.log(err);
		} else {
			req.flash('success', 'Account Deactivated. Hope to see you again soon!');
			res.redirect('/news');
		}
	});
});

router.get('/delete-account', middleware.isLoggedIn, function(req, res){
	res.render('account_delete_account');
});

router.delete('/delete-account', middleware.isLoggedIn, function(req, res){
			User.findByIdAndRemove(req.user._id, function(err){
				if(err){
					req.flash('error', 'Could not delete account. Please contact us for more info.');
					console.log(err, err.message);
				} else {
					req.flash('success', 'Account deleted. We\'re sorry to see you go! Hope to see you again soon!');
					res.redirect('/news');
				}
			});
});

module.exports = router;