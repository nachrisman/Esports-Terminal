var express = require('express'),
	router	= express.Router(),
	moment = require('moment'),
	Article = require('../models/article');

router.get('/', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days');
	
	Article.find({}).sort({published: -1}).limit(3).exec(function(err, mostRecentArticles){
		if(err){
			console.log(err);
		} else {
			var lastPublished = mostRecentArticles[mostRecentArticles.length - 1].published;
			
			Article.find({published: {$lt: lastPublished}}).sort({published: -1}).limit(22).exec(function(err, articles){
				if(err){
					console.log(err);
				} else {
					Article.find({
						published: {$gte: lastWeek.toDate(), $lt: today.toDate()}
					}).sort({published: -1}).limit(5).exec(function(err, lastWeeksArticles){
						if(err){
							console.log(err);
						} else {
							Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
								if(err){
									console.log(err);
								} else {
									res.render('news', {
										mostRecentArticles: mostRecentArticles, 
										articles: articles, 
										randomArticles: randomArticles, 
										lastWeeksArticles: lastWeeksArticles});
								}
							});
						}
					});
				}
			});
		}
	});
});

router.get('/more-articles/:lastSeen', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days');
	
	Article.find({published: {$lt: req.params.lastSeen}}).sort({published: -1}).limit(3).exec(function(err, mostRecentArticles){
		if(err){
			console.log(err);
		} else {
			var lastPublished = mostRecentArticles[mostRecentArticles.length - 1].published;
			
			Article.find({published: {$lt: lastPublished}}).sort({published: -1}).limit(22).exec(function(err, articles){
				if(err){
					console.log(err);
				} else {
					Article.find({
						published: {$gte: lastWeek.toDate(), $lt: today.toDate()}
					}).sort({published: -1}).limit(5).exec(function(err, lastWeeksArticles){
						if(err){
							console.log(err);
						} else {
							Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
								if(err){
									console.log(err);
								} else {
									res.render('news', {
										mostRecentArticles: mostRecentArticles, 
										articles: articles, 
										randomArticles: randomArticles, 
										lastWeeksArticles: lastWeeksArticles});
								}
							});
						}
					});
				}
			});
		}
	});
});
	
	// Article.find({published: {$lt: req.params.lastSeen}}).limit(25).sort({published: -1}).exec(function(err, articles){
	// 	if(err){
	// 		console.log(err);
	// 	} 
	// 	if(articles.length > 0) {
	// 		Article.find({published: {$gte: lastWeek.toDate(), $lt: today.toDate()}}).sort({published: -1}).limit(5).exec(function(err, pastArticles){
	// 			if(err){
	// 				console.log(err);
	// 			} else {
	// 				Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
	// 					if(err){
	// 						console.log(err);
	// 					} else {
	// 						Article.find({published: {$gte: lastWeek.toDate(), $lt: today.toDate()}, contentType: 'video'}).sort({published: -1}).exec(function(err, recentVideos){
	// 							if(err){
	// 								console.log(err);
	// 							} else {
	// 								res.render('news', {articles: articles, pastArticles: pastArticles, randomArticles: randomArticles, recentVideos: recentVideos});
	// 							}
	// 						});
	// 					}
	// 				});
	// 			}
	// 		});
	// 	} else {
	// 		res.redirect('/news');
	// 	}
	// });


router.get('/:id', function(req, res){
	var metaTags = {
		metaTagsUrl: 'https://Test.com/',
		metaTagsSite: '@Test',
		metaTagsImg: 'https://url/img.png',
		metaTagsTitle: 'Test',
		metaTagsName: 'Test',
		metaTagsType: 'website',
		metaTagsDescription: "Description",
		metaTagsRobots: 'index,follow',
		metaTagsKeyWords: 'esports, news, articles'
	};
	Article.findById(req.params.id, function(err, foundArticle){
		if(err){
			res.redirect('/news');
		} else {
			var relatedCategories = foundArticle.categories.remove('general');
			Article.find({
				_id: {$ne: foundArticle._id},
				categories: {$in: relatedCategories}
			}).sort({published: -1}).limit(5).exec(function(err, relatedArticles){
				if(err){
					console.log(err);
				} else {
					Article.find({contentType: 'video', categories: {$in: foundArticle.categories}}).sort({published: -1}).limit(5).exec(function(err, relatedVideos){
						if(err){
							console.log(err);
						} else {
							metaTags.metaTagsUrl = 'https://esportsterminal.com/news/' + foundArticle._id;
							metaTags.metaTagsSite = '@esportsterminal';
							metaTags.metaTagsImg = foundArticle.image;
							metaTags.metaTagsTitle = foundArticle.title;
							metaTags.metaTagsName = foundArticle.title;
							metaTags.metaTagsType = foundArticle.contentType;
							metaTags.metaTagsDescription = foundArticle.subTitle;
							metaTags.metaTagsRobots = 'index,follow';
							metaTags.metaTagsKeyWords = foundArticle.title;
							
							res.render('article_view', {
								foundArticle: foundArticle, 
								relatedArticles: relatedArticles,
								relatedVideos: relatedVideos,
								metaTags: metaTags
							});
						}
					});
				}
			});
		}
	});	
});

router.post('/', function(req, res){
	Article.create(req.body.article, function(err, newArticle){
		if(err){
			req.flash('error', 'Could not add article. Check error logs.');
			console.log(err);
			res.redirect('/admin/view-articles');
		} else {
			req.flash('success', 'New article added successfully!');
			res.redirect('/news');
		};
	});
});

router.put('/:id', function(req, res){
	Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle){
		if(err){
			req.flash('error', 'Could not edit article. Check error logs.');
			console.log(err)
			res.redirect('/admin/edit-article/:id');
		} else {
			req.flash('success', 'Article edited successfully!');
			res.redirect('/news/' + req.params.id);
		};
	});
});

router.delete('/:id', function(req, res){
	Article.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Could not delete article. Check error logs.');
			console.log(err);
			res.redirect('/admin/view-articles');
		} else {
			req.flash('success', 'Article deleted successfully!');
			res.redirect('/admin/view-articles');
		};
	});
});

router.get('/game/:game', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days');

	Article.find({categories: req.params.game }).sort({published: -1}).limit(25).exec(function(err, articles){
		if(err){
			console.log(err);
		} else {
			Article.find({
				published: {$gte: lastWeek.toDate(), $lt: today.toDate()}
			}).sort({published: -1}).limit(5).exec(function(err, pastArticles){
				if(err){
					console.log(err);
				} else {
					Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
						if(err){
							console.log(err);
						} else {
							res.render('news_game', {
								articles: articles,
								pastArticles: pastArticles, 
								randomArticles: randomArticles,
								query: req.params.game
							});
						}
					});
				}
			});	
		}
	});
});

module.exports = router;