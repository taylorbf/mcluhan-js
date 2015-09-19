
// Template for all animation pulses
/**
 * @class Rhythm
 * @constructor
 * @description  Template for all animation pulses
 * @param  {object} Params (see Params)
 */
var Rhythm = module.exports = function(time,action,duration) {

	this.time = time;
	this.duration = duration ? duration : false;
	this.action = action;

	if (this.duration) {
		this.starttime = 0 // get Date time in ms
		this.stoptime = 0 // get Date time in ms
	}

	this.on = true;

	this.pulse();
}


Rhythm.prototype.pulse = function() {
	
	var done = this.action()

	if (this.duration) {

	}

	if (done) {
		this.on = false;
	}

	if (this.on) {
		setInterval(this.pulse, this.time)
	}
}

Rhythm.prototype.kill = function(params) {
	this.on = false;
}