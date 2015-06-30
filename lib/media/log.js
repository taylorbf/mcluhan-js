var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Log
 * @constructor
 * @description  Visually log all executed code
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Log}
 */
var Log = module.exports = function(params) {

	this.defaultSize = { w: 1000, h: 800 }
	this.type = "div";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	//this.terminal = new Array();

	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.fontFamily = "courier"
		this.element[i].style.width = "100%"
		this.element[i].style.height = "100%"
		this.element[i].style.overflow = "hidden"
		this.element[i].style.border = "solid 1px black"
		this.element[i].style.color = "black"
		this.element[i].style.fontSize = "9pt"
	}


}

util.inherits(Log, Medium);

Log.prototype.write = function(text) {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML += "<br>" + text
	}
	return this;
}

