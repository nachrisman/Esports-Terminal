var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
	    handle: String,
	    firstName: String,
	    lastName: String,
	    dob: {type: Date, default: null},
	    homeCountry: {type: String, default: 'unknown'},
	    role: {type: String, default: 'unknown'},
	    bio: {type: String, default: 'unknown'},
	    image: {type: String, default: 'https://i.imgur.com/amUEiX5.png'},
	    facebook: String,
	    twitter: String,
	    twitch: String,
	    instagram: String
});

var teamSchema = new mongoose.Schema({
	name: {type: String, default: 'unknown'},
	game: {type: String, default: 'unknown'},
	country: {type: String, default: 'unknown'},
	division: {type: String, default: 'none'},
	founded: {type: String, default: 'unknown'},
	owner: {type: String, default: 'unknown'},
	coach: {type: String, default: 'unknown'},
	logo: {type: String, default: 'https://i.imgur.com/amUEiX5.png'},
	members: [memberSchema],
	website: {type: String, default: 'unknown'},
	video: {type: String, default: 'unknown'}
});

module.exports = mongoose.model('Team', teamSchema);