var express = require('express'),
	router	= express.Router(),
	Event = require('../models/event'),
	Game = require('../models/game'),
	moment = require('moment'),
	Article = require('../models/article');

router.get('/', function(req, res){
	var today = moment().startOf('day');
	var lastWeek = moment().subtract(7, 'days')

	//Events happening on current date
	Event.find({date: today.toDate()}, function(err, currentEvents){
		if(err){
			console.log('Error');
		} else {
			//Query for 5 future events
			Event.find({date: {$gt: today.toDate()}}).sort({date: -1}).limit(5).exec(function(err, upcomingEvents){
				if(err){
					console.log(err);
				} else {
					//Query for last week's events
					Event.find({date: {$lt: today.toDate(), $gte: lastWeek.toDate()}}).sort({date: -1}).exec(function(err, pastEvents){
						if(err){
							console.log(err);
						} else {
							res.render('events', {
						currentEvents: currentEvents,
						upcomingEvents: upcomingEvents,
						pastEvents: pastEvents
							});					
						};
					});	
				};
			});
		};
	});
});

router.get('/:id', function(req, res){
	var today = moment().startOf('day');

	Event.findById(req.params.id, function(err, foundEvent){
		if(err){
			res.redirect('/events');
		} else {
			//Query for all articles, logic for related articles in EJS
			Article.find({}).sort({published: -1}).limit(6).exec(function(err, relatedArticles){
				if(err){
					console.log(err);
				} else {
					//Query for related upcoming events, logic for comparing event categories/games in EJS
					Event.find({
						_id: {$ne: foundEvent._id},
						date: {$gt: today.toDate()}
					}).sort({date: -1}).exec(function(err, relatedEvents){
						if(err){
							console.log(err);
						} else {
							res.render('event_view', {
						foundEvent: foundEvent, 
						relatedArticles: relatedArticles,
						relatedEvents: relatedEvents
							});
						};
					});
				};
			});
		};
	});	
});

router.post('/', function(req, res){
	Event.create(req.body.event, function(err, newEvent){
		if(err){
			req.flash('error', 'Event could not be added. Check error logs.');
			console.log(err);
			res.redirect('/admin/view-events');
		} else {
			req.flash('success', 'Event added successfully!');
			res.redirect('/:id');
		};
	});
});

router.put('/:id', function(req, res){
	Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
		if(err){
			req.flash('error', 'Could not edit event. Check error logs.');
			console.log(err);
		} else {
			req.flash('success', 'Event edited successfully!');
			res.redirect('/events/' + req.params.id);
		};
	});
});

router.delete('/:id', function(req, res){
	Event.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Could not delete event. Check error logs.');
			console.log(err);
		} else {
			req.flash('success', 'Event deleted successfully!');
			res.redirect('/admin/view-events');
		};
	});
});

module.exports = router;