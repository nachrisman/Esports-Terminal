var mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');

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

articleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Article', articleSchema);