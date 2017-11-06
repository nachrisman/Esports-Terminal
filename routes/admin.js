var express 	= require('express'),
	router		= express.Router(),
	User 		= require('../models/user'),
	Event 		= require('../models/event'),
	Article 	= require('../models/article'),
	Game 		= require('../models/game'),
	Team		= require('../models/team'),
	middleware  = require('../middleware'),
	country		= require('countryjs'),
	moment		= require('moment'),
	countryList = require('country-list')();

var states	  = country.states('US'),
	countries = countryList.getNames();

router.get('/', middleware.isAdmin, function(req, res){
	Article.find({}, function(err, articles){
		if(err){
			console.log(err);
		} else {
			Event.find({}, function(err, events){
				if(err){
					console.log(err);
				} else {
					Game.find({}, function(err, games){
						if(err){
							console.log(err);
						} else {
							User.find({}, function(err, users){
								if(err){
									console.log(err);
								} else {
									res.render('admin', {articles: articles, events: events, games: games, users: users});
								}
							});
						}
					});
				}
			});
		}
	});
});

router.get('/account', middleware.isAdmin, function(req, res){
	res.render('admin_account', {states: states, countries: countries});	
});

router.get('/view-users', middleware.isAdmin, function(req, res){
	User.find({}).sort({lastName: 1}).exec(function(err, users){
		if(err){
			res.send('No Users Found');
		} else {
			res.render('admin_view_users', {users: users});
		}
	});
});

router.get('/new-user', middleware.isAdmin, function(req, res){
	res.render('admin_new_user', {states: states, countries: countries});
});

router.post('/new-user', middleware.isAdmin, function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		phone: req.body.phone,
		role: req.body.role,
		gender: req.body.gender,
		location: {
			country: req.body.country,
			state: req.body.state,
			street: req.body.street,
			city: req.body.city,
			zip: req.body.zip
		}
	});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', 'Could not add user. Check error logs.');
			console.log(err);
			return res.render('admin_new_user', {states: states, countries: countries});
		}
		req.flash('success', 'User added successfully!');
		res.redirect('/admin/view-users');
	});
});

router.get('/edit-user/:id', middleware.isAdmin, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		} else {
			res.render('admin_edit_user', {user: foundUser, states: states, countries: countries});
		}
	});
});

router.put('/edit-user/:id', middleware.isAdmin, function(req, res){
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash('error', 'Could not edit user. Check error logs.');
			console.log('error');
		} else {
			req.flash('success', 'User edited successfully!');
			res.redirect('/admin/view-users');
		}
	});
});

router.delete('/view-user/:id', middleware.isAdmin, function(req, res){
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Could not delete user. Check error logs.');
			console.log(err);
		} else {
			req.flash('success', 'User deleted successfully!');
			res.redirect('/admin/view-users');
		}
	});
});

router.get('/new-article', middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log(err);
		} else {
			User.find({role: 'admin'}, function(err, authors){
				if(err){
					console.log(err, err.message);
				} else {
					Article.findOne({}, function(err, article){
						if(err){
							console.log(err);
						} else {
							var contentTypes = article.contentTypes;
							var today = moment();
							res.render('admin_new_article', {
								games: games, 
								authors: authors,
								contentTypes: contentTypes,
								today: today
							});
						}
					});
				}
			});
		}
	});
});

router.get('/new-event', middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log(err);
		} else {
			res.render('admin_new_event', {games: games, countries: countries, states: states});
		}
	});
});

router.get('/view-events', middleware.isAdmin, function(req, res){
	Event.find({}).sort({date: 1}).exec(function(err, events){
		if(err){
			res.send('No Events Found');
		} else {
			res.render('admin_view_events', {events: events});
		}
	});
});

router.get('/edit-event/:id', middleware.isAdmin, function(req, res){
	Event.findById(req.params.id, function(err, foundEvent){
		if(err){
			res.redirect('/events');
		} else {
			Game.find({}, function(err, games){
				if(err){
					console.log(err);
				} else {
					res.render('admin_edit_event', {event: foundEvent, games: games, countries: countries, states: states});
				}
			});
		}
	});
});

router.get('/view-articles', middleware.isAdmin, function(req, res){
	Article.find({}).sort({published: 1}).exec(function(err, articles){
		if(err){
			console.log('Errors all over the place');
		} else {
			res.render('admin_view_articles', {articles: articles});
		}
	});
});

router.get('/edit-article/:id', middleware.isAdmin, function(req, res){
	Article.findById(req.params.id, function(err, foundArticle){
		if(err){
			console.log(err);
		} else {
			Game.find({}, function(err, games){
				if(err){
					console.log(err);
				} else {
					User.find({role: 'admin'}, function(err, authors){
						if(err){
							console.log(err, err.message);
						} else {
							var contentTypes = foundArticle.contentTypes;
							res.render('admin_edit_article', {
								games: games, 
								authors: authors, 
								article: foundArticle,
								contentTypes: contentTypes
							});
						}
					});
				}
			});
		}
	});
});

router.get('/view-games', middleware.isAdmin, function(req, res){
	Game.find({}).sort({title: 1}).exec(function(err, games){
		if(err){
			console.log('Errors for games');
		} else {
			res.render('admin_view_games', {games: games});
		}
	});
});

router.get('/new-game', middleware.isAdmin, function(req, res){
	Game.findOne({}, function(err, game){
		if(err){
			console.log(err);
		} else {
			var genres = game.genres;
			res.render('admin_new_game', {genres: genres});
		}	
	});
});

router.post('/view-games', middleware.isAdmin, function(req, res){
	Game.create(req.body.game, function(err, newGame){
		if(err){
			req.flash('error', err.message);
			console.log(err);
		} else {
			res.redirect('/admin/view-games');
		}
	});
});

router.get('/edit-game/:id', middleware.isAdmin, function(req, res){
	Game.findById(req.params.id, function(err, foundGame){
		if(err){
			res.redirect('/admin/view-games');
		} else {
			var genres = foundGame.genres;
			res.render('admin_edit_game', {game: foundGame, genres: genres});
		}
	});
});

router.put('/view-games/:id', middleware.isAdmin, function(req, res){
	Game.findByIdAndUpdate(req.params.id, req.body.game, function(err, updatedGame){
		if(err){
			req.flash('error', 'Could not edit game. Check error logs.');
			console.log(err);
		} else {
			req.flash('success', 'Game edited successfully!');
			res.redirect('/admin/view-games');
		}
	});
});

router.delete('/view-games/:id', middleware.isAdmin, function(req, res){
	Game.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Could not delete game. Check error logs.');
			console.log(err);
		} else {
			req.flash('success', 'Game deleted successfully!');
			res.redirect('/admin/view-games');
		}
	});
});

router.get('/view-teams', middleware.isAdmin, function(req, res){
	Team.find({}, function(err, teams){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/');
		} else {
			res.render('admin_view_teams', {teams: teams});
		}
	});
});

router.get('/new-team', middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			res.render('admin_new_team', {games: games, countries: countries});
		}
	});
});

router.post('/view-teams', middleware.isAdmin, function(req, res){
	Team.create(req.body.team, function(err, newTeam){
		if(err){
			req.flash('error', err.message);
			console.log(err);
		} else {
			res.redirect('/admin/view-teams');
		}
	});
});

module.exports = router;