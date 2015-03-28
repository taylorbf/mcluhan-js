var Manager = require('./lib/core/manager');
var FilmManager = require('./lib/media/film');
var math = require('./lib/utils/math');
var extend = require('extend');
require('nexusui');
window._ = require("underscore")
window.glitch = require("./bower_components/glitch-canvas/dist/glitch-canvas")
window.Nightmare = require ("nightmare")

/************************************************
*      MAKE GLOBAL COMPONENTS + INSTANCES
************************************************/

window.m = new Manager(); 
window._spaces = new Array();
window.spaces = new Array();
window.windex = 0;
window.walls = new Array();
window.journal = { "hello": "Hello Digital World" }


window.components = require("./lib/media")
for (var key in window.components) {
	window[key] = window.components[key]
}

window.onload = function() {
    m.init();
 //   new Nightmare().goto('http://yahoo.com').run()
	 // .type('input[title="Search"]', 'github nightmare')
	 // .click('.searchsubmit')
	 // .run();
};


//currently implemented in WALL object instead
window.alt = function() {




}


//GLOBAL LIBARY CODE

window.getCol = function(index,limit) {
	return index%limit;
}

window.getRow = function(index,limit) {
	return Math.floor(index/limit);
}

Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
/*
Array.prototype.all = function(action,context) {
	var arr = this;
	var act = action.bind(context)
	for (var iii=0;iii<this.length;iii) {
		act(arr[iii])
	}
} */

window.random = function(scale) {
	return Math.floor(Math.random()*scale)
}





