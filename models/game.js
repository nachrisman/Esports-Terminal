var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
	title: String,
	abbreviation: {type: String, default: 'None'},
	platform: [String],
	logojpg: String,
	logopng: String,
	genre: [String],
	meta: [{events: Boolean, default: false},
		   {news:Boolean, default: false}]
});

module.exports = mongoose.model('Game', gameSchema);