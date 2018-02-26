var	sgTransport = require("nodemailer-sendgrid-transport"),
	Article		= require("../models/article"),
	Video		= require("../models/video"),
	User		= require("../models/user"),
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
	Article.find().sort({published: -1}).limit(4).exec(function(err, mostRecentArticles){
		if(err){
			console.log("Error in Article Query: " + err.message);
			req.flash("error", "Error in Article Query");
			return res.redirect("/");
		} else {
			Video.find().sort({published: -1}).limit(4).exec(function(err, videos){
				if(err){
					console.log("Error in Video Query: " + err.message);
					req.flash("error", "Error in Video Query: " + err.message);
					return res.redirect("/");
				} else {
					res.render("main", {mostRecentArticles: mostRecentArticles, videos: videos});
				}
			});
		}
	});
});

router.get("/creators", function(req, res){
	res.render("creators");	
});

router.get("/getinvolved", function(req, res){
	res.render("get_involved");
});

router.get("/privacy-policy", function(req, res){
	res.render("privacy_policy");
});

router.get("/terms-of-use", function(req, res){
	res.render("terms_of_use");
});

/*===========================
		CONTACT FORM
=============================*/
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
	      return res.redirect("/");
	    }
	    else {
	      req.flash("success", "Thanks for your submission! We\'ll get back to you ASAP!");
	      res.redirect("/");
	    }
	});
});

/*===========================
		CONTENT CREATORS
=============================*/
router.get("/:creator", function(req, res){
	User.findOne({username: req.params.creator}, function(err, creator){
		if(err){
			console.log("Error in User FindOne Query: " + err.message);
			req.flash("error", "Something went wrong. Please try visitng again later.");
			return res.redirect("/");
		} else if(creator) {
			Article.find({author: creator.fullname}).sort({published: -1}).limit(4).exec(function(err, articles){
				if(err){
					console.log("Error in Article Query: " + err.message);
					req.flash("error", "Error in Article Query");
					return res.redirect("/");
				} else {
					Video.find({creator: creator.username}).sort({published: -1}).limit(4).exec(function(err, videos){
						if(err){
							console.log("Error in Video Query: " + err.message);
							req.flash("error", "Error in Video Query");
							return res.redirect("/");
						} else {
							res.render("creator_profile", {articles: articles, creator: creator, videos: videos});
						}
					});
				}	
			});
		} else {
			res.redirect("/")
		}
	});
});

module.exports = router;