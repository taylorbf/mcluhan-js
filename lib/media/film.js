var util = require('util');
var Medium = require('../core/medium')


var Film = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.src = false;
	this.type = "video"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.element.controls = true;

}

util.inherits(Film, Medium);

Film.prototype.load = function(src) {
	for (var i=0;i<this.element.length;i++) {
		src ? this.element[i].src = src : false;
	}
}

Film.prototype.play = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].play();
	}
}

Film.prototype.stop = function() {
	this.element.stop()
}

Film.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.element.loop = false;
	} else {
		this.element.loop = true;
	}
}

