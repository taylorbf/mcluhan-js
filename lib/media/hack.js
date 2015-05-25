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


// cannot scroll across origins
// can be circumvented by embedding the iframe in a div and scrolling the div.
Hack.prototype.scroll = function() {


}

// cannot scroll across origins
// can be circumvented by embedding the iframe in a div and scrolling the div.
Hack.prototype.zoom = function(level) {

	for (var i=0;i<this.spaces.length;i++) {
		this.element[i].style.zoom = level
	}	

	/* 
	zoom: 0.15;
    -moz-transform:scale(0.75);
    -moz-transform-origin: 0 0;
    -o-transform: scale(0.75);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(0.75);
    -webkit-transform-origin: 0 0; 
    */

}

