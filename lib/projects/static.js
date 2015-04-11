

var StaticProject = module.exports = function() {

	this.showbguide = true;
	this.smoothguide = 0;
	window.NProgress = require('nprogress')

	this.wwid = window.screen.availWidth;
	this.whgt = window.screen.availHeight;
	
}

StaticProject.prototype.setup = function() {



	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: "../../node_modules/nprogress/nprogress.css"
	}).appendTo("head");

	projectwid = $(".guides").width()
	projecthgt = $(".guides").height()

	window.addEventListener("resize",this.checkSize.bind(this))

	this.checkSize()

	NProgress.start();
	NProgress.inc();
	
	setTimeout("NProgress.set(0.69)", 3000);
	setTimeout("NProgress.set(0.99)", 4000);
	setTimeout(NProgress.done, 5000);
	setTimeout("$('#splash').fadeOut()", 5000);

	window.addEventListener("beforeunload", function() {
		m.deck(m.spaceLimit);
	});
}

StaticProject.prototype.checkSize = function() {
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

StaticProject.prototype.watchWindow = function() {
	this.sguide = setInterval(this.pingWindow.bind(this), 100)
}


StaticProject.prototype.pingWindow = function() {
	var winx = window.screenLeft;
	var winy = window.screenTop;
	var winwid2 = window.outerWidth;
	var winhgt2 = window.outerHeight;

	var distx = winx + (winwid2/2) - (this.wwid/2)
	var disty = winy + (winhgt2/2) - (this.whgt/2)

	var polar = m.toPolar(distx,disty)
	var degrees = Math.round((polar.angle/(Math.PI*2)) * 360) + 180;
	var size = (Math.round(polar.radius)/6)+10

	$("#sgarrow").css("-ms-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("-webkit-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("font-size", size+"px")

	if (Math.abs(distx) < 20 && Math.abs(disty) < 20 ) {
		$(".sguide").fadeOut(this.smoothguide)
		clearInterval(this.sguide)
	} else {
		this.smoothguide = 500
	}

}
		

	
