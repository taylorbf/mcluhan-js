var util = require('util');
var units = require("../media")
 var Tone = require('tone')


var Wall = module.exports = function(setting,limit) {

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

Wall.prototype.show = function(params) {

	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(this.patt[i].w, this.patt[i].h)
			moveTo(this.patt[i].x, this.patt[i].y)
		}
	}
	this.visible = true;
}

Wall.prototype.hide = function() {
	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(100,100)
			moveTo(0,0)
		}
		this.visible = false;
	}
}

Wall.prototype.add = function(type,name,params) {
  this.media.push(new ([type])(params) )
  var i = arr.length-1;
  return i;
}

Wall.prototype.see = function(src) {
	var _f = new film({ spaces: this.elements });
	_f.load(src)
	return _f;
}

Wall.prototype.hear = function(src) {
	var _c = new cassette({ spaces: this.elements });
	_c.load(src)
	return _c;
}

Wall.prototype.write = function(msg,style) {
	var _p = new paper({ spaces: this.elements });
	if (style==1) {
		_p.read(msg)
	} else if (!style) {
		_p.write(msg)
	} else if (style==2) {
		_p.flutter(msg)
	}
	return _p;
}

Wall.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
}

Wall.prototype.move = function() {
}

Wall.prototype.size = function() {
}

Wall.prototype.kill = function() {
}

Wall.prototype.empty = function() {
}

Wall.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

Wall.prototype.scroll = function(x,y) {
	this.element.scrollTo(x,y)
}

Wall.prototype.scrollSight = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scrollSight()
	}
}

Wall.prototype.refresh = function() {
}

Wall.prototype.goto = function(url,window) {
	var url = url ? url : "space.html"
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	}
}

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




