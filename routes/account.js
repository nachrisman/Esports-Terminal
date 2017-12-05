var express 	= require('express'),
	router		= express.Router(),
	User 		= require('../models/user'),
	Game 		= require('../models/game'),
	middleware  = require('../middleware'),
	country		= require('countryjs'),
	nodemailer	= require('nodemailer'),
	sgTransport = require('nodemailer-sendgrid-transport'),
	countryList = require('country-list')();

var states	  = country.states('US'),
	countries = countryList.getNames();
	
var options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
};

var client = nodemailer.createTransport(sgTransport(options));

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
	var userMeta = req.user.meta,
		updatedEvents = req.body.events,
		updatedNews = req.body.news,
	    updatedMeta = [];
	
	userMeta.forEach(function(meta){
		if(updatedEvents.indexOf(meta.game) > -1){
			meta.events = true;
			updatedEvents.splice(updatedEvents.indexOf(meta.game), 1);
		} else {
			meta.events = false;
		}

		if(updatedNews.indexOf(meta.game) > -1){
			meta.news = true;
			updatedNews.splice(updatedNews.indexOf(meta.game), 1);
		} else {
			meta.news = false;
		}
	});
	
	if(updatedEvents.length > 0){
		updatedEvents.forEach(function(event){
			updatedMeta.push({game: event, events: true, news: false});	
		});
	}
	
	if(updatedNews.length > 0){
		updatedNews.forEach(function(news){
			if(updatedMeta.find(meta => meta.game == news)) {
				updatedMeta.find(meta => meta.game == news).news = true;
			} else {
				updatedMeta.push({game: news, events: false, news: true});
			}	
		});
	}
	
	userMeta.forEach(function(meta){
		updatedMeta.push(meta);	
	});
	
	User.findByIdAndUpdate(req.user._id, {$set: {meta: updatedMeta } }, function(err, updatedUser){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/account/meta-settings');
		} else {
			req.flash('success', 'Your META has been updated. Enjoy the new content!');
			res.redirect('/account/meta-settings');
		}
	});
});

router.get('/security', middleware.isLoggedIn, function(req, res){
	res.render('account_security');
});

router.put('/security', middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, {$set: {newsletter: req.body.email} }, function(err, updatesUser){
		if(err){
			console.log(err);
			res.redirect('/account/security');
		} else {
			req.flash('success', 'Your settings have been updated!');
			res.redirect('/account/security');
		}
	});	
});

router.get('/change-password', middleware.isLoggedIn, function(req, res){
	res.render('account_change_password');	
});

router.put('/change-password', function(req, res){
	User.findById(req.user._id, function(err, foundUser){
		if(err){
			console.log(err, err.message);
		} else {
			foundUser.changePassword(req.body.oldPassword, req.body.newPassword, function(err, next){
				if(err){
					console.log(err, err.message);
				} else {
					req.flash('success', 'Password Updated!');
					res.redirect('/account/info');
				}
			});
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
			var reason = req.body.deactivationReason;
			var comments = req.body.additionalComments;
			var email = {
					  from: 'accounts@esportsterminal.com',
					  to: 'esportsterminal@gmail.com',
					  subject: 'Account Deactivation',
					  html: 'User: ' + req.user.email + '<br>Reason: ' + reason + '<br>Comments: ' + comments
					};
					client.sendMail(email, function(err, info){
					    if (err){
					      console.log(err);
					    }
					    else {
					      req.flash('success', 'Account Deactivated. Hope to see you again soon!');
							res.redirect('/news');
					    }
					});
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
			var reason = req.body.deactivationReason;
			var comments = req.body.additionalComments;
			var email = {
					  from: 'accounts@esportsterminal.com',
					  to: 'esportsterminal@gmail.com',
					  subject: 'Account Deletion',
					  html: 'User: ' + req.user.email + '<br>Reason: ' + reason + '<br>Comments: ' + comments
					};
					client.sendMail(email, function(err, info){
					    if (err){
					      console.log(err);
					    } else {
					    	req.flash('success', 'Account deleted. We\'re sorry to see you go! Hope to see you again soon!');
							res.redirect('/news');
					    }
					});
				}
	});
});

module.exports = router;