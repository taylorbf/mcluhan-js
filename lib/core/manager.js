var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Tone = require('Tone')  //.Tone
//var math = require('../utils/math')
var extend = require('extend');
var StaticProject = require('../guides/static')
var ClientProject = require('../guides/client')



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
  //
  
  this.createPatterns()



  /* AUDIO MANAGEMENT */

 
  window.Tone = Tone

 /* // UGENS
  this.player = new Tone.Player("./ambientcity.mp3")
  Tone.Buffer.on("load",function(){
    this.player.loop = true
    this.player.start();
  }.bind(this))
*/


  //var pitch = new Tone.PitchShift()
  //pitch.pitch (STEPS) -- can use tune.js maybe?
  //pitch.wet (signal)
  this.pitch = {
    ugen: new Tone.PitchShift(),
    to: function() {
      this.ugen.pitch = arguments[0]
    },
    wet: function() {
      m.rampValue(this.ugen.wet,arguments)
    }
  }

  //var bp = new Tone.Filter(200,"bandpass")
  // Q
  // frequency
  
  this.bp = {
    ugen: new Tone.Filter(200,"bandpass"),
    freq: function() {
      m.rampValue(this.ugen.frequency,arguments)
    },
    q: function() {
      m.rampValue(this.ugen.Q,arguments)
    }
  }


  // var echo = new Tone.FeedbackDelay()
  // delayTime
  // feedback - 0-1
  // wet
  // 
  this.echo = {
    ugen: new Tone.FeedbackDelay(),
    time: function() {
      m.rampValue(this.ugen.delayTime,arguments)
    },
    fb: function() {
      m.rampValue(this.ugen.feedback,arguments)
    },
    wet: function() {
      m.rampValue(this.ugen.wet,arguments)
    }
  }

  //var hall = new Tone.JCReverb()
  //roomSize 0-1
  //wet
  //
  this.hall = {
    ugen: new Tone.JCReverb(),
    size: function() {
      m.rampValue(this.ugen.roomSize,arguments)
    },
    wet: function() {
      m.rampValue(this.ugen.wet,arguments)
    }
  }

  //var vol = new Tone.Volume()
  //volume
  //
  this.vol = {
    ugen: new Tone.Volume(),
    to: function() {
      m.rampValue(this.ugen.volume,arguments)
    }
  }

  //var pan = new Tone.Panner()
  //pan 0-1 (0.5 is middle)
  this.pan = {
    ugen: new Tone.Panner(),
    to: function() {
      m.rampValue(this.ugen.pan,arguments)
    }
  }

  this.pitch.ugen.chain(this.bp.ugen,this.echo.ugen,this.hall.ugen,this.vol.ugen,this.pan.ugen,Tone.Master)
  //
  //this.pitch.ugen.connect(this.bp.ugen)


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
Manager.prototype.client = new ClientProject()





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



Manager.prototype.patterns = {
  "default": [
    {
      x: Math.random()*0.9,
      y: Math.random()*0.9,
      w: .2,
      h: .2
    }
  ],
  "big1": [
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    }
  ],
  "line": [
    {
      x: 0,
      y: 0,
      w: .25,
      h: 1
    },
    {
      x: 0.25,
      y: 0,
      w: .25,
      h: 1
    },
    {
      // offset so that the main window will show for intervals
      x: 0.51,
      y: 0,
      w: .25,
      h: 1
    },
    {
      x: 0.75,
      y: 0,
      w: .25,
      h: 1
    }
  ],
  "fauve": [
    {
      x: 0.1,
      y: 0,
      w: 0.2,
      h: 0.2
    },
    {
      x: 0.7,
      y: 0.05,
      w: 0.1,
      h: 0.95
    },
    {
      x: 0.4,
      y: 0.4,
      w: 0.1,
      h: 0.1
    },
    {
      x: 0,
      y: 0.4,
      w: 0.3,
      h: 0.1
    }
  ]
}

Manager.prototype.createPatterns = function() {

  //grid4
  this.patterns["grid4"] = new Array();
  var size = .25
  for (var i=0;i<16;i++) {
    var col = Math.floor(i/4)
    //getCol(i,4)
    var row = i-col*4;
    //getRow(i,4)
    var pat = {
      x: col*size,
      y: row*size,
      w: size,
      h: size
    }
    //FUTURE: should do some callibration at start
    //to learn how big the URL bar etc of each browser is
    this.patterns["grid4"].push(pat)
  }

}

Manager.prototype.rampValue = function(ugen,args) {

  if (args.length==0) {
    return
  } else if (args.length==1) {
    ugen.rampTo(args[0],0)
  } else if (args.length==2) {
    ugen.rampTo(args[0],args[1])
  } else if (args.length>=3) {
    var nodetime = args[args.length-1] / (args.length - 2)
    for (var i=0;i<args.length-1;i++) {
      ugen.rampTo(args[i],nodetime*i)
    }
  }
  
}
