var passportLocalMongoose = require('passport-local-mongoose'), 
	mongoose              = require('mongoose');

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	createdOn: {type: Date, default: Date.now},
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
	meta: [ {game: String, events: {type: Boolean, default: false}, news: {type: Boolean, default: false}} ],
	podcast: {type: Boolean, default: true},
	stream: {type: Boolean, default: true},
	newsletter: {type: Boolean, default: true},
	role:{
		type: String,
		enum: ['admin', 'editor', 'user'],
		default: 'user'
	},
	active: {type: Boolean, default: false},
	validationToken: String
});

userSchema.virtual('fullname').get(function () {
    return this.firstName + ' ' + this.lastName;
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);