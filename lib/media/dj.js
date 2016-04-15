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

	this.defaultSize = { w: 300 }

	// handle parameters
	this.params = params ? params : new Object()

	// define spaces
	this.spaces = this.params.spaces ? this.params.spaces : [0];

	this.src = false;

	//create the player
	this.element = new Tone.Player()
	this.element.connect(m.fx)
	this.element.autostart = false
	this.element.retrigger = true
	this.element.loop = true

	this.interval = false;
	this.rate = 1;
	
	m.media.push(this)

}

/** Load an audio file via source string. 
*	@param {String} src name of .mp3 file in /media folder. For example, .load("piano") will load "/media/piano.mp3"
*/
DJ.prototype.load = function(src) {
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
	return this
}

/**
 * Pause audio playback
 */
DJ.prototype.stop = function() {
	this.element.stop()
	return this
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
	return this
}

/**
 * Loop audio between two points
 * @param  {float} start starting loop position
 * @param  {float} stop  ending loop position
 */
DJ.prototype.skip = function(start,stop) {
	if(start || start===0) {
	 
	} else {
		start = 1
	}
	stop = stop ? stop : this.start + 0.2;

	//this.element.setLoopPoints(this.start, this.stop)
	this.element.loop = true
	this.element.loopStart = start
	this.element.loopEnd = stop

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
 * Change the player's volune
 * @param  {float} level volume 0-1
 */
DJ.prototype.vol = function(level) {
	level = scale(level,0,1,-100,0)
	if (level || level === 0) {
		this.element.volume.value = level
		this.level = level;
	}
	return this;
}

/**
 * Destroy the element after a delay
 * @param  {float} duration delay in milliseconds
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

