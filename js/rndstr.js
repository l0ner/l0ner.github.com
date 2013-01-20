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
});

