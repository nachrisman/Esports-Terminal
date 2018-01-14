router.get("/meta", middleware.isLoggedIn, function(req, res){
	var meta = req.user.meta,
		games = [];
	
	meta.forEach(function(metaOption){
		if(metaOption.news == true){ games.push(metaOption.game); }	
	});
	
	Article.find({categories: {$in: games}}).sort({published: -1}).limit(games.length * 10).exec(function(err, articles){
		if(err){
			console.log("Article Query Error: " + err.message);
			req.flash("error", "There was an error loading your account page. Please try again.");
			return res.redirect("/news");
		} else {
			res.render("meta", {games: games, articles: articles});
		}
	});
});

router.get("/meta-settings", middleware.isLoggedIn, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			console.log("Game Query Error: " + err.message);
			req.flash("error", "There was an error loading the page. Please try again.")
			return res.redirect("/news");
		} else {
			res.render("account_meta_settings", {games: games});
		}
	});
});

router.put("/meta-settings", middleware.isLoggedIn, function(req, res){
	var userMeta = req.user.meta,
		updatedEvents = req.body.events,
		updatedNews = req.body.news,
	    updatedMeta = [];
	
	userMeta.forEach(function(meta){
		if(updatedEvents.indexOf(meta.game) > -1){
			meta.events = true;
			updatedEvents.splice(updatedEvents.indexOf(meta.game), 1);
		} else {
			meta.events = false;
		}

		if(updatedNews.indexOf(meta.game) > -1){
			meta.news = true;
			updatedNews.splice(updatedNews.indexOf(meta.game), 1);
		} else {
			meta.news = false;
		}
	});
	
	if(updatedEvents.length > 0){
		updatedEvents.forEach(function(event){
			updatedMeta.push({game: event, events: true, news: false});	
		});
	}
	
	if(updatedNews.length > 0){
		updatedNews.forEach(function(news){
			if(updatedMeta.find(meta => meta.game == news)) {
				updatedMeta.find(meta => meta.game == news).news = true;
			} else {
				updatedMeta.push({game: news, events: false, news: true});
			}	
		});
	}
	
	userMeta.forEach(function(meta){
		updatedMeta.push(meta);	
	});
	
	User.findByIdAndUpdate(req.user._id, {$set: {meta: updatedMeta } }, function(err, updatedUser){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/account/meta-settings');
		} else {
			req.flash('success', 'Your META has been updated. Enjoy the new content!');
			res.redirect('/account/meta-settings');
		}
	});
});