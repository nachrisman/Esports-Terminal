var express 	= require('express'),
	router		= express.Router(),
	Game 		= require('../models/game'),
	Article		= require('../models/article'),
	Event		= require('../models/event'),
	moment 		= require('moment'),
	passport 	= require('passport'),
	User 	 	= require('../models/user'),
	middleware  = require('../middleware'),
	countryList = require('country-list')(),
	country		= require('countryjs');
	
var states	  = country.states('US'),
	countries = countryList.getNames();

/*=============
  MISC ROUTES
=============*/
router.get('/search', function(req, res){
	res.render('search');	
});

//stream view with upcoming streams list
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

//Legal Pages
router.get('/privacy-policy', function(req, res){
	res.render('privacy_policy');
});

router.get('/terms-of-use', function(req, res){
	res.render('terms_of_use');
});

//info page
router.get('/info', function(req, res){
	res.render('info');
});

//Podcast View - waiting on this for now
// router.get('/podcast', function(req, res){
// 	res.render('podcast');
// });


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

router.get('/login', function(req, res){
	res.render('login');
});

//META Routes
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
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		location: {country: req.body.country}
	});
	var metaGames = req.body.title;
	for(var i=0; i < metaGames.length; i++){
		newUser.meta.push({ game: metaGames[i], events: true, news: true});
	}
	if(req.body.password == req.body.confirmedPassword){
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash('error', err.message);
				return res.redirect('/register');
			}
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'Welcome, ' + user.username + '! ' + 'Let\'s finish your META');
				res.redirect('/account');
			});
		});
	} else {
		req.flash('error', 'Passwords did not match, please try registering again.');
		res.redirect('/register');
	}
	});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/meta',
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