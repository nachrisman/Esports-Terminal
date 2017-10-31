var express 	= require('express'),
	router		= express.Router(),
	Game 		= require('../models/game'),
	Article		= require('../models/article'),
	Event		= require('../models/event'),
	moment 		= require('moment'),
	passport 	= require('passport'),
	User 	 	= require('../models/user'),
	middleware  = require('../middleware'),
	nodemailer	= require('nodemailer'),
	sgTransport = require('nodemailer-sendgrid-transport'),
	countryList = require('country-list')(),
	country		= require('countryjs');
	
var states	  = country.states('US'),
	countries = countryList.getNames();

var options = {
  auth: {
    api_user: 'app79330346@heroku.com',
    api_key: 'v0po3kna4389'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

/*=============
  MISC ROUTES
=============*/
router.get('/search', function(req, res){
	res.render('search');	
});

router.get('/stream', function(req, res){
	var today = moment().startOf('day');

	Event.find({
		stream: true, 
		date: {$gt: today.toDate()}}).sort({date: 1}).exec(function(err, upcomingStreams){
		if(err){
			console.log(err);
		} else {
			res.render('stream', {upcomingStreams: upcomingStreams});
		}
	});
});

router.get('/privacy-policy', function(req, res){
	res.render('privacy_policy');
});

router.get('/terms-of-use', function(req, res){
	res.render('terms_of_use');
});

router.get('/info', function(req, res){
	res.render('info');
});

/*==================
   AUTHENTICATION
==================*/
router.get('/', function(req, res){
	if(req.isAuthenticated()){
		res.redirect('/meta');
	} else {
		res.redirect('/news');
	}
});

router.get('/meta/', middleware.isLoggedIn, function(req, res){
	var today = moment().startOf('day');
	var nextWeek = moment().add(7, 'days');

	Article.find({}).sort({published: -1}).limit(9).exec(function(err, articles){
		if(err){
			console.log(err);
		} else {
			Event.find({date: {$gte: today.toDate()}}).sort({date: 1}).exec(function(err, foundEvents){
				if(err){
					console.log(err);
				} else {
					res.render('meta', {
						games: req.user.meta.game,
						articles: articles,
						foundEvents: foundEvents
					});
				}
			});	
		}
	});
});

router.get('/admin/login', function(req, res){
	res.render('admin_login');
});

router.post('/admin/login', passport.authenticate('local', 
	{
		successRedirect: '/admin',
		failureRedirect: '/admin/login',
		failureFlash: { type: 'error', message: 'Something Went Wrong. Try Again.' }
	}), function(req, res){
});

router.get('/register', function(req, res){
	Game.find({}, function(err, games){
		if(err){
			req.flash('error', 'Something went wrong.');
			console.log(err);
		} else {
			res.render('register', {games: games, countries: countries, states: states});
		}
	});
});

router.post('/register', function(req, res){
	var validationToken = Math.floor(Math.random() * 100 + 54);
	
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		location: {country: req.body.country},
		validationToken: validationToken
	});
	
	var metaGames = req.body.title;
	metaGames.forEach(function(metaGame){
		newUser.meta.push({ game: metaGame, events: true, news: true});
	});
	
	if(req.body.password == req.body.confirmedPassword){
		var host = req.get('host');
    	var link= "http://" + host + "/verify?id=" + validationToken;
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash('error', err.message);
				return res.redirect('/register');
			}
			passport.authenticate('local')(req, res, function(){
				var email = {
					  from: 'app79330346@heroku.com',
					  to: user.email,
					  subject: 'Please Confirm Your Account',
					  html: 'Hey, ' + user.firstName + '! <br><br><p>Thanks for creating an account with EST. Next step is to verify your email. <br><br> <a href='+ link +'>Click Here to Confirm Your Account!</a>'
					};
					client.sendMail(email, function(err, info){
					    if (err ){
					      console.log(err);
					    }
					    else {
					      req.flash('warning', 'Please Check Your Email to Confirm Your Account!');
					      res.redirect('/account');
					    }
					});
			});
		});
	} else {
		req.flash('error', 'Passwords did not match, please try registering again.');
		res.redirect('/register');
	}
});

router.get('/verify',function(req,res){
		console.log(req.protocol + ':/' + req.get('host'));
		
		if((req.protocol + '://' + req.get('host')) == ('http://' + req.get('host'))){
		    console.log("Domain is matched. Information is from Authentic email");
		    
		    if(req.query.id == req.user.validationToken){
		        console.log('Email Verified... Activating User Account');
		        
		        User.findByIdAndUpdate(req.user.id, {$set: {active: true, validationToken: undefined} }, function(err, user){
		        	if(err){
		        		console.log(err);
		        	} else {
		        	req.flash('success', 'Your Account Has Been Verified!');
		        	res.redirect('/meta-settings');
		        	}
		        });
		    } else {
		        console.log('Email Could Not Be Verified');
		        req.flash('error', 'Your Email Could Not Be Verified.');
		        res.redirect('/news');
		    }
		} else {
		    res.end('<h1>Request is from unknown source</h1>');
		}
});
	
router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/account',
		failureRedirect: '/login',
		failureFlash : { type: 'error', message: 'Invalid username or password.' }
	}), function(req, res){
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/news');
});

router.get('/reset-password', middleware.isLoggedIn, function(req, res){
	res.render('reset_password');	
});

router.put('/reset-password', function(req, res){
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

module.exports = router;