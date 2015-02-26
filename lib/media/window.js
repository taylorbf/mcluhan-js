var util = require('util');


var Window = module.exports = function(params) {

	this.defaultSize = { w: 100, h: 100, x:0, y:0 }
	this.element = window.open("space.html","win"+windex,"height=100,width=100,left:0,top:0,menubar=0,status=0,")
	windex++;
	
}

Window.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

Window.prototype.scroll = function() {
}

Window.prototype.move = function() {
}

Window.prototype.size = function() {
}

Window.prototype.kill = function() {
}

Window.prototype.empty = function() {
}

Window.prototype.empty = function() {
}


