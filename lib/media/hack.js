var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Hack
 * @constructor
 * @description  Performative IFRAME media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Photo}
 */
var Hack = module.exports = function(params) {

	this.defaultSize = { w: 1200, h: 1200 }
	this.type = "iframe";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

  this.elementsLoaded = 0;
	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.border="none"
	}

}

util.inherits(Hack, Medium);

/** 
 * Load a URL
 * @param { string } address  URL to load. No http:// necessary.
 */
Hack.prototype.load = function(src) {

	if (src.indexOf("http")==0) {

		for (var i=0;i<this.spaces.length;i++) {
			this.element[i].src = src
		}	

	} else {

		for (var i=0;i<this.spaces.length;i++) {
			this.element[i].src = "http://"+src
		}	

	}

	return this;

}

/** 
 * Zoom in on the website. (maybe not working yet)
 * @param { number } [level] Zoom scroll (e.g. 1 is normal. 0.5 is zoomed out, 2 is zoomed in).
 */
Hack.prototype.zoom = function(level) {

	for (var i=0;i<this.spaces.length;i++) {
		this.element[i].style.zoom = level
	}	 
	return this

}

