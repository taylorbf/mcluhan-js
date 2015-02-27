var util = require('util');
var Medium = require('../core/medium')


var Film = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.src = false;
	this.type = "video"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.setAll("controls", true);
	//this.element.controls = true;

}

util.inherits(Film, Medium);

Film.prototype.load = function(src) {
	src ? this.setAll("src",src) : false;
}

Film.prototype.play = function() {
	this.all("play");
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

