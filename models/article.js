var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
	title: String,
	author: String,
	published: {type: Date, default: Date.now},
	image: String,
	imageCaption: String,
	imageSource: String,
	body: String,
	sourceLink: String,
	categories: [String]
});

module.exports = mongoose.model('Article', articleSchema);