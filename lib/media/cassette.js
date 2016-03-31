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

	this.interval = false;
	this.rate = 1;

	this.setAll("controls", true);
	this.setAll("volume", 0.75);
	this.loop();

}

util.inherits(Cassette, Medium);

/** Load an audio file via source string. 
*	@param {String} src name of .mp3 file in /media folder. For example, .load("piano") will load "/media/piano.mp3"
*/
Cassette.prototype.load = function(src) {
	src ? this.setAll("src","media/audio/"+src+".mp3") : false;
	this.all("play");
	return this;
}

/**
 * Play audio file
 * @param  {float} rate Playback rate of audio file (0.25 - 4). DOES NOT CHANGE PITCH.
 */
Cassette.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play")
	this.speed(this.rate)
}

/**
 * Pause audio playback
 */
Cassette.prototype.stop = function() {
	this.all("pause")
}

/**
 * 
 */
Cassette.prototype.solo = function() {
	for (var i=1;i<this.element.length;i++) {
		this.element[i].volume = 0
	}
}

/**
 * Turn audio looping on or off
 * @param  {boolean} on Looping on (true) or off (false)
 */
Cassette.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false)
	} else {
		this.setAll("loop",true)
	}
}

/**
 * Scrub to location in audio file.
 * @param  {float} start New start time
 */
Cassette.prototype.jumpTo = function(start) {
	if (start===0) {
		start = start;
	} else {
		start = start ? start : this.start;
	}
	this.setAll("currentTime",start);
}

/**
 * Loop audio between two points
 * @param  {float} start starting loop position
 * @param  {float} stop  ending loop position
 */
Cassette.prototype.skip = function(start,stop) {
	this.start = start || start===0 ? start : 1;
	this.stop = stop ? stop : this.start + 0.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
	return this;
}

/**
 * Stop skipping the audio file
 */
Cassette.prototype.unskip = function() {
	this.skipping = false
	this.start = false
	this.stop = false
	clearInterval(this.interval)
	this.interval = false
	return this
}

/**
 * Change the audio file's playback rate (does not change pitch!)
 * @param  {float} rate Playback rate (0.25 - 4)
 */
Cassette.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
	return this;
}

/**
 * Change the audio file's playback rate (does not change pitch!)
 * @param  {float} rate Playback rate (0.25 - 4)
 */
Cassette.prototype.volume = function(level) {
	if (level || level === 0) {
		this.setAll("volume",level);
		this.level = level;
	}
	return this;
}

Cassette.prototype._destroy = function(level) {
}

