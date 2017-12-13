/* global $ */
$(document).ready(function(){
	// Article View
	$('.article-body a').attr('target', '_blank');

	var teamLinkIds = [];
	var teamLogoIds = [];
	
	$(".division").find("a").each(function(){ teamLinkIds.push(this.id); });
	$(".division").find("img").each(function(){ teamLogoIds.push(this.id); });
	
	$.each(teamLinkIds, function(key, id){
		$("#"+id).mouseenter(function(){
			$("#"+teamLogoIds[key]).animate({'opacity':'0.5'},500);
		});
		
		$("#"+id).mouseleave(function(){
			$("#"+teamLogoIds[key]).animate({'opacity':'1'},500);
		});
		
	});
	
	
	var teamMemberIds = [];
	var teamMemberInfoIds = [];
	
	$(".team-roster").find(".team-member").each(function(){ teamMemberIds.push(this.id); });
	$(".team-roster").find(".member-info").each(function(){ teamMemberInfoIds.push(this.id); });

	$.each(teamMemberIds, function(key, memberId){
		$("#"+memberId).mouseenter(function(){
			$(this).children('.member-image').animate({'opacity':'0.5'},500);
		});
		
		$("#"+memberId).mouseleave(function(){
			$(this).children('.member-image').animate({'opacity':'1'},500);
		});
		
		$('#'+memberId).click(function(){
			$('#'+teamMemberInfoIds[key]).slideToggle();
		});	
		
		$('#'+memberId).click(function(){
			$('#'+teamMemberInfoIds[key]).stopPropogation();
		});
	});
	
	$(window).scroll( function(){
		$('.owl-footer-row').each( function(i){
            var topOfDiv = $(this).offset().top;
            var topOfWindow = $(window).scrollTop();
            
            if( topOfWindow > 0.4*topOfDiv ){
                $(this).animate({'opacity':'1'},500);
            }
        }); 
    });
    
    $(window).scroll( function(){
		$('#owl-team-schedule').each( function(i){
            var topOfDiv = $(this).offset().top;
            var topOfWindow = $(window).scrollTop();
            
            if( topOfWindow > 0.5*topOfDiv ){
                $(this).animate({'opacity':'1'},500);
            }
        }); 
    });
	
	
	// ACCOUNT SETTINGS VIEW //
	var $email_true = $("#email-true");
	var $email_false = $("#email-false");
	
	$email_true.change(function(){
		if(this.checked){
			$email_false.prop("checked", false);
		}	
	});
	
	$email_false.change(function(){
		if(this.checked){
			$email_true.prop("checked", false);
		}
	});
	
	// NEWS - MAIN //
	var sidebarArticleHeadlines = [];
	var sidebarArticleImages = [];
	
	$("#news-sidebar-content").find("img").each(function(){ sidebarArticleImages.push(this.id.substr(20, 30)); });
	$("#news-sidebar-content").find(".preview-headline").each(function(){ sidebarArticleHeadlines.push(this.id.substr(20, 30)); });
	
	$.each(sidebarArticleImages, function(key, id){
		$("#"+id).mouseenter(function(){
			$(this).fadeTo("slow", 0.5);
		});
	});
});

function insertTwitchFeed(channel) {
	var options = {
	          channel: channel,
	        };
	        var player = new Twitch.Player("twitch-stream-player", options);
	        player.setVolume(0.5);
}