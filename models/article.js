var mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');
	
var contentTypes = ['standard', 'video'];

var articleSchema = new mongoose.Schema({
	title: String,
	subTitle: String,
	author: String,
	published: {type: Date, default: Date.now},
	image: String,
	imageCaption: String,
	imageSource: String,
	body: String,
	sourceLink: String,
	categories: [String],
	contentType: {
		type: String,
		enum: contentTypes,
		default: 'standard'
		}
	});

articleSchema.plugin(mongoosePaginate);

articleSchema.virtual('contentTypes').get(function () {
    return contentTypes;
});

module.exports = mongoose.model('Article', articleSchema);