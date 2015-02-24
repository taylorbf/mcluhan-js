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

Film.prototype.play = function() {

}
