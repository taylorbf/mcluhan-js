var util = require('util');
var EventEmitter = require('events').EventEmitter;
window.Tone = require('tone').Tone
//var math = require('../utils/math')
var extend = require('extend');
var StaticProject = require('../guides/static')

/** 
  @title McLuhan JS API
  @overview A toolkit for performative web browsing
  @author Ben Taylor
  @copyright &copy; 2015
  @license MIT
 */ 

var spacer = false;


/** 

  @constructor
  @description Methods for all global actions that affect groups of media objects.
  
*/

var Manager = module.exports = function() {

  // windows in this wall
  this.spaceLimit = 8;

  /**
   * Dimensions of the screen area to be used for the performance. Default 800x600.
   * @type {Object} 
   * @memberOf Manager
   */
  this.stage = {
    w: 800,
    h: 600
    //my screen is 800 x 1280
  }

  this.stage.x = window.screen.width / 2 - this.stage.w / 2;
  this.stage.y = window.screen.height / 2 - this.stage.h / 2;

  this.media = []

  // May use eventually
  // EventEmitter.apply(this)
  
  //extend(this,math)

  //console.log(googleit('bee'))

}

util.inherits(Manager, EventEmitter)


// deprecated
Manager.prototype.init = function() {
  //deprecated
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
}

/**
 * Initialize and open all browser windows to use
 * @param { integer } [limit] How many total windows will be used
 */
Manager.prototype.deck = function(limit) {
  this.spaceLimit = limit
  windex = 0;
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
}

Manager.prototype.time = 0

Manager.prototype.pretimeline = function() {
  this.time += 1
  this.time = Math.round(this.time)
  this.timeline(this.time)
}

/**
 * *static mode only* Start the event timeline.
 */
Manager.prototype.start = function() {
  this.timer = setInterval(this.pretimeline.bind(this),100)
}




/**
 * Add a new media object
 * @param {string} type Type of media object to add
 * @param {Array} arr Array that this object is added into
 * @param {object} params parameters (x,y,w,h,spaces,parent)
 */
Manager.prototype.add = function(type, arr, params) {
  arr.push( new (require("../media")[type])(params) )
  var i = arr.length-1;
  return i;
}

//deprecated i think
Manager.prototype.film = function(src,params) {
    !window.films ? window.films = new Array() : null;
    var i = this.add("film",films,params)
    src ? films[i].load(src) : false;
}

/*
 * Add a new window to the deck. Not recommended. Use m.deck() instead.
 * @param { object } [params] key value pairs of params such as x/y/w/h
 */
Manager.prototype.makeSpace = function(params) {
    var i = this.add("window",_spaces,params)
}

/*
 * Deprecated? What does this do?
 */
Manager.prototype.peer = function(x,y,w,h) {
  if (windex >= _spaces.length) {
    windex = 0;
  }
  var params = {
    x: x ? x : false,
    y: y ? y : false,
    w: w ? w : false,
    h: h ? h : false
  }
  _spaces[windex].show(params);
  windex++;
  return _spaces[windex-1]
}

// deprecated?
Manager.prototype.pare = function(size) {
  size = size ? size : 1;
  for (var i=0;i<size;i++) {
    spaces[0].hide()
  }
}

/* This is not really used anymore...
 * Add a new Wall to the performance. Deprecated?
 * @param { integer } [num] How many windows in the wall
 * @param { object } [config] Unknown config info....
 */
Manager.prototype.makeWall = function(num,config) {
  var wall = new Array()
  for (var i=0;i<num;i++) {
    wall.push(this.useSpace(200*(i+1),50,200,400))
  }
  walls.push(wall)

//  return 
}


/* GUI THINGS */


Manager.prototype.static = new StaticProject()





/* GOOGLE THINGS */

// should this be moved to be a Wall method or a global function?
// or should there be a component with all of these and other new aesthetic functions as methods?

/** 
 * Google image search and use the results in a callback func. Should this be made into adding it was a photo with wall.see()?
 * @param { string } [word] Word to search for
 * @param { function } [cb] callback to use the data
 */
Manager.prototype.googleimage = function(keyword,callback) {

  //currently searches for png. might want jpg later...
  //uses my own api key and custom search e
  $.ajax({
    type: "GET",
      url: "https://www.googleapis.com/customsearch/v1?q="+keyword+"&cx=009196469186626065537:vchqbejelag&key=AIzaSyCiMlsThmuedVfny63G7swWUvcNkX963PA&searchType=image&fileType=png",
      crossDomain: true,
      dataType: 'json',
      contentType: "application/json",
      success: function(data) {
        var links = []
        for(var i=0;i<data.items.length;i++) {
          links.push(data.items[i].link)
        }
        callback(links)
      },
      error: function(err) {
        console.log(err)
      }
  })
}



