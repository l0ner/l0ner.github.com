function randString(length) {
    if(!length) {
        length = 5;
    }

    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

$('document').ready(function(){
	// random string generator in header
	section = $('#sectName').html()
	setInterval(function(){
			$('#randomCh').html(randString(29-section.length));
    }, 50);
	
	// picasa link replacer
	// disbled for compatibility reasons
	$('.picasaPhoto').brscPicasa({
		photos_thumbsize: '64c',
		photo_displaysize: '600',
		classes: {
			link_with_image: 'loaded-link'
		},
		callback: function() {
			$('a.loaded-link img', this).parent().click(function() {
				$(this).slimbox();
			});
		}
	});

});

