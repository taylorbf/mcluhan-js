var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Log
 * @constructor
 * @description  Visually log code
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Log}
 */
var Log = module.exports = function(params) {

	this.defaultSize = { w: 200, h: 200 }
	this.type = "div"

	this.fulltext = ""
	this.tickInterval = false
	this.currentLine = 0

	this.boundTick = this.tick.bind(this)

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params)

	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.fontFamily = "courier"
		this.element[i].style.width = "auto"
		this.element[i].style.height = "auto"
		this.element[i].style.overflow = "none"
		this.element[i].style.color = "black"
		this.element[i].style.fontSize = "10pt"
		this.element[i].style.position = "absolute"
		this.element[i].style.bottom = "0px"
		this.element[i].style.top = "auto"
		this.element[i].style.zIndex = "100"
	}


}

util.inherits(Log, Medium)

/** 
 * Add a line of text to the fake code log
 */
Log.prototype.write = function(text) {

	if (text) {
		for (var i=0;i<this.element.length;i++) {
			this.element[i].innerHTML += "<br>" + text
			if (this.element[i].innerHTML.length>5000) {
				var len = this.element[i].innerHTML.length
				this.element[i].innerHTML = this.element[i].innerHTML.slice( len-3000, len )
			}
		}
	}
	return this;
}

/** 
 * Load a text file via URL (i.e. "js/mcluhan.js") and print it line by line as a code log
 */
Log.prototype.load = function(path) {
	$.get(path, function(data) {
		if (data) {
			data = data.replace(/</g,"&lt;")
			data = data.replace(/>/g,"&gt;")
			data = data.replace(/"/g,"\"")
			data = data.replace(/'/g,"\'")
	  	this.fulltext = data.split("\n")
	  	this.start()
		}
	}.bind(this))

	return this;
}

/** 
 * Log the next line of text
 */
Log.prototype.tick = function() {
	this.write(this.fulltext[this.currentLine])
	this.currentLine++
	if (this.currentLine >= this.fulltext.length) {
		this.currentLine = 0
	}
}

/** 
 * Start an interval that prints a line every 50 ms
 */
Log.prototype.start = function(path) {
	if (this.tickInterval) {
		clearInterval(this.tickInterval)
	}
	this.tickInterval = setInterval(this.boundTick, 50)
	return this;
}
/** 
 * Stop the interval
 */
Log.prototype.stop = function(path) {
	
	clearInterval(this.tickInterval)
	return this;
}


Log.prototype._destroy = function() {
	this.stop() 
}

