var manager = require('./lib/core/manager');
var FilmManager = require('./lib/media/film');
var math = require('./lib/utils/math');
var extend = require('extend');
// var nexusui = require('nexusui');


/************************************************
*      MAKE GLOBAL COMPONENTS + INSTANCES
************************************************/

window.m = new manager(); 
window._spaces = new Array();
window.spaces = new Array();
window.windex = 0;
window.walls = new Array();
window.journal = { "hello": "Hello Digital World" }

window.components = require("./lib/media")
for (var key in window.components) {
	window[key] = window.components[key]
}

//window.films = new Array();
//window.film = new FilmManager();
// ... new Film()
// window.imgs = new Array()
// window.img = new GlitchManager()

window.onload = function() {
   m.init();
};