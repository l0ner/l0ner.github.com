//Add the images
var on=new Image();
on.src="img/clock/off.png";
var off=new Image();
off.src="img/clock/on.png";

//Make the binaryclock
function binaryclock(img,number) {
	if ((number%2)==1) {
		eval("document."+img+"1.src=on.src");
		eval("document."+img+"1.style.opacity=1");
	}
	else {
		eval("document."+img+"1.src=off.src");
	}
	if (number==2 || number==3 || number==6 || number==7) {
		eval("document."+img+"2.src=on.src");
	}
	else {
		eval("document."+img+"2.src=off.src");
	}
	if (number>3 && number<8) {
		eval("document."+img+"3.src=on.src");
	}
	else {
		eval("document."+img+"3.src=off.src");
	}
	if (number>7) {
		eval("document."+img+"4.src=on.src");
	}
	else {
		eval("document."+img+"4.src=off.src");
	}
}

function binaryize() {
	//Get the date
	var d = new Date();

	//Assign each character in the date to a variable
	var hr1=Math.floor(d.getHours()/10);
	var hr2=d.getHours() % 10;
	var min1=Math.floor(d.getMinutes()/10);
	var min2=d.getMinutes() % 10;
	var sec1=Math.floor(d.getSeconds()/10);
	var sec2=d.getSeconds() % 10;

	binaryclock('hr1',hr1);
	binaryclock('hr2',hr2);
	binaryclock('min1',min1);
	binaryclock('min2',min2);
	binaryclock('sec1',sec1);
	binaryclock('sec2',sec2);
	setTimeout("binaryize()",1000);
}