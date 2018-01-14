var Article = require("../models/article"),
	Game	= require("../models/game"),
	express = require("express"),
	moment = require("moment"),
	router	= express.Router();

/*=======================================
	ALL NEWS ROUTE/CUSTOM IF LOGGED IN
=========================================*/
router.get("/", function(req, res){
	var today = moment().startOf("day"),
		lastWeek = moment().subtract(7, "days");
	
	if(req.isAuthenticated()){
		Game.find({franchise: {$in: req.user.games}}, function(err, games){
			if(err){
				console.log("Game Query Error: " + err.message);
				return res.redirect("/news");
			} else {
				var titles = [];
				
				games.forEach(function(game){ titles.push(game.title); });
				
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
														franchise: false
													});
												}	
											});
										}
									});
							}	
						});
					} else { res.render("no_content", {franchise: req.params.franchise}); }	
				});
			}
		});
	} else {
		Article.find({}).sort({published: -1}).limit(3).exec(function(err, mostRecentArticles){
			if(err){
				console.log("Article Query Error: " + err.message);
				req.flash("error", "There was an error loading the page.");
				return res.redirect("/news");
			} else {
				var lastPublished = mostRecentArticles[mostRecentArticles.length - 1].published;
				
				Article.find({published: {$lt: lastPublished}}).sort({published: -1}).limit(22).exec(function(err, articles){
					if(err){
						console.log("Article Query Error: " + err.message);
						req.flash("error", "There was an error loading the page.");
						return res.redirect("/news");
					} else {
						Article.find({
							published: {$gte: lastWeek.toDate(), $lt: today.toDate()}
						}).sort({published: -1}).limit(5).exec(function(err, lastWeeksArticles){
							if(err){
								console.log("Article Query Error: " + err.message);
								req.flash("error", "There was an error loading the page.");
								return res.redirect("/news");
							} else {
								Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
									if(err){
										console.log("Article Query Error: " + err.message);
										req.flash("error", "There was an error loading the page.");
										return res.redirect("/news");
									} else {
										res.render("news", {
											mostRecentArticles: mostRecentArticles, 
											articles: articles, 
											randomArticles: randomArticles, 
											lastWeeksArticles: lastWeeksArticles,
											franchise: false
										});
									}
								});
							}
						});
					}
				});
			}
		});	
	}
});

router.get("/more-articles/:lastSeen", function(req, res){
	var today = moment().startOf("day");
	var lastWeek = moment().subtract(7, "days");
	
	Article.find({published: {$lt: req.params.lastSeen}}).sort({published: -1}).limit(3).exec(function(err, mostRecentArticles){
		if(err){
			console.log("Article Query Error: " + err.message);
			req.flash("error", "There was an error loading the page.");
			return res.redirect("/news");
		} else {
			var lastPublished = mostRecentArticles[mostRecentArticles.length - 1].published;
			
			Article.find({published: {$lt: lastPublished}}).sort({published: -1}).limit(22).exec(function(err, articles){
				if(err){
					console.log("Article Query Error: " + err.message);
					req.flash("error", "There was an error loading the page.");
					return res.redirect("/news");
				} else {
					Article.find({
						published: {$gte: lastWeek.toDate(), $lt: today.toDate()}
					}).sort({published: -1}).limit(5).exec(function(err, lastWeeksArticles){
						if(err){
							console.log("Article Query Error: " + err.message);
							req.flash("error", "There was an error loading the page.");
							return res.redirect("/news");
						} else {
							Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
								if(err){
									console.log("Article Query Error: " + err.message);
									req.flash("error", "There was an error loading the page.");
									return res.redirect("/news");
								} else {
									res.render("news", {
										mostRecentArticles: mostRecentArticles, 
										articles: articles, 
										randomArticles: randomArticles, 
										lastWeeksArticles: lastWeeksArticles,
										franchise: false
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

/*=====================================
	ARTICLE CRUD ROUTES + UX VIEW
======================================*/
router.get("/:id", function(req, res){
	var metaTags = {
		metaTagsUrl: "https://Test.com/",
		metaTagsSite: "@Test",
		metaTagsImg: "https://url/img.png",
		metaTagsTitle: "Test",
		metaTagsName: "Test",
		metaTagsType: "website",
		metaTagsDescription: "Description",
		metaTagsRobots: "index, follow",
		metaTagsKeyWords: "esports, news, articles"
	};
	
	Article.findById(req.params.id, function(err, foundArticle){
		if(err){
			console.log("Article Query Error: " + err.message);
			req.flash("error", "There was an error loading the page.");
			return res.redirect("/news");
		} else {
			var relatedCategories = foundArticle.categories.remove('general');
			Article.find({
				_id: {$ne: foundArticle._id},
				categories: {$in: relatedCategories}
			}).sort({published: -1}).limit(5).exec(function(err, relatedArticles){
				if(err){
					console.log("Article Query Error: " + err.message);
					req.flash("error", "There was an error loading the page.");
					return res.redirect("/news");
				} else {
					metaTags.metaTagsUrl = "https://www.esportsterminal.com/news/" + foundArticle._id;
					metaTags.metaTagsSite = "@esportsterminal";
					metaTags.metaTagsImg = foundArticle.image;
					metaTags.metaTagsTitle = foundArticle.title;
					metaTags.metaTagsName = foundArticle.title;
					metaTags.metaTagsType = foundArticle.contentType;
					metaTags.metaTagsDescription = foundArticle.subTitle;
					metaTags.metaTagsRobots = "index, follow";
					metaTags.metaTagsKeyWords = foundArticle.title;
					
					res.render("article_view", {
						foundArticle: foundArticle, 
						relatedArticles: relatedArticles,
						metaTags: metaTags
					});
				}
			});
		}
	});	
});

router.post("/", function(req, res){
	Article.create(req.body.article, function(err, newArticle){
		if(err){
			console.log("Article Creation Error: " + err.message);
			req.flash("error", "Article Creation Error: " + err.message);
			res.redirect("/admin/view-articles");
		} else {
			req.flash("success", "Article added successfully.");
			res.redirect("/news");
		}
	});
});

router.put("/:id", function(req, res){
	Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle){
		if(err){
			console.log("Article Query by ID and Update Error: " + err.message);
			req.flash("error", "Article Query by ID and Update Error: " + err.message);
			return res.redirect("/admin/edit-article/:id");
		} else {
			req.flash("success", "Article has been edited.");
			res.redirect("/news/" + req.params.id);
		};
	});
});

router.delete("/:id", function(req, res){
	Article.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Article Query by ID and Remove Error: " + err.message);
			req.flash("error", "Article Query by ID and Remove Error: " + err.message);
			return res.redirect("/admin/view-articles");
		} else {
			req.flash("success", "Article has been deleted.");
			res.redirect("/admin/view-articles");
		}
	});
});

module.exports = router;