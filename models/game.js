var mongoose = require("mongoose");

var genres = ["FPS", "MOBA", "TPS", "Fighting"],
	platforms = ["PC", "Playstation", "Xbox", "Switch", "Wii U", "GameCube"];

var gameSchema = new mongoose.Schema({
	title: String,
	abbreviation: {type: String, default: "None"},
	franchise: String,
	platform: {type: String, enum: platforms, default: null},
	genre: {type: String, enum: genres, default: "none"},
	logojpg: String,
	logopng: String,
	active: {type: Boolean, default: false}
});

gameSchema.virtual("genres").get(function(){ return genres; });
gameSchema.virtual("platforms").get(function(){ return platforms; });

module.exports = mongoose.model("Game", gameSchema);