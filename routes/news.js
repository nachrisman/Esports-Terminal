var express = require('express'),
	router	= express.Router(),
	moment = require('moment'),
	Article = require('../models/article');

router.get('/', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days');

	Article.find({}).sort({published: -1}).limit(25).exec(function(err, articles){
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
							res.render('news', {articles: articles, pastArticles: pastArticles, randomArticles: randomArticles});
						}
					});
				}
			});	
		}
	});
});

router.get('/more/:lastSeen', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days');
	
	Article.find({published: {$lt: req.params.lastSeen}}).limit(25).sort({published: -1}).exec(function(err, articles){
		if(err){
			console.log(err);
		} 
		if(articles.length > 0) {
			Article.find({published: {$gte: lastWeek.toDate(), $lt: today.toDate()}}).sort({published: -1}).limit(5).exec(function(err, pastArticles){
				if(err){
					console.log(err);
				} else {
					Article.aggregate([{$sample: {size: 5} }], function(err, randomArticles){
						if(err){
							console.log(err);
						} else {
							res.render('news', {articles: articles, pastArticles: pastArticles, randomArticles: randomArticles});
						}
					});
				}
			});
		} else {
			res.redirect('/news');
		}
	});
});

router.get('/:id', function(req, res){
	Article.findById(req.params.id, function(err, foundArticle){
		if(err){
			res.redirect('/news');
		} else {
			Article.find({
				_id: {$ne: foundArticle._id}
			}).sort({published: -1}).limit(4).exec(function(err, relatedArticles){
				if(err){
					console.log(err);
				} else {
					res.render('article_view', {
						foundArticle: foundArticle, 
						relatedArticles: relatedArticles
					});
				};
			});
		};
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
			res.redirect('admin_view_articles');
		};
	});
});

module.exports = router;