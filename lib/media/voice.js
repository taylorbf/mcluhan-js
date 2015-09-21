var util = require('util');

/**
 * @class Voice
 * @constructor
 * @description  Performative Text-To-Speech media element
 * @param  {object} Params (see Params)
 * @return {Voice}
 */

var Voice = module.exports = function(params) {

	this.text = "hello world"

	this.src = false;

	this.element = document.createElement("audio");
	//this.element.src = "data:audio/x-wav;base64,"+encode64(wav)
	this.element.addEventListener('ended',function(el) {
		console.log("done")
		//this could be a place to remove this audio element,
		//if we want to dynamically load/destroy each audio element
	}.bind(this.element,this.element))

    this.stream = Tone.context.createMediaElementSource(this.element)
    this.stream.connect(feedbackDelay)

    //this.element.play()

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
	speak(this.text, { pitch: this.pitch, speed: this.speed })

	/* all speak() does is create the audio file and then execute:

	this.element.src = the spoken audio source
	this.element.play() 
	
	it occurs in speakClient.js */
}

/** 
 * .
 */
Voice.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp3") : false;
	this.all("play");
	return this;
}

/** 
 * .
 */
Voice.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

/** 
 *
 * .
 */
Voice.prototype.stop = function() {
	this.all("pause");
}
/** 
 * .
 */
Voice.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}

/** 
 * .
 */
Voice.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Voice.prototype.skip = function(start,stop) {
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

Voice.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
	return this;
}

Voice.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
	return this;
}

