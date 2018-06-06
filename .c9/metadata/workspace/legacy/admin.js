{"filter":false,"title":"admin.js","tooltip":"/legacy/admin.js","undoManager":{"mark":12,"position":12,"stack":[[{"start":{"row":0,"column":0},"end":{"row":62,"column":3},"action":"insert","lines":["// Events CRUD","router.get('/view-events', middleware.isAdmin, function(req, res){","\tEvent.find({}).sort({date: -1}).limit(15).exec(function(err, events){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin');","\t\t} else {","\t\t\tres.render('admin_view_events', {events: events});","\t\t}","\t});","});","","router.get('/new-event', middleware.isAdmin, function(req, res){","\tGame.find({}, function(err, games){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-events');","\t\t} else {","\t\t\tTeam.find({}, function(err, teams){","\t\t\t\tif(err){","\t\t\t\t\treq.flash('error', err.message);","\t\t\t\t\treturn res.redirect('/admin/view-events');","\t\t\t\t} else {","\t\t\t\t\tres.render('admin_new_event', {","\t\t\t\t\t\tgames: games, ","\t\t\t\t\t\tcountries: countries, ","\t\t\t\t\t\tstates: states,","\t\t\t\t\t\tteams: teams","\t\t\t\t\t});","\t\t\t\t}","\t\t\t});","\t\t}","\t});","});","","router.get('/edit-event/:id', middleware.isAdmin, function(req, res){","\tEvent.findById(req.params.id, function(err, foundEvent){","\t\tif(err){","\t\t\tres.redirect('/events');","\t\t} else {","\t\t\tGame.find({}, function(err, games){","\t\t\t\tif(err){","\t\t\t\t\tconsole.log(err);","\t\t\t\t} else {","\t\t\t\t\tTeam.find({}, function(err, teams){","\t\t\t\t\t\tif(err){","\t\t\t\t\t\t\treq.flash('error', err.message);","\t\t\t\t\t\t\treturn res.redirect('/admin/view-events');","\t\t\t\t\t\t} else {","\t\t\t\t\t\t\tres.render('admin_edit_event', {","\t\t\t\t\t\t\t\tevent: foundEvent, ","\t\t\t\t\t\t\t\tgames: games, ","\t\t\t\t\t\t\t\tcountries: countries, ","\t\t\t\t\t\t\t\tstates: states,","\t\t\t\t\t\t\t\tteams: teams","\t\t\t\t\t\t\t});","\t\t\t\t\t\t}","\t\t\t\t\t});","\t\t\t\t}","\t\t\t});","\t\t}","\t});","});"],"id":1}],[{"start":{"row":62,"column":3},"end":{"row":63,"column":0},"action":"insert","lines":["",""],"id":2}],[{"start":{"row":63,"column":0},"end":{"row":64,"column":0},"action":"insert","lines":["",""],"id":3}],[{"start":{"row":64,"column":0},"end":{"row":64,"column":1},"action":"insert","lines":["/"],"id":4}],[{"start":{"row":64,"column":1},"end":{"row":64,"column":2},"action":"insert","lines":["/"],"id":5}],[{"start":{"row":64,"column":2},"end":{"row":64,"column":3},"action":"insert","lines":["T"],"id":6}],[{"start":{"row":64,"column":3},"end":{"row":64,"column":4},"action":"insert","lines":["E"],"id":7}],[{"start":{"row":64,"column":4},"end":{"row":64,"column":5},"action":"insert","lines":["A"],"id":8}],[{"start":{"row":64,"column":5},"end":{"row":64,"column":6},"action":"insert","lines":["M"],"id":9}],[{"start":{"row":64,"column":6},"end":{"row":64,"column":7},"action":"insert","lines":["S"],"id":10}],[{"start":{"row":64,"column":7},"end":{"row":65,"column":0},"action":"insert","lines":["",""],"id":11}],[{"start":{"row":65,"column":0},"end":{"row":66,"column":0},"action":"insert","lines":["",""],"id":12}],[{"start":{"row":66,"column":0},"end":{"row":231,"column":3},"action":"insert","lines":["router.get('/view-teams', middleware.isAdmin, function(req, res){","\tTeam.find({}, function(err, teams){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin');","\t\t} else {","\t\t\tres.render('admin_view_teams', {teams: teams});","\t\t}","\t});","});","","router.get('/new-team', middleware.isAdmin, function(req, res){","\tGame.find({}, function(err, games){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-teams');","\t\t} else {","\t\t\tres.render('admin_new_team', {games: games, countries: countries});","\t\t}","\t});","});","","router.post('/new-team', middleware.isAdmin, function(req, res){","\tvar newMembers = [],","\t\tnumOfMembers = req.body.team.members.firstName.length,","\t\tfirstNames = req.body.team.members.firstName,","\t\tlastNames = req.body.team.members.lastName,","\t\thandles = req.body.team.members.handle,","\t\troles = req.body.team.members.role,","\t\tdobs = req.body.team.members.dob,","\t\thomeCountries = req.body.team.members.homeCountry,","\t\tbios = req.body.team.members.bio,","\t\tfacebooks = req.body.team.members.facebook,","\t\ttwitters = req.body.team.members.twitter,","\t\tinstagrams = req.body.team.members.instagram,","\t\ttwitches = req.body.team.members.twitch,","\t\timages = req.body.team.members.image;","","\tfor(var i = 0; i < numOfMembers; i++){","\t\tnewMembers.push({","\t\t\tfirstName: firstNames[i],","\t\t\tlastName: lastNames[i],","\t\t\thandle: handles[i],","\t\t\trole: roles[i],","\t\t\tdob: dobs[i],","\t\t\thomeCountry: homeCountries[i],","\t\t\tbio: bios[i],","\t\t\timage: images[i],","\t\t\tfacebook: facebooks[i],","\t\t\ttwitter: twitters[i],","\t\t\tinstagram: instagrams[i],","\t\t\ttwitch: twitches[i]","\t\t});","\t}","\t","\tvar newTeam = new Team({","\t\tname: req.body.team.name,","\t\tgame: req.body.team.game,","\t\tcountry: req.body.team.country,","\t\tfounded: req.body.team.founded,","\t\tlogo: req.body.team.logo,","\t\tcoach: req.body.team.coach,","\t\tdivision: req.body.team.division,","\t\twebsite: req.body.team.website,","\t\tvideo: req.body.team.video,","\t\tmembers: newMembers","\t});","\t","\tTeam.create(newTeam, function(err, newTeam){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-teams');","\t\t} else {","\t\t\treq.flash('success', newTeam.name + ' created!');","\t\t\tres.redirect('/admin/view-teams');","\t\t}","\t});","});","","router.get('/edit-team/:id', function(req, res){","\tTeam.findById(req.params.id, function(err, team){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-teams');","\t\t} else {","\t\t\tGame.find({}, function(err, games){","\t\t\t\tif(err){","\t\t\t\t\treq.flash('error', err.message);","\t\t\t\t\treturn res.redirect('/admin/view-teams');","\t\t\t\t} else {","\t\t\t\t\tres.render('admin_edit_team', {team: team, games: games, countries: countries});\t\t","\t\t\t\t}","\t\t\t});","\t\t}\t","\t});\t","});","","router.put('/edit-team/:id', function(req, res){","\tTeam.findById(req.params.id, function(err, team){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-teams');","\t\t} else {","\t\t\tvar firstNames = req.body.team.members.firstName,","\t\t\t\tlastNames = req.body.team.members.lastName,","\t\t\t\thandles = req.body.team.members.handle,","\t\t\t\troles = req.body.team.members.role,","\t\t\t\tdobs = req.body.team.members.dob,","\t\t\t\thomeCountries = req.body.team.members.homeCountry,","\t\t\t\tbios = req.body.team.members.bio,","\t\t\t\tfacebooks = req.body.team.members.facebook,","\t\t\t\ttwitters = req.body.team.members.twitter,","\t\t\t\tinstagrams = req.body.team.members.instagram,","\t\t\t\ttwitches = req.body.team.members.twitch,","\t\t\t\timages = req.body.team.members.image;","\t\t\t\t","\t\t\tteam.name = req.body.team.name;","\t\t\tteam.game = req.body.team.game;","\t\t\tteam.country = req.body.team.country;","\t\t\tteam.division = req.body.team.division;","\t\t\tteam.founded = req.body.team.founded;","\t\t\tteam.owner = req.body.team.owner;","\t\t\tteam.coach = req.body.team.coach;","\t\t\tteam.logo = req.body.team.logo;","\t\t\tteam.website = req.body.team.website;","\t\t\tteam.video = req.body.team.video;","\t\t\tteam.members = [];","\t\t\tteam.save();","\t\t\t","\t\t\tvar numOfMembers = firstNames.length;","\t\t\tfor(var i = 0; i < numOfMembers; i++){","\t\t\t\tteam.members.push({","\t\t\t\t\tfirstName: firstNames[i],","\t\t\t\t\tlastName: lastNames[i],","\t\t\t\t\thandle: handles[i],","\t\t\t\t\trole: roles[i],","\t\t\t\t\tdob: dobs[i],","\t\t\t\t\thomeCountry: homeCountries[i],","\t\t\t\t\tbio: bios[i],","\t\t\t\t\timage: images[i],","\t\t\t\t\tfacebook: facebooks[i],","\t\t\t\t\ttwitter: twitters[i],","\t\t\t\t\tinstagram: instagrams[i],","\t\t\t\t\ttwitch: twitches[i]\t","\t\t\t\t});","\t\t\t}","\t\t\t","\t\t\tteam.save();","\t\t\t","\t\t\treq.flash('success', team.name + ' updated!');","\t\t\tres.redirect('/admin/view-teams');","\t\t}","\t});","});","","router.delete('/view-teams/:id', function(req, res){","\tTeam.findByIdAndRemove(req.params.id, function(err, team){","\t\tif(err){","\t\t\treq.flash('error', err.message);","\t\t\treturn res.redirect('/admin/view-teams');","\t\t} else {","\t\t\treq.flash('success', team.name + ' is no longer with us. Good riddance!');","\t\t\tres.redirect('/admin/view-teams');","\t\t}","\t})\t","});"],"id":13}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":12,"column":24},"end":{"row":12,"column":24},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1515880656371,"hash":"e15980bcd0b375f1b977df10bcca504ba2a9ca78"}