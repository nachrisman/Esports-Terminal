var	sgTransport = require("nodemailer-sendgrid-transport"),
	Article		= require("../models/article"),
	Game 		= require("../models/game"),
	nodemailer	= require("nodemailer"),
	express 	= require("express"),
	moment 		= require("moment"),
	router		= express.Router();
	
/*=================
	EMAIL AUTH
=================*/
var options = {auth: {api_key: process.env.SENDGRID_API_KEY}};
var client = nodemailer.createTransport(sgTransport(options));

/*====================
	GENERAL ROUTES
======================*/
router.get("/", function(req, res){
	res.redirect("/news");
});

router.get("/privacy-policy", function(req, res){
	res.render("privacy_policy");
});

router.get("/terms-of-use", function(req, res){
	res.render("terms_of_use");
});

router.get("/info", function(req, res){
	res.render("info");
});

/*===========================
	INFO/TIP SUBMIT/CONTACT
=============================*/
router.get("/write-for-us", function(req, res){
	res.render("write_for_us");	
});

router.post("/write-for-us", function(req, res){
	var email = {
		from: "writeforus@esportsterminal.com",
		to: "esportsterminal@gmail.com",
		subject: "Write for Us - NEW SUBMISSION",
		html: "Date/Time: " + moment().toDate() + "<br>Name: " + req.body.firstName + " " + req.body.lastName + "<br>" + 
			"Username: " + req.body.username + "<br>Email: " + req.body.email + "<br>Social: " + req.body.social + "<br>" +
			"Work Samples: " + req.body.links + "<br>" + "Message: " + req.body.message
	};
	
	client.sendMail(email, function(err, info){
	    if (err){
	      console.log(err);
	    }
	    else {
	      req.flash("success", "Thanks for your submission! We hope to talk to you soon.");
	      res.redirect("/news");
	    }
	});
});

router.get("/contact", function(req, res){
	res.render("contact");	
});

router.post("/contact", function(req, res){
	var email = {
		from: "contact@esportsterminal.com",
		to: "esportsterminal@gmail.com",
		subject: "Contact Form Submission",
		html: "Date/Time: " + moment().toDate() + "<br>Name: " + req.body.firstName + " " + req.body.lastName + "<br>" + 
			"Username: " + req.body.username + "<br>Email: " + req.body.email + "<br>Message: " + req.body.message
	};
	
	client.sendMail(email, function(err, info){
	    if (err){
	      console.log("Error Sending Contact Email: " + err.message);
	      return res.redirect("/news");
	    }
	    else {
	      req.flash("success", "Thanks for your submission! We\'ll get back to you ASAP!");
	      res.redirect("/news");
	    }
	});
});

/*=========================
	SEARCH FUNCTIONALITY
===========================*/
router.get("/search/articles", function(req, res){
	Article.find({$text: {$search: req.query.search} }).limit(25).exec(function(err, foundArticles){
		if(err){
			req.flash("error", err.message + "Search could not be completed. Please try again. If the issue persists, please contact us.");
			return res.redirect("/news");
		} else {
			res.render("search_articles", {foundArticles: foundArticles, search: req.query.search});
		}
	});	
});

router.get("/search/author", function(req, res){
	Article.find({$text: {$search: req.query.search} }).limit(30).exec(function(err, foundArticles){
		if(err){
			req.flash("error", "Search could not be completed. Please try again. If the issue persists, please contact us.");
			return res.redirect("/news");
		} else {
			res.render("search_articles", {foundArticles: foundArticles, search: req.query.search});
		}
	});	
});

/*=========================
		DONATION
===========================*/
router.get("/donate", function(req, res){
	res.render("donate");	
});

router.get("/donate/success", function(req, res){
	res.render("donate_success");	
});

/*==================================
	GAME SPECIFIC CONTENT HANDLER
====================================*/
router.get("/:franchise", function(req, res){
	var today = moment().startOf("day"),
		lastWeek = moment().subtract(7, "days");
		
	Game.find({franchise: req.params.franchise}, function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			return res.redirect("news");
		} else {
			var titles = [];
			
			games.forEach(function(game){
				titles.push(game.title);
			});
			
			Article.find({categories: {$in: titles}}).sort({published: -1}).limit(3).exec(function(err, mostRecentArticles){
				if(err){
					console.log("Article Query Error: " + err.message);
					return res.redirect("/news");
				} else if(mostRecentArticles.length > 0) {
					var lastPublished = mostRecentArticles[mostRecentArticles.length - 1].published;
					
					Article.find({published: {$lt: lastPublished}, categories: {$in: titles}}).sort({published: -1}).limit(22).exec(function(err, articles){
						if(err){
							console.log("Article Query Error: " + err.message);
							return res.redirect("/news");
						} else {
							Article.find({
								published: {$gte: lastWeek.toDate(), $lt: today.toDate()}, 
								categories: {$in: titles}}).sort({published: -1}).limit(5).exec(function(err, lastWeeksArticles){
									if(err){
										console.log("Article Query Error: " + err.message);
										return res.redirect("/news");
									} else {
										Article.aggregate([{$sample: {size: 5}}], function(err, randomArticles){
											if(err){
												console.log("Article Query Error: " + err.message);
												return res.redirect("/news");
											} else {
												res.render("news", {
													mostRecentArticles: mostRecentArticles, 
													articles: articles, 
													randomArticles: randomArticles, 
													lastWeeksArticles: lastWeeksArticles,
													franchise: req.params.franchise
												});
											}	
										});
									}
								});
						}	
					});
				} else {
					res.render("no_content", {franchise: req.params.franchise});
				}	
			});
		}	
	});
});

module.exports = router;