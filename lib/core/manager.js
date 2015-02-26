
 var util = require('util');
 var EventEmitter = require('events').EventEmitter;

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

  this.spaceLimit = 3;

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
    var i = this.add("window",spaces,params)
}

//peer
