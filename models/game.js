var mongoose = require('mongoose');

var genres = ['FPS', 'MOBA', 'TPS', 'Fighting'];
var platforms = ['PC', 'Playstation', 'Xbox', 'Switch',
					'Wii U', 'GameCube'];

var gameSchema = new mongoose.Schema({
	title: String,
	abbreviation: {type: String, default: 'None'},
	platform: {
		type: String,
		enum: platforms,
		default: null
		},
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

gameSchema.virtual('platforms').get(function () {
    return platforms;
});

module.exports = mongoose.model('Game', gameSchema);