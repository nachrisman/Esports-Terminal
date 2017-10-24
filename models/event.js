var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	title: String,
	description: String,
	image: String,
	date: Date,
	games: [{type: String}],
	venue: String,
	city: String,
	state: String,
	country: String,
	stream: Boolean,
	sourceLink: String
});

module.exports = mongoose.model('Event', eventSchema);