var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative VIDEO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */

/* IF TIME: ONE CENTRAL VIDEO ELEMENT.
USE CANVASES TO DRAW IT INTO EACH WINDOW.
BETTER FOR SYNCING AND FOR IMAGE PROCESSING.
*/

var Film = module.exports = function(params) {

	this.defaultSize = { w: 900 }

	this.src = false;
	this.type = "video"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);


	this.boundJump = this.jumpTo.bind(this,0)

	this.interval = false;
	this.rate = 1;

	this.setAll("controls", false);
	this.setAll("volume", 0);
	this.loop();

	this.zoe = new SmartMatrix(10,10);

}

util.inherits(Film, Medium);


/** Load a video via source string. 
*	@param {String} src name of .mp4 file in /media folder. For example, .load("waves") will load "/media/waves.mp4"
*/
Film.prototype.load = function(src) {
	src ? this.setAll("src","media/video/"+src+".mp4") : false;
	this.all("play")
}

/**
 * Play video
 * @param  {float} rate Playback rate of video (0.25 - 4)
 */
Film.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate
	this.all("play")
	this.speed(this.rate)
}

/**
 * Pause video
 */
Film.prototype.stop = function() {
	this.all("pause")
}



/**
 * Loop video
 */
Film.prototype.loop = function(on) {
	this.start = 0.0001
	this.element[0].addEventListener('ended',this.boundJump)
}


/**
 * Unloop video
 */
Film.prototype.unloop = function(on) {
	this.element[0].removeEventListener('ended',this.boundJump);
}

/**
 * Scrub to specific point
 * @param  {integer} start New start time of video, in seconds
 */
Film.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
	this.all("play");
}


/**
 * Loop video between two points
 * @param  {float} start starting loop position
 * @param  {float} stop  ending loop position
 */
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

/**
 * Stop skipping the video
 */
Film.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
}

/**
 * Change the video's playback rate
 * @param  {float} rate Playback rate (0.25 - 4)
 */
Film.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
}

/**
 * Turn on film-strip frame visualization
 */
Film.prototype.ticker = function() {
	console.log(this)
	this.ticking = true;
	this.tick()
}

/**
 * Turn off film-strip ticker visualization
 */
Film.prototype.unticker = function() {
	this.ticking = false;
	this.spaces[i].element.context.clearRect(0,0,1000,1000)
		
}

Film.prototype.tick = function() {

	if (this.ticking) {
		var w = 120
		var h = 70
		var x = this.zoe.col * w
		var y = this.zoe.row * h
		console.log(x)
		for (var i=0;i<this.spaces.length;i++) {
			this.spaces[i].element.context.drawImage(this.element[i],x,y,w,h)
		}
		this.zoe.advance();
		setTimeout(this.tick.bind(this),20)
	}
}


