/* global $ */

$(document).ready(function(){
    $("#numOfMembers").change(function () {
    var count = $(this).val();
    for (var i = 0; i < count; i++) {
        $('#memberInputs').append(
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="firstName">First Name: </label>' +
                    '<input class="form-control" type="text" name="team[members][firstName][]" id="firstName" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="lastName">Last Name: </label>' +
                    '<input class="form-control" type="text" name="team[members][lastName][]" id="lastName" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="handle">Player Handle: </label>' +
                    '<input class="form-control" type="text" name="team[members][handle][]" id="handle" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="role">Role: </label>' +
                    '<input class="form-control" type="text" name="team[members][role][]" id="role" />' +
                '</div>' +
            '</div>' + 
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="dob">Date of Birth: </label>' +
                    '<input class="form-control" type="text" name="team[members][dob][]" id="dob" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="homeCountry">Home Country: </label>' +
                    '<input class="form-control" name="team[members][homeCountry][]" id="homeCountry" />' +
                '</div>' +
            '</div>' + 
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="image">Image URL: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][image][]" id="image" value="https://i.imgur.com/amUEiX5.png" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2"> ' +
                    '<label for="bio">Bio: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<textarea class="form-control" name="team[members][bio][]" id="bio" rows="5">unknown</textarea>' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="instagram">Instagram: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][instagram][]" id="instagram" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="facebook">Facebook: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][facebook][]" id="facebook" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="twitch">Twitch: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][twitch][]" id="twitch" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="twitter">Twitter: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][twitter][]" id="twitter" />' +
                '</div>' +
            '</div>'
        );
    }
    });
    
    $("#addTeamMember").click(function () {
        $('#teamMembersEdit').append(
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="firstName">First Name: </label>' +
                    '<input class="form-control" type="text" name="team[members][firstName][]" id="firstName" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="lastName">Last Name: </label>' +
                    '<input class="form-control" type="text" name="team[members][lastName][]" id="lastName" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="handle">Player Handle: </label>' +
                    '<input class="form-control" type="text" name="team[members][handle][]" id="handle" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="role">Role: </label>' +
                    '<input class="form-control" type="text" name="team[members][role][]" id="role" />' +
                '</div>' +
            '</div>' + 
            '<div class="form-group row">' + 
                '<div class="col-xs-6 col-md-6">' + 
                    '<label for="dob">Date of Birth: </label>' +
                    '<input class="form-control" type="text" name="team[members][dob][]" id="dob" />' +
                '</div>' +
                '<div class="col-xs-6 col-md-6">' +
                    '<label for="homeCountry">Home Country: </label>' +
                    '<input class="form-control" name="team[members][homeCountry][]" id="homeCountry" />' +
                '</div>' +
            '</div>' + 
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="image">Image URL: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][image][]" id="image" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2"> ' +
                    '<label for="bio">Bio: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<textarea class="form-control" name="team[members][bio][]" id="bio" rows="5">unknown</textarea>' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="instagram">Instagram: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][instagram][]" id="instagram" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="facebook">Facebook: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][facebook][]" id="facebook" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="twitch">Twitch: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][twitch][]" id="twitch" />' +
                '</div>' +
            '</div>' +
            '<div class="form-group row">' +
                '<div class="col-xs-2 col-md-2">' +
                    '<label for="twitter">Twitter: </label>' +
                '</div>' +
                '<div class="col-xs-10 col-md-10">' +
                    '<input class="form-control" type="text" name="team[members][twitter][]" id="twitter" />' +
                '</div>' +
            '</div>'
        );
    });
    
    $('.delete-item').submit(function() {
        var answer = confirm('Deleting this means it will be gone forever. Continue?');
        return answer;
    });
});


