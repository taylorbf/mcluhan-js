var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Gif
 * @constructor
 * @description  Performative GIF media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Photo}
 */
var GIF = module.exports = function(params) {

	this.defaultSize = { w: 800 }
	this.type = "img";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

}

util.inherits(GIF, Medium);


/** 
 * .
 */
GIF.prototype.load = function(src) {

	this.setAll("src","media/images/"+src+".gif")
	return this

}
