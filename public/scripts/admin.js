/* global $ */
$(document).ready(function(){
    //Confirmation alert for deleting any form of content
    $(".delete-item").submit(function() {
        var answer = confirm("Deleting this means it will be gone forever. Continue?");
        return answer;
    });
});