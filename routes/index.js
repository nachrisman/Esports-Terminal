var express 	= require('express'),
	router		= express.Router(),
	Game 		= require('../models/game'),
	Article		= require('../models/article'),
	Event		= require('../models/event'),
	moment 		= require('moment'),
	passport 	= require('passport'),
	User 	 	= require('../models/user'),
	middleware  = require('../middleware');

/*=============
  OTHER PAGES
=============*/
//Stream Page with upcoming streams list
router.get('/stream', function(req, res){
	var today = moment().startOf('day');

	Event.find({stream: true, date: {$gt: today.toDate()}}).sort({date: -1}).exec(function(err, upcomingStreams){
		if(err){
			console.log(err);
		} else {
			res.render('stream', {upcomingStreams: upcomingStreams});
		};
	});
});

//Legal Pages
router.get('/privacy-policy', function(req, res){
	res.render('privacy_policy');
});

router.get('/terms-of-use', function(req, res){
	res.render('terms_of_use');
});


//Website About
router.get('/info', function(req, res){
	res.render('info');
});

//Podcast View
router.get('/podcast', function(req, res){
	res.render('podcast');
});


/*==================
   AUTHENTICATION
==================*/
//landing page
router.get('/', function(req, res){
	res.render('index');
});

router.get('/login', function(req, res){
	res.render('login');
});

//META Routes
router.get('/meta/', middleware.isLoggedIn, function(req, res){
	var today = moment().startOf('day');
	var nextWeek = moment().add(7, 'days')

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
				};
			});	
		};
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
			res.render('register', {games: games});
		};
	});
});

router.post('/register', function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	});
	var metaGames = req.body.title;
	for(var i=0; i < metaGames.length; i++){
		newUser.meta.push({ game: metaGames[i], events: true, news: true});
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome, ' + user.username + '! ' + 'Account successfully created!')
			res.redirect('/account');
		});
	});
});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/meta',
		failureRedirect: '/login',
	}), function(req, res){
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/news');
});

module.exports = router;
