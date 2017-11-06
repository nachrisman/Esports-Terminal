var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
	name: String,
	game: String,
	country: String,
	founded: {type: Date, default: null},
	logo: String,
	members: [{
	    gamertag: String,
	    firstName: String,
	    lastName: String,
	    dob: {type: Date, default: null},
	    born: String
	}],
	description: String
});

module.exports = mongoose.model('Team', teamSchema);