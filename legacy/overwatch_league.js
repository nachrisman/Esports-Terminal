// router.get('/overwatch-league', function(req, res){
// 	var metaTags = {
// 		metaTagsUrl: 'https://Test.com/',
// 		metaTagsSite: '@Test',
// 		metaTagsImg: 'https://url/img.png',
// 		metaTagsTitle: 'Test',
// 		metaTagsName: 'Test',
// 		metaTagsType: 'website',
// 		metaTagsDescription: "Description",
// 		metaTagsRobots: 'index,follow',
// 		metaTagsKeyWords: 'esports, news, articles'
// 	};
// 	Team.find({}, function(err, teams){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			var teamNames = [];
// 			teams.forEach(function(team){
// 				teamNames.push(team.name);	
// 			});
// 			Article.find({categories: {$in: ['Overwatch League', 'Overwatch']}}).sort({published: -1}).limit(10).exec(function(err, articles){
// 				if(err){
// 					console.log(err);
// 				} else {
// 					Event.find({teams: {$in: teamNames}}).limit(10).exec(function(err, events){
// 						if(err){
// 							console.log(err);
// 						} else {
// 							metaTags.metaTagsUrl = 'https://esportsterminal.com/overwatch-league/';
// 							metaTags.metaTagsSite = '@esportsterminal';
// 							metaTags.metaTagsImg = 'https://i.imgur.com/2oy41V3.png';
// 							metaTags.metaTagsTitle = 'Overwatch League - EST';
// 							metaTags.metaTagsName = 'Overwatch League - EST';
// 							metaTags.metaTagsType = 'website';
// 							metaTags.metaTagsDescription = 'Overwatch League news & events coverage';
// 							metaTags.metaTagsRobots = 'index,follow';
// 							metaTags.metaTagsKeyWords = 'esports, overwatch, overwatch league, owl, blizzard, competitive gaming';
							
// 							res.render('overwatch_league', {teams: teams, articles: articles, events: events, metaTags: metaTags});
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});
// });

// router.get('/overwatch-league/team/:id', function(req, res){
// 	Team.findById(req.params.id, function(err, team){
// 		if(err){
// 			req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
// 			return res.redirect('/overwatch-league');
// 		} else {
// 			Article.find({categories: team.name}).sort({published: -1}).limit(8).exec(function(err, articles){
// 				if(err){
// 					req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
// 					return res.redirect('/overwatch-league');
// 				} else {
// 					Event.find({teams: team.name}, function(err, events){
// 						if(err){
// 							req.flash('error', 'Something went wrong. We\'re looking into it, but please try again.');
// 							return res.redirect('/overwatch-league');
// 						} else {
// 							res.render('team_view', {
// 								team: team,
// 								articles: articles,
// 								events: events
// 							});
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});
// });