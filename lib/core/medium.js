
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

	// define spaces
	this.spaces = this.params.spaces ? this.params.spaces : [0];

	// make elements
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
 * Set a property on this media element in all windows
 * @param {String} property key
 * @param {Unknown} value
 */
Medium.prototype.setAll = function(prop,val) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][prop] = val;
	}
	return this
}

/**
 * Call a method on this media element in all windows
 * @param {String} method  name
 */

Medium.prototype.all = function(method) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][method]()
	}
	return this
}

// uses params instead of x y so you could set y without setting x, or vice versa
/**
 * Resize this media element
 * @param {number} w  width in px
 * @param {number} h  height in px
 */
Medium.prototype.size = function(params,h) {

	console.log("original size called")

	/*console.log(this.video)
	if (this.video) {
		console.log("sizing video")
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		console.log(h)
		if (!h) {
			params.h = params.w*this.video.videoHeight/this.video.videoWidth
			console.log(params.h)
		}
		this.video.style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.video.style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
	} else if (this.image) {
		console.log("sizing image")
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		console.log(h)
		if (!h) {
			params.h = params.w*this.image.imageHeight/this.image.imageWidth
			console.log(params.h)
		}
		this.image.style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.image.style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
	} else {
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		for (var i = 0; i<this.element.length; i++) {
			this.element[i].style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
			this.element[i].style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
		}
	}
	return this */

	if (typeof params == "number") {
		params = {
			w: params,
			h: h
		}
	}
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.element[i].style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
	}
	return this
}

/**
 * Move this element
 * @param {number} x  x position in px
 * @param {number} y  y position in px
 */
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
	return this;
}

/**
 * Remove this element and destroy all references to it
 */
Medium.prototype.kill = function() {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].parentNode.removeChild(this.element[i])
	}
	this._destroy()
	m.media.splice(m.media.indexOf(this))
}

/**
 * Empty function to be overwritten within each element if necessary
 * Called by .kill()
 */
Medium.prototype._destroy = function() {
	
}

/**
 * Set the element's opacity
 * @param {number} level  opacity level
 */
Medium.prototype.fade = function(level) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.opacity = level;
	}
	return this;
}

/**
 * Make the element disappear, but do not remove it. A/V files will keep playing and making sound.
 */
Medium.prototype.hide = function() {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.visibility = "hidden";
	}
	return this
}

/**
 * If the element is hidden, show it.
 */
Medium.prototype.show = function(level) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.visibility = "visible";
	}
	return this
}

/**
 * If the element is hidden, show it.
 */
Medium.prototype.bomb = function(dur) {
	setTimeout( this.kill.bind(this), dur ? dur : 1000)
	return this
}