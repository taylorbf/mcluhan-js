
var util = require('util');
var EventEmitter = require('events').EventEmitter;
// var Tone = require('tone')

/** 
  @title McLuhan JS API
  @overview 
  @author Ben Taylor
  @copyright &copy; 2015
  @license MIT
 */ 

var spacer = false;


/** 

  @class m
  @description 
  
*/

var manager = module.exports = function() {

  this.spaceLimit = 5;

  // Will use eventually
  // EventEmitter.apply(this)

}

util.inherits(manager, EventEmitter)

manager.prototype.init = function() {
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
}


/** 
  @method add 
  */
manager.prototype.add = function(type,arr,params) {
  arr.push( new (require("../media")[type])(params) )
  var i = arr.length-1;
  return i;
}

manager.prototype.film = function(src,params) {
    !window.films ? window.films = new Array() : null;
    var i = this.add("film",films,params)
    src ? films[i].load(src) : false;
}

manager.prototype.makeSpace = function(params) {
    var i = this.add("window",_spaces,params)
}

manager.prototype.peer = function(x,y,w,h) {
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

manager.prototype.pare = function(size) {
  size = size ? size : 1;
  for (var i=0;i<size;i++) {
    spaces[0].hide()
  }
}


manager.prototype.makeWall = function(num,config) {
  var wall = new Array()
  for (var i=0;i<num;i++) {
    wall.push(this.useSpace(200*(i+1),50,200,400))
  }
  walls.push(wall)

//  return 
}
