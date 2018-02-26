/* global $ */
$(document).ready(function(){
	$(".creator-banner-image").mouseenter(function() { 
	    $(this).animate({opacity: 0.7}, 500);
	});
	
	$(".creator-banner-image").mouseleave(function() { 
	    $(this).animate({opacity: 1.0}, 500);
	});
	
	$(".main-videos-container").find("iframe").each(function(index, elem){
		elem.setAttribute("width","500");
		elem.setAttribute("height", "281");
	});
	
	$(".creator-videos").find("iframe").each(function(index, elem){
		elem.setAttribute("width","500");
		elem.setAttribute("height", "281");
	});
	
	$('li.active').removeClass('active');
	$('a[href="' + window.location.pathname + '"]').closest('li').addClass('active');
  
	// Article View
	$(".article-body a").attr("target", "_blank");
});