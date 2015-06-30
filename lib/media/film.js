var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative VIDEO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */
var Film = module.exports = function(params) {

	this.defaultSize = { w: 900 }
	this.src = false;
	this.type = "video"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.interval = false;
	this.rate = 1;


	this.setAll("controls", false);
	this.setAll("volume", 0);
	this.loop();

	this.zoe = new SmartMatrix(10,10);

}

util.inherits(Film, Medium);

Film.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp4") : false;
	this.all("play");
}

Film.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

Film.prototype.stop = function() {
	this.all("pause");
}

Film.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}


Film.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Film.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
}

Film.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
}

Film.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
}

Film.prototype.ticker = function() {
	this.ticking = true;
	this.tick();	
}

Film.prototype.unticker = function() {
	this.ticking = false;
}

Film.prototype.tick = function() {
	if (this.ticking) {
		var w = 120
		var h = 70
		var x = this.zoe.col * w
		var y = this.zoe.row * h
		for (var i=0;i<this.spaces.length;i++) {
			this.spaces[i].element.context.drawImage(this.element[i],x,y,w,h)
		}
		this.zoe.advance();
		setTimeout(this.tick.bind(this),10)
	}
}


