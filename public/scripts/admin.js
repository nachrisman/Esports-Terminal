/* global $ */

$(document).ready(function(){
    // Functionality to add/remove members to a team
    $("#numOfMembers").change(function () { // When creating a new team, number of member inputs populate based on select value
    var count = $(this).val();
    for (var i = 0; i < count; i++) {
        $('#memberInputs').append(
            '<div class="content-form-col">' +
                '<label for="firstName">First Name:</label>' +
                '<input class="form-control" type="text" name="team[members][firstName][]" id="firstName" />' +
        		'<label for="lastName">Last Name: </label>' +
        		'<input class="form-control" type="text" name="team[members][lastName][]" id="lastName" />' +
        		'<label for="handle">Player Handle: </label>' +
        		'<input class="form-control" type="text" name="team[members][handle][]" id="handle"  />' +
        		'<label for="role">Role: </label>' +
        		'<input class="form-control" type="text" name="team[members][role][]" id="role" />' +
        	'</div>' +
            '<div class="content-form-col">' +
				'<label for="dob">Date of Birth: </label>' +
				'<input class="form-control" type="text" name="team[members][dob][]" id="dob" />' +
				'<label for="homeCountry">Home Country: </label>' +
				'<input class="form-control" name="team[members][homeCountry][]" id="homeCountry" />' +
				'<label for="image">Image URL: </label>' +
				'<input class="form-control" type="text" name="team[members][image][]" id="image" />' +
				'<label for="bio">Bio: </label>' +
				'<textarea class="form-control" name="team[members][bio][]" id="bio" rows="5" required>unknown</textarea>' +
			'</div>' +
            '<div class="content-form-col">' +
				'<label for="instagram">Instagram: </label>' +
				'<input class="form-control" type="text" name="team[members][instagram][]" id="instagram" />' +
				'<label for="facebook">Facebook: </label>' +
				'<input class="form-control" type="text" name="team[members][facebook][]" id="facebook" />' +
				'<label for="twitch">Twitch: </label>' +
				'<input class="form-control" type="text" name="team[members][twitch][]" id="twitch" />' +
				'<label for="twitter">Twitter: </label>' +
				'<input class="form-control" type="text" name="team[members][twitter][]" id="twitter" />' +
			'</div>' +
			'<hr>'
        );
    }
    });
    
    $("#addTeamMember").click(function () { // For editing an existing team, adding more members - one member per click
        $('#teamMembersEdit').append(
            '<div class="content-form-col">' +
                '<label for="firstName">First Name:</label>' +
                '<input class="form-control" type="text" name="team[members][firstName][]" id="firstName" />' +
        		'<label for="lastName">Last Name: </label>' +
        		'<input class="form-control" type="text" name="team[members][lastName][]" id="lastName" />' +
        		'<label for="handle">Player Handle: </label>' +
        		'<input class="form-control" type="text" name="team[members][handle][]" id="handle"  />' +
        		'<label for="role">Role: </label>' +
        		'<input class="form-control" type="text" name="team[members][role][]" id="role" />' +
        	'</div>' +
            '<div class="content-form-col">' +
				'<label for="dob">Date of Birth: </label>' +
				'<input class="form-control" type="text" name="team[members][dob][]" id="dob" />' +
				'<label for="homeCountry">Home Country: </label>' +
				'<input class="form-control" name="team[members][homeCountry][]" id="homeCountry" />' +
				'<label for="image">Image URL: </label>' +
				'<input class="form-control" type="text" name="team[members][image][]" id="image" />' +
				'<label for="bio">Bio: </label>' +
				'<textarea class="form-control" name="team[members][bio][]" id="bio" rows="5" required>unknown</textarea>' +
			'</div>' +
            '<div class="content-form-col">' +
				'<label for="instagram">Instagram: </label>' +
				'<input class="form-control" type="text" name="team[members][instagram][]" id="instagram" />' +
				'<label for="facebook">Facebook: </label>' +
				'<input class="form-control" type="text" name="team[members][facebook][]" id="facebook" />' +
				'<label for="twitch">Twitch: </label>' +
				'<input class="form-control" type="text" name="team[members][twitch][]" id="twitch" />' +
				'<label for="twitter">Twitter: </label>' +
				'<input class="form-control" type="text" name="team[members][twitter][]" id="twitter" />' +
			'</div>' +
			'<hr>'
        );
    });
    
    //Confirmation alert for deleting any form of content
    $('.delete-item').submit(function() {
        var answer = confirm('Deleting this means it will be gone forever. Continue?');
        return answer;
    });
});