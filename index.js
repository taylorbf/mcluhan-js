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

//window.films = new Array();
//window.film = new FilmManager();
// ... new Film()
// window.imgs = new Array()
// window.img = new GlitchManager()

window.onload = function() {
   m.init();
};