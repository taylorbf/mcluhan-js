var util = require('util');
var meSpeak = require("mespeak")

/**
 * @class Voice
 * @constructor
 * @description  Performative Text-To-Speech media element
 * @param  {object} Params (see Params)
 * @return {Voice}
 */

var Voice = module.exports = function(params) {

	this.text = "hello world"

	this.element = new Tone.Player().connect(m.fx)

	meSpeak.loadConfig(require("mespeak/src/mespeak_config.json"))

	//Select english/american voice
	meSpeak.loadVoice(require("mespeak/voices/en/en-us.json"))


	/*
	
		methods:
		skip()
		rate()
		loop()
		start()
		stop()
		reverse()

	*/

}

/** 
 * .
 */
Voice.prototype.say = function(phrase, params) {

	this.text = phrase;
	this.speed = 175;
	this.pitch = 50;
//	this.speed = params ? params.speed ? params.speed : 175 : 175;
//	this.pitch = params ? params.pitch ? params.pitch : 50 : 50 ;

	var speechBuffer = meSpeak.speak(phrase, { 'rawdata': true });

	console.log("speechBuffer is ... ") 
	console.log(speechBuffer) 

 	Tone.context.decodeAudioData( speechBuffer, function( result ) {

 		this.element._buffer.set(result)
 		this.element.playbackRate = 1
 		this.element.retrigger = true
 		this.element.loop = false
 		this.element.start()

	}.bind(this));

}


/**
 * Play audio file
 * @param  {float} rate Playback rate of audio file (0.25 - 4). DOES NOT CHANGE PITCH.
 */
Voice.prototype.play = function(rate) {
	this.element.start()
	//this.rate = rate ? rate : this.rate;
	//this.all("start");
	//this.speed(this.rate)
	return this
}

/**
 * Pause audio playback
 */
Voice.prototype.stop = function() {
	this.element.stop
	return this
}

/**
 * Turn audio looping on or off
 * @param  {boolean} on Looping on (true) or off (false)
 */
Voice.prototype.loop = function(on) {
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
Voice.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : this.start + 0.2;

	this.element.setLoopPoints(this.start * 1000, this.stop*1000)
	this.element.loop = true

	this.skipping = true;
	return this;
}

/**
 * Stop skipping the audio file
 */
Voice.prototype.unskip = function() {
	this.element.loop = false
	return this
}

/**
 * Change the audio file's playback rate (does not change pitch!)
 * @param  {float} rate Playback rate (0.25 - 4)
 */
Voice.prototype.speed = function(rate) {
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
Voice.prototype.volume = function(level) {
	if (level || level === 0) {
		this.element.volume = level
		this.level = level;
	}
	return this;
}

/**
 * If the element is hidden, show it.
 */
Voice.prototype.bomb = function(dur) {
	setTimeout( this.kill.bind(this), dur ? dur : 1000)
	return this
}

/**
 * Remove this element and destroy all references to it
 */
Voice.prototype.kill = function() {
	this._destroy()
	m.media.splice(m.media.indexOf(this))
}


Voice.prototype._destroy = function(level) {
	this.element.disconnect()
	this.element = null
}


