var util = require('util')
var Tone = require('Tone')
var StaticProject = require('../guides/static')
var ClientProject = require('../guides/client')



/** 
  @title McLuhan JS API
  @overview A toolkit for live net art
  @author Ben Taylor
  @copyright &copy; 2015-2016
  @license MIT
 */ 

var spacer = false;


/** 

  @constructor
  @description Methods for all global actions that affect groups of media objects.
  
*/

var Manager = module.exports = function() {

  /* windows in this wall */
  this.spaceLimit = 8;

  /**
   * Dimensions of the screen area to be used for the performance. Default 900x700. Properties: stage.w (width in px) and stage.h (height in px)
   * @type {Object}
   * @memberOf Manager
   */
  this.stage = {
    w: 900,
    h: 700
  }

  this.stage.x = window.screen.width / 2 - this.stage.w / 2;
  this.stage.y = window.screen.height / 2 - this.stage.h / 2;

  this.media = []
  
  this.createPatterns()

  /* AUDIO MANAGEMENT */
  window.Tone = Tone

  //fx is a gain node that all other audio media connects to
  //this way, effects can be added or rearranged later without breaking code
  //previously all audio media connected to m.pitch.ugen
  //but that caused a problem if ever wanted to change the first effect from pitchshift to something else
  this.fx = new Tone.Volume()
   
  /**
   * A bandpass filter applied to audio.<br>
   * bp.freq() changes the center frequency.<br>
   * bp.q() changes the q.<br>
   * Both methods take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.bp = {
    ugen: new Tone.Filter(200,"bandpass"),
    freq: function() {
      m.rampValue(this.ugen.frequency,arguments)
    },
    q: function() {
      m.rampValue(this.ugen.Q,arguments)
    }
  }

  this.bp.ugen.Q.value = 0.3


  /**
   * A feedback delay applied to outgoing audio.<br>
   * echo.time() changes the delay time.<br>
   * echo.fb() changes the feedback level.<br>
   * echo.wet() changes the amount of signal routed through the delay<br>
   * All methods take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
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

  /**
   * A reverb applied to outgoing audio.<br>
   * hall.size() changes the reverb's virtual room size.<br>
   * hall.wet() changes the amount of signal passed into the reverb.<br>
   * All methods take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.hall = {
    ugen: new Tone.JCReverb(),
    size: function() {
      m.rampValue(this.ugen.roomSize,arguments)
    },
    wet: function() {
      m.rampValue(this.ugen.wet,arguments)
    }
  }

  /**
   * A volume of outgoing audio.<br>
   * vol.to() changes the outgoing volume level (0-1).<br>
   * All methods take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.vol = {
    ugen: new Tone.Volume(),
    to: function() {
      if (arguments.length==1 || arguments.length==2) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
      } else if (arguments.length==3) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
        arguments[1] = scale(arguments[0],1,0,0,-200)
      }
      m.rampValue(this.ugen.volume,arguments)
    }
  }

  /**
   * Pan outgoing audio.<br>
   * pan.to() changes the outgoing pan level (0-1).<br>
   * All methods take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.pan = {
    ugen: new Tone.Panner(),
    to: function() {
      m.rampValue(this.ugen.pan,arguments)
    }
  }



  this.fx.chain(this.bp.ugen,this.echo.ugen,this.hall.ugen,this.vol.ugen,this.pan.ugen,Tone.Master)


  /* create global generators */

  /**
   * A sine generator.<br>
   * sine.freq() changes the frequency<br>
   * sine.vol() changes the volume (0-1)<br>
   * sine.start()<br>
   * sine.stop()<br>
   * .freq() and .vol() take arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.sine = {
    ugen: new Tone.Oscillator(),
    freq: function() {
      m.rampValue(this.ugen.frequency,arguments)
    },
    vol: function() {
      if (arguments.length==1 || arguments.length==2) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
      } else if (arguments.length==3) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
        arguments[1] = scale(arguments[0],1,0,0,-200)
      }
      m.rampValue(this.ugen.volume,arguments)
    },
    start: function() {
      this.ugen.start()
    },
    stop: function() {
      this.ugen.stop()
    }  
  }
  this.sine.ugen.connect(this.fx)


  /**
   * A noise generator.<br>
   * noise.vol() changes the volume (0-1)<br>
   * noise.start()<br>
   * noise.stop()<br>
   * .vol() takes arguments of (destination) or (destination,time) or (origin,destination,time)
   * @type {Object}
   * @memberOf Manager
   */
  this.noise = {
    ugen: new Tone.Noise(),
    gain: new Tone.Volume(),
    vol: function() {
      if (arguments.length==1 || arguments.length==2) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
      } else if (arguments.length==3) {
        arguments[0] = scale(arguments[0],1,0,0,-200)
        arguments[1] = scale(arguments[0],1,0,0,-200)
      }
      m.rampValue(this.gain.volume,arguments)
    },
    start: function() {
      this.ugen.start()
    },
    stop: function() {
      this.ugen.stop()
    }
  }
  this.noise.ugen.chain(this.noise.gain,this.fx)

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

/*
 * *static mode only* Start the event timeline.
 */
Manager.prototype.start = function() {
  this.timer = setInterval(this.pretimeline.bind(this),100)
}


/*
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

/*
 * Add a new window to the deck. Not recommended. Use m.deck() instead.
 * @param { object } [params] key value pairs of params such as x/y/w/h
 */
Manager.prototype.makeSpace = function(params) {
    var i = this.add("window",_spaces,params)
}

/*
 * Use a window from the stack and return it to be added to the wall.
 * Called by the Wall initializer. 
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
Manager.prototype.google = function(keyword,callback) {

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

/** 
 * An object containing wall window arrangements as x,y,w,h.
 */
Manager.prototype.patterns = {
  "default": [
    {
      x: "Math.random()*0.9",
      y: "Math.random()*0.9",
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
      x: 0.504,
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
  ],
  "low": [
    {
      x: 0,
      y: 0.75,
      w: 0.25,
      h: 0.25
    },
    {
      x: 0.25,
      y: 0.75,
      w: 0.25,
      h: 0.25
    },
    {
      x: 0.5,
      y: 0.75,
      w: 0.25,
      h: 0.25
    },
    {
      x: 0.75,
      y: 0.75,
      w: 0.25,
      h: 0.25
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
    console.log("ramping to "+args[0])
    ugen.rampTo(args[0],0.01)
  } else if (args.length==2) {
    ugen.rampTo(args[0],args[1])
  } else if (args.length>=3) {
    var nodetime = args[args.length-1] / (args.length - 2)
    for (var i=0;i<args.length-1;i++) {
      ugen.rampTo(args[i],nodetime*i)
    }
  }
  
}
