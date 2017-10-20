function insertTwitchFeed() {
	var options = {
	          width: 854,
	          height: 480,
	          channel: "esportsterminal",
	        };
	        var player = new Twitch.Player("twitch-stream-player", options);
	        player.setVolume(0.5);
	    }