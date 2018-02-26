var mongoose = require('mongoose');

var hosts = ["YouTube"];

var videoSchema = new mongoose.Schema({
    published: Date,
    creator: String,
    sourceLink: String,
    host: {
        type: String,
        enum: hosts,
        default: "YouTube"
    }
});

module.exports = mongoose.model("Video", videoSchema);