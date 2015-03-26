var util = require('util');
var units = require("../media")
// var Tone = require('tone')

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
	console.log(this.patterns[this.setting].length)
	this.limit = limit ? limit : this.patterns[this.setting].length
	this.patt = this.patterns[this.setting];
	for (var i=0;i<this.limit;i++) {
		this.elements.push(m.peer(this.patt[i].x, this.patt[i].y, this.patt[i].w, this.patt[i].h))
	}
	this.index = windex;
	this.visible = false;

	return this;
	
}

/**
 * Show all browser windows in this wall
 * @return {Wall} Should return this wall object but probably doesn't now.
 */
Wall.prototype.show = function() {

	//for (var i=0;i<this.elements.length;i++) {

  	_.each(this.elements,function(win,i,l) {	
		with (win.element) {
			resizeTo(this.patt[i].w, this.patt[i].h)
			moveTo(this.patt[i].x, this.patt[i].y)
		}
	})
	this.visible = true;
}

/**
 * Hide all browser windows in this wall (but keep them associated with this wall)
 * @return {Wall} Nothing yet
 */
Wall.prototype.hide = function() {
	//for (var i=0;i<this.elements.length;i++) {
	_.each(function(win,i,l) {
		with (win.element) {
			resizeTo(100,100)
			moveTo(0,0)
		}
		this.visible = false;
	})
}

/** 
 * Add a new media element to this wall
 * @param {String}
 * @param {Object} params (see Params)
 */
Wall.prototype.add = function(type,params) {
  this.media.push(new ([type])(params) )
  var i = arr.length-1;
  return i;
}

/**
 * Add a film element to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "waves" not "waves.mp4"
 * @return {Film}
 */
Wall.prototype.watch = function(src) {
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
Wall.prototype.hear = function(src) {
	var _m = new cassette({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
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
		_m.write()
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
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Cassette}
 */
Wall.prototype.see = function(src) {
	var _m = new photo({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Scroll all windows to an x/y coordinate
 * @param  {number} x scroll coordinate
 * @param  {number} y scroll coordinate
 * @return {Wall}
 */
Wall.prototype.scroll = function(x,y) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scrollTo(x,y)
	}
}

/**
 * Move all windows by an x/y amount
 * @return {Wall}
 */
Wall.prototype.move = function() {
}

/**
 * Resize all windows to a specific w/h
 * @return {Wall}
 */
Wall.prototype.size = function() {
}

/**
 * Destroy this wall and return all windows to stack
 */
Wall.prototype.kill = function() {
}

/**
 * Remove all media elements and content from all windows in this wall
 */
Wall.prototype.empty = function() {
}

Wall.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

/**
 * Scroll each window according to the window's place on the screen
 * @return {Wall}
 */
Wall.prototype.scrollSight = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scrollSight()
	}
}

/** 
 * Refresh all windows in this wall
 * @return {Wall}
 */
Wall.prototype.refresh = function() {
}

/**
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
}

/*
Wall.prototype.rhythm = function(time,duration,functions,setting) {
	var _m = new rhythm(time,duration,functions,setting)
	_m.wall = this;
	setInterval()
	this.intervals.push(_m)
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	}
}
*/
// a.rhythm("a.show()","a.hide()")

Wall.prototype.patterns = {
	"default": [
		{
			x: ~~(Math.random()*1000),
			y: ~~(Math.random()*600),
			w: 200,
			h: 100
		}
	],
	"line": [
		{
			x: 1,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 200,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 400,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 600,
			y: 100,
			w: 200,
			h: 400
		}
	]
}




