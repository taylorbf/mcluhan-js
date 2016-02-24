

var ClientProject = module.exports = function() {

	this.showbguide = true;
	this.smoothguide = 0;
	window.NProgress = require('nprogress')

	this.wwid = window.screen.availWidth;
	this.whgt = window.screen.availHeight;
	
}

ClientProject.prototype.setup = function() {

	var htmlstr = '<div class="sguide" style="display:none">'
				+ 'Please move your browser to the middle of your screen.'
				+ '<div id="sgarrow" style="font-size:70px;margin-top:40px">&#10148;</div>'
				+ '</div>'
				+ '<div class="bguide">'
				+ 'Please resize your browser to the size of this box.'
				+ '</div>'

	$(".guides").append(htmlstr)

	var htmlstr = '<div id="splash">'
			 	+ '<span>M</span>'
				+ '</div>'

	$("body").append(htmlstr)


	//NProgress.start();
	//NProgress.inc();


	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: "../node_modules/nprogress/nprogress.css"
	}).appendTo("head");

	projectwid = $(".guides").width()
	projecthgt = $(".guides").height()

	window.addEventListener("resize",this.checkSize.bind(this))

	this.checkSize()
	/*
	setTimeout("NProgress.set(0.39)", 2000);
	setTimeout("NProgress.set(0.99)", 4000);
	setTimeout(NProgress.done, 6000);
	setTimeout("$('#splash').fadeOut()", 6000); */

	window.addEventListener("beforeunload", function() {
		m.deck(m.spaceLimit);
	});
}

ClientProject.prototype.checkSize = function() {
	var winwid = window.innerWidth;
	var winhgt = window.innerHeight;
	if (winwid < projectwid + 10 && winwid > projectwid - 10 && winhgt < projecthgt + 10 && winhgt > projecthgt - 10) {

		if (this.showbguide) {
			this.showbguide = false;
			$(".bguide").fadeOut(this.smoothguide)
			$(".sguide").fadeIn(0)
			this.watchWindow();
		}
	} else {
		this.smoothguide = 500;
	}
}

ClientProject.prototype.watchWindow = function() {
	this.sguide = setInterval(this.pingWindow.bind(this), 100)
}


ClientProject.prototype.pingWindow = function() {
	var winx = window.screenLeft;
	var winy = window.screenTop;
	var winwid2 = window.outerWidth;
	var winhgt2 = window.outerHeight;

	var distx = winx + (winwid2/2) - (this.wwid/2)
	var disty = winy + (winhgt2/2) - (this.whgt/2)

	var polar = toPolar(distx,disty)
	var degrees = Math.round((polar.angle/(Math.PI*2)) * 360) + 180;
	//var size = (Math.round(polar.radius)/8)+30

	$("#sgarrow").css("-ms-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("-webkit-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("transform", "rotate("+degrees+"deg)")
	//$("#sgarrow").css("font-size", size+"px")

	if (Math.abs(distx) < 20 && Math.abs(disty) < 20 ) {
		$(".sguide").fadeOut(this.smoothguide)
		clearInterval(this.sguide)
	} else {
		this.smoothguide = 500
	}

}

ClientProject.prototype.begin = function() {

	$("#shell").fadeOut(500)
	$("body").css("background-color","white")

	m.start(0,1000);

}		

	
