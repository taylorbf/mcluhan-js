var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Wiki
 * @constructor
 * @description  Performative WIKIPEDIA media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Photo}
 */
var Wiki = module.exports = function(params) {

	this.defaultSize = { w: 1200, h: 1200 }
	this.type = "iframe";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

  this.elementsLoaded = 0;
	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.border="none"
	}


}

util.inherits(Wiki, Medium);


/** 
 * Load an embedded wikipedia page
 * @param { string } article Article to load (i.e. "life")
 */
Wiki.prototype.load = function(src) {
	for (var i=0;i<this.spaces.length;i++) {
		this.element[i].src = "http://en.wikipedia.org/wiki/"+src
	}	
	return this;
}

