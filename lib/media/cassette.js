var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative AUDIO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */
var Cassette = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.src = false;
	this.type = "audio"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);
/*
	for (var i=0;i<this.element.length;i++) {
		this._p.push(Tone.Player())
		this._p[this._p.length-1].toMaster()
	}
*/
	this.interval = false;
	this.rate = 1;

	this.setAll("controls", true);
	this.setAll("volume", 0.0000001);
	this.loop();

	this._b = new Array();
	//for (var i=0;i<this.element.length;i++) {
	//	this._b.push(Tone.context.createMediaElementSource(this.element[i]));
	//	this._b[this._b.length-1].connect()
	//}
	
	

}

util.inherits(Cassette, Medium);

Cassette.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp3") : false;
	this.all("play");
	return this;
}

Cassette.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

Cassette.prototype.stop = function() {
	this.all("pause");
}

Cassette.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}


Cassette.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Cassette.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
	return this;
}

Cassette.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
	return this;
}

Cassette.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
	return this;
}

