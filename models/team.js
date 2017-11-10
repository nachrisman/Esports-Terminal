var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
	name: String,
	game: String,
	overwatchLeague: {type: Boolean, default: true},
	country: String,
	division: {type: String, default: 'none'},
	founded: {type: Date, default: null},
	owner: String,
	logo: String,
	members: [{
	    handle: String,
	    firstName: String,
	    lastName: String,
	    dob: Date,
	    homeCountry: String,
	    role: String,
	    bio: String,
	    image: String,
	    socialLinks: {
	    	facebook: String,
	    	twitter: String,
	    	twitch: String,
	    	instagram: String
	    }
	}],
	description: String
});

module.exports = mongoose.model('Team', teamSchema);