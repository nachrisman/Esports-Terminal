var Article = require("../models/article"),
	User	= require("../models/user"),
	express = require("express"),
	router	= express.Router();

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
			return res.redirect("/main");
		} else {
			User.find({role: {$in: ["admin", "editor"]}}, function(err, creators){
				if(err){
					console.log("Error in User Query: " + err.message);
					req.flash("error", "Error in User Query: " + err.message);
					return res.redirect("/main");
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
						metaTags: metaTags,
						creators: creators
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