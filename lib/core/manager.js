
 var util = require('util');
 var EventEmitter = require('events').EventEmitter;

/** 
  @title McLuhan JS API
  @overview 
  @author Ben Taylor
  @copyright &copy; 2015
  @license MIT
 */ 


var manager = module.exports = function() {

/** 

  @class mc
  @description 
  
*/

  // EventEmitter.apply(this)

}

util.inherits(manager, EventEmitter)


/** 
  @method add 
  */
manager.prototype.add = function(type,arr,params) {

  //separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
  arr.push( new (require("../media")[type])(params) )
  var i = arr.length-1;
  return i;
  
}

manager.prototype.film = function(src,params) {
    !window.films ? window.films = new Array() : null;
    var i = this.add("film",films,params)
    films[i].src = src;
}
