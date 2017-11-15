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
	crypto		= require('crypto'),
	Team		= require('../models/team'),
	sgTransport = require('nodemailer-sendgrid-transport'),
	countryList = require('country-list')(),
	country		= require('countryjs');
	
var states	  = country.states('US'),
	countries = countryList.getNames();


router.get('/', function(req, res){
	if(req.isAuthenticated()){
		res.redirect('/meta');
	} else {
		res.redirect('/news');
	}
});

router.get('/meta', middleware.isLoggedIn, function(req, res){
	var today = moment().startOf('day');
	var nextWeek = moment().add(7, 'days');

	Article.find({}).sort({published: -1}).limit(req.user.meta.length * 10).exec(function(err, articles){
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

// router.get('/stream', function(req, res){
// 	var today = moment().startOf('day');

// 	Event.find({
// 		stream: true, 
// 		date: {$gt: today.toDate()}}).sort({date: 1}).exec(function(err, upcomingStreams){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render('stream', {upcomingStreams: upcomingStreams});
// 		}
// 	});
// });

router.get('/privacy-policy', function(req, res){
	res.render('privacy_policy');
});

router.get('/terms-of-use', function(req, res){
	res.render('terms_of_use');
});

router.get('/info', function(req, res){
	res.render('info');
});

router.get('/overwatch-league', function(req, res){
	Team.find({}, function(err, teams){
		if(err){
			console.log(err);
		} else {
			var teamNames = [];
			teams.forEach(function(team){
				teamNames.push(team.name);	
			});
			
			Article.find({categories: 'Overwatch League'}).sort({published: -1}).exec(function(err, articles){
				if(err){
					console.log(err);
				} else {
					Event.find({teams: {$in: teamNames}}, function(err, events){
						if(err){
							console.log(err)
						} else {
							res.render('overwatch_league', {teams: teams, articles: articles, events: events});
						}
					});
				}
			});
		}
	});
});

router.get('/overwatch-league/team/:id', function(req, res){
	Team.findById(req.params.id, function(err, team){
		if(err){
			req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
			return res.redirect('/overwatch-league');
		} else {
			Article.find({categories: team.name}).sort({published: -1}).limit(8).exec(function(err, articles){
				if(err){
					req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
					return res.redirect('/overwatch-league');
				} else {
					Event.find({teams: team.name}, function(err, events){
						if(err){
							req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
							return res.redirect('/overwatch-league');
						} else {
							res.render('team_view', {
								team: team,
								articles: articles,
								events: events
							});
						}
					});
				}
			});
		}
	});
});

/*=================
	EMAIL AUTH
=================*/
var options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
};

var client = nodemailer.createTransport(sgTransport(options));

/*==================
   AUTHENTICATION
==================*/

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
	var buf = crypto.randomBytes(256);
	var token = buf.toString('hex');
	var metaGames = req.body.title;
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		location: {country: req.body.country},
		validationToken: {token: token, expiration: moment()}
	});

	metaGames.forEach(function(metaGame){
		newUser.meta.push({ game: metaGame, events: true, news: true});
	});
	
	if(req.body.password == req.body.confirmedPassword) {
		User.findOne({email: req.body.email}, function(err, user){
			if(err){
				console.log('Error registering user, err = ' + err);
			} else if(user){
				req.flash('error', 'A user with that email exists already.');
				res.redirect('/register');
			} else {
		    	var link = "http://" + req.get('host') + "/verify?id=" + token;
				User.register(newUser, req.body.password, function(err, user){
					if(err){
						req.flash('error', err.message);
						return res.redirect('/register');
					}
					passport.authenticate('local')(req, res, function(){
						var email = {
							  from: 'registration@esportsterminal.com',
							  to: user.email,
							  subject: 'Please Confirm Your Account',
							  html: 'Hey, ' + user.firstName + '! <br><br><p>Thanks for creating an account with EST. Next step is to verify your email. <br><br> <a href='+ link +'>Click Here to Confirm Your Account!</a>'
							};
							client.sendMail(email, function(err, info){
							    if (err){
							      console.log(err);
							    }
							    else {
							      req.flash('warning', 'Please Check Your Email to Confirm Your Account!');
							      res.redirect('/account/meta-settings');
							    }
							});
					});
				});
			}
		});
	} else {
		req.flash('error', 'Passwords did not match, please try registering again.');
		res.redirect('/register');
	}
});

router.get('/verify',function(req,res){
		var yesterday = moment().subtract(1, 'day');
		if((req.protocol + '://' + req.get('host')) == ('http://' + req.get('host'))) {
		    if(req.query.id == req.user.validationToken.token && req.user.validationToken.expiration >= yesterday){
		        User.findByIdAndUpdate(req.user.id, {$set: {active: true, validationToken: {token: undefined, expiration: undefined} }}, function(err, user){
		        	if(err){
		        		console.log(err);
		        	} else {
		        	req.flash('success', 'Your Account Has Been Verified!');
		        	res.redirect('/account/meta-settings');
		        	}
		        });
		    } else {
		        req.flash('error', 'Your Email Could Not Be Verified.');
		        res.redirect('/news');
		    }
		} else {
		    res.end('<h1>Request is from unknown source</h1>');
		}
});

router.get('/resend-email-verification', function(req, res){
	var buf = crypto.randomBytes(256);
	var token = buf.toString('hex');
	
	User.findByIdAndUpdate(req.query.uid, {validationToken: {token: token, expiration: moment()}}, function(err, user){
		if(err){
			console.log(err);
		} else {
			var link = "http://"+req.get('host')+"/verify?id="+token;
			var email = {
					  from: 'registration@esportsterminal.com',
					  to: user.email,
					  subject: 'Please Confirm Your Account',
					  html: 'Hey, ' + user.firstName + '! <br><br><p>Thanks for creating an account with EST. Next step is to verify your email. <br><br> <a href='+ link +'>Click Here to Confirm Your Account!</a>'
					};
					client.sendMail(email, function(err, info){
					    if (err){
					      console.log(err);
					    }
					    else {
					      req.flash('warning', 'Email verification resent. Please check your email.');
					      res.redirect('/news');
					    }
					});
		}
	});	
});
	
router.get('/login', function(req, res){
	res.render('login');
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

router.get('/forgot-password', function(req, res){
	res.render('forgot_password');
});

router.post('/forgot-password', function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		if(err){
			req.flash('error', err.message);
			res.redirect('/forgot-password');
		} else {
			var buf = crypto.randomBytes(256),
				expiration = moment(),
				token = buf.toString('hex');
			
			user.validationToken.token = token;
			user.validationToken.expiration = expiration;
			
			user.save(function (err) {
				if(err) {
            	console.error(err);
        	}});
			
			var link = "http://" + req.get('host') + "/forgot-password/change?id=" + user._id + "&token=" + user.validationToken.token;
			var email = {
					  from: 'registration@esportsterminal.com',
					  to: user.email,
					  subject: 'EST Password Reset Link',
					  html: 'Hey, ' + user.firstName + '! <br><br><p>You recently requested to reset your password. ' + 
							'In order to do this, please follow the link below.' + 
							'<br><br><a href='+ link +'>'+ link + '</a>'
					};
			client.sendMail(email, function(err, info){
				    if (err){
				      console.log(err);
				    }
				    else {
				      req.flash('warning', 'Please Check Your Email for a Password Reset Link');
				      res.redirect('/news');
				    }
				});
		}
	});	
});

router.get('/forgot-password/change', function(req, res){
		console.log(req.protocol + ':/' + req.get('host'));
		var yesterday = moment().subtract(1, 'day');
		
		if((req.protocol + '://' + req.get('host')) == ('http://'+req.get('host'))) {
		    console.log("Domain is matched. Now verifying user...");
		    
		    User.findOne({_id: req.query.id}, function(err, user){
		    	if(err){
		    		req.flash('error', err.message);
		    		return res.redirect('/forgot-password');
		    	}	else {
		    		if(req.query.token == user.validationToken.token && user.validationToken.expiration >= yesterday){
		    			res.render('forgot_password_change', {user: user});
		    		} else {
		    			req.flash('error', err.message);
		    			res.redirect('/forgot-password');
		    		}
		    	}
		    });
		} else {
		    res.end('<h1>Request is from unknown source</h1>');
		}
});

router.put('/forgot-password/change/:id', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/forgot-password');
		} else if(req.body.newPassword == req.body.confirmedPassword){
			foundUser.validationToken.token = undefined;
			foundUser.validationToken.expiration = undefined;
			foundUser.setPassword(req.body.confirmedPassword, function(err){
				if(err){
					req.flash('error', err.message);
					return res.redirect('/forgot-password');
				} else {
					foundUser.save(function(err){
						if(err){
							console.log(err);
						}	
					});
				}
			});
			req.flash('success', 'Password successfully changed!');
			res.redirect('/login');
		}
	});
});


/*===================
	    SEARCH
===================*/

router.get('/search/articles', function(req, res){
	Article.find({$text: {$search: req.query.search} }).limit(30).exec(function(err, foundArticles){
		if(err){
			req.flash('error', 'Search could not be completed. Please try again. If the issue persists, please contact us.');
			return res.redirect('/news');
		} else {
			res.render('search_articles', {foundArticles: foundArticles, search: req.query.search});
		}
	});	
});

router.get('/search/events', function(req, res){
	Event.find({$text: {$search: req.query.search} }).limit(30).exec(function(err, events){
		if(err){
			req.flash('error', 'Search could not be completed. Please try again. If the issue persists, please contact us.');
			return res.redirect('/events');
		} else {
			res.render('search_events', {events: events, search: req.query.search});
		}
	});	
});

// router.get('/search/streams', function(req, res){
// 	Event.find({$text: {$search: req.query.search}, stream: true}).limit(30).exec(function(err, events){
// 		if(err){
// 			req.flash('error', 'Search could not be completed. Please try again. If the issue persists, please contact us.');
// 			return res.redirect('/stream');
// 		} else {
// 			res.render('search_events', {events: events, search: req.query.search});
// 		}
// 	});		
// });

router.get('/search/author', function(req, res){
	Article.find({$text: {$search: req.query.search} }).limit(30).exec(function(err, foundArticles){
		if(err){
			req.flash('error', 'Search could not be completed. Please try again. If the issue persists, please contact us.');
			return res.redirect('/news');
		} else {
			res.render('search_articles', {foundArticles: foundArticles, search: req.query.search});
		}
	});	
});


/*====================
	INFO/TIP SUBMIT
=====================*/
router.get('/write-for-us', function(req, res){
	res.render('write_for_us');	
});

router.post('/write-for-us', function(req, res){
	var email = {
		from: process.env.SENDGRID_USERNAME,
		to: 'esportsterminal@gmail.com',
		subject: 'WRITE FOR US Submission',
		html: 'Date/Time: ' + moment().toDate() + '<br>Name: ' + req.body.firstName + ' ' + req.body.lastName + '<br>' + 
			'Username: ' + req.body.username + '<br>Email: ' + req.body.email + '<br>Message: ' + req.body.message
	};
			client.sendMail(email, function(err, info){
				    if (err){
				      console.log(err);
				    }
				    else {
				      req.flash('success', 'Thanks for your submission! We\'ll get back to you ASAP!');
				      res.redirect('/news');
				    }
				});
});

router.get('/contact', function(req, res){
	res.render('contact');	
});

router.post('/contact', function(req, res){
	var email = {
		from: process.env.SENDGRID_USERNAME,
		to: 'esportsterminal@gmail.com',
		subject: 'Contact Form Submission',
		html: 'Date/Time: ' + moment().toDate() + '<br>Name: ' + req.body.firstName + ' ' + req.body.lastName + '<br>' + 
			'Username: ' + req.body.username + '<br>Email: ' + req.body.email + '<br>Message: ' + req.body.message
	};
			client.sendMail(email, function(err, info){
				    if (err){
				      console.log(err);
				    }
				    else {
				      req.flash('success', 'Thanks for your submission! We\'ll get back to you ASAP!');
				      res.redirect('/news');
				    }
				});
});


module.exports = router;