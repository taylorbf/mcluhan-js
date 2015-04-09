var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Tone = require('tone')

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

  /** @type {Number} */
  this.spaceLimit = 8;

  // Will use eventually
  // EventEmitter.apply(this)

}

util.inherits(Manager, EventEmitter)


/**
 * @method
 * @description  initialize and open all browser windows to use
 */
Manager.prototype.init = function() {
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
}


Manager.prototype.deck = function(limit) {
  this.spaceLimit = limit
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
  this.timer = setInterval(this.pretimeline.bind(this),100)
}

Manager.prototype.time = 0

Manager.prototype.pretimeline = function() {
  this.time += 0.1
  setInterval(this.timeline.bind(this,this.time),100)
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

Manager.prototype.film = function(src,params) {
    !window.films ? window.films = new Array() : null;
    var i = this.add("film",films,params)
    src ? films[i].load(src) : false;
}

Manager.prototype.makeSpace = function(params) {
    var i = this.add("window",_spaces,params)
}

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

Manager.prototype.pare = function(size) {
  size = size ? size : 1;
  for (var i=0;i<size;i++) {
    spaces[0].hide()
  }
}


Manager.prototype.makeWall = function(num,config) {
  var wall = new Array()
  for (var i=0;i<num;i++) {
    wall.push(this.useSpace(200*(i+1),50,200,400))
  }
  walls.push(wall)

//  return 
}
