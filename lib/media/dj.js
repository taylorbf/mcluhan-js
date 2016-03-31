var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative AUDIO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {DJ}
 */
var DJ = module.exports = function(params) {

	console.log("being created")

	this.defaultSize = { w: 300 }

	// handle parameters
	this.params = params ? params : new Object()

	// define spaces
	this.spaces = this.params.spaces ? this.params.spaces : [0];


	this.src = false;
	this.element = new Tone.Player()
	this.element.connect(m.fx)
	this.element.autostart = true
	this.element.retrigger = true

	this.interval = false;
	this.rate = 1;

	console.log("done")
	
	m.media.push(this)

}

//util.inherits(DJ, Medium);

/** Load an audio file via source string. 
*	@param {String} src name of .mp3 file in /media folder. For example, .load("piano") will load "/media/piano.mp3"
*/
DJ.prototype.load = function(src) {
	console.log("loading "+src)
	this.element.load("media/audio/"+src+".mp3",function() {
		this.play()
	}.bind(this))
	//src ? this.all("load","media/audio/"+src+".mp3") : false;
	//this.all("start")
	return this;
}

/**
 * Play audio file
 * @param  {float} rate Playback rate of audio file (0.25 - 4). DOES NOT CHANGE PITCH.
 */
DJ.prototype.play = function(rate) {
	this.element.start()
	//this.rate = rate ? rate : this.rate;
	//this.all("start");
	//this.speed(this.rate)
}

/**
 * Pause audio playback
 */
DJ.prototype.stop = function() {
	this.element.stop
}

/**
 * Turn audio looping on or off
 * @param  {boolean} on Looping on (true) or off (false)
 */
DJ.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.element.loop = false
	} else {
		this.element.loop = true
	}
}

/**
 * Loop audio between two points
 * @param  {float} start starting loop position
 * @param  {float} stop  ending loop position
 */
DJ.prototype.skip = function(start,stop) {
	this.start = start || start===0 ? start : 1;
	this.stop = stop ? stop : this.start + 0.2;

	this.element.setLoopPoints(this.start * 1000, this.stop*1000)
	this.element.loop = true

	this.skipping = true;
	return this;
}

/**
 * Stop skipping the audio file
 */
DJ.prototype.unskip = function() {
	this.element.loop = false
	return this
}

/**
 * Change the audio file's playback rate (does not change pitch!)
 * @param  {float} rate Playback rate (0.25 - 4)
 */
DJ.prototype.speed = function(rate) {
	if (rate) {
		this.element.playbackRate = rate
		this.rate = rate;
	}
	return this;
}

/**
 * Change the audio file's playback rate (does not change pitch!)
 * @param  {float} rate Playback rate (0.25 - 4)
 */
DJ.prototype.volume = function(level) {
	if (level || level === 0) {
		this.element.volume = level
		this.level = level;
	}
	return this;
}

/**
 * If the element is hidden, show it.
 */
DJ.prototype.bomb = function(dur) {
	setTimeout( this.kill.bind(this), dur ? dur : 1000)
	return this
}

/**
 * Remove this element and destroy all references to it
 */
DJ.prototype.kill = function() {
	this._destroy()
	m.media.splice(m.media.indexOf(this))
}


DJ.prototype._destroy = function(level) {
	this.element.disconnect()
	this.element = null
}

