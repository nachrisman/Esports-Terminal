var passportLocalMongoose = require('passport-local-mongoose'), 
	mongoose              = require('mongoose');

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	phone: Number,
	gender: {
		type: String,
		enum: ['male', 'female', 'unspecified'],
		default: 'unspecified'
	},
	email: String,
	location: {
		country: {type: String, default: 'United States'},
		street: {type: String, default: 'none'},
		city: {type: String, default: 'none'},
		state: {type: String, default: 'none'},
		zip: {type: Number, default: null},
	},
	meta: [ {game: String, events: {type: Boolean, default: false}, news: {type: Boolean, default: false}}],
	podcast: {type: Boolean, default: false},
	stream: {type: Boolean, default: false},
	role:{
		type: String,
		enum: ['admin', 'editor', 'user'],
		default: 'user'
	}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);