var	sgTransport = require("nodemailer-sendgrid-transport"),
	Article		= require("../models/article"),
	User 		= require("../models/user"),
	Game 		= require("../models/game"),
	middleware  = require("../middleware"),
	countryList = require("country-list")(),
	nodemailer	= require("nodemailer"),
	country		= require("countryjs"),
	passport 	= require("passport"),
	express 	= require("express"),
	moment 		= require("moment"),
	crypto		= require("crypto"),
	router		= express.Router();
	
var states	  = country.states("US"),
	countries = countryList.getNames();

/*=================
	EMAIL AUTH
===================*/
var options = {auth: {api_key: process.env.SENDGRID_API_KEY}};
var client = nodemailer.createTransport(sgTransport(options));

/*====================================
	USER ACCOUNT PORTAL (LOGGED IN)
======================================*/
router.get("/", middleware.isLoggedIn, function(req, res){
	res.redirect("/account/settings");
});

router.get("/info", middleware.isLoggedIn, function(req, res){
	res.render("account_info", {states: states, countries: countries});
});

router.put("/info", middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash("error", "There was an error updating your account. Please try again.");
			console.log("Error in Updating User Information: " + err.message);
			return res.redirect("/account/info");
		} else {
			req.flash("success", "Your account has been updated!");
			res.redirect("/account/info");
		}
	});
});

/*=================================
	USER GAME SUBSCRIPTIONS
==================================*/
router.get("/settings", middleware.isLoggedIn, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "There was an error loading the page. Please try again.");
			return res.redirect("/news");
		} else {
			var franchises = [];
			games.forEach(function(game){
				if(game.franchise){ franchises.push(game.franchise); }	
			});
			res.render("account_settings", {franchises: franchises});			
		}	
	});
});

router.put("/settings", middleware.isLoggedIn, function(req, res){
	var userGames = req.user.games,
		newGames = req.body.games;

	newGames.forEach(function(game){
		if(userGames.indexOf(game) > -1){
		} else {
			newGames.push(game);
		}
	});
	
	User.findByIdAndUpdate(req.user._id, {$set: {games: newGames}}, function(err, updatedUser){
		if(err){
			console.log("Error Updating User Settings: " + err.message);
			req.flash("error", "There was an error updating your settings. Please try again.");
			return res.redirect("/account/settings");
		} else {
			req.flash("success", "Your settings have been updated!");
			res.redirect("/account/settings");
		}
	});	
});

/*=================================================
	USER PASSWORD & NEWSLETTER ROUTES (LOGGED IN)
===================================================*/
router.get("/security", middleware.isLoggedIn, function(req, res){
	res.render("account_security");
});

router.put("/security", middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, {$set: {newsletter: req.body.email} }, function(err, updatesUser){
		if(err){
			console.log(err);
			return res.redirect("/account/security");
		} else {
			req.flash("success", "Your settings have been updated!");
			res.redirect("/account/security");
		}
	});	
});

router.get("/change-password", middleware.isLoggedIn, function(req, res){
	res.render("account_change_password");	
});

router.put("/change-password", function(req, res){
	User.findById(req.user._id, function(err, foundUser){
		if(err){
			console.log("User Query by ID Error: " + err.message);
			req.flash("error", "Something happened when trying to load the page. Please try again.");
			return res.redirect("/account/change-password");
		} else {
			foundUser.changePassword(req.body.oldPassword, req.body.newPassword, function(err, next){
				if(err){
					console.log("Error in Updating User Password: " + err.message);
					req.flash("error", "We could not update your password. Please try again.");
					return res.redirect("/account/change-password");
				} else {
					req.flash("success", "Your password was updated!");
					res.redirect("/account/info");
				}
			});
		}
	});
});

/*==================================
	ACCOUNT DEACTIVATION/DELETION
====================================*/
router.get("/deactivate", middleware.isLoggedIn, function(req, res){
	res.render("account_deactivate");	
});

router.put("/deactivate", middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.user._id, {$set: {active: false} }, function(err, foundUser){
		if(err){
			console.log("User Query by ID and Update Error: " + err.message);
			req.flash("error", "Something went wrong on this page. Please try again.");
			return res.redirect("/account/deactivate");
		} else {
			var reason = req.body.deactivationReason;
			var comments = req.body.additionalComments;
			var email = {
				from: "accounts@esportsterminal.com",
				to: "nate@esportsterminal.com",
				subject: "ACCOUNT DEACTIVATION",
				html: "User: " + req.user.email + "<br>Reason: " + reason + "<br>Comments: " + comments
			};
			client.sendMail(email, function(err, info){
				if (err){
					console.log("Error Sending Deactivation Email to Admin: " + err.message);
					req.flash("success", "Your account has been deactivated. We hope to see you again!");
					return res.redirect("/news");
				} else {
					req.flash("success", "Your account has been deactivated. We hope to see you again!");
					res.redirect("/news");
				}
			});
		}
	});
});

router.get("/delete-account", middleware.isLoggedIn, function(req, res){
	res.render("account_delete_account");
});

router.delete("/delete-account", middleware.isLoggedIn, function(req, res){
	User.findByIdAndRemove(req.user._id, function(err){
		if(err){
			console.log("Error in User Query ID and Removal: " + err.message);
			req.flash("error", "There was an error in deleting your account. Please try again.");
			return res.redirect("/delete-account");
		} else {
			var reason = req.body.deactivationReason;
			var comments = req.body.additionalComments;
			var email = {
				from: "accounts@esportsterminal.com",
				to: "nate@esportsterminal.com",
				subject: "ACCOUNT DELETION",
				html: "User: " + req.user.email + "<br>Reason: " + reason + "<br>Comments: " + comments
			};
			client.sendMail(email, function(err, info){
				if (err){
					console.log("Error Sending Account Deletion Email: " + err.message);
					req.flash("success", "Your account has been deleted! We hope to see you again!");
					return res.redirect("/news");
				} else {
					req.flash("success", "Your account has been deleted! We hope to see you again!");
					res.redirect("/news");
				}
			});
		}
	});
});

/*=====================================
	ACCOUNT REGISTRATION/VERIFICATION
=======================================*/
router.get("/register", function(req, res){
	Game.find({active: true}, function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "There was an error loading the page. Please try again.");
			return res.redirect("/news");
		} else {
			res.render("register", {games: games, countries: countries, states: states});
		}
	});
});

router.post("/register", function(req, res){
	var buf = crypto.randomBytes(256),
		token = buf.toString("hex");

	var newUser = new User({
		username: req.body.username.toLowerCase(),
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		location: {country: req.body.country},
		validationToken: {token: token, expiration: moment()}
	});
	
	if(req.body.password == req.body.confirmedPassword){
		User.findOne({email: req.body.email}, function(err, user){
			if(err){
				console.log("User Query by Email Error: " + err.message);
				req.flash("error", "There was a problem when creating your account. Please try again.");
				return res.redirect("/account/register");
			} else if(user){
				req.flash("error", "There's already a user registered with that email. Please use a different one.");
				res.redirect("/account/register");
			} else {
		    	var link = "http://" + req.get("host") + "/account/verify?id=" + token;
		    	
				User.register(newUser, req.body.password, function(err, user){
					if(err){
						console.log("Error in Registering New User: " + err.message);
						req.flash("error", err.message);
						return res.redirect("/account/register");
					}
					passport.authenticate("local")(req, res, function(){
						var email = {
							from: "registration@esportsterminal.com",
							fromname: "Esports Terminal",
							to: user.email,
							subject: "Esports Terminal: Please Confirm Your New Account with Us",
							html: "Hey, " + user.firstName + "! <br><br><p>Thanks for creating an account with EST. Next step is to verify your email. <br><br> <a href="+ link +">Click Here to Confirm Your Account!</a>"
						};
						client.sendMail(email, function(err, info){
							if (err){
								console.log("Error Sending New Account Verification to User: " + err.message);
								req.flash("error", "There was an error in sending your verification email. Please try again.");
								return res.redirect("/account/register");
							} else {
								req.flash("warning", "Please check your email to confirm your account!");
								res.redirect("/account/meta-settings");
							}
						});
					});
				});
			}
		});
	} else {
		req.flash("error", "Both passwords must match.");
		res.redirect("/account/register");
	}
});

router.get("/verify",function(req,res){
	var yesterday = moment().subtract(1, 'day');
	if((req.protocol + "://" + req.get("host")) == ("http://" + req.get("host"))){
		if(req.query.id == req.user.validationToken.token && req.user.validationToken.expiration >= yesterday){
			User.findByIdAndUpdate(req.user.id, {$set: {active: true, validationToken: {token: undefined, expiration: undefined}}}, function(err, user){
				if(err){
					console.log("User Query by ID and Update Error: " + err.message);
					req.flash("error", "There was an error loading this page. Please try again.");
					return res.redirect("/news");
				} else {
					var email = {
						from: "registration@esportsterminal.com",
						fromname: "Esports Terminal",
						to: "nate@esportsterminal.com",
						subject: "NEW ACCOUNT CREATED",
						html: "This is an automatic notification to inform you that a new account has been created on Esports Terminal!"
					};
					client.sendMail(email, function(err, info){
						if(err){
							console.log("Error Sending New Account Creation Email to Admin: " + err.message);
							req.flash("success", "Your account has been verified. Thanks!");
							return res.redirect("/account/meta-settings");
						} else {
							req.flash("success", "Your account has been verified. Thanks!");
							res.redirect("/account/meta-settings");
						}
					});
				}
			});
		} else {
			req.flash("error", "Your email could not be verified.");
			res.redirect("/news");
		}
	} else {
		res.end("<h1>Request is from unknown source</h1>");
	}
});

router.get("/resend-email-verification", function(req, res){
	var buf = crypto.randomBytes(256),
		token = buf.toString("hex");
	
	User.findByIdAndUpdate(req.query.uid, {validationToken: {token: token, expiration: moment()}}, function(err, user){
		if(err){
			console.log("User Query by ID and Update Error: " + err.message);
			req.flash("error", "There was an error resending the verification email. Please try again.");
			return res.redirect("/news");
		} else {
			var link = "http://" + req.get("host") + "/account/verify?id=" + token;
			var email = {
				from: "registration@esportsterminal.com",
				fromname: "Esports Terminal",
				to: user.email,
				subject: "Esports Terminal: Please Confirm Your New Account with Us",
				html: "Hey, " + user.firstName + "! <br><br><p>Thanks for creating an account with EST. Next step is to verify your email. <br><br> <a href=" + link + ">Click Here to Confirm Your Account!</a>"
			};
			client.sendMail(email, function(err, info){
				if (err){
					console.log("Error Re-Sending the Verification Email to User: " + err.message);
					req.flash("error", "There was an error resending the verification email. Please try again.");
					return res.redirect("/news");
				} else {
					req.flash("warning", "We have resent the verification email to you.");
					res.redirect("/news");
				}
			});
		}
	});	
});

/*========================
	LOGIN/LOGOUT ROUTES
=========================*/
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", middleware.usernameToLowerCase, passport.authenticate("local", 
	{
		successRedirect: "/news",
		failureRedirect: "/login",
		failureFlash: {type: "error", message: "Invalid username or password."}
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You've been logged out!");
	res.redirect("/news");
});

/*================================================
	USER FORGOT PASSWORD (NOT LOGGED IN) ROUTES
===================================================*/
router.get("/forgot-password", function(req, res){
	res.render("forgot_password");
});

router.post("/forgot-password", function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		if(err){
			console.log("User Query by Email Error: " + err.message);
			req.flash("error", err.message);
			return res.redirect("/account/forgot-password");
		} else {
			var buf = crypto.randomBytes(256),
				expiration = moment(),
				token = buf.toString("hex");
			
			user.validationToken.token = token;
			user.validationToken.expiration = expiration;
			
			user.save(function(err){
				if(err){ console.error("Error in Saving User Validation Token: " + err.message); } });
			
			var link = "http://" + req.get("host") + "/account/forgot-password/change?id=" + user._id + "&token=" + user.validationToken.token;
			var email = {
				from: "registration@esportsterminal.com",
				fromname: "Esports Terminal",
				to: user.email,
				subject: "Esports Terminal: Password Reset Request",
				html: "Hey, " + user.firstName + "! <br><br><p>You recently requested to reset your password. " + 
							"In order to do this, please follow the link below." + 
							"<br><br><a href="+ link +">Reset My Password</a>"
			};
			client.sendMail(email, function(err, info){
				if (err){
					console.log("Error Sending Password Reset Email to User: " + err.message);
					req.flash("error", "There was an error in sending the password reset email. Please try again.");
					return res.redirect("/account/forgot-password");
				} else {
					req.flash("warning", "Please check your email for a password reset link!");
					res.redirect("/news");
				}
			});
		}
	});	
});

router.get("/forgot-password/change", function(req, res){
	var yesterday = moment().subtract(1, "day");
		
	if((req.protocol + "://" + req.get("host")) == ("http://" + req.get("host"))) {
	    User.findOne({_id: req.query.id}, function(err, user){
	    	if(err){
	    		req.flash("error", err.message);
	    		return res.redirect("/account/forgot-password");
	    	} else if(req.query.token == user.validationToken && user.validationToken.expiration >= yesterday) {
	    		res.render("forgot_password_change", {user: user});
	    	} else {
	    		req.flash("error", err.message);
	    		return res.redirect("/account/forgot-password");
	    	}
	    });
	} else {
		res.end("<h1>Request is from unknown source</h1>");
	}
});

router.put("/forgot-password/change/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log("User Query by ID Error: " + err.message);
			req.flash("error", err.message);
			return res.redirect("/account/forgot-password");
		} else if(req.body.newPassword == req.body.confirmedPassword){
			foundUser.validationToken.token = undefined;
			foundUser.validationToken.expiration = undefined;
			foundUser.setPassword(req.body.confirmedPassword, function(err){
				if(err){
					console.log("Error in Setting User Password: " + err.message);
					req.flash("error", err.message);
					return res.redirect("/account/forgot-password");
				} else {
					foundUser.save(function(err){
						if(err){ console.log("Error Saving User During Password Change: " + err.message); }	});
				}
			});
			req.flash("success", "Your password has been changed!");
			res.redirect("/login");
		}
	});
});

module.exports = router;