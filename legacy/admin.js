// Events CRUD
router.get('/view-events', middleware.isAdmin, function(req, res){
	Event.find({}).sort({date: -1}).limit(15).exec(function(err, events){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin');
		} else {
			res.render('admin_view_events', {events: events});
		}
	});
});

router.get('/new-event', middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-events');
		} else {
			Team.find({}, function(err, teams){
				if(err){
					req.flash('error', err.message);
					return res.redirect('/admin/view-events');
				} else {
					res.render('admin_new_event', {
						games: games, 
						countries: countries, 
						states: states,
						teams: teams
					});
				}
			});
		}
	});
});

router.get('/edit-event/:id', middleware.isAdmin, function(req, res){
	Event.findById(req.params.id, function(err, foundEvent){
		if(err){
			res.redirect('/events');
		} else {
			Game.find({}, function(err, games){
				if(err){
					console.log(err);
				} else {
					Team.find({}, function(err, teams){
						if(err){
							req.flash('error', err.message);
							return res.redirect('/admin/view-events');
						} else {
							res.render('admin_edit_event', {
								event: foundEvent, 
								games: games, 
								countries: countries, 
								states: states,
								teams: teams
							});
						}
					});
				}
			});
		}
	});
});

//TEAMS

router.get('/view-teams', middleware.isAdmin, function(req, res){
	Team.find({}, function(err, teams){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin');
		} else {
			res.render('admin_view_teams', {teams: teams});
		}
	});
});

router.get('/new-team', middleware.isAdmin, function(req, res){
	Game.find({}, function(err, games){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			res.render('admin_new_team', {games: games, countries: countries});
		}
	});
});

router.post('/new-team', middleware.isAdmin, function(req, res){
	var newMembers = [],
		numOfMembers = req.body.team.members.firstName.length,
		firstNames = req.body.team.members.firstName,
		lastNames = req.body.team.members.lastName,
		handles = req.body.team.members.handle,
		roles = req.body.team.members.role,
		dobs = req.body.team.members.dob,
		homeCountries = req.body.team.members.homeCountry,
		bios = req.body.team.members.bio,
		facebooks = req.body.team.members.facebook,
		twitters = req.body.team.members.twitter,
		instagrams = req.body.team.members.instagram,
		twitches = req.body.team.members.twitch,
		images = req.body.team.members.image;

	for(var i = 0; i < numOfMembers; i++){
		newMembers.push({
			firstName: firstNames[i],
			lastName: lastNames[i],
			handle: handles[i],
			role: roles[i],
			dob: dobs[i],
			homeCountry: homeCountries[i],
			bio: bios[i],
			image: images[i],
			facebook: facebooks[i],
			twitter: twitters[i],
			instagram: instagrams[i],
			twitch: twitches[i]
		});
	}
	
	var newTeam = new Team({
		name: req.body.team.name,
		game: req.body.team.game,
		country: req.body.team.country,
		founded: req.body.team.founded,
		logo: req.body.team.logo,
		coach: req.body.team.coach,
		division: req.body.team.division,
		website: req.body.team.website,
		video: req.body.team.video,
		members: newMembers
	});
	
	Team.create(newTeam, function(err, newTeam){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			req.flash('success', newTeam.name + ' created!');
			res.redirect('/admin/view-teams');
		}
	});
});

router.get('/edit-team/:id', function(req, res){
	Team.findById(req.params.id, function(err, team){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			Game.find({}, function(err, games){
				if(err){
					req.flash('error', err.message);
					return res.redirect('/admin/view-teams');
				} else {
					res.render('admin_edit_team', {team: team, games: games, countries: countries});		
				}
			});
		}	
	});	
});

router.put('/edit-team/:id', function(req, res){
	Team.findById(req.params.id, function(err, team){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			var firstNames = req.body.team.members.firstName,
				lastNames = req.body.team.members.lastName,
				handles = req.body.team.members.handle,
				roles = req.body.team.members.role,
				dobs = req.body.team.members.dob,
				homeCountries = req.body.team.members.homeCountry,
				bios = req.body.team.members.bio,
				facebooks = req.body.team.members.facebook,
				twitters = req.body.team.members.twitter,
				instagrams = req.body.team.members.instagram,
				twitches = req.body.team.members.twitch,
				images = req.body.team.members.image;
				
			team.name = req.body.team.name;
			team.game = req.body.team.game;
			team.country = req.body.team.country;
			team.division = req.body.team.division;
			team.founded = req.body.team.founded;
			team.owner = req.body.team.owner;
			team.coach = req.body.team.coach;
			team.logo = req.body.team.logo;
			team.website = req.body.team.website;
			team.video = req.body.team.video;
			team.members = [];
			team.save();
			
			var numOfMembers = firstNames.length;
			for(var i = 0; i < numOfMembers; i++){
				team.members.push({
					firstName: firstNames[i],
					lastName: lastNames[i],
					handle: handles[i],
					role: roles[i],
					dob: dobs[i],
					homeCountry: homeCountries[i],
					bio: bios[i],
					image: images[i],
					facebook: facebooks[i],
					twitter: twitters[i],
					instagram: instagrams[i],
					twitch: twitches[i]	
				});
			}
			
			team.save();
			
			req.flash('success', team.name + ' updated!');
			res.redirect('/admin/view-teams');
		}
	});
});

router.delete('/view-teams/:id', function(req, res){
	Team.findByIdAndRemove(req.params.id, function(err, team){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/admin/view-teams');
		} else {
			req.flash('success', team.name + ' is no longer with us. Good riddance!');
			res.redirect('/admin/view-teams');
		}
	})	
});