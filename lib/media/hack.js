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

	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.border="none";
	}

//	denied for cross-origin reasons:
/*	this.doc = new Array();

	for (var i=0;i<this.element.length;i++) {
	    $(this.element[i]).load(function() {
	        this.doc.push(this.contentDocument || this.contentWindow.document);
	    	console.log(this.doc)
	    }.bind(this));
	} */

}

util.inherits(Hack, Medium);

Hack.prototype.load = function(src) {

	for (var i=0;i<this.spaces.length;i++) {
		this.element[i].src = "http://"+src
	}

	return this;

}

