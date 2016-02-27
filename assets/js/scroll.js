$(document).scroll(function() {
	var y = $(this).scrollTop();
	if (y > 50) {
		$('#to-top').fadeIn();
	} else {
		$('#to-top').fadeOut();
	}
});

$(document).ready(function() {
	$("#to-top").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "fast");
		return false;
	});
});
