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

	this.createPatterns();

	this.setting = setting ? setting : "default"

	// number of windows int he wall
	this.limit = limit ? limit : this.patterns[this.setting].length

	//pattern object with xywh for each window
	this.patt = this.patterns[this.setting];

	//creates each window in the wall and puts it in its spot
	////must also change in show function below
	for (var i=0;i<this.limit;i++) {
		// not totally necessary but makes the windows popup in the right place from start
		// actually _is_ necessary for creating the this.elements array
		this.elements.push(m.peer(~~(this.patt[i].x*m.stage.w+m.stage.x),~~(this.patt[i].y*m.stage.h+m.stage.y),~~(this.patt[i].w*m.stage.w),~~(this.patt[i].h*m.stage.h)));
	}
	
	this.index = windex;
	this.visible = false;
	this.coloralpha = 0.1

	return this;
	
}

/**
 * Show all browser windows in this wall
 * @return {Wall} Should return this wall object but probably doesn't now.
 */
Wall.prototype.show = function() {

	for (var i=0;i<this.elements.length;i++) {
		//this.elements[i].show();
		with (this.elements[i]) {
			element.resizeTo(w,h)
			element.moveTo(x,y)
		}
	}

  	/*_.each(this.elements,function(win,i,l) {	
		with (win.element) {
			resizeTo(this.patt[i].w, this.patt[i].h)
			moveTo(this.patt[i].x, this.patt[i].y)
		}
	}) */
	this.visible = true;
}

/**
 * Hide all browser windows in this wall (but keep them associated with this wall)
 * @return {Wall} Nothing yet
 */
Wall.prototype.hide = function() {
	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(100,100)
			moveTo(m.stage.x+m.stage.w/2-50,m.stage.y+m.stage.h/2-50)
		}
	}
	/*_.each(this.elements,function(win,i,l) {
		with (win.element) {
			resizeTo(100,100)
			moveTo(0,0)
		}
		this.visible = false;
	}) */
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
 * @return {Photo}
 */
Wall.prototype.see = function(src) {
	var _m = new photo({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an embedded webpage (iframe) to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Hack}
 */
Wall.prototype.hack = function(src) {
	var _m = new hack({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}


/**
 * Add a just intonation pitch lattice to the wall
 * @return {Lattice}
 */
Wall.prototype.partch = function() {
	var _m = new lattice({ spaces: this.elements });
	_m.wall = this;
	return _m;
}

/**
 * Add a digital voice
 * @return {Voice}
 */
Wall.prototype.say = function(phrase) {
	var _m = new voice({ spaces: this.elements });
	_m.wall = this;
	_m.say(phrase)
	return _m;
}

Wall.prototype.explore = function(msg) {
	var _m = new map({ spaces: this.elements });
	_m.search(msg)
	return _m;
}

Wall.prototype.sms = function(msg) {
	var _m = new textmessage({ spaces: this.elements });
	_m.text(msg)
	return _m;
}


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
}


Wall.prototype.autoscroll = function(on) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].autoscroll = on;
	}
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

/**
 * Destroy this wall and return all windows to stack
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
		this.elements[i].element.document.body.innerHTML = ""
	}
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
}
/**
 * Scroll each window to a random position
 * @return {Wall}
 */
Wall.prototype.scramble = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scramble()
	}
}

/* animate browser windows
Wall.prototype.trans = function(x,y,time) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].trans(x,y,time)
	}
} */

/* move and resize to new pattern configuration */
Wall.prototype.shapeshift = function(pattern,time) {
	var patt = this.patterns[pattern];
	console.log(patt);
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].size(patt[i%patt.length].w*m.stage.w,patt[i%patt.length].h*m.stage.h,0)
		this.elements[i].move(patt[i%patt.length].x*m.stage.w+m.stage.x,patt[i%patt.length].y*m.stage.h+m.stage.y,time)
	}


/*	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(patt[i%patt.length].x,patt[i%patt.length].y,time,function(patt,i,time) {
			console.log(this,patt,i,time)
		//	alert("done")
			this.elements[i].size(patt[i%patt.length].w,patt[i%patt.length].h,time)
		}.bind(this,patt,i,time))
	} */
}

/**
 * Move all windows to an x/y location
 * @return {Wall}
 */
Wall.prototype.move = function(x,y,time) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(x,y,time)
	}
}

/**
 * Resize all windows to a specific w/h
 * @return {Wall}
 */
Wall.prototype.size = function() {
}

/**
 * Move all windows to an x/y location
 * @return {Wall}
 */
Wall.prototype.moveby = function() {
}

/**
 * Resize all windows to a specific w/h
 * @return {Wall}
 */
Wall.prototype.sizeby = function() {
}


/* resize whole wall to certain amount */







/** 
 * Refresh all windows in this wall
 * @return {Wall}
 */
Wall.prototype.refresh = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.reload()
	}
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
} */
// a.alt("a.show()","a.hide()")
// 
Wall.prototype.alt = function(functions,durations,iterations) {

	var timing = 0;
	for (var i=0;i<iterations;i++) {
		timing += durations.pick();
		setTimeout(functions.pick(),timing)
	}

/*
	var thefunc = function(arg1,arg2,arg3) {
		console.log(arg1)
		console.log(arg2)
		console.log(arg3)
	}.apply(this,[100,200,300])

	var _int = setInterval(thefunc, 1000) */
/*
	var _m = new rhythm(time,duration,functions,setting)
	_m.wall = this;
	setInterval()
	this.intervals.push(_m)
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	} */
}


Wall.prototype.patterns = {
	"default": [
		{
			x: Math.random()*0.9,
			y: Math.random()*0.9,
			w: .2,
			h: .2
		}
	],
	"big1": [
		{
			x: 0,
			y: 0,
			w: 1,
			h: 1
		}
	],
	"line": [
		{
			x: 0,
			y: 0,
			w: .25,
			h: 1
		},
		{
			x: 0.25,
			y: 0,
			w: .25,
			h: 1
		},
		{
			x: 0.5,
			y: 0,
			w: .25,
			h: 1
		},
		{
			x: 0.75,
			y: 0,
			w: .25,
			h: 1
		}
	],
	"fauve": [
		{
			x: 0.1,
			y: 0,
			w: 0.2,
			h: 0.2
		},
		{
			x: 0.7,
			y: 0.05,
			w: 0.1,
			h: 0.95
		},
		{
			x: 0.4,
			y: 0.4,
			w: 0.1,
			h: 0.1
		},
		{
			x: 0,
			y: 0.4,
			w: 0.3,
			h: 0.1
		}
	]
}

Wall.prototype.createPatterns = function() {

	//grid4

	this.patterns["grid4"] = new Array();
	var size = .25
	for (var i=0;i<16;i++) {
		var col = getCol(i,4)
		var row = getRow(i,4)
		var pat = {
			x: col*size,
			y: row*size,
			w: size,
			h: size
		}
		//FUTURE: should do some callibration at start
		//to learn how big the URL bar etc of each browser is
		this.patterns["grid4"].unshift(pat)
	}

}


/* colors */

Wall.prototype.color = function(color) {
	for (var i=0;i<this.elements.length;i++) {
		var canv = this.elements[i].element.canvas
		this.elements[i].element.context.clearRect(0,0,canv.width,canv.height)
		this.elements[i].element.context.fillStyle = color
		this.elements[i].element.context.fillRect(0,0,canv.width,canv.height)
	}
}




/* New Aesthetic
 not enough methods to resize the canvas, etc
 */
Wall.prototype.bg = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.NA.bg()
	}
}





