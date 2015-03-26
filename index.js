var Manager = require('./lib/core/manager');
var FilmManager = require('./lib/media/film');
var math = require('./lib/utils/math');
var extend = require('extend');
require('nexusui');
window._ = require("underscore")

window.glitch = require("./bower_components/glitch-canvas/dist/glitch-canvas")

console.log(glitch)

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
	console.log("test")
   m.init();
};