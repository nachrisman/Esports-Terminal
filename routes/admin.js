var Article 	= require("../models/article"),
	Game 		= require("../models/game"),
	Team		= require("../models/team"),
	User 		= require("../models/user"),
	middleware  = require("../middleware"),
	countryList = require("country-list")(),
	country		= require("countryjs"),
	passport 	= require("passport"),
	express 	= require("express"),
	moment		= require("moment"),
	router		= express.Router();

var states	  = country.states("US"),
	countries = countryList.getNames();

/*==========================
	LOGIN/LOGOUT ROUTES
============================*/
router.get("/login", function(req, res){
	res.render("admin_login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/admin",
		failureRedirect: "/admin/login",
		failureFlash: {type: "error", message: "Login failed. Please try again."}
	}), function(req, res){
});

/*===========================
	GENERAL ADMIN ROUTES
============================*/
router.get("/", middleware.isAdmin, function(req, res){
	res.render("admin");
});

router.get("/account", middleware.isAdmin, function(req, res){
	res.render("admin_account", {states: states, countries: countries});	
});

/*============================
	SITE USER ACCOUNT CRUD
==============================*/
router.get("/view-users", middleware.isAdmin, function(req, res){
	User.find({}).sort({lastName: 1}).limit(15).exec(function(err, users){
		if(err){
			console.log("User Query Error: " + err.message);
			req.flash("error", "User Query Error: " + err.message);
			return res.redirect("/admin");
		} else {
			res.render("admin_view_users", {users: users});
		}
	});
});

router.get("/new-user", middleware.isAdmin, function(req, res){
	res.render("admin_new_user", {states: states, countries: countries});
});

router.post("/new-user", middleware.isAdmin, function(req, res){
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
			console.log("User Creation Error: " + err.message);
			req.flash("error", "User Creation Error: " + err.message);
			return res.redirect("/admin/new-user");
		}
		req.flash("success", "New user has been created.");
		res.redirect("/admin/view-users");
	});
});

router.get("/edit-user/:id", middleware.isAdmin, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log("User Query by ID Error: " + err.message);
			req.flash("error", "User Query by ID Error: " + err.message);
			res.redirect("/admin/view-users");
		} else {
			res.render("admin_edit_user", {user: foundUser, states: states, countries: countries});
		}
	});
});

router.put("/edit-user/:id", middleware.isAdmin, function(req, res){
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			console.log("User Query by ID and Update Error: " + err.message);
			req.flash("error", "User Query by ID and Update Error: " + err.message);
			res.redirect("/admin/view-users");
		} else {
			req.flash("success", "User has been edited.");
			res.redirect("/admin/view-users");
		}
	});
});

router.delete("/view-user/:id", middleware.isAdmin, function(req, res){
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("User Query by ID and Remove Error: " + err.message);
			req.flash("error", "User Query by ID and Remove Error: " + err.message);
			res.redirect("/admin/view-users");
		} else {
			req.flash("success", "User has been removed.");
			res.redirect("/admin/view-users");
		}
	});
});

/*=========================
		ARTICLE CRUD
==========================*/
router.get("/new-article", middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "Game Query Error: " + err.message);
			return res.redirect("/admin/view-articles");
		} else {
			User.find({role: {$in: ["admin", "editor"]}}, function(err, authors){
				if(err){
					console.log("User Query Error: " + err.message);
					req.flash("error", "User Query Error: " + err.message);
					return res.redirect("/admin/view-articles");
				} else {
					Article.findOne({}, function(err, article){
						if(err){
							console.log("Article Query Error: " + err.message);
							req.flash("Article Query Error: " + err.message);
							return res.redirect("/admin/view-articles");
						} else {
							var contentTypes = article.contentTypes;
							var today = moment().local().format("YYYY-MM-DD");
							
							res.render("admin_new_article", {
								games: games, 
								authors: authors,
								contentTypes: contentTypes,
								today: today,
							});
						}
					});
				}
			});
		}
	});
});

router.get("/edit-article/:id", middleware.isAdmin, function(req, res){
	Article.findById(req.params.id, function(err, foundArticle){
		if(err){
			console.log("Article Query by ID Error: " + err.message);
			req.flash("error", "Article Query by ID Error: " + err.message);
			return res.redirect("/admin/view-articles");
		} else {
			Game.find({}, function(err, games){
				if(err){
					console.log("Game Query Error: " + err.message);
					req.flash("error", "Game Query Error: " + err.message);
					return res.redirect("/admin/view-articles");
				} else {
					User.find({role: {$in: ["admin", "editor"]}}, function(err, authors){
						if(err){
							console.log("User Query by Role Error: " + err.message);
							req.flash("error", "User Query by Role Error: " + err.message);
							return res.redirect("/admin/view-articles");
						} else {
							var contentTypes = foundArticle.contentTypes,
								published = moment(foundArticle.published).format("YYYY-MM-DD");
							
							res.render("admin_edit_article", {
								games: games, 
								authors: authors, 
								article: foundArticle,
								contentTypes: contentTypes,
								published: published,
							});
						}
					});
				}
			});
		}
	});
});

router.get("/view-articles", middleware.isAdmin, function(req, res){
	Article.find({}).sort({published: -1}).limit(15).exec(function(err, articles){
		if(err){
			console.log("Article Query Error: " + err.message);
			req.flash("error", "Article Query Error: " + err.message);
			return res.redirect("/admin");
		} else {
			res.render("admin_view_articles", {articles: articles});
		}
	});
});

/*==========================
		GAME CRUD
===========================*/
router.get("/view-games", middleware.isAdmin, function(req, res){
	Game.find({}).sort({title: 1}).exec(function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "Game Query Error: " + err.message);
			return res.redirect("/admin");
		} else {
			res.render("admin_view_games", {games: games});
		}
	});
});

router.get("/new-game", middleware.isAdmin, function(req, res){
	Game.findOne({}, function(err, game){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "Game Query Error: " + err.message);
			return res.redirect("/admin");
		} else {
			var genres = game.genres,
				platforms = game.platforms;
				
			res.render("admin_new_game", {genres: genres, platforms: platforms});
		}	
	});
});

router.post("/view-games", middleware.isAdmin, function(req, res){
	Game.create(req.body.game, function(err, newGame){
		if(err){
			console.log("Game Creation Error: " + err.message);
			req.flash("error", "Game Creation Error: " + err.message);
			return res.redirect("/admin");
		} else {
			req.flash("success", "Game has been created.");
			res.redirect("/admin/view-games");
		}
	});
});

router.get("/edit-game/:id", middleware.isAdmin, function(req, res){
	Game.findById(req.params.id, function(err, foundGame){
		if(err){
			console.log("Game Query by ID Error: " + err.message);
			req.flash("error", "Game Query by ID Error: " + err.message);
			res.redirect("/admin/view-games");
		} else {
			var genres = foundGame.genres,
				platforms = foundGame.platforms;
				
			res.render("admin_edit_game", {game: foundGame, genres: genres, platforms: platforms});
		}
	});
});

router.put("/view-games/:id", middleware.isAdmin, function(req, res){
	Game.findByIdAndUpdate(req.params.id, req.body.game, function(err, updatedGame){
		if(err){
			console.log("Game Query by ID and Update Error: " + err.message);
			req.flash("error", "Game Query by ID and Update Error: " + err.message);
			return res.redirect("/admin/view-games");
		} else {
			req.flash("success", "Game has been edited.");
			res.redirect("/admin/view-games");
		}
	});
});

router.delete("/view-games/:id", middleware.isAdmin, function(req, res){
	Game.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Game Query by ID and Remove Error: " + err.message);
			req.flash("error", "Game Query by ID and Remove Error: " + err.message);
			return res.redirect("/admin/view-games");
		} else {
			req.flash("success", "Game has been deleted.");
			res.redirect("/admin/view-games");
		}
	});
});

module.exports = router;