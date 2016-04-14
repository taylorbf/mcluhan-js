var util = require('util');
var units = require("../media")

/**
 * @class Wall
 * @constructor
 * @description Manages groups of windows
 */
var Wall = module.exports = function(setting,limit) {

	/**
	 * Window elements in this Wall
	 * @type {Array} 
	 * @memberOf Wall
	 */
	this.elements = []

	this.setting = setting ? setting : "default"

	// number of windows in the wall
	this.limit = limit ? limit : m.patterns[this.setting].length

	//pattern object with xywh for each window
	this.patt = m.patterns[this.setting];

	/* 	creates each window in the wall and puts it in its spot
	  	must also change in show function below
			makes the windows popup in the right place from start
			necessary for creating the this.elements array 
	*/
	for (var i=0;i<this.limit;i++) {

		var w = eval(this.patt[i%this.patt.length].w)
		var h = eval(this.patt[i%this.patt.length].h)
		var x = eval(this.patt[i%this.patt.length].x)
		var y = eval(this.patt[i%this.patt.length].y)

		this.elements.push(m.peer(~~(x*m.stage.w+m.stage.x),~~(y*m.stage.h+m.stage.y),~~(w*m.stage.w),~~(h*m.stage.h)));
	}
	
	this.index = windex;
	this.visible = false;
	this.coloralpha = 0.1

	return this;
	
}

/**
 * Show all browser windows in this wall
 */
Wall.prototype.show = function() {

	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i]) {
			size(w,h)
			move(x,y)
		}
	}

	this.visible = true;

	return this
}

/**
 * Hide all browser windows in this wall (but keep them associated with this wall)
 */
Wall.prototype.hide = function() {
	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(100,100)
			moveTo(m.stage.x+m.stage.w/2-50,m.stage.y+m.stage.h/2-50)
		}
	}
	return this
}

/*
 * Add a new media element to this wall
 * @param {String}
 * @param {Object} params (see Params)
 */
Wall.prototype.add = function(type,params) {
  this.media.push(new ([type])(params) )
  var i = arr.length-1;
  return i;
}




/* adding media */

/**
 * Add a film element to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "waves" not "waves.mp4"
 * @return {Film}
 */
Wall.prototype.watch = function(src) {
	//NEED TO BE ABLE TO SET WIDTH / HEIGHT
	var _m = new film({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an audio cassette element to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Cassette}
 */
Wall.prototype.hear = function(src,x,y) {
	var _m = new cassette({ spaces: this.elements, x: x ? x : 0, y: y? y : 0 });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an invisible audio player that is routed through m.fx
 * @return {Lattice}
 */
Wall.prototype.dj = function(src) {
	var _m = new dj({ spaces: this.elements })
	_m.wall = this
	_m.load(src)
	return _m
}

/** 
 * Add a paper (text) element to the page
 * @param  {String} message to write or .txt filename to read
 * @param  {String} style of writing
 * @param  {Number/String} optional arg depending on style
 * @return {Paper}
 */
Wall.prototype.write = function(msg,style,arg) {
	var _m = new paper({ spaces: this.elements });
	_m.read(msg)
	_m.wall = this;
	if (!style) {
	//	_m.edit(msg)
	} else if (style=="across") {
		_m.writeAcross()
	} else if (style=="flip") {
		_m.flip(arg)
	} else if (style=="wash") {
		_m.wash(arg)
	}
	return _m;
}

/**
 * Add an image canvas to the wall
 * @param  {String}	source filename (w/o file extension if a jpg, i.e. "mcluhan" not "mcluhan.jpg")
 * @return {Photo}
 */
Wall.prototype.see = function(src) {
	var _m = new photo({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add a gif to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "funny" not "funny.gif"
 * @return {Photo}
 */
Wall.prototype.gif = function(src) {
	var _m = new gif({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an embedded webpage (iframe) to the wall
 * @param  {String}	url url of page to embed
 * @return {Hack}
 */
Wall.prototype.hack = function(src,w,h) {
	var _m = new hack({ spaces: this.elements })
	_m.wall = this;
	if (m.settings) {
		if (m.settings.embeds) {
			if (m.settings.embeds[src]) {
				src = m.settings.embeds[src]
			}
		}
	}
	_m.load(src)
	return _m;
}

/**
 * Add an embedded wikipedia iframe to the wall
 * @param  {String}	path article name (i.e. "art" for "en.wikipedia.org/wiki/art/"
 * @return {Hack}
 */
Wall.prototype.wiki = function(src,w,h) {
	var _m = new wiki({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add a digital text-to-speech voice
 * @param  {String}	phrase   words to speak
 * @return {Voice}
 */
Wall.prototype.say = function(phrase) {
	var _m = new voice({ spaces: this.elements });
	_m.wall = this;
	_m.say(phrase)
	return _m;
}

/**
 * Add a Google Map
 * @param  {String}	place   Name of the place to map (i.e. "Arkansas")
 * @return {Voice}
 */
Wall.prototype.explore = function(msg) {
	var _m = new map({ spaces: this.elements });
	_m.search(msg)
	return _m;
}

/**
 * Add a text message
 * @param  {String}	phrase  Words to write
 * @return {Voice}
 */
Wall.prototype.text = function(msg) {
	var _m = new textmessage({ spaces: this.elements });
	_m.text(msg)
	return _m;
}

/**
 * Add a code log
 * @param  {String}	text  Text to write or name of URL or file name
 * @return {Voice}
 */
Wall.prototype.log = function(msg) {
	var _m = new log({ spaces: this.elements });
	_m.write(msg)
	return _m;
}




/* wall-specific */

/**
 * Scroll all windows to an x/y coordinate
 * @param  {number} x scroll coordinate
 * @param  {number} y scroll coordinate
 * @return {Wall}
 */
Wall.prototype.scroll = function(x,y) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.scrollTo(x,y)
	}
	return this
}

/**
 * Xray automatically is called when windows move
 * @return {Wall}
 */
Wall.prototype.autoscroll = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].autoscroll = true;
	}
	this.xray()
	return this
}

/**
 * Turn off autoscroll
 * @return {Wall}
 */
Wall.prototype.noautoscroll = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].autoscroll = false;
	}
	return this
}

/**
 * Destroy this wall and return all windows to stack
 */
Wall.prototype.kill = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].kill()
	}
	this.elements = []
}

/*
 * Destroy one window in the wall
 */
Wall.prototype.killWindow = function(index) {
	this.elements[index].kill()
	this.elements.splice(index,1)
}

/**
 * Remove all media elements and content from all windows in this wall
 */
Wall.prototype.empty = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.document.getElementById("allmedia").innerHTML = ""
	}
	return this
}

Wall.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

/**
 * Scroll each window according to the window's place on the screen
 * @return {Wall}
 */
Wall.prototype.xray = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].xray()
	}
	return this
}
/**
 * Scroll each window to a random position
 * @return {Wall}
 */
Wall.prototype.scramble = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scramble()
	}
	return this
}



/**
 * Move and resize the wall's windows to a new pattern arrangement
 * @param  {String} pattern  Name of the new pattern arrangement
 * @return {Wall}
 */
Wall.prototype.shape = function(pattern) {
	var patt = m.patterns[pattern];
	for (var i=0;i<this.elements.length;i++) {
		var w = eval(patt[i%patt.length].w)
		var h = eval(patt[i%patt.length].h)
		var x = eval(patt[i%patt.length].x)
		var y = eval(patt[i%patt.length].y)
		this.elements[i].size(w*m.stage.w,h*m.stage.h,0)
		this.elements[i].move(x*m.stage.w+m.stage.x,y*m.stage.h+m.stage.y,time)
	}
	return this
}

/**
 * Move all windows to an x/y location
 * @param  {String} x  New x location of the window
 * @param  {String} y  New y location of the window
 * @return {Wall}
 */
Wall.prototype.move = function(x,y) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(x,y,time)
	}
	return this
}

/**
 * Move all windows to a random x/y location within limits
 * @param  {String} x  x limit 
 * @param  {String} y  y limit  
 * @return {Wall}
 */
Wall.prototype.scatter = function(x,y) {
	if (!x) {x = 1500}
	if (!y) {y = 900}
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(random(x),random(y))
	}
	return this
}

/**
 * Resize all windows to a specific w/h
 * @param  {String} w  New width
 * @param  {String} h  New height
 * @return {Wall}
 */
Wall.prototype.size = function(w,h,time) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].size(w,h,time)
	}
	return this
}



/** 
 * Refresh all windows in this wall
 * @return {Wall}
 */
Wall.prototype.refresh = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.reload()
	}
	return this
}

/*
 * Goto a URL
 * @param  {string} URL
 * @param  {number/array} number of windows to use, or array of window numbers to use
 * @return {Wall}
 */
Wall.prototype.goto = function(url,window) {
	var url = url ? url : "space.html"
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	}
	return this
}


/* Create a color overlay for the wall */

Wall.prototype.color = function(color, alpha) {
	for (var i=0;i<this.elements.length;i++) {
		var canv = this.elements[i].element.canvas
		this.elements[i].element.context.clearRect(0,0,canv.width,canv.height)
		this.elements[i].element.context.fillStyle = color
		this.elements[i].element.context.globalAlpha = alpha ? alpha : 1;
		this.elements[i].element.context.fillRect(0,0,canv.width,canv.height)
		this.elements[i].element.context.globalAlpha = 1;
	}
	return this
}




/*
 * New Aesthetic
 * Creates a photoshop background
 * currently poor support for erasure of the NA canvas
 */
 Wall.prototype.bg = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.NA.bg()
	}
	return this
}





