var mongoose = require('mongoose');

var genres = ['FPS', 'MOBA', 'TPS', 'Fighting'];

var gameSchema = new mongoose.Schema({
	title: String,
	abbreviation: {type: String, default: 'None'},
	platform: [String],
	logojpg: String,
	logopng: String,
	genre: {
		type: String,
		enum: genres,
		default: 'none'
	}
});

gameSchema.virtual('genres').get(function () {
    return genres;
});

module.exports = mongoose.model('Game', gameSchema);