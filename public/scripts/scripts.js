/* global $ */
$(document).ready(function(){
	$('li.active').removeClass('active');
	$('a[href="' + window.location.pathname + '"]').closest('li').addClass('active');
  
	// Article View
	$(".article-body a").attr("target", "_blank");
	
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