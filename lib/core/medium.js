
// Template for all DOM-based items (video, audio, divs, embeds)
/**
 * @class Medium
 * @constructor
 * @description  Template for all DOM-based media items (video, audio, text, etc)
 * @param  {object} Params (see Params)
 */
var Medium = module.exports = function(params) {

	// handle parameters
	this.params = params ? params : new Object()

	// define space
	this.spaces = this.params.spaces ? this.params.spaces : [0];

	// make element
	this.element = [];
	for (var i = 0; i<this.spaces.length; i++) {
		this.element[i] = document.createElement(this.type)
		this.element[i].className = "media"
		this.spaces[i].element.document.getElementById("allmedia").appendChild(this.element[i])
	}

	this.size(params)

	m.media.push(this)
}

/**
 * Set a property of all window elements in this media element's wall
 * @param {String} property key
 * @param {Unknown} value
 */
Medium.prototype.setAll = function(prop,val) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][prop] = val;
	}
}
Medium.prototype.all = function(method) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][method]()
	}
}

// uses params instead of x y so you could set y without setting x, or vice versa
Medium.prototype.size = function(params,y) {
	if (typeof params == "number") {
		params = {
			x: params,
			y: y
		}
	}
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.element[i].style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
	}
	/*this.params.w ? this.element.style.width = this.params.w+"px" : false;
	this.params.width ? this.element.style.width = this.params.width+"px" : false;
	this.params.h ? this.element.style.width = this.params.h+"px" : false;
	this.params.height ? this.element.style.width = this.params.height+"px" : false;*/
}

Medium.prototype.move = function(params,y) {
	if (typeof params == "number") {
		params = {
			x: params,
			y: y
		}
	}
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.position = "absolute";
		params.x ? this.element[i].style.left = params.x+"px" : false;
		params.y ? this.element[i].style.top = params.y+"px" : false;
	}
}

Medium.prototype.kill = function(params) {
//	console.log("-----------------")
//	console.log(this.spaces)
	for (var i = 0; i<this.element.length; i++) {
	//	console.log(this.spaces[i])
	//	this.spaces[i].element.document.body.removeChild(this.element[i])
		this.element[i].parentNode.removeChild(this.element[i])
	}
	m.media.splice(m.media.indexOf(this))
}
Medium.prototype.fade = function(level) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.opacity = level;
	}
}
Medium.prototype.hide = function() {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.visibility = "hidden";
	}
}
Medium.prototype.show = function(level) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.visibility = "visible";
	}
}