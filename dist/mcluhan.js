(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Manager = require('./lib/core/manager');
var math = require('./lib/utils/math');
var extend = require('extend');
require('nexusui');
window._ = require("underscore")
window.glitch = require("./bower_components/glitch-canvas/dist/glitch-canvas")
window.Nightmare = require ("nightmare")
window.Tone = require('tone').Tone


//var Voice = require("./lib/media/voice")

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
	// this opens all windows
    //m.init();
    
 //   new Nightmare().goto('http://yahoo.com').run()
	 // .type('input[title="Search"]', 'github nightmare')
	 // .click('.searchsubmit')
	 // .run();
	 // 

	window.feedbackDelay = new Tone.PingPongDelay({
	      "delayTime" : 0.07,
	      "feedback" : 0.94,
	      "wet" : 0.5
	}).toMaster();
	siri = new voice()
};


//currently implemented in WALL object instead
window.alt = function() {




}



window.Tonify = function(el) {

}

window.say = function(text,speed,pitch) {
	siri.say({
		"text": text,
		"speed": speed,
		"pitch": pitch
	})
}


//GLOBAL LIBARY CODE

window.getCol = function(index,limit) {
	return index%limit;
}

window.getRow = function(index,limit) {
	return Math.floor(index/limit);
}

Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
/*
Array.prototype.all = function(action,context) {
	var arr = this;
	var act = action.bind(context)
	for (var iii=0;iii<this.length;iii) {
		act(arr[iii])
	}
} */

window.random = function(scale) {
	return Math.floor(Math.random()*scale)
}

window.ramp = function(start,end,dur,callback) {
	$({n: start}).animate({n: end}, {
	    duration: dur,
	    easing: "linear",
	    step: callback
	})
}






},{"./bower_components/glitch-canvas/dist/glitch-canvas":2,"./lib/core/manager":3,"./lib/media":9,"./lib/utils/math":17,"extend":52,"nexusui":53,"nightmare":90,"tone":111,"underscore":112}],2:[function(require,module,exports){
//! glitch-canvas by snorpey, MIT License
(function(window, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        window.glitch = factory();
    }
})(this, function() {
    var canvas_1 = document.createElement("canvas");
    var canvas_2 = document.createElement("canvas");
    var ctx_1 = canvas_1.getContext("2d");
    var ctx_2 = canvas_2.getContext("2d");
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_map = base64_chars.split("");
    var reversed_base64_map = {};
    var params;
    var base64;
    var byte_array;
    var jpg_header_length;
    var img;
    var new_image_data;
    var i;
    var len;
    base64_map.forEach(function(val, key) {
        reversed_base64_map[val] = key;
    });
    function glitchImageData(image_data, parameters, callback) {
        if (isValidImageData(image_data) && checkType(parameters, "parameters", "object") && checkType(callback, "callback", "function")) {
            params = getNormalizedParameters(parameters);
            resizeCanvas(canvas_1, image_data);
            resizeCanvas(canvas_2, image_data);
            base64 = getBase64FromImageData(image_data, params.quality);
            byte_array = base64ToByteArray(base64);
            jpg_header_length = getJpegHeaderSize(byte_array);
            for (i = 0, len = params.iterations; i < len; i++) {
                glitchJpegBytes(byte_array, jpg_header_length, params.seed, params.amount, i, params.iterations);
            }
            img = new Image();
            img.onload = function() {
                ctx_1.drawImage(img, 0, 0);
                new_image_data = ctx_1.getImageData(0, 0, image_data.width, image_data.height);
                callback(new_image_data);
            };
            img.src = byteArrayToBase64(byte_array);
        }
    }
    function resizeCanvas(canvas, size) {
        if (canvas.width !== size.width) {
            canvas.width = size.width;
        }
        if (canvas.height !== size.height) {
            canvas.height = size.height;
        }
    }
    function glitchJpegBytes(byte_array, jpg_header_length, seed, amount, i, len) {
        var max_index = byte_array.length - jpg_header_length - 4;
        var px_min = parseInt(max_index / len * i, 10);
        var px_max = parseInt(max_index / len * (i + 1), 10);
        var delta = px_max - px_min;
        var px_i = parseInt(px_min + delta * seed, 10);
        if (px_i > max_index) {
            px_i = max_index;
        }
        var index = Math.floor(jpg_header_length + px_i);
        byte_array[index] = Math.floor(amount * 256);
    }
    function getBase64FromImageData(image_data, quality) {
        var q = typeof quality === "number" && quality < 1 && quality > 0 ? quality : .1;
        ctx_2.putImageData(image_data, 0, 0);
        var base64 = canvas_2.toDataURL("image/jpeg", q);
        switch (base64.length % 4) {
          case 3:
            base64 += "=";
            break;

          case 2:
            base64 += "==";
            break;

          case 1:
            base64 += "===";
            break;
        }
        return base64;
    }
    function getJpegHeaderSize(data) {
        var result = 417;
        for (i = 0, len = data.length; i < len; i++) {
            if (data[i] === 255 && data[i + 1] === 218) {
                result = i + 2;
                break;
            }
        }
        return result;
    }
    function base64ToByteArray(str) {
        var result = [];
        var digit_num;
        var cur;
        var prev;
        for (i = 23, len = str.length; i < len; i++) {
            cur = reversed_base64_map[str.charAt(i)];
            digit_num = (i - 23) % 4;
            switch (digit_num) {
              case 1:
                result.push(prev << 2 | cur >> 4);
                break;

              case 2:
                result.push((prev & 15) << 4 | cur >> 2);
                break;

              case 3:
                result.push((prev & 3) << 6 | cur);
                break;
            }
            prev = cur;
        }
        return result;
    }
    function byteArrayToBase64(arr) {
        var result = [ "data:image/jpeg;base64," ];
        var byte_num;
        var cur;
        var prev;
        for (i = 0, len = arr.length; i < len; i++) {
            cur = arr[i];
            byte_num = i % 3;
            switch (byte_num) {
              case 0:
                result.push(base64_map[cur >> 2]);
                break;

              case 1:
                result.push(base64_map[(prev & 3) << 4 | cur >> 4]);
                break;

              case 2:
                result.push(base64_map[(prev & 15) << 2 | cur >> 6]);
                result.push(base64_map[cur & 63]);
                break;
            }
            prev = cur;
        }
        if (byte_num === 0) {
            result.push(base64_map[(prev & 3) << 4]);
            result.push("==");
        } else if (byte_num === 1) {
            result.push(base64_map[(prev & 15) << 2]);
            result.push("=");
        }
        return result.join("");
    }
    function getImageDataCopy(image_data) {
        var copy = ctx_2.createImageData(image_data.width, image_data.height);
        copy.data.set(image_data.data);
        return copy;
    }
    function getNormalizedParameters(parameters) {
        return {
            seed: (parameters.seed || 0) / 100,
            quality: (parameters.quality || 0) / 100,
            amount: (parameters.amount || 0) / 100,
            iterations: parameters.iterations || 0
        };
    }
    function isValidImageData(image_data) {
        if (checkType(image_data, "image_data", "object") && checkType(image_data.width, "image_data.width", "number") && checkType(image_data.height, "image_data.height", "number") && checkType(image_data.data, "image_data.data", "object") && checkType(image_data.data.length, "image_data.data.length", "number") && checkNumber(image_data.data.length, "image_data.data.length", isPositive, "> 0")) {
            return true;
        } else {
            return false;
        }
    }
    function checkType(it, name, expected_type) {
        if (typeof it === expected_type) {
            return true;
        } else {
            error(it, "typeof " + name, '"' + expected_type + '"', '"' + typeof it + '"');
            return false;
        }
    }
    function checkNumber(it, name, condition, condition_name) {
        if (condition(it) === true) {
            return true;
        } else {
            error(it, name, condition_name, "not");
        }
    }
    function isPositive(nr) {
        return nr > 0;
    }
    function error(it, name, expected, result) {
        throw new Error("glitch(): Expected " + name + " to be " + expected + ", but it was " + result + ".");
    }
    return glitchImageData;
});
},{}],3:[function(require,module,exports){
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Tone = require('tone')
var math = require('../utils/math')
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

  /** @type {Number} */
  this.spaceLimit = 8;

  // Will use eventually
  // EventEmitter.apply(this)
  
  extend(this,math)

}

util.inherits(Manager, EventEmitter)


/**
 * @method
 * @description  initialize and open all browser windows to use
 */
Manager.prototype.init = function() {
  //deprecated
  for (var i=0;i<this.spaceLimit;i++) {
    m.makeSpace()
  }
}


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


/* GUI THINGS */


Manager.prototype.static = new StaticProject()

},{"../guides/static":5,"../media":9,"../utils/math":17,"events":23,"extend":52,"tone":111,"util":51}],4:[function(require,module,exports){

// Template for all DOM-based items (video, audio, divs, embeds)
/**
 * @class Medium
 * @constructor
 * @description  Template for all DOM-based media items (video, audio, text, etc)
 * @param  {object} Params (see Params)
 */
var Medium = module.exports = function(params) {

	// handle parameters
	this.params = params ? params : new Object()

	// define space
	this.spaces = this.params.spaces ? this.params.spaces : [0];

	// make element
	this.element = [];
	for (var i = 0; i<this.spaces.length; i++) {
		this.element.push(document.createElement(this.type))
		this.spaces[i].element.document.body.appendChild(this.element[i])
	}

	this.size(params)
}

/**
 * Set a property of all window elements in this media element's wall
 * @param {String} property key
 * @param {Unknown} value
 */
Medium.prototype.setAll = function(prop,val) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][prop] = val;
	}
}
Medium.prototype.all = function(method) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i][method]()
	}
}

Medium.prototype.size = function(params) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.width = this.params.w ? this.params.w+"px" : this.defaultSize.w+"px";
		this.element[i].style.height = this.params.h ? this.params.h+"px" : this.defaultSize.h+"px";
	}
	/*this.params.w ? this.element.style.width = this.params.w+"px" : false;
	this.params.width ? this.element.style.width = this.params.width+"px" : false;
	this.params.h ? this.element.style.width = this.params.h+"px" : false;
	this.params.height ? this.element.style.width = this.params.height+"px" : false;*/
}

Medium.prototype.move = function(params) {
	for (var i = 0; i<this.element.length; i++) {
		this.element[i].style.position = "absolute";
		params.x ? this.element[i].style.left = params.x+"px" : false;
		params.y ? this.element[i].style.top = params.y+"px" : false;
	}
}
},{}],5:[function(require,module,exports){


var StaticProject = module.exports = function() {

	this.showbguide = true;
	this.smoothguide = 0;
	window.NProgress = require('nprogress')

	this.wwid = window.screen.availWidth;
	this.whgt = window.screen.availHeight;
	
}

StaticProject.prototype.setup = function() {

	var htmlstr = '<div class="sguide" style="display:none">'
				+ 'Please move your browser to the middle of your screen.'
				+ '<div id="sgarrow" style="font-size:70px;margin-top:40px">&#10148;</div>'
				+ '</div>'
				+ '<div class="bguide">'
				+ 'Please resize your browser to the size of this box.'
				+ '</div>'

	$(".guides").append(htmlstr)

	var htmlstr = '<div id="splash">'
			 	+ '<span>M</span>'
				+ '</div>'

	$("body").append(htmlstr)


	NProgress.start();
	//NProgress.inc();


	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: "../node_modules/nprogress/nprogress.css"
	}).appendTo("head");

	projectwid = $(".guides").width()
	projecthgt = $(".guides").height()

	window.addEventListener("resize",this.checkSize.bind(this))

	this.checkSize()
	
	setTimeout("NProgress.set(0.69)", 4000);
	setTimeout("NProgress.set(0.99)", 6000);
	setTimeout(NProgress.done, 8000);
	setTimeout("$('#splash').fadeOut()", 8000);

	window.addEventListener("beforeunload", function() {
		m.deck(m.spaceLimit);
	});
}

StaticProject.prototype.checkSize = function() {
	var winwid = window.innerWidth;
	var winhgt = window.innerHeight;
	if (winwid < projectwid + 10 && winwid > projectwid - 10 && winhgt < projecthgt + 10 && winhgt > projecthgt - 10) {

		if (this.showbguide) {
			this.showbguide = false;
			$(".bguide").fadeOut(this.smoothguide)
			$(".sguide").fadeIn(0)
			this.watchWindow();
		}
	} else {
		this.smoothguide = 500;
	}
}

StaticProject.prototype.watchWindow = function() {
	this.sguide = setInterval(this.pingWindow.bind(this), 100)
}


StaticProject.prototype.pingWindow = function() {
	var winx = window.screenLeft;
	var winy = window.screenTop;
	var winwid2 = window.outerWidth;
	var winhgt2 = window.outerHeight;

	var distx = winx + (winwid2/2) - (this.wwid/2)
	var disty = winy + (winhgt2/2) - (this.whgt/2)

	var polar = m.toPolar(distx,disty)
	var degrees = Math.round((polar.angle/(Math.PI*2)) * 360) + 180;
	//var size = (Math.round(polar.radius)/8)+30

	$("#sgarrow").css("-ms-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("-webkit-transform", "rotate("+degrees+"deg)")
	$("#sgarrow").css("transform", "rotate("+degrees+"deg)")
	//$("#sgarrow").css("font-size", size+"px")

	if (Math.abs(distx) < 20 && Math.abs(disty) < 20 ) {
		$(".sguide").fadeOut(this.smoothguide)
		clearInterval(this.sguide)
	} else {
		this.smoothguide = 500
	}

}

StaticProject.prototype.begin = function() {

	$("#shell").fadeOut(500)
	$("body").css("background-color","white")

	m.start(0,1000);

}		

	

},{"nprogress":110}],6:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative AUDIO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */
var Cassette = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.src = false;
	this.type = "audio"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);
/*
	for (var i=0;i<this.element.length;i++) {
		this._p.push(Tone.Player())
		this._p[this._p.length-1].toMaster()
	}
*/
	this.interval = false;
	this.rate = 1;

	this.setAll("controls", true);
	this.setAll("volume", 0.5);
	this.loop();

	this._b = new Array();
	for (var i=0;i<this.element.length;i++) {
		var tonesource = Tone.context.createMediaElementSource(this.element[i]);
		tonesource.connect(feedbackDelay)
		this._b.push(tonesource);
	}
	
	

}

util.inherits(Cassette, Medium);

Cassette.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp3") : false;
	this.all("play");
	return this;
}

Cassette.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

Cassette.prototype.stop = function() {
	this.all("pause");
}

Cassette.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}


Cassette.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Cassette.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
	return this;
}

Cassette.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
	return this;
}

Cassette.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
	return this;
}


},{"../core/medium":4,"util":51}],7:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative VIDEO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */
var Film = module.exports = function(params) {

	this.defaultSize = { w: 900 }
	this.src = false;
	this.type = "video"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.interval = false;
	this.rate = 1;


	this.setAll("controls", false);
	this.setAll("volume", 0);
	this.loop();

}

util.inherits(Film, Medium);

Film.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp4") : false;
	this.all("play");
}

Film.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

Film.prototype.stop = function() {
	this.all("pause");
}

Film.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}


Film.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Film.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
}

Film.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
}

Film.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
}


},{"../core/medium":4,"util":51}],8:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Hack
 * @constructor
 * @description  Performative IFRAME media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Photo}
 */
var Hack = module.exports = function(params) {

	this.defaultSize = { w: 1200, h: 1200 }
	this.type = "iframe";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	for (var i=0;i<this.element.length;i++) {
		this.element[i].style.border="none";
	}

//	denied for cross-origin reasons:
/*	this.doc = new Array();

	for (var i=0;i<this.element.length;i++) {
	    $(this.element[i]).load(function() {
	        this.doc.push(this.contentDocument || this.contentWindow.document);
	    	console.log(this.doc)
	    }.bind(this));
	} */

}

util.inherits(Hack, Medium);

Hack.prototype.load = function(src) {

	for (var i=0;i<this.spaces.length;i++) {
		this.element[i].src = "http://"+src
	}

	return this;

}


},{"../core/medium":4,"util":51}],9:[function(require,module,exports){
module.exports = {
  cassette: require('./cassette'),
  film: require('./film'),
  hack: require('./hack'),
  lattice: require('./lattice'),
  paper: require('./paper'),
  photo: require('./photo'),
  presence: require('./presence'),
  voice: require('./voice'),
  window: require('./window'),
  wall: require('./wall')
}
},{"./cassette":6,"./film":7,"./hack":8,"./lattice":10,"./paper":11,"./photo":12,"./presence":13,"./voice":14,"./wall":15,"./window":16}],10:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Lattice
 * @constructor
 * @description  Interactive PITCH LATTICE
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Lattice}
 */
var Lattice = module.exports = function(params) {

	this.defaultSize = { w: 600, h: 600 }
	this.type = "canvas";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.context = []
	this.instrument = []
	//create 3d matrix
	this.dimension = {
		x: 5,
		y: 8,
		z: 3
	}
	this.place = {
		x: Math.floor(this.dimension.x/2),
		y: Math.floor(this.dimension.y/2),
		z: Math.floor(this.dimension.z/2)
	}

	for (var i = 0; i<this.spaces.length; i++) {
		this.element[i].width = this.defaultSize.w
		this.element[i].height = this.defaultSize.h
		this.instrument[i] = new Object();
		this.instrument[i].context = this.element[i].getContext("2d")	
		this.instrument[i].notes = new Array();
		for (var j = 0; j < this.dimension.z; j++) {
			this.instrument[i].notes[j] = new Array();
			for (var k = 0; k < this.dimension.x; k++) {
				this.instrument[i].notes[j][k] = new Array();
				for (var l = 0; l < this.dimension.y; l++) {
					this.instrument[i].notes[j][k][l] = new this.note(j,k,l,this.instrument[i].context,this.instrument[i],this);
				}
			}
		}
	}

	this.draw();

	return this;

}


/*
	looking at : 5 * 3 * 10
	x: * 3/2
	y: + fundamental of this column, making overtone series
	z: * 5/4
				25/16
				5/4		15/8	45/32
		2/3		1/1		3/2		9/8
				8/5




		2/3 * <=	=> * 3/2
 */


util.inherits(Lattice, Medium);

Lattice.prototype.draw = function(src) {

	for (var i = 0; i<this.instrument.length; i++) {
		var context = this.instrument[i].context
		context.fillStyle="black"
		context.fillRect(0,0,this.defaultSize.w,this.defaultSize.h)
		var notes = this.instrument[i].notes
		for (var j = 0; j < notes.length; j++) {
			for (var k = 0; k < notes[j].length; k++) {
				for (var l = 0; l < notes[j][k].length; l++) {
					notes[j][k][l].draw();
				}
			}
		}
	}


	return this;

}

Lattice.prototype.play = function() {
	this.instrument[0].notes[this.place.z][this.place.x][this.place.y].play()
}
Lattice.prototype.wander = function() {
	this.int = setInterval(this.nextxyz.bind(this),100)
}
Lattice.prototype.nextxyz = function() {
	var dir = random(3)
	if (dir==0) {
		this.place.x += random(3)-1
	} else if (dir==1) {
		this.place.y += random(3)-1
	} else {
		this.place.z += random(3)-1
	}
	this.place.x = this.place.x>=this.dimension.x ? 0 : this.place.x;
	this.place.y = this.place.y>=this.dimension.y ? 0 : this.place.y;
	this.place.z = this.place.z>=this.dimension.z ? 0 : this.place.z;
	this.place.x = this.place.x<0 ? this.dimension.x-1 : this.place.x;
	this.place.y = this.place.y<0 ? this.dimension.y-1 : this.place.y;
	this.place.z = this.place.z<0 ? this.dimension.z-1 : this.place.z;
	this.play()
}
Lattice.prototype.nextx = function() {
	this.place.x++
	this.place.x = this.place.x>=this.dimension.x ? 0 : this.place.x;
	this.place.x = this.place.x<0 ? this.dimension.x : this.place.x;
	this.play()
}
Lattice.prototype.nexty = function() {
	this.place.y++
	this.place.y = this.place.y>=this.dimension.y ? 0 : this.place.y;
	this.place.y = this.place.y<0 ? this.dimension.y : this.place.y;
	this.play()
}
Lattice.prototype.nextz = function() {
	this.place.z++
	this.place.z = this.place.z>=this.dimension.z ? 0 : this.place.z;
	this.place.z = this.place.z<0 ? this.dimension.z : this.place.z;
	this.play()
}


Lattice.prototype.note = function(z,x,y,context,instrument,lattice) {

	this.note = 0.1 * ((x+1)*5/4) * (y+1) * ((z+1)*3/2)
	//this.note = 0.01 * (x*3/2) * y * (z*5/4)
	this.on = false

	this.context = context
	this.instrument = instrument
	this.lattice = lattice

	this.player = new Tone.Player("./media/pnoc3.mp3")
	this.player.retrigger = true
	this.player.playbackRate = this.note
	this.player.toMaster()

	this.x = x
	this.y = y
	this.z = z

	this.place = {
		x: (this.x * 60 + 50) * (1+this.z/12),
		y: (this.y * 50 + 50) * (1+this.z/12)
	}
	this.grd = this.context.createRadialGradient(this.place.x-3,this.place.y-3,3,this.place.x+3,this.place.y+3,20);
	this.grd.addColorStop(0,"rgb("+(180+this.z*40)+","+(180+this.z*40)+","+(180+this.z*40)+")")
	this.grd.addColorStop(1,"#333")

	this.grd2 = this.context.createRadialGradient(this.place.x-3,this.place.y-3,3,this.place.x+3,this.place.y+3,20);
	this.grd2.addColorStop(0,"rgb("+(0+this.z*40)+","+(0+this.z*40)+","+(180+this.z*40)+")")
	this.grd2.addColorStop(1,"#0af")

	this.draw = function() {

		//j is z
		//k is x
		//l is y
		if (this.on) {
			this.context.fillStyle = this.grd2
		} else {
			this.context.fillStyle = this.grd
		}
		this.context.beginPath()
		this.context.arc(this.place.x,this.place.y,8+this.z*2,0,Math.PI*2,false)
		this.context.fill()
		this.context.closePath()

	}

	this.play = function() {
		this.on = true;
		this.player.onended = function() {
			this.on = false
			this.lattice.draw();
		}.bind(this)
		this.player.start();
		//currently redraws *all* lattices in all windows. should only draw its own instrument.
		this.lattice.draw();
	}

	this.stop = function() {
		this.on = false;
		this.player.stop();
		this.lattice.draw();

	}


}


},{"../core/medium":4,"util":51}],11:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Paper
 * @constructor
 * @description  Performative TEXT media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Paper}
 */
var Paper = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.type = "div";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.flipSpace = 0
	this.flipWord = 0
	this.time = 100;

	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "normal"
	}


}

util.inherits(Paper, Medium);

Paper.prototype.read = function(text) {
	console.log(journal, text)
	if (journal[text]) {
		this.text = journal[text];
	} else {
		this.text = text ? text : "null"
	}
	this.words = this.text.split(" ");
	this.letters = this.text.split("");
	return this;
}

/* eventually move this to happen at start up for all files in
/media/text folder, and to make them stored in journals object
with filname as object key */
Paper.prototype.readFile = function(file,callback) {
	file = file ? file : "hello"
	this.text
	$.get("text/"+file+'.txt', function(text) {
		this.text = text ? text : "null"
		this.words = this.text.split(" ");
		this.letters = this.text.split("");
		var bc = callback.bind(this)
	    bc(data);
	}.bind(this), 'text');
}

Paper.prototype.write = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.text
	}
	return this;
}

Paper.prototype.and = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.elements[i].innerHTML + this.text
	}
}

Paper.prototype.writeAcross = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "fullScreen"
		this.element[i].style.width = this.spaces[i].element.innerWidth+"px"
		this.element[i].style.height = this.spaces[i].element.innerHeight+"px"
		this.element[i].style.lineHeight = this.spaces[i].element.innerHeight+"px"
		if (i<this.words.length) {	
			this.element[i].innerHTML = this.words[i]
		}
	}
}

Paper.prototype.flip = function(time) {
	time ? this.time = time : null;
	this.flipint = setInterval(this.flipOne.bind(this), time)
}

Paper.prototype.flipOne = function() {
	this.element[this.flipSpace].innerHTML = this.words[this.flipWord];
	this.flipSpace++;
	if (this.flipSpace>=this.spaces.length) {
		this.flipSpace=0;
	}
	this.flipWord++;
	if (this.flipWord>=this.words.length) {
		this.flipWord=0;
	}
}

Paper.prototype.unflip = function(file) {
	clearInterval(this.flipint);
}


Paper.prototype.wash = function(time) {
	time ? this.time = time : null;
	this.washWord = 0;
	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "fullScreen"
		this.element[i].style.width = this.spaces[i].element.innerWidth+"px"
		this.element[i].style.height = this.spaces[i].element.innerHeight+"px"
		this.element[i].style.lineHeight = this.spaces[i].element.innerHeight+"px"
	}
	this.washint = setInterval(this.washOne.bind(this), time)
}

Paper.prototype.washOne = function() {
	for (var i=0;i<this.element.length;i++) {
		if (!this.strobe) {
			this.element[i].style.backgroundColor = "black"
		} else {
			this.element[i].style.backgroundColor = "white"
		}
		this.element[i].innerHTML = this.words[this.washWord];
	}
	if (!this.strobe) {
		this.strobe = true;
	} else {
		this.strobe = false;
	}
	this.washWord++;
	if (this.washWord>=this.words.length) {
		this.washWord = 0;
		//this.unwash()
	}
}

Paper.prototype.unwash = function(file) {
	clearInterval(this.washint);
}


},{"../core/medium":4,"util":51}],12:[function(require,module,exports){
var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Photo
 * @constructor
 * @description  Performative IMAGE media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Photo}
 */
var Photo = module.exports = function(params) {

	this.defaultSize = { w: 300, h: 300 }
	this.type = "canvas";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.context = []

	for (var i = 0; i<this.spaces.length; i++) {
		this.context.push(this.element[i].getContext("2d"))
	}

	this.width = 0;
	this.height = 0;

}

util.inherits(Photo, Medium);

Photo.prototype.load = function(src) {

	this.image = new Image()
	this.image.onload = function() {
		this.width = this.image.width;
		this.height = this.image.height
		for (var i=0;i<this.context.length;i++) {
			this.element[i].width = this.width;
			this.element[i].height = this.height;
			this.element[i].style.width = this.width;
			this.element[i].style.height = this.height;
			this.context[i].drawImage(this.image,0,0)
		}
	}.bind(this)
	this.image.src = "images/"+src+".jpg"

	return this;

}

Photo.prototype.glitch = function(file,callback) {
	this.data = this.context[0].getImageData( 0, 0, this.width, this.height );

	// glitch the image data (passing drawImageDataInCanvasTwo as a callback function)
	var parameters = { amount: 10, seed: 45, iterations: 30, quality: 30 };
	
	console.log(parameters)
	console.log(glitch)
	
	glitch( this.data, parameters, function(data) {
		console.log("inside")
		for (var i = 0; i<this.spaces.length; i++) {
			this.context[i].putImageData( data, 0, 0 );
		}
	}.bind(this));
		
}


},{"../core/medium":4,"util":51}],13:[function(require,module,exports){
var util = require('util');

/**
 * @class Presence
 * @constructor
 * @description  Pixilated live video feed of performer
 * @param  {object} Params (see Params)
 * @return {Presence}
 */
var Presence = module.exports = function(params) {

	this.defaultSize = { w: 400, h: 300 }

	this.fps = 10

	this.video = document.createElement("video")
	this.video.style.height = this.defaultSize.h;
	this.video.style.width = this.defaultSize.w;
	this.video.height = this.defaultSize.h;
	this.video.width = this.defaultSize.w;
	this.video.play()

	this.pic = document.createElement('canvas');
	this.pic.style.height = this.defaultSize.h;
	this.pic.style.width = this.defaultSize.w;
	this.pic.width = this.defaultSize.w;
	this.pic.height = this.defaultSize.h;
	this.picctx = this.pic.getContext('2d');

	this.canvas = document.getElementById("presence")
	this.canvas.style.height = this.defaultSize.h;
	this.canvas.style.width = this.defaultSize.w;
	this.canvas.width = this.defaultSize.w;
	this.canvas.height = this.defaultSize.h;
	this.context = this.canvas.getContext('2d');


	document.getElementById("main").appendChild(this.canvas)
	
	
	this.localMediaStream = null;
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	if (navigator.getUserMedia) {
	  navigator.getUserMedia({audio: false, video: true}, function(stream) {
	        this.video.src = window.URL.createObjectURL(stream);
			this.localMediaStream = stream;
			this.start();
	  }.bind(this),function(e) { console.log(e)}.bind(this));
	}

}

Presence.prototype.snapshot = function(src) {
	this.context.fillStyle = "#eee";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
  if (this.localMediaStream) {
    this.picctx.drawImage(this.video, 0, 0, this.pic.width, this.pic.height);
    this.data = this.picctx.getImageData(0,0,this.pic.width,this.pic.height);
    console.log(this.data);
    var dim = 10
    var w = this.pic.width
    var h = this.pic.height
  /*  for (var i=0;i<this.data;i=i+4) {

  		this.context.fillStyle = "#000";
  		this.context.fillRect(0,0,10,10);
    } */
	for (var i=0;i<30;i++) {
        for (var j=0;j<40;j++) {
          // i means which row
          // j means which column
          //get data, avg, draw shape at right place
          var red = j*4*dim + i*320*4*dim;
          var green = j*4*dim + i*320*4*dim + 1;
          var blue = j*4*dim + i*320*4*dim + 2;
          var placex = j*dim;
          var placey = i*dim; 
          var darkness = this.data.data[red]+this.data.data[green]+this.data.data[blue];
          if (darkness < 300) {
          	//this.context.fillStyle = "rgb("+this.data.data[red]+","+this.data.data[green]+","+this.data.data[blue]+")";
          	this.context.fillStyle = "#04a";
          } else {
			this.context.fillStyle = "#fff";
          }
          this.context.fillRect(placex,placey,dim,dim)
        }
    }
  }
}

Presence.prototype.start = function(src) {
	this.boundSnapshot = this.snapshot.bind(this)
	this.interval = setInterval(this.boundSnapshot,1000/this.fps)
	return this;
}

Presence.prototype.stop = function(rate) {
	clearInterval(this.interval)
}

},{"util":51}],14:[function(require,module,exports){
var util = require('util');

/**
 * @class Voice
 * @constructor
 * @description  Performative Text-To-Speech media element
 * @param  {object} Params (see Params)
 * @return {Voice}
 */

var Voice = module.exports = function(params) {

	this.text = "hello world"

	this.src = false;

	this.element = document.createElement("audio");
	//this.element.src = "data:audio/x-wav;base64,"+encode64(wav)
	this.element.addEventListener('ended',function(el) {
		console.log("done")
		//this could be a place to remove this audio element,
		//if we want to dynamically load/destroy each audio element
	}.bind(this.element,this.element))

    this.stream = Tone.context.createMediaElementSource(this.element)
    this.stream.connect(feedbackDelay)

    //this.element.play()

}

Voice.prototype.say = function(params) {
	this.text = params.text;
	this.speed = params.speed ? params.speed : 175;
	this.pitch = params.pitch ? params.pitch : 50;
	speak(this.text, { pitch: this.pitch, speed: this.speed })
}

Voice.prototype.load = function(src) {
	src ? this.setAll("src","media/"+src+".mp3") : false;
	this.all("play");
	return this;
}

Voice.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate;
	this.all("play");
	this.speed(this.rate)
}

Voice.prototype.stop = function() {
	this.all("pause");
}

Voice.prototype.loop = function(on) {
	if (on===false || on===0) {
		this.setAll("loop",false);
	} else {
		this.setAll("loop",true);
	}
}


Voice.prototype.jumpTo = function(start) {
	start = start ? start : this.start;
	this.setAll("currentTime",start);
}

Voice.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
	return this;
}

Voice.prototype.unskip = function() {
	this.skipping = false;
	this.start = false;
	this.stop = false
	clearInterval(this.interval);
	this.interval = false;
	return this;
}

Voice.prototype.speed = function(rate) {
	if (rate) {
		this.setAll("playbackRate",rate);
		this.rate = rate;
	}
	return this;
}


},{"util":51}],15:[function(require,module,exports){
var util = require('util');
var units = require("../media")

/**
 * @class Wall
 * @constructor
 * @description Manages groups of windows
 */
var Wall = module.exports = function(setting,limit) {

	/**
	 * Window elements in this Wall
	 * @type {Array} 
	 * @memberOf Wall
	 */
	this.elements = []

	this.createPatterns();

	this.setting = setting ? setting : "default"
	this.limit = limit ? limit : this.patterns[this.setting].length
	this.patt = this.patterns[this.setting];
	for (var i=0;i<this.limit;i++) {
		this.elements.push(m.peer(this.patt[i].x, this.patt[i].y, this.patt[i].w, this.patt[i].h))
	}
	this.index = windex;
	this.visible = false;

	return this;
	
}

/**
 * Show all browser windows in this wall
 * @return {Wall} Should return this wall object but probably doesn't now.
 */
Wall.prototype.show = function() {

	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(this.patt[i].w, this.patt[i].h)
			moveTo(this.patt[i].x, this.patt[i].y)
		}
	}

  	/*_.each(this.elements,function(win,i,l) {	
		with (win.element) {
			resizeTo(this.patt[i].w, this.patt[i].h)
			moveTo(this.patt[i].x, this.patt[i].y)
		}
	}) */
	this.visible = true;
}

/**
 * Hide all browser windows in this wall (but keep them associated with this wall)
 * @return {Wall} Nothing yet
 */
Wall.prototype.hide = function() {
	for (var i=0;i<this.elements.length;i++) {
		with (this.elements[i].element) {
			resizeTo(100,100)
			moveTo(0,0)
		}
	}
	/*_.each(this.elements,function(win,i,l) {
		with (win.element) {
			resizeTo(100,100)
			moveTo(0,0)
		}
		this.visible = false;
	}) */
}

/** 
 * Add a new media element to this wall
 * @param {String}
 * @param {Object} params (see Params)
 */
Wall.prototype.add = function(type,params) {
  this.media.push(new ([type])(params) )
  var i = arr.length-1;
  return i;
}







/* adding media */

/**
 * Add a film element to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "waves" not "waves.mp4"
 * @return {Film}
 */
Wall.prototype.watch = function(src) {
	//NEED TO BE ABLE TO SET WIDTH / HEIGHT
	var _m = new film({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an audio cassette element to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Cassette}
 */
Wall.prototype.hear = function(src) {
	var _m = new cassette({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/** 
 * Add a paper (text) element to the page
 * @param  {String} message to write or .txt filename to read
 * @param  {String} style of writing
 * @param  {Number/String} optional arg depending on style
 * @return {Paper}
 */
Wall.prototype.write = function(msg,style,arg) {
	var _m = new paper({ spaces: this.elements });
	_m.read(msg)
	_m.wall = this;
	if (!style) {
		_m.write()
	} else if (style=="across") {
		_m.writeAcross()
	} else if (style=="flip") {
		_m.flip(arg)
	} else if (style=="wash") {
		_m.wash(arg)
	}
	return _m;
}

/**
 * Add an image canvas to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Photo}
 */
Wall.prototype.see = function(src) {
	var _m = new photo({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}

/**
 * Add an embedded webpage (iframe) to the wall
 * @param  {String}	source filename (w/o file extension, i.e. "piano" not "piano.mp3"
 * @return {Hack}
 */
Wall.prototype.hack = function(src) {
	var _m = new hack({ spaces: this.elements });
	_m.wall = this;
	_m.load(src)
	return _m;
}


/**
 * Add a just intonation pitch lattice to the wall
 * @return {Lattice}
 */
Wall.prototype.partch = function() {
	var _m = new lattice({ spaces: this.elements });
	_m.wall = this;
	return _m;
}









/* wall-specific */

/**
 * Scroll all windows to an x/y coordinate
 * @param  {number} x scroll coordinate
 * @param  {number} y scroll coordinate
 * @return {Wall}
 */
Wall.prototype.scroll = function(x,y) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scrollTo(x,y)
	}
}

/**
 * Destroy this wall and return all windows to stack
 */
Wall.prototype.kill = function() {
}

/**
 * Remove all media elements and content from all windows in this wall
 */
Wall.prototype.empty = function() {
}

Wall.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

/**
 * Scroll each window according to the window's place on the screen
 * @return {Wall}
 */
Wall.prototype.xray = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].xray()
	}
}
/**
 * Scroll each window to a random position
 * @return {Wall}
 */
Wall.prototype.scramble = function() {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].scramble()
	}
}

/* animate browser windows
Wall.prototype.trans = function(x,y,time) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].trans(x,y,time)
	}
} */

/* move and resize to new pattern configuration */
Wall.prototype.shapeshift = function(pattern,time) {
	var patt = this.patterns[pattern];
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].size(patt[i%patt.length].w,patt[i%patt.length].h,0)
		this.elements[i].move(patt[i%patt.length].x,patt[i%patt.length].y,time)
	}


/*	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(patt[i%patt.length].x,patt[i%patt.length].y,time,function(patt,i,time) {
			console.log(this,patt,i,time)
		//	alert("done")
			this.elements[i].size(patt[i%patt.length].w,patt[i%patt.length].h,time)
		}.bind(this,patt,i,time))
	} */
}

/**
 * Move all windows to an x/y location
 * @return {Wall}
 */
Wall.prototype.move = function(x,y,time) {
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].move(x,y,time)
	}
}

/**
 * Resize all windows to a specific w/h
 * @return {Wall}
 */
Wall.prototype.size = function() {
}

/**
 * Move all windows to an x/y location
 * @return {Wall}
 */
Wall.prototype.moveby = function() {
}

/**
 * Resize all windows to a specific w/h
 * @return {Wall}
 */
Wall.prototype.sizeby = function() {
}


/* resize whole wall to certain amount */







/** 
 * Refresh all windows in this wall
 * @return {Wall}
 */
Wall.prototype.refresh = function() {
}

/**
 * Goto a URL
 * @param  {string} URL
 * @param  {number/array} number of windows to use, or array of window numbers to use
 * @return {Wall}
 */
Wall.prototype.goto = function(url,window) {
	var url = url ? url : "space.html"
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	}
}

/*
Wall.prototype.rhythm = function(time,duration,functions,setting) {
	var _m = new rhythm(time,duration,functions,setting)
	_m.wall = this;
	setInterval()
	this.intervals.push(_m)
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	}
} */
// a.alt("a.show()","a.hide()")
// 
Wall.prototype.alt = function(functions,durations,iterations) {

	var timing = 0;
	for (var i=0;i<iterations;i++) {
		timing += durations.pick();
		setTimeout(functions.pick(),timing)
	}

/*
	var thefunc = function(arg1,arg2,arg3) {
		console.log(arg1)
		console.log(arg2)
		console.log(arg3)
	}.apply(this,[100,200,300])

	var _int = setInterval(thefunc, 1000) */
/*
	var _m = new rhythm(time,duration,functions,setting)
	_m.wall = this;
	setInterval()
	this.intervals.push(_m)
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].element.location.href = url
	} */
}


Wall.prototype.patterns = {
	"default": [
		{
			x: ~~(Math.random()*1000),
			y: ~~(Math.random()*600),
			w: 200,
			h: 100
		}
	],
	"big1": [
		{
			x: 100,
			y: 100,
			w: 450,
			h: 600
		}
	],
	"line": [
		{
			x: 1,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 200,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 400,
			y: 100,
			w: 200,
			h: 400
		},
		{
			x: 600,
			y: 100,
			w: 200,
			h: 400
		}
	]
}

Wall.prototype.createPatterns = function() {

	//grid4

	this.patterns["grid4"] = new Array();
	var size = 200
	for (var i=0;i<16;i++) {
		var col = getCol(i,4)
		var row = getRow(i,4)
		var pat = {
			x: col*size+1,
			y: row*size+1,
			w: size,
			h: size
		}
		//FUTURE: should do some callibration at start
		//to learn how big the URL bar etc of each browser is
		pat.y -= 50 * row;
		this.patterns["grid4"].unshift(pat)
	}

}





},{"../media":9,"util":51}],16:[function(require,module,exports){
var util = require('util');

/**
 * @constructor
 * @description  Window object managed by a Wall
 * @param  {object} Params (see Params)
 * @return {Window}
 */
var Window = module.exports = function(params) {

	this.defaultSize = { w: 300, h: 200, x: window.screen.width/2 - 150, y: window.screen.height/2 - 100 }
	this.element = window.open("space.html","win"+windex,"height=100,width=100,left:0,top:0,menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	this.index = windex;
	windex++;
	this.visible = false;
	this.empty()
	
}

Window.prototype.show = function(params) {

	this.element.close();
	this.element = window.open("space.html","win"+this.index,"height=100,width=100,left:0,top:0,menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	
	params = params ? params : new Object()
	params.w = params.w ? params.w : this.defaultSize.w
	params.h = params.h ? params.h : this.defaultSize.h
	params.x = params.x ? params.x : this.defaultSize.x
	params.y = params.y ? params.y : this.defaultSize.y

	with (this.element) {
		resizeTo(params.w,params.h)
		moveTo(params.x,params.y)
	}

	this.visible = true;
	this.element.focus()

	// spaces can access us
	spaces.push(this)

	// the new window can access us
	this.element.space = this;
	//this.element.defineCanvas();

	// this.canvas and this.context
	// are then created by the new window when loading

}

Window.prototype.hide = function() {
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	spaces.splice(spaces.indexOf(this),1)
	this.element.close();
	this.visible = false;
}

Window.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

Window.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
}
/*
Window.prototype.move = function(x,y) {
	this.element.moveTo(x,y)
}

Window.prototype.size = function() {
} */

Window.prototype.kill = function() {
}

Window.prototype.empty = function() {
	this.element.document.body.innerHTML = "";
}

Window.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

Window.prototype.scroll = function(x,y) {
	//this.element.scrollTo(x,y)
	$([this.element.document.body]).stop().clearQueue().animate({ scrollTop: y, scrollLeft: x }, 500);
}

Window.prototype.xray = function() {
	this.scroll(this.element.screenX,this.element.screenY)
}

Window.prototype.scramble = function() {
	var w = this.element.document.body.clientWidth
	var h = this.element.document.body.clientHeight
	this.scroll(random(w),random(h))
}


Window.prototype.refresh = function() {
}


Window.prototype.move = function(x,y,time,callback) {
	if (time && time > 99) {
		callback = callback ? callback : function() { }
		var obj = {
			x: this.element.screenX,
			y: this.element.screenY,
		}
		$(obj).animate({x: x, y: y}, {
		    duration: time,
		    easing: "linear",
		    step: function() {
		    	this.element.moveTo(obj.x,obj.y)
		    }.bind(this)
		 //   complete: callback
		})	
	} else {
		this.element.moveTo(x,y)
	}
	/*$({newx: this.element.screenX}).animate({newx: x}, {
	    duration: 8000,
	    easing: "linear",
	    step: function(cur) {
	    	this.element.moveTo(cur)
	    }.bind(this)
	})*/
/*	ramp(this.element.screenX, x, time, function(cur) {  
		this.element.moveTo(cur,this.element.screenY)
	}.bind(this))
	ramp(this.element.screenY, y, time, function(cur) {  
		this.element.moveTo(this.element.screenX,cur)
	}.bind(this))
*/

}

Window.prototype.size = function(w,h,time) {
	if (time && time > 99) {
		callback = callback ? callback : function() { }
		var obj = {
			w: this.element.outerWidth,
			h: this.element.outerHeight,
		}
		$(obj).animate({w: w, h: h}, {
		    duration: time,
		    easing: "linear",
		    step: function() {
		    	this.element.resizeTo(obj.w,obj.h)
		    }.bind(this),
		    complete: callback
		})
	} else {
		this.element.resizeTo(w,h)
	}
/*	ramp(this.element.outerWidth, w, time, function(cur) {  
		this.element.resizeTo(cur,this.element.outerHeight)
	}.bind(this))
	ramp(this.element.outerHeight, h, time, function(cur) {  
		this.element.resizeTo(this.element.outerWidth,cur)
	}.bind(this))
*/

}


Window.prototype.moveseq = function(x,y,time,callback) {

	//create a function that moves one window linearly, then calls this function again,
	// which will move the next window, etc.

	if (time && time > 99) {
		callback = callback ? callback : function() { }
		var obj = {
			x: this.element.screenX,
			y: this.element.screenY,
		}
		$(obj).animate({x: x, y: y}, {
		    duration: time,
		    easing: "linear",
		    step: function() {
		    	this.element.moveTo(obj.x,obj.y)
		    }.bind(this),
		    complete: callback
		})	
	} else {
		this.element.moveTo(x,y)
	}

}





},{"util":51}],17:[function(require,module,exports){
/**
 * @class utils tes
 * @description (IN TRANSIT) shared utility functions
 */



/** @method toPolar test1
    Receives cartesian coordinates and returns polar coordinates as an object with 'radius' and 'angle' properties.
    @param {float} [x] 
    @param {float} [y] 
*/
exports.toPolar = function(x,y) {
  var r = Math.sqrt(x*x + y*y);

  var theta = Math.atan2(y,x);
  if (theta < 0.) {
    theta = theta + (2 * Math.PI);
  }
  return {radius: r, angle: theta};
}

/** @method toCartesian 
    Receives polar coordinates and returns cartesian coordinates as an object with 'x' and 'y' properties.
    @param {float} [radius] 
    @param {float} [angle] 
*/
exports.toCartesian = function(radius, angle){
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return {x: radius*cos, y: radius*sin*-1};
}


/** @method clip 
    Limits a number to within low and high values.
    @param {float} [input value] 
    @param {float} [low limit] 
    @param {float} [high limit] 
*/
exports.clip = function(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

/** @method prune 
    Limits a float to within a certain number of decimal places
    @param {float} [input value] 
    @param {integer} [max decimal places] 
*/

exports.prune = function(data, scale) {
  if (typeof data === "number") {
    data = parseFloat(data.toFixed(scale));
  } else if (data instanceof Array) {
    for (var i=0;i<data.length;i++) {
      if (typeof data[i]=="number") {
        data[i] = parseFloat(data[i].toFixed(scale));
      }
    }
  }
  return data;
}

/** @method scale 
    Scales an input number to a new range of numbers
    @param {float} [input value] 
    @param {float} [low1]  input range (low)
    @param {float} [high1] input range (high)
    @param {float} [low2] output range (low)
    @param {float} [high2] output range (high)
*/
exports.scale = function(inNum, inMin, inMax, outMin, outMax) {
  return (((inNum - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;  
}

/** @method invert 
    Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number. 
    @param {float} [input value]  
*/
exports.invert = function (inNum) {
  return exports.scale(inNum, 1, 0, 0, 1);
}

exports.bounce = function(posIn, borderMin, borderMax, delta) {
  if (posIn > borderMin && posIn < borderMax) {
    return delta;
  } else if (posIn <= borderMin) {
    return Math.abs(delta); 
  } else if (posIn >= borderMax) {
    return Math.abs(delta) * (-1);
  }
}


/** @method mtof 
    MIDI to frequency conversion. Returns frequency in Hz.
    @param {float} [MIDI] MIDI value to convert
*/
exports.mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}


/** @method random 
    Returns a random integer between 0 a given scale parameter.
    @param {float} [scale] Upper limit of random range.
*/
exports.random = function(scale) {
  return Math.floor(Math.random() * scale);
}


exports.interp = function(loc,min,max) {
  return loc * (max - min) + min;  
}
},{}],18:[function(require,module,exports){

},{}],19:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (this.length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start) throw new TypeError('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new TypeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new TypeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":20,"ieee754":21,"is-array":22}],20:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],21:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],22:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],24:[function(require,module,exports){
var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');
var url = require('url')

http.request = function (params, cb) {
    if (typeof params === 'string') {
        params = url.parse(params)
    }
    if (!params) params = {};
    if (!params.host && !params.port) {
        params.port = parseInt(window.location.port, 10);
    }
    if (!params.host && params.hostname) {
        params.host = params.hostname;
    }

    if (!params.protocol) {
        if (params.scheme) {
            params.protocol = params.scheme + ':';
        } else {
            params.protocol = window.location.protocol;
        }
    }

    if (!params.host) {
        params.host = window.location.hostname || window.location.host;
    }
    if (/:/.test(params.host)) {
        if (!params.port) {
            params.port = params.host.split(':')[1];
        }
        params.host = params.host.split(':')[0];
    }
    if (!params.port) params.port = params.protocol == 'https:' ? 443 : 80;
    
    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

http.Agent = function () {};
http.Agent.defaultMaxSockets = 4;

var xhrHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
})();

http.STATUS_CODES = {
    100 : 'Continue',
    101 : 'Switching Protocols',
    102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
    200 : 'OK',
    201 : 'Created',
    202 : 'Accepted',
    203 : 'Non-Authoritative Information',
    204 : 'No Content',
    205 : 'Reset Content',
    206 : 'Partial Content',
    207 : 'Multi-Status',               // RFC 4918
    300 : 'Multiple Choices',
    301 : 'Moved Permanently',
    302 : 'Moved Temporarily',
    303 : 'See Other',
    304 : 'Not Modified',
    305 : 'Use Proxy',
    307 : 'Temporary Redirect',
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Time-out',
    409 : 'Conflict',
    410 : 'Gone',
    411 : 'Length Required',
    412 : 'Precondition Failed',
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Large',
    415 : 'Unsupported Media Type',
    416 : 'Requested Range Not Satisfiable',
    417 : 'Expectation Failed',
    418 : 'I\'m a teapot',              // RFC 2324
    422 : 'Unprocessable Entity',       // RFC 4918
    423 : 'Locked',                     // RFC 4918
    424 : 'Failed Dependency',          // RFC 4918
    425 : 'Unordered Collection',       // RFC 4918
    426 : 'Upgrade Required',           // RFC 2817
    428 : 'Precondition Required',      // RFC 6585
    429 : 'Too Many Requests',          // RFC 6585
    431 : 'Request Header Fields Too Large',// RFC 6585
    500 : 'Internal Server Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Gateway Time-out',
    505 : 'HTTP Version Not Supported',
    506 : 'Variant Also Negotiates',    // RFC 2295
    507 : 'Insufficient Storage',       // RFC 4918
    509 : 'Bandwidth Limit Exceeded',
    510 : 'Not Extended',               // RFC 2774
    511 : 'Network Authentication Required' // RFC 6585
};
},{"./lib/request":25,"events":23,"url":49}],25:[function(require,module,exports){
var Stream = require('stream');
var Response = require('./response');
var Base64 = require('Base64');
var inherits = require('inherits');

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = [];
    
    self.uri = (params.protocol || 'http:') + '//'
        + params.host
        + (params.port ? ':' + params.port : '')
        + (params.path || '/')
    ;
    
    if (typeof params.withCredentials === 'undefined') {
        params.withCredentials = true;
    }

    try { xhr.withCredentials = params.withCredentials }
    catch (e) {}
    
    if (params.responseType) try { xhr.responseType = params.responseType }
    catch (e) {}
    
    xhr.open(
        params.method || 'GET',
        self.uri,
        true
    );

    xhr.onerror = function(event) {
        self.emit('error', new Error('Network error'));
    };

    self._headers = {};
    
    if (params.headers) {
        var keys = objectKeys(params.headers);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!self.isSafeRequestHeader(key)) continue;
            var value = params.headers[key];
            self.setHeader(key, value);
        }
    }
    
    if (params.auth) {
        //basic auth
        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
    }

    var res = new Response;
    res.on('close', function () {
        self.emit('close');
    });
    
    res.on('ready', function () {
        self.emit('response', res);
    });

    res.on('error', function (err) {
        self.emit('error', err);
    });
    
    xhr.onreadystatechange = function () {
        // Fix for IE9 bug
        // SCRIPT575: Could not complete the operation due to error c00c023f
        // It happens when a request is aborted, calling the success callback anyway with readyState === 4
        if (xhr.__aborted) return;
        res.handle(xhr);
    };
};

inherits(Request, Stream);

Request.prototype.setHeader = function (key, value) {
    this._headers[key.toLowerCase()] = value
};

Request.prototype.getHeader = function (key) {
    return this._headers[key.toLowerCase()]
};

Request.prototype.removeHeader = function (key) {
    delete this._headers[key.toLowerCase()]
};

Request.prototype.write = function (s) {
    this.body.push(s);
};

Request.prototype.destroy = function (s) {
    this.xhr.__aborted = true;
    this.xhr.abort();
    this.emit('close');
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.body.push(s);

    var keys = objectKeys(this._headers);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = this._headers[key];
        if (isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                this.xhr.setRequestHeader(key, value[j]);
            }
        }
        else this.xhr.setRequestHeader(key, value)
    }

    if (this.body.length === 0) {
        this.xhr.send('');
    }
    else if (typeof this.body[0] === 'string') {
        this.xhr.send(this.body.join(''));
    }
    else if (isArray(this.body[0])) {
        var body = [];
        for (var i = 0; i < this.body.length; i++) {
            body.push.apply(body, this.body[i]);
        }
        this.xhr.send(body);
    }
    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
        var len = 0;
        for (var i = 0; i < this.body.length; i++) {
            len += this.body[i].length;
        }
        var body = new(this.body[0].constructor)(len);
        var k = 0;
        
        for (var i = 0; i < this.body.length; i++) {
            var b = this.body[i];
            for (var j = 0; j < b.length; j++) {
                body[k++] = b[j];
            }
        }
        this.xhr.send(body);
    }
    else if (isXHR2Compatible(this.body[0])) {
        this.xhr.send(this.body[0]);
    }
    else {
        var body = '';
        for (var i = 0; i < this.body.length; i++) {
            body += this.body[i].toString();
        }
        this.xhr.send(body);
    }
};

// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
Request.unsafeHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "cookie",
    "cookie2",
    "content-transfer-encoding",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "via"
];

Request.prototype.isSafeRequestHeader = function (headerName) {
    if (!headerName) return false;
    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
};

var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var indexOf = function (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
};

var isXHR2Compatible = function (obj) {
    if (typeof Blob !== 'undefined' && obj instanceof Blob) return true;
    if (typeof ArrayBuffer !== 'undefined' && obj instanceof ArrayBuffer) return true;
    if (typeof FormData !== 'undefined' && obj instanceof FormData) return true;
};

},{"./response":26,"Base64":27,"inherits":28,"stream":47}],26:[function(require,module,exports){
var Stream = require('stream');
var util = require('util');

var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
};

util.inherits(Response, Stream);

var capable = {
    streaming : true,
    status2 : true
};

function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line === '') continue;
        
        var m = line.match(/^([^:]+):\s*(.*)/);
        if (m) {
            var key = m[1].toLowerCase(), value = m[2];
            
            if (headers[key] !== undefined) {
            
                if (isArray(headers[key])) {
                    headers[key].push(value);
                }
                else {
                    headers[key] = [ headers[key], value ];
                }
            }
            else {
                headers[key] = value;
            }
        }
        else {
            headers[line] = true;
        }
    }
    return headers;
}

Response.prototype.getResponse = function (xhr) {
    var respType = String(xhr.responseType).toLowerCase();
    if (respType === 'blob') return xhr.responseBlob || xhr.response;
    if (respType === 'arraybuffer') return xhr.response;
    return xhr.responseText;
}

Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
};

Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
        try {
            this.statusCode = res.status;
            this.headers = parseHeaders(res);
        }
        catch (err) {
            capable.status2 = false;
        }
        
        if (capable.status2) {
            this.emit('ready');
        }
    }
    else if (capable.streaming && res.readyState === 3) {
        try {
            if (!this.statusCode) {
                this.statusCode = res.status;
                this.headers = parseHeaders(res);
                this.emit('ready');
            }
        }
        catch (err) {}
        
        try {
            this._emitData(res);
        }
        catch (err) {
            capable.streaming = false;
        }
    }
    else if (res.readyState === 4) {
        if (!this.statusCode) {
            this.statusCode = res.status;
            this.emit('ready');
        }
        this._emitData(res);
        
        if (res.error) {
            this.emit('error', this.getResponse(res));
        }
        else this.emit('end');
        
        this.emit('close');
    }
};

Response.prototype._emitData = function (res) {
    var respBody = this.getResponse(res);
    if (respBody.toString().match(/ArrayBuffer/)) {
        this.emit('data', new Uint8Array(respBody, this.offset));
        this.offset = respBody.byteLength;
        return;
    }
    if (respBody.length > this.offset) {
        this.emit('data', respBody.slice(this.offset));
        this.offset = respBody.length;
    }
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

},{"stream":47,"util":51}],27:[function(require,module,exports){
;(function () {

  var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],28:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],29:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],30:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],31:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],32:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.4 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],35:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":33,"./encode":34}],36:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":37}],37:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":39,"./_stream_writable":41,"_process":31,"core-util-is":42,"inherits":28}],38:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":40,"core-util-is":42,"inherits":28}],39:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"_process":31,"buffer":19,"core-util-is":42,"events":23,"inherits":28,"isarray":29,"stream":47,"string_decoder/":48}],40:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":37,"core-util-is":42,"inherits":28}],41:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":37,"_process":31,"buffer":19,"core-util-is":42,"inherits":28,"stream":47}],42:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":19}],43:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":38}],44:[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":37,"./lib/_stream_passthrough.js":38,"./lib/_stream_readable.js":39,"./lib/_stream_transform.js":40,"./lib/_stream_writable.js":41,"stream":47}],45:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":40}],46:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":41}],47:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":23,"inherits":28,"readable-stream/duplex.js":36,"readable-stream/passthrough.js":43,"readable-stream/readable.js":44,"readable-stream/transform.js":45,"readable-stream/writable.js":46}],48:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":19}],49:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":32,"querystring":35}],50:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],51:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":50,"_process":31,"inherits":28}],52:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],53:[function(require,module,exports){
var manager = require('./lib/core/manager');
var domUtils = require('./lib/utils/dom');
var drawingUtils = require('./lib/utils/drawing');
var mathUtils = require('./lib/utils/math');
var extend = require('extend');

/************************************************
*  INSTANTIATE NX MANAGER AND CREATE ELEMENTS   *
************************************************/

window.nx = new manager();
window.nx.onload = function() {};
window.nx = extend(window.nx,domUtils)
window.nx = extend(window.nx,drawingUtils)
window.nx = extend(window.nx,mathUtils)

/* this onload function turns canvases into nexus elements,
 * using the canvas's id as its var name */

window.onload = function() {

  nx.addStylesheet();

  // get all canvases on the page and add them to the manager
  var allcanvi = document.getElementsByTagName("canvas");
  for (i=0;i<allcanvi.length;i++) nx.transform(allcanvi[i]);

  if (nx.isTouchDevice) {
    document.addEventListener("touchmove", nx.blockMove, true);
    document.addEventListener("touchstart", nx.blockMove, true);
  }
  
  nx.onload();

  nx.startPulse();
  
};
},{"./lib/core/manager":54,"./lib/utils/dom":56,"./lib/utils/drawing":57,"./lib/utils/math":58,"extend":52}],54:[function(require,module,exports){

/** 
  @title NexusUI API
  @overview NexusUI is a JavaScript toolkit for easily creating musical interfaces in web browsers. Interfaces are rendered on HTML5 canvases and are ideal for web audio projects, mobile apps, or for sending OSC to external audio applications like Max.
  @author Ben Taylor, Jesse Allison, Yemin Oh, Sébastien Piquemal
  @copyright &copy; 2011-2014
  @license MIT
 */ 
 

var timingUtils = require('../utils/timing');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var transmit = require('../utils/transmit');


var manager = module.exports = function() {

/** 

  @class nx
  @description Central nexusUI manager with shared utility functions for all nexusUI objects
  
*/

  EventEmitter.apply(this)
  this.widgets = new Object();

  /**  @property {integer} throttlePeriod Throttle time in ms (for nx.throttle). */
  this.throttlePeriod = 20;
  this.elemTypeArr = new Array();
  this.aniItems = new Array();
  /**  @property {boolean} showLabels Whether or not to draw an automatic text label on each interface component. */
  this.showLabels = false;
  this.starttime = new Date().getTime();
  if (transmit) {
    /**  
    @method sendsTo 
    @param {string or function} [destination] Protocol for transmitting data from interfaces (i.e. "js", "ajax", "ios", "max", or "node"). Also accepts custom functions.
    ```js
    nx.sendsTo("ajax")

    // or

    nx.sendsTo(function(data) {
         //define a custom transmission function
    })
    ```
    */
    this.sendsTo = transmit.setGlobalTransmit;
    /**  
    @method setAjaxPath 
    @param {string} [path] If sending via AJAX, define the path to ajax destination
    */
    this.setAjaxPath = transmit.setAjaxPath;
    /**  @property {string} destination NexusUI's transmission protocol (i.e. "js" or "ajax"). Defaults to "js". We recommend setting this property using nx.sendsTo() which ensures that all widgets receive this setting. */
    this.destination = "js";
    /**  @property {string} ajaxPath If sending via AJAX, the destination path. Defaults to "lib/nexusOSCRelay.php". We recommend setting this property using nx.setAjaxPath() which ensures that all widgets receive this setting. */
    this.ajaxPath = "lib/nexusOSCRelay.php";
  }

  /** @property {boolean} isTouchDevice Returns true if page is loaded on a touch device. */
  this.isTouchDevice = ('ontouchstart' in document.documentElement)? true:false;
  this.metas = document.getElementsByTagName('meta');

  /**  @property {boolean} globalWidgets Whether or not to instantiate a global variable for each widget (i.e. button1). Defaults to true. Designers of other softwares who wish to keep nexusUI entirely encapsulated in the nx object may set this property to false. In that case, all widgets are accessible in nx.widgets */
  this.globalWidgets = true;
}

util.inherits(manager, EventEmitter)


/** 
  @method add 
  Adds a NexusUI element to the webpage. This will create an HTML5 canvas and draw the interface on it.
  @param {string} [type] NexusUI widget type (i.e. "dial").
  @param {object} [settings] (Optional.) Extra settings for the new widget. This settings object may have any of the following properties: x (integer in px), y, w (width), h (height), name (widget's OSC name and canvas ID), parent (the ID of the element you wish to add the canvas into). If no settings are provided, the element will be at default size and appended to the body of the HTML document.
  */
manager.prototype.add = function(type, args) {
  //args may have optional properties: x, y, w, h, name, parent

  if(type) {
      var canv = document.createElement("canvas");
      canv.setAttribute('nx', type);
      if (args) {
        if (args.x || args.y) {
           canv.style.position = "absolute";
        }
        if (args.x) {
           canv.style.left = args.x + "px";
        }
        if (args.y) {
           canv.style.top = args.y + "px";
        }
        if (args.w) {
           canv.style.width = args.w;
           canv.width = args.w;
        }
        if (args.h) {
           canv.style.height = args.h;
           canv.height = args.h;
        }
        if (args.parent) {
           var parent = document.getElementById(args.parent)
        }
        if (args.name) {
           canv.id = args.name
        }
      }
      if (!parent) {
        var parent = document.body
      }
      parent.appendChild(canv);
      return this.transform(canv);
  }
}

/** @method transform 
Transform an existing canvas into a NexusUI widget.
@param {string} [canvasID] The ID of the canvas to be transformed.
@param {string} [type] (Optional.) Specify which type of widget the canvas will become. If no type is given, the canvas must have an nx attribute with a valid widget type.
*/
manager.prototype.transform = function(canvas, type) {
  for (var key in nx.widgets) {
    if (nx.widgets[key].canvasID == canvas.id) {
      return;
    }
  }
  if (type) {
    var nxType = type;
  } else {
    var nxType = canvas.getAttribute("nx");
  }

  if (!nxType) {
    return;
  }
  var elemCount = 0;
  var newObj;

  /* find out how many of the same elem type have come before
    i.e. nx.elemTypeArr will look like [ dial, dial, toggle, toggle ]
    allowing you to count how many dials already exist on the page
    and give your new dial the appropriate index and id: dial3 */

  for (j=0;j<this.elemTypeArr.length;j++) {
    if (this.elemTypeArr[j] === nxType) {
      elemCount++;
    }
  }

  // add your new nexus element type to the element list
  this.elemTypeArr.push(nxType);

  // check to see if it has a pre-given ID
  // and use that as its id if so
  if (!canvas.id) {
    var idNum = elemCount + 1;
    canvas.id = nxType + idNum;
  }

  if(nxType) {
    try {
      var newObj = new (require('../widgets')[nxType])(canvas.id);
    } catch (err) {
      console.log(nxType);
    }
  }

  this.widgets[newObj.canvasID] = newObj;
  if (this.globalWidgets) {
    window[newObj.canvasID] = this.widgets[newObj.canvasID]
  }

  newObj.init();
  return newObj;
}

/** @method transmit 
The "output" instructions for sending a widget's data to another application or to a JS callback. Inherited by each widget and executed when each widget is interacted with or its value changes. Set using nx.sendsTo() to ensure that all widgets inherit the new function correctly.
@param {object} [data] The data to be transmitted. Each property of the object will become its own OSC message. (This works with objects nested to up to 2 levels).
*/

manager.prototype.transmit = function(data) {
    this.makeOSC(this.emit, data);
    this.emit('*',data);
} 

/** 
  @method colorize
  @param {string} [aspect] Which part of ui to change, i.e. "accent" "fill", "border"
  @param {string} [color] Hex or rgb color code
  Change the color of all nexus objects, by aspect ([fill, accent, border, accentborder]
  
  ```js
  nx.colorize("#00ff00") // changes the accent color by default
  nx.colorize("border", "#000000") // changes the border color
  ```

**/
manager.prototype.colorize = function(aspect, newCol) {
  
  if (!newCol) {
    // just sending in a color value colorizes the accent
    newCol = aspect;
    aspect = "accent";
  }
  
  this.colors[aspect] = newCol;
  
  for (var key in this.widgets) {
    this.widgets[key].colors[aspect] = newCol;
    this.widgets[key].draw();
  }
}
  

/** @method setThrottlePeriod 
Set throttle time of nx.throttle, which controls rapid network transmissions of widget data.
@param {integer} [throttle time] Throttle time in milliseconds. 
*/
manager.prototype.setThrottlePeriod = function(newThrottle) {
  this.throttlePeriod = newThrottle;
  for (var key in this.widgets) {
    this.widgets[key].throttlePeriod = this.throttlePeriod;
  }
}



  /*  
   *    GUI
   */

/**  @property {object} colors The interface's color settings. Set with nx.colorize(). */
manager.prototype.colors = { 
  "accent": "#ff5500", 
  "fill": "#eee", 
  "border": "#bbb",
  "black": "#000",
  "white": "#FFF"
};
  
/**  @method startPulse 
  Start an animation interval for animated widgets (calls nx.pulse() every 30 ms). Executed by default when NexusUI loads.
*/
manager.prototype.startPulse = function() {
  this.pulseInt = setInterval("nx.pulse()", 30);
}

/**  @method stopPulse 
  Stop the animation pulse interval.
*/
manager.prototype.stopPulse = function() {
  clearInterval(this.pulseInt);
}

/**  @method pulse 
  Animation pulse which executes all functions stored in the nx.aniItems array.
*/
manager.prototype.pulse = function() {
  for (var i=0;i<this.aniItems.length;i++) {
    this.aniItems[i]();
  }
} 

manager.prototype.addAni = function(fn) {

}

manager.prototype.removeAni = function(fn) {
  this.aniItems.splice(this.aniItems.indexOf(fn));
}
  
manager.prototype.addStylesheet = function() {
  var htmlstr = '<style>'
    + 'select {'
    + 'width: 150px;'
    + 'padding: 5px 5px;'
    + 'font-size: 16px;'
    + 'color:#666666;'
    + 'border: solid 0px #CCC;'
    + 'border-radius: 5;'
    + 'outline: black;'
    + 'cursor:pointer;'
    + 'background-color:#EEE;'
    + 'font-family:gill sans;'
    + '}'
    + ''
    + 'canvas { '
    + 'cursor:pointer;'
    + 'border-radius:5px;'
    + 'moz-border-radius:5px;'
    + 'webkit-border-radius:5px;'
    + 'box-sizing:border-box;'
    + '-moz-box-sizing:border-box;'
    + '-webkit-box-sizing:border-box;'
    + '}'
    + '</style>';

  document.head.innerHTML = document.head.innerHTML + htmlstr
}

/**  @method setViewport
    Set mobile viewport scale (similar to a zoom)
    @param {integer} [scale] Zoom ratio (i.e. 0.5, 1, 2) */
manager.prototype.setViewport = function(scale) {
  for (i=0; i<this.metas.length; i++) {
    if (this.metas[i].name == "viewport") {
      this.metas[i].content = "minimum-scale="+scale+", maximum-scale="+scale;
    }
  }
}

/**  @method setLabels
    Tell all widgets whether or not draw text labels on widgets
    @param {boolean} [on/off] true to add labels, false to remove labels
 */
manager.prototype.setLabels = function(onoff) {
  if (onoff=="on") {
    this.showLabels = true;
  } else {
    this.showLabels = false;
  }
  for (var key in this.widgets) {
    this.widgets[key].draw()
  }
}


manager.prototype.blockMove = function(e) {
  if (e.target.tagName == 'CANVAS') {
     e.preventDefault();
     e.stopPropogation();
  }
}
},{"../utils/timing":59,"../utils/transmit":60,"../widgets":68,"events":23,"util":51}],55:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var domUtils = require('../utils/dom');
var drawingUtils = require('../utils/drawing');
var timingUtils = require('../utils/timing');
var transmit = require('../utils/transmit');



var widget = module.exports = function (target) {
  EventEmitter.apply(this)
  this.preClick = this.preClick.bind(this)
  this.preMove = this.preMove.bind(this)
  this.preRelease = this.preRelease.bind(this)
  this.preTouch = this.preTouch.bind(this)
  this.preTouchMove = this.preTouchMove.bind(this)
  this.preTouchRelease = this.preTouchRelease.bind(this)

/** 

  @class widget
  All NexusUI interface widgets inherit from the widget class. The properties and methods of the widget class are usable by any NexusUI interface.
  
*/

  /**  @property {string} canvasID ID attribute of the interface's HTML5 canvas */
  this.canvasID = target;
  /**  @property {string} oscPath OSC prefix for this interface. By default this is populated using the canvas ID (i.e. an ID of dial1 has OSC path /dial1) */
  this.oscPath = "/"+target;
  if (!document.getElementById(target)) {
    var newcanv = document.createElement("canvas")
    newcanv.id = target;
    document.body.appendChild(newcanv)
  }
  /**  @property {DOM element} canvas The widget's HTML5 canvas */
  this.canvas = document.getElementById(target);
  /**  @property {HTML5 drawing context} context The canvas's drawing context */
  this.context = this.canvas.getContext("2d");
  this.canvas.height = window.getComputedStyle(document.getElementById(target), null).getPropertyValue("height").replace("px","");
  this.canvas.width = window.getComputedStyle(document.getElementById(target), null).getPropertyValue("width").replace("px","");
  /**  @property {integer} height The widget canvas's computed height in pixels */
  this.height = parseInt(window.getComputedStyle(document.getElementById(target), null).getPropertyValue("height").replace("px",""));
  /**  @property {integer} width The widget canvas's computed width in pixels */
  this.width = parseInt(window.getComputedStyle(document.getElementById(target), null).getPropertyValue("width").replace("px",""));
  if (!this.defaultSize) {
    /**  @property {object} defaultSize The widget's default size if not defined with HTML/CSS style. (Has properties 'width' and 'height', both in pixels) */
    this.defaultSize = { width: 100, height: 100 };
  }
  if (this.width==300 && this.height==150) {
    this.canvas.width = this.defaultSize.width*2;
    this.canvas.height = this.defaultSize.height*2;
    this.width = this.defaultSize.width;
    this.height = this.defaultSize.height;
  } else {
  	var proxyw = this.width;
  	var proxyh = this.height;
  	this.canvas.width = proxyw*2;
    this.canvas.height = proxyh*2;
    this.width = proxyw;
    this.height = proxyh;
  }
  this.canvas.style.width = this.canvas.width/2+"px";
  this.canvas.style.height = this.canvas.height/2+"px";
  this.context.scale(2,2)
  /**  @property {object} offset The widget's computed offset from the top left of the document. (Has properties 'top' and 'left', both in pixels) */
  this.offset = domUtils.findPosition(this.canvas);
  /**  @property {object} center The center of the widget's canvas. A 100x100 widget would have a center at 50x50. (Has properties 'x' and 'y', both in pixels) */
  this.center = {
    x: this.width/2, 
    y: this.height/2
  };
  //drawing
  /**  @property {integer} lineWidth The default line width for drawing (default is 2 pixels). In many widgets, this is overwritten to suite the widget. However it does dictate the border width on most widgets. */
  this.lineWidth = 2;
  this.context.lineWidth = this.lineWidth;
  /**  @property {object} colors A widget's individual color scheme. Inherited from nx.colors. (Has properties "accent", "fill", "border", "black", and "white") */
  this.colors = new Object();
  // define colors individually so they are not pointers to nx.colors
  // this way each object can have its own color scheme
  this.colors.accent = nx.colors.accent;
  this.colors.fill = nx.colors.fill;
  this.colors.border = nx.colors.border;
  this.colors.accentborder = nx.colors.accentborder;
  this.colors.black = nx.colors.black;
  this.colors.white = nx.colors.white; 
  this.colors.highlight = nx.colors.highlight;
  //interaction
  /**  @property {object} clickPos The most recent mouse/touch position when interating with a widget. (Has properties x and y) */
  this.clickPos = {x: 0, y: 0};
  /**  @property {array} clickPos.touches If multitouch, an array of touch positions  */
  this.clickPos.touches = new Array();
  /**  @property {boolean} clicked Whether or not the widget is currently clicked  */
  this.clicked = false;
  this.value = 0;
    /**
      @property {object} val An object containing the core interactive values of the widget, which are also the widget's data output. 
    */
  this.val = new Object();
  this.pval = new Object();
  this.nodePos = new Array();
  /**  @property {object} deltaMove Difference between the current touch/mouse position and the previous touch/mouse position, in pixels.   */
  this.deltaMove = new Object();
  this.throttlePeriod = nx.throttlePeriod;
  this.throttle = timingUtils.throttle;
  /**  @property {boolean} label Whether or not to draw a text label this widget.   */
  this.label = false;
  this.hasMoved = false;
  //recording
  /**  @property {boolean} isRecording Whether or not this widget's output is being recorded to a "remix" widget */
  this.isRecording = false;
  this.tapeNum = 0;
  this.recorder = null;
  //transmission
  if (transmit) {
    /**  @method sendsTo
    Set the transmission protocol for this widget individually 
    @param {string or function} [destination] Protocol for transmitting data from this widget (i.e. "js", "ajax", "ios", "max", or "node"). Also accepts custom functions.
    ```js
    dial1.sendsTo("ajax")

    // or

    dial1.sendsTo(function(data) {
         //define a custom transmission function
    })
    ```  
    */
    this.sendsTo = transmit.setWidgetTransmit;
    this.destination = "js";
  }
  this.events = new Object();

  // Setup interaction
  if (nx.isTouchDevice) {
    this.canvas.ontouchstart = this.preTouch;
    this.canvas.ontouchmove = this.preTouchMove;
    this.canvas.ontouchend = this.preTouchRelease;
  } else {
    this.canvas.addEventListener('mousedown', this.preClick, false);
  }

}
util.inherits(widget, EventEmitter)

/**  @method transmit
    The "output" instructions for sending the widget's data to another application or to a JS callback. Inherited from nx.transmit and executed when each widget is interacted with or during animation. Set using .sendsTo() to use our built-in transmission defintions.
    @param {object} [data] The data to be transmitted. Each property of the object will become its own OSC message if sending via "ajax" or "max7" protocols. (This works with objects nested to up to 2 levels).
*/
widget.prototype.transmit = nx.transmit;

/**  @method makeOSC
    Loops through an object (i.e. a widget's data), creates OSC path/value pairs, and executes a callback function with these two arguments.
    @param {function} [callback] A function defining the action to be taken with each OSC path/value pair. This function should have two parameters, path (string) and data (type depends on widget data type).
    @param {object} [data] The data as an object, to be broken into individual OSC messages.
*/
widget.prototype.makeOSC = function(action, data) {
    this.action = action;
    if ((typeof data == "object") && (data !== null)) {
      for (var key in data) {
        if ((typeof data[key] == "object") && (data[key] !== null)) {
          for (var key2 in data[key]) {
              this.action(key+"/"+key2, data[key][key2])
          }
        } else {
            this.action(key, data[key])
        }
      }
    } else if (typeof data == "number" || typeof data == "string") {
        this.action('value', data)
    }
}

// getoffset is useful as an API for others
// otherwise they would have to write
// dial1.offset = utils.findPosition()
// now it is simply:
// dial1.getOffset()

/**  @method getOffset
    Recalculate the computed offset of the widget's canvas and store it in widget.offset. This is useful if a widget has been moved after being created.
    */
widget.prototype.getOffset = function() {
  this.offset = domUtils.findPosition(this.canvas)
}

widget.prototype.preClick = function(e) {
  this.offset = domUtils.findPosition(this.canvas)
  document.addEventListener("mousemove", this.preMove, false);
  document.addEventListener("mouseup", this.preRelease, false);
  this.clickPos = domUtils.getCursorPosition(e, this.offset);
  this.clicked = true;
  this.deltaMove.x = 0;
  this.deltaMove.y = 0;
  this.click(e);
  document.body.style.userSelect = "none";
  document.body.style.mozUserSelect = "none";
  document.body.style.webkitUserSelect = "none";
}

widget.prototype.preMove = function(e) {
  var newClickPos = domUtils.getCursorPosition(e, this.offset);
  this.deltaMove.y = newClickPos.y - this.clickPos.y;
  this.deltaMove.x = newClickPos.x - this.clickPos.x;
  this.clickPos = newClickPos;
  this.move(e);
}

widget.prototype.preRelease = function(e) {

  document.removeEventListener("mousemove", this.preMove, false);
  document.removeEventListener("mouseup", this.preRelease, false);
  this.clicked = false;
  this.release();
  document.body.style.userSelect = "text";
  document.body.style.mozUserSelect = "text";
  document.body.style.webkitUserSelect = "text";
}

widget.prototype.preTouch = function(e) {
  this.clickPos = domUtils.getTouchPosition(e, this.offset);
  this.clicked = true;
  this.deltaMove.x = 0;
  this.deltaMove.y = 0;
  this.touch(e);
}

widget.prototype.preTouchMove = function(e) {
  if (this.clicked) {
    var newClickPos = domUtils.getTouchPosition(e, this.offset);
    this.deltaMove.y = newClickPos.y - this.clickPos.y;
    this.deltaMove.x = newClickPos.x - this.clickPos.x;
    this.clickPos = newClickPos;
    this.touchMove(e);
  }
}

widget.prototype.preTouchRelease = function(e) {
  if (e.targetTouches.length>=1) {
    var newClickPos = domUtils.getTouchPosition(e, this.offset);
    this.clickPos = newClickPos;
  } else {
    this.clicked = false;
  }
  this.touchRelease();
}


/**  @method init
     Initialize or re-initialize the widget. Defined separately within each widget.
    */

/**  @method draw
    Draw the widget onto the canvas.
    */
widget.prototype.draw = function() {
}


/**  @method click
    Executes when the widget is clicked on
    */
widget.prototype.click = function() {
}


/**  @method move
    Executes on drag (mouse moves while clicked).
    */
widget.prototype.move = function() {
}


/**  @method release
    Executes when the mouse releases after having clicked on the widget.
    */
widget.prototype.release = function() {
}

/**  @method touch
    Executes when the widget is touched on a touch device.
    */
widget.prototype.touch = function() {
  this.click();
}

/**  @method touchMove
    Executes on drag (touch then move) on a touch device
    */
widget.prototype.touchMove = function() {
  this.move();
}

/**  @method touchRelease
    Executes when the touch releases after having touched the widget.
    */
widget.prototype.touchRelease = function() {
  this.release();
}

widget.prototype.adjustSizeIfDefault = function() {
  if (this.width==300 && this.height==150) {
    this.canvas.width = this.defaultSize.width;
    this.canvas.height = this.defaultSize.height;
    this.width = this.defaultSize.width;
    this.height = this.defaultSize.height;
  }
}

widget.prototype.makeRoundedBG = function() {
  this.bgLeft = this.lineWidth;
  this.bgRight = this.width - this.lineWidth;
  this.bgTop = this.lineWidth;
  this.bgBottom = this.height - this.lineWidth;
  this.bgHeight = this.bgBottom - this.lineWidth;
  this.bgWidth = this.bgRight - this.lineWidth; 
  
  drawingUtils.makeRoundRect(this.context, this.bgLeft, this.bgTop, this.bgWidth, this.bgHeight);
}

/**  @method erase
    Erase the widget's canvas.
    */
widget.prototype.erase = function() {
  this.context.clearRect(0,0,this.width,this.height);
}

widget.prototype.hideCursor = function() {
  this.canvas.style.cursor = "none";
}

widget.prototype.showCursor = function() {
  this.canvas.style.cursor = "auto";
}

// allow us to get the constructor function name programatically
//i.e. if element is a dial, this function will return "dial"

/**  @method getName
    Returns the widget's constructor function name (i.e. "dial")
    */
widget.prototype.getName = function() { 
  var funcNameRegex = /function (.{1,})\(/;
  var results = (funcNameRegex).exec((this).constructor.toString());
  return (results && results.length > 1) ? results[1] : "";
}

/** @method set
Manually set a widget's value (that is, set any properties of a widget's .val). See widget.val or the .val property of individual widgets for more info. 
@param {object} [data] Parameter/value pairs in object notation.
@param {boolean} [transmit] (optional) Whether or not to transmit new value after being set.
Sets the value of an object. 

```js
  position1.set({
  &nbsp;  x: 100,
  &nbsp;  y: 250
  })
```

An optional second argument decides whether the object then transmits its new value.
```js
  button1.set({
  &nbsp;  press: 100
  }, true)
```
*/
widget.prototype.set = function(data, transmit) {

  if (typeof this.val == "object" && this.val !== "null") {
    if (typeof data == "object" && data !== "null") {
      for (var key in data) {
        this.val[key] = data[key];
      }
    }
  } else if (typeof this.val == "string" || typeof this.val == "number") {
    if (typeof data == "object" && data !== "null") {
      this.val = data["value"];
      this.draw();
    } else if (typeof data == "string" || typeof data == "number") {
      this.val = data;
    }
  }
  this.draw();

  if (transmit) {
    this.transmit(this.val)
  }
}

/**  @method destroy
    Remove the widget object, canvas, and all related event listeners from the document.
    */
widget.prototype.destroy = function() {
  var type = nx.elemTypeArr.indexOf(this.getName())
  nx.elemTypeArr.splice(type,1)

  this.canvas.ontouchmove = null;
  this.canvas.ontouchend = null;
  this.canvas.onclick = null;
  this.canvas.onmousemove = null;
  this.canvas.onmouseoff = null;
  document.removeEventListener("mousemove", this.preMove, false);
  document.removeEventListener("mouseup", this.preRelease, false);

  var elemToKill = document.getElementById(this.canvasID)
  if (elemToKill) {
    elemToKill.parentNode.removeChild(elemToKill);
  }

  this.customDestroy();

  var id = this.canvasID
  delete nx.widgets[id];
  delete window[id];

}

widget.prototype.customDestroy = function() {

}

widget.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {
  if (text) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    this.context.fillText(line, x, y);
  }
}

widget.prototype.drawLabel = function() {
  if (this.showLabels) {
    with(this.context) {
      globalAlpha = 0.9;
      fillStyle = this.colors.fill;
      fillRect(this.width-100,this.height-20,100,20);
      globalAlpha = 1;
      beginPath();
      fillStyle = this.colors.border;
      font = "bold 15px courier";
      textAlign = "center";
      fillText(this.oscPath,this.width-50,this.height-5);
      textAlign = "left";
      closePath();
    }
  }
}

/**  @method saveCanv
     Download the widget's current graphical state as an image (png).
    */
widget.prototype.saveCanv = function() {
  var data = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href = data
}
},{"../utils/dom":56,"../utils/drawing":57,"../utils/timing":59,"../utils/transmit":60,"events":23,"util":51}],56:[function(require,module,exports){

/** @class utils 
  Shared utility functions. These functions are exposed as methods of nx in NexusUI projects, i.e. .mtof() here can be accessed in your project with nx.mtof().
*/


/** @method findPosition 
    Returns the offset of an HTML element. Returns an object with 'top' and 'left' properties.
    @param {DOM element} [element] 
    ```js
    var button1Offset = nx.findPosition(button1.canvas)
    ```
*/
exports.findPosition = function(element) {
  var body = document.body,
      win = document.defaultView,
      docElem = document.documentElement,
      box = document.createElement('div');
  box.style.paddingLeft = box.style.width = "1px";
  body.appendChild(box);
  var isBoxModel = box.offsetWidth == 2;
  body.removeChild(box);
  box = element.getBoundingClientRect();
  var clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
      scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
  return {
    top : box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}

exports.getCursorPosition = function(e, canvas_offset) {
  var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas_offset.left;
    y -= canvas_offset.top;
  var click_position = {x: x, y: y};
  click_position.touches = [ {x: x, y: y } ];
  return click_position;
}

exports.getTouchPosition = function(e, canvas_offset) {
  var x;
  var y;
  x = e.targetTouches[0].pageX;
  y = e.targetTouches[0].pageY;
  x -= canvas_offset.left;
    y -= canvas_offset.top;
  var click_position = {x: x, y: y};

  click_position.touches = new Array();
  for (var i=0;i<e.targetTouches.length;i++) {
     click_position.touches.push({
      x: e.targetTouches[i].pageX - canvas_offset.left,
      y: e.targetTouches[i].pageY - canvas_offset.top
    });
  }
  click_position.changed = new Array();
  for (var i=0;i<e.changedTouches.length;i++) {
     click_position.changed.push({
      x: e.changedTouches[i].pageX - canvas_offset.left,
      y: e.changedTouches[i].pageY - canvas_offset.top
    });
  }
  return click_position;
}
},{}],57:[function(require,module,exports){
var math = require('./math')

/** @method randomColor
    Returns a random color string in rgb format
*/
exports.randomColor = function() {
  return "rgb(" + math.random(250) + "," + math.random(250) + "," + math.random(250) + ")";
}

/** @method hexToRgb
    Converts a hex color code to rgb format
    @param {color code} [hex] Input color code in hex format
    @param {float} [alpha] Color alpha level
*/
exports.hexToRgb = function(hex, a) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!a) {
    a = 0.5;
  }
  
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

exports.isInside = function(clickedNode,currObject) {
  if (clickedNode.x > currObject.x && clickedNode.x < (currObject.x+currObject.w) && clickedNode.y > currObject.y && clickedNode.y < (currObject.y+currObject.h)) {
    return true;
  } else {
    return false; 
  }
}

exports.makeRoundRect = function(ctx,xpos,ypos,wid,hgt,depth) {
  var x1 = xpos;
  var y1 = ypos;
  var x2 = wid+x1;
  var y2 = hgt+y1;
  if (!depth) {
    depth = 2;
  }
  
  ctx.beginPath();
  ctx.moveTo(x1+depth, y1); //TOP LEFT
  ctx.lineTo(x2-depth, y1); //TOP RIGHT
  ctx.quadraticCurveTo(x2, y1, x2, y1+depth);
  ctx.lineTo(x2, y2-depth); //BOTTOM RIGHT
  ctx.quadraticCurveTo(x2, y2, x2-depth, y2);
  ctx.lineTo(x1+depth, y2); //BOTTOM LEFT
  ctx.quadraticCurveTo(x1, y2, x1, y2-depth);
  ctx.lineTo(x1, y1+depth); //TOP LEFT
  ctx.quadraticCurveTo(x1, y1, x1+depth, y1);
  ctx.closePath();
}

exports.text = function(context, text, position) {
  if (!position) {
    position = [10 , 10];
  }
  with(context) {
    beginPath();
    font = "bold 12px sans-serif";
    fillText(text,position[0],position[1]);
    closePath();
  }
}
},{"./math":58}],58:[function(require,module,exports){


/** @method toPolar 
    Receives cartesian coordinates and returns polar coordinates as an object with 'radius' and 'angle' properties.
    @param {float} [x] 
    @param {float} [y] 
    ```js
    var ImOnACircle = nx.toPolar({ x: 20, y: 50 }})
    ```
*/
exports.toPolar = function(x,y) {
  var r = Math.sqrt(x*x + y*y);

  var theta = Math.atan2(y,x);
  if (theta < 0.) {
    theta = theta + (2 * Math.PI);
  }
  return {radius: r, angle: theta};
}

/** @method toCartesian 
    Receives polar coordinates and returns cartesian coordinates as an object with 'x' and 'y' properties.
    @param {float} [radius] 
    @param {float} [angle] 
*/
exports.toCartesian = function(radius, angle){
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return {x: radius*cos, y: radius*sin*-1};
}


/** @method clip 
    Limits a number to within low and high values.
    @param {float} [input value] 
    @param {float} [low limit] 
    @param {float} [high limit] 
    ```js
    nx.clip(5,0,10) // returns 5
    nx.clip(15,0,10) // returns 10
    nx.clip(-1,0,10) // returns 0
    ```
*/
exports.clip = function(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

/** @method prune 
    Limits a float to within a certain number of decimal places
    @param {float} [input value] 
    @param {integer} [max decimal places] 
    ```js
    nx.prine(1.2345, 3) // returns 1.234
    nx.prune(1.2345, 1) // returns 1.2
    ```
*/

exports.prune = function(data, scale) {
  if (typeof data === "number") {
    data = parseFloat(data.toFixed(scale));
  } else if (data instanceof Array) {
    for (var i=0;i<data.length;i++) {
      if (typeof data[i]=="number") {
        data[i] = parseFloat(data[i].toFixed(scale));
      }
    }
  }
  return data;
}


/** @method scale 
    Scales an input number to a new range of numbers
    @param {float} [input value] 
    @param {float} [low1]  input range (low)
    @param {float} [high1] input range (high)
    @param {float} [low2] output range (low)
    @param {float} [high2] output range (high)
    ```js
    nx.scale(5,0,10,0,100) // returns 50
    nx.scale(5,0,10,1,2) // returns 1.5
    ```
*/
exports.scale = function(inNum, inMin, inMax, outMin, outMax) {
  return (((inNum - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;  
}

/** @method invert 
    Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number. 
    @param {float} [input value]  
    ```js
    nx.invert(0.25) // returns 0.75
    nx.invert(0) // returns 1
    ```
*/
exports.invert = function (inNum) {
  return exports.scale(inNum, 1, 0, 0, 1);
}

exports.bounce = function(posIn, borderMin, borderMax, delta) {
  if (posIn > borderMin && posIn < borderMax) {
    return delta;
  } else if (posIn <= borderMin) {
    return Math.abs(delta); 
  } else if (posIn >= borderMax) {
    return Math.abs(delta) * (-1);
  }
}


/** @method mtof 
    MIDI to frequency conversion. Returns frequency in Hz.
    @param {float} [MIDI] MIDI value to convert
    ```js
    nx.mtof(69) // returns 440
    ```
*/
exports.mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}


/** @method random 
    Returns a random integer between 0 a given scale parameter.
    @param {float} [scale] Upper limit of random range.
    ```js
    nx.random(10) // returns a random number from 0 to 9.
    ```
*/
exports.random = function(scale) {
  return Math.floor(Math.random() * scale);
}


exports.interp = function(loc,min,max) {
  return loc * (max - min) + min;  
}
},{}],59:[function(require,module,exports){


exports.throttle = function(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    if (!timeout) {
      // the first time the event fires, we setup a timer, which 
      // is used as a guard to block subsequent calls; once the 
      // timer's handler fires, we reset it and create a new one
      timeout = setTimeout(function() {
        timeout = null;
        try {
          func.apply(context, args);
        } catch (err) {
          console.log(err);
        }
      }, wait);
    }
  }
}
},{}],60:[function(require,module,exports){
exports.defineTransmit = function(protocol) {
  
  var newTransmit;

  if (typeof(protocol)=="function") {
    return protocol;
  } else {
    switch (protocol) {
      case 'js':
        newTransmit = function(data) {
          this.makeOSC(this.emit, data);
          this.emit('*',data);
        }
        return newTransmit
      
      case 'ajax':
        newTransmit = function(data) {
          this.makeOSC(exports.ajaxTransmit, data);
        }
        return newTransmit
      
      case 'node':
        newTransmit = function(data) {
          this.makeOSC(exports.nodeTransmit, data);
        }
        return newTransmit
      
      case 'ios':
        newTransmit = function(data) {
          
        }
        return newTransmit
      
      case 'max':
        newTransmit = function(data) {
          this.makeOSC(exports.maxTransmit, data);
        }
        return newTransmit
    }
  }
}

exports.setGlobalTransmit = function(protocol) {
  var newTransmit = exports.defineTransmit(protocol)
  this.transmit = newTransmit
  this.destination = protocol
  for (var key in nx.widgets) {
    this.widgets[key].transmit = newTransmit;
    this.widgets[key].destination = protocol;
  }
}

exports.setWidgetTransmit = function(protocol) {
  var newTransmit = exports.defineTransmit(protocol)
  this.transmit = newTransmit
  this.destination = protocol
}


exports.ajaxTransmit = function(subPath, data) {

    var oscPath = subPath=='value' ? this.oscPath : this.oscPath+"/"+subPath;
     
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST",nx.ajaxPath,true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('oscName='+oscPath+'&data='+data);

}

exports.setAjaxPath = function(path) {
  this.ajaxPath = path;
}

exports.nodeTransmit = function(subPath, data) {
   
    var msg = {
      oscName: subPath=='value' ? this.oscPath : this.oscPath+"/"+subPath,
      value: data
    }
    socket.emit('nx', msg)

}

exports.maxTransmit = function (subPath, data) {
    var oscPath = subPath=='value' ? this.oscPath : this.oscPath+"/"+subPath;
    window.max.outlet(oscPath + " " + data);
}
},{}],61:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class banner      
	"Powered by NexusUI" tag with a link to our website. Use it if you want to share the positive vibes of NexusUI. Thanks for using!
	```html
	<canvas nx="banner"></canvas>
	```
	<canvas nx="banner" style="margin-left:25px"></canvas>
*/

var banner = module.exports = function (target) {
	this.defaultSize = { width: 100, height: 40 };
	widget.call(this, target);
	
	//unique attributes
	/** @property {string} message1 The first line of text on the banner. */
	this.message1 = "Powered By";
	/** @property {string} message2 The second line of text on the banner. */
	this.message2 = "NexusUI";
	/** @property {string} link The URL the banner will link to. */
	this.link = "http://www.nexusosc.com";
	/** @property {boolean} isLink Whether or not the banner is a hyperlink. Defaults to true. */
	this.isLink = true;
}
util.inherits(banner, widget);

banner.prototype.init = function() {
	this.draw();
}

banner.prototype.draw = function() {
	with (this.context) {

		globalAlpha = 0.1;
		fillStyle = this.colors.accent;
		beginPath();
			moveTo(0,10);
			lineTo(10,this.height/2+5);
			lineTo(0,this.height);
			lineTo(30,this.height);
			lineTo(30,10);
			fill();
			moveTo(this.width-30,10);
			lineTo(this.width-30,this.height);
			lineTo(this.width,this.height);
			lineTo(this.width-10,this.height/2+5);
			lineTo(this.width,10);
			fill();
		closePath();
		globalAlpha = 1;

		fillStyle = this.colors.accent;
		fillRect(15,0,this.width-30,this.height-10);
		
		fillStyle = this.colors.white;
		font = this.height/5+"px gill sans";
		textAlign = "center";
		fillText(this.message1, this.width/2, this.height/3.3);
		fillText(this.message2, this.width/2, (this.height/3.3)*2);

		fillStyle = this.colors.black;
		beginPath();
			moveTo(15,this.height-10);
			lineTo(30,this.height);
			lineTo(30,this.height-10);
			lineTo(15,this.height-10);
			fill();
			moveTo(this.width-15,this.height-10);
			lineTo(this.width-30,this.height);
			lineTo(this.width-30,this.height-10);
			lineTo(this.width-15,this.height-10);
			fill();
		closePath();
	
	}
}

banner.prototype.click = function() {
	if (this.isLink) {
		window.location = this.link;
	}
}
},{"../core/widget":55,"util":51}],62:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

var button = module.exports = function(target) {

/** 
	
	@public
	@class button 

	Touch button with three modes of interaction ("toggle", "impulse", and "aftertouch").
	```html
	<canvas nx="button"></canvas>
	```
	<canvas nx="button" style="margin-left:25px"></canvas>
*/

	this.defaultSize = { width: 50, height: 50 };
	widget.call(this, target);

	/** 
		@property {object}  val  Main value set and output, with sub-properties:
		| &nbsp; | data
		| --- | ---
		| *press* | 0 (clicked) or 1 (unclicked)
		| *x* | 0-1 float of x-position of click ("aftertouch" mode only)
		| *y* | 0-1 float of y-position of click ("aftertouch" mode only) 
		
		When the widget is interacted with, val is sent as the output data for the widget.
		```js 
		button1.on('*', function(data) {
			// some code using data.press, data.x, and data.y
		});
		```
		Or, if NexusUI is outputting OSC (e.g. if nx.sendsTo("ajax")), val will be broken into OSC messages: 
		```html 
		/button1/press 1
		/button1/x 37
		/button1/y 126
		```
		*/
	this.val = {
		press: 0
	}
	
	/** @property {string}  mode  Interaction mode. Options:
	<b>impulse</b> &nbsp; 1 on click <br>
	<b>toggle</b> &nbsp;  1 on click, 0 on release _(default)_<br>
	<b>aftertouch</b> &nbsp; 1, x, y on click; x, y on move; 0, x, y on release <br> 
	```js 
	button1.mode = "aftertouch" 
	```
	*/
	this.mode = "toggle";

	this.lockResize = true;

	this.image = null;
	this.imageHover = null;
	this.imageTouch = null;

	this.subval = new Object();

	this.init();

}
util.inherits(button, widget);

button.prototype.init = function() {
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.draw();
}

button.prototype.draw = function() {
	this.erase();
	
	with (this.context) {
		
		if (this.image !== null) {
			// Image Button
			if (!this.val.press) {
				// Draw Image if not touched
				drawImage(this.image, 0, 0);
			} else {
				if (!this.imageTouch) {

					drawImage(this.image, 0, 0);

					// No touch image, apply highlighting
					globalAlpha = 0.5;
					fillStyle = this.colors.accent;
					fillRect (0, 0, this.width, this.height);
					globalAlpha = 1;
					
				} else {
					// Draw Touch Image
					drawImage(this.imageTouch, 0, 0);
				}
			}
			
		} else {
	
			// Regular Button
			if (!this.val.press) {
				fillStyle = this.colors.fill;
			} else if (this.val.press) {
				fillStyle = this.colors.accent;
			}
		
			beginPath();
				arc(this.center.x, this.center.y, (Math.min(this.center.x, this.center.y)-this.lineWidth/2), 0, Math.PI*2, true);
				fill();	  
			closePath();

			if (this.val.press && this.mode=="node") {
				globalAlpha = 0.2;
				fillStyle = this.colors.white;
				beginPath();
					arc(this.val.x, this.val.y, (Math.min(this.center.x, this.center.y)/2), 0, Math.PI*2, true);
					fill();	  
				closePath();

				globalAlpha = 1;
			}
		}

		this.drawLabel();
		
	}
}

button.prototype.click = function(e) {
	this.val["press"] = 1;
	if (this.mode=="node") {
		this.val["x"] = this.clickPos.x;
		this.val["y"] = this.clickPos.y;
	}
	this.transmit(this.val);
	this.draw();
}

button.prototype.move = function () {
	// use to track movement on the button
	if (this.mode=="node") {
		this.val["x"] = this.clickPos.x;
		this.val["y"] = this.clickPos.y;
		this.subval["x"] = this.clickPos.x;
		this.subval["y"] = this.clickPos.y;
		this.transmit(this.subval);
		this.draw();
	}
}

button.prototype.release = function() {
	this.val["press"] = 0;
	if (this.mode=="toggle" || this.mode=="node") { 
		this.transmit(this.val);
	}
	this.draw();
}


/** @method setImage 
	Turns the button into an image button with custom image. Sets the default (unclicked) button image.
	@param {string} [src] Image source */
button.prototype.setImage = function(image) {
	this.image = new Image();
	this.image.onload = function() { this.draw() }
	this.image.src = image;
}

button.prototype.setHoverImage = function(image) {
	this.imageHover = new Image();
	this.imageHover.onload = function() { this.draw() }
	this.imageHover.src = image;
}

/** @method setTouchImage 
	Sets the image that will show when the button is clicked.
	@param {string} [src] Image source */
button.prototype.setTouchImage = function(image) {
	this.imageTouch = new Image();
	this.imageTouch.onload = this.draw();
	this.imageTouch.src = image;
}
},{"../core/widget":55,"util":51}],63:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class colors      
	Color picker that outputs RBG values
	```html
	<canvas nx="colors"></canvas>
	```
	<canvas nx="colors" style="margin-left:25px"></canvas>
*/
				
var colors = module.exports = function (target) {
	
	this.defaultSize = { width: 100, height: 100 };	
	widget.call(this, target);

	/* new tactic */

	this.gradient1 = this.context.createLinearGradient(0,0,this.width,0)
 	this.gradient1.addColorStop(0, '#F00'); 
 	this.gradient1.addColorStop(0.17, '#FF0'); 
 	this.gradient1.addColorStop(0.34, '#0F0'); 
 	this.gradient1.addColorStop(0.51, '#0FF'); 
 	this.gradient1.addColorStop(0.68, '#00F'); 
 	this.gradient1.addColorStop(0.85, '#F0F'); 
 	this.gradient1.addColorStop(1, '#F00'); 

	this.gradient2 = this.context.createLinearGradient(0,0,0,this.height)
 	this.gradient2.addColorStop(0, 'rgba(0,0,0,255)'); 
 	this.gradient2.addColorStop(0.49, 'rgba(0,0,0,0)'); 
 	this.gradient2.addColorStop(0.51, 'rgba(255,255,255,0)'); 
 	this.gradient2.addColorStop(0.95, 'rgba(255,255,255,255)'); 
	this.init();
	
}
util.inherits(colors, widget);

colors.prototype.init = function() {

	this.draw();
}

colors.prototype.draw = function() {
	this.erase();

	with(this.context) {
		fillStyle = this.gradient1;
		fillRect(0,0,this.width,this.height)
		fillStyle = this.gradient2;
		fillRect(0,0,this.width,this.height)
	}

	this.drawLabel();
}

colors.prototype.drawColor = function() {
	with(this.context) {
		fillStyle = "rgb("+this.val.r+","+this.val.g+","+this.val.b+")"
		fillRect(0,this.height * 0.95,this.width,this.height* 0.05)

	}
}

colors.prototype.click = function(e) {
	if (this.clickPos.x > 0 && this.clickPos.y > 0 && this.clickPos.x < this.width && this.clickPos.y < this.height) {
		var imgData = this.context.getImageData(this.clickPos.x*2,this.clickPos.y*2,1,1);
	} else {
		return;
	}
	

	/** @property {object}  val  RGB color value at mouse position. <br> This is also the widget's data output (See <a href="#nexusui-api-widget-widgetval">widget.val</a>). <br> Properties:
	| &nbsp; | data
	| --- | ---
	| *r* | red value 0-256
	| *g* | green value 0-256
	| *b* | blue value 0-256 
	```js 
	colors1.on('*', function(data) {
		// some code using data.r, data.g, and data.b
	}
	```
	*/

	this.val = {
		r: imgData.data[0], 
		g: imgData.data[1], 
		b: imgData.data[2]
	}
	this.transmit(this.val);
	this.drawColor();
}


colors.prototype.move = function(e) {
	this.click(e);
}
},{"../core/widget":55,"util":51}],64:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class comment      
	Text comment
	```html
	<canvas nx="comment"></canvas>
	```
	<canvas nx="comment" style="margin-left:25px"></canvas>
*/

var comment = module.exports = function (target) {
	
	this.defaultSize = { width: 75, height: 25 };
	widget.call(this, target);

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *text* | text of comment area (as string)
		```js 
		comment1.val.text = "This is my comment"
		comment1.draw()
		```
	*/
	
	this.val = {
		text: "comment"
	}
	this.sizeSet = false;

	this.init();
}
util.inherits(comment, widget);

/** @method setSize
	Set the font size of the comment text
	@param {integer} [size] Text size in pixels
*/
comment.prototype.setSize = function(size) {
	this.size = size;
	this.sizeSet = true;
	this.draw();
}

comment.prototype.init = function() {
	this.draw();
}

comment.prototype.draw = function() {
	if (!this.sizeSet) {
		this.size = Math.sqrt((this.width * this.height) / (this.val.text.length));
	}

	this.erase();
	with (this.context) {
		
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		
		beginPath();
		moveTo(0,this.height);
		lineTo(this.width,this.height);
		closePath();
		
		fillStyle = this.colors.black;
		textAlign = "left";
		font = this.size+"px Gill Sans";
	}
	this.wrapText(this.val.text, 6, 3+this.size, this.width-6, this.size);
}
},{"../core/widget":55,"util":51}],65:[function(require,module,exports){
var math = require('../utils/math');
var util = require('util');
var widget = require('../core/widget');

/** 
	@class dial      
	Circular dial
	```html
	<canvas nx="dial"></canvas>
	```
	<canvas nx="dial" style="margin-left:25px"></canvas>
*/

var dial = module.exports = function(target) {
	
	this.defaultSize = { width: 50, height: 50 };
	widget.call(this, target);
	
	//define unique attributes
	this.circleSize;
	this.handleLength;

	/** @property {object}  val
	    | &nbsp; | data
		| --- | ---
		| *value* | Current value of dial as float 0-1
	*/
	this.val = {
		value: 0
	}
	/** @property {float}  responsivity    How much the dial increments on drag. Default: 0.004<br>
	*/
	this.responsivity = 0.004;
	
	this.aniStart = 0;
	this.aniStop = 1;
	this.aniMove = 0.01;

	this.lockResize = true;

	this.init();
	
}

util.inherits(dial, widget);

dial.prototype.init = function() {

	this.circleSize = (Math.min(this.center.x, this.center.y)-this.lineWidth);
	this.handleLength = this.circleSize+this.lineWidth;
	
	if (this.width<101) {
		this.handleLength--;
	//	this.handleLength--;
	}

	if (this.width<101 || this.width<101) {
		this.accentWidth = this.lineWidth * 1;
	} else {
		this.accentWidth = this.lineWidth * 2;
	}
	
	this.draw();
	
	return 1;
}

dial.prototype.draw = function() {
	var dial_angle = (((1.0 - this.val.value) * 2 * Math.PI) + (1.5 * Math.PI));
	var dial_position = (this.val.value + 0.25) * 2 * Math.PI
	var point = math.toCartesian(this.handleLength, dial_angle);

	this.erase();
	
	with (this.context) {
		
		fillStyle = this.colors.fill;
		
		//draw main circle
		beginPath();
			arc(this.center.x, this.center.y, this.circleSize, 0, Math.PI*2, true);
			fill();
		closePath();

		//draw color fill
		beginPath();
			lineWidth = this.accentWidth;
			arc(this.center.x, this.center.y, this.circleSize , Math.PI* 0.5, dial_position, false);
			lineTo(this.center.x,this.center.y);
			globalAlpha = 0.1;
			fillStyle = this.colors.accent;
			fill();
			globalAlpha = 1;
		closePath(); 

		//draw round accent
		beginPath();
			lineWidth = this.accentWidth;
			arc(this.center.x, this.center.y, this.circleSize , Math.PI* 0.5, dial_position, false);
			strokeStyle = this.colors.accent;
			stroke();
		closePath(); 
	
		//draw bar accent
		beginPath();
			lineWidth = this.accentWidth;
			strokeStyle = this.colors.accent;
			moveTo(this.center.x, this.center.y);
			lineTo(point.x + this.center.x, point.y + this.center.y);
			stroke();
		closePath(); 
		
		//draw circle in center
		beginPath();
			fillStyle = this.colors.accent;
			arc(this.center.x, this.center.y, this.circleSize/8, 0, Math.PI*2, false);
			fill();
		closePath(); 
		
	}

	this.drawLabel();
}


dial.prototype.click = function(e) {
	this.val.value = math.prune(this.val.value, 4)
	this.transmit(this.val);
	this.draw();
	this.aniStart = this.val.value;
}


dial.prototype.move = function() {	
	this.val.value = math.clip((this.val.value - (this.deltaMove.y * this.responsivity)), 0, 1);
	this.val.value = math.prune(this.val.value, 4)
	this.transmit(this.val);
	
	this.draw();
}


dial.prototype.release = function() {
	this.aniStop = this.val.value;
}

/** @method animate 
	Animates the dial
	@param {string} [type] Type of animation. Currently accepts "bounce" (bounces between mousedown and mouserelease points) or "none" */
dial.prototype.animate = function(aniType) {
	
	switch (aniType) {
		case "bounce":
			nx.aniItems.push(this.aniBounce.bind(this));
			break;
		case "none":
			nx.aniItems.splice(nx.aniItems.indexOf(this.aniBounce));
			break;
	}
	
}

dial.prototype.aniBounce = function() {
	if (!this.clicked) {
		this.val.value += this.aniMove;
		if (this.aniStop < this.aniStart) {
			this.stopPlaceholder = this.aniStop;
			this.aniStop = this.aniStart;
			this.aniStart = this.stopPlaceholder;
		}
		this.aniMove = math.bounce(this.val.value, this.aniStart, this.aniStop, this.aniMove);	
		this.draw();
		this.val.value = math.prune(this.val.value, 4)
		this.transmit(this.val);
	}
}


},{"../core/widget":55,"../utils/math":58,"util":51}],66:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class envelope      
	Three-point line ramp generator
	```html
	<canvas nx="envelope"></canvas>
	```
	<canvas nx="envelope" style="margin-left:25px"></canvas>
*/

var envelope = module.exports = function (target) {
	
	this.defaultSize = { width: 75, height: 75 };
	widget.call(this, target);
	
	this.nodeSize = 0;
	/** @property {boolean} active Whether or not the envelope is currently animating. */
	this.active = false;
	/** @property {integer} duration The envelope's duration in ms. */
	this.duration = 1000; // 1000 ms
	/** @property {boolean} looping Whether or not the envelope loops. */
	this.looping = false

	//define unique attributes
	
	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *amp* | amplitude at current point of ramp (float 0-1)
		| *index* | current progress through ramp (float 0-1)
		| *x* | x of envelope peak point (float 0-1)
		| *y* | y of envelope peak point (float 0-1)
	*/
	this.val = {
		x: 0.15,
		y: 0.5,
		amp: 0,
		index: 0
	}
	this.init();

}

util.inherits(envelope, widget);

envelope.prototype.init = function() {
	this.actualWid = this.width- this.nodeSize*2;
	this.actualHgt = this.height- this.nodeSize*2;
	this.draw();
	nx.aniItems.push(this.pulse.bind(this));
}

envelope.prototype.draw = function() {
	this.erase();
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);

		var drawingX = this.val.x * this.actualWid + this.nodeSize
		var drawingY = this.val.y * this.actualHgt + this.nodeSize

		//stay within right/left bounds
		if (drawingX<(this.bgLeft+this.nodeSize)) {
			drawingX = this.bgLeft + this.nodeSize;
		} else if (drawingX>(this.bgRight-this.nodeSize)) {
			drawingX = this.bgRight - this.nodeSize;
		}
		//stay within top/bottom bounds
		if (drawingY<(this.bgTop+this.nodeSize)) {
			drawingY = this.bgTop + this.nodeSize;
		} else if (drawingY>(this.bgBottom-this.nodeSize)) {
			drawingY = this.bgBottom - this.nodeSize;
		}
	
		with (this.context) {
			beginPath();
				strokeStyle = this.colors.accent;
				moveTo(0,this.height);
				lineTo(drawingX,drawingY);
				lineTo(this.width,this.height);					
				stroke();
				globalAlpha = 0.2;
				fillStyle = this.colors.accent;
				fill();
				globalAlpha = 1;
			closePath();
			beginPath();
				fillStyle = this.colors.accent;
				strokeStyle = this.colors.border;
				arc(drawingX, drawingY, this.nodeSize, 0, Math.PI*2, true);					
				fill();
			closePath();
			globalAlpha = 0.1
			fillRect(0,0,this.val.index*this.width,this.height);
			globalAlpha = 1;
		}
	}
	
	this.drawLabel();
}

envelope.prototype.scaleNode = function() {
	var actualX = this.val.x - this.nodeSize;
	var actualY = this.val.y - this.nodeSize;
	var clippedX = math.clip(actualX/this.actualWid, 0, 1);
	var clippedY = math.clip(actualY/this.actualHgt, 0, 1);
	this.val.x = math.prune(clippedX, 3)
	this.val.y = math.prune(clippedY, 3)
}

envelope.prototype.click = function() {
	this.val.x = this.clickPos.x;
	this.val.y = this.clickPos.y;
	this.scaleNode();
	this.transmit(this.val);
	this.draw();
}

envelope.prototype.move = function() {
	if (this.clicked) {
		this.val.x = this.clickPos.x;
		this.val.y = this.clickPos.y;
		this.scaleNode();
		this.transmit(this.val);
		this.draw();
	}
}

envelope.prototype.release = function() {
	this.val.x = this.clickPos.x;
	this.val.y = this.clickPos.y;
	this.scaleNode();
	this.draw();
}

envelope.prototype.pulse = function() {
	if (this.active) {
		this.val.index += ((this.width/3.3)/this.duration);
		this.val.index = math.clip(this.val.index, 0, 1)

		if (this.val.index < this.val.x) {
			var guiy = (this.val.index/this.val.x) * (1-this.val.y);
			this.val.amp = math.clip(guiy, 0, 1)
		} else {
			var guiy = ((1-this.val.index)/(1-this.val.x)) * (1-this.val.y);
			this.val.amp = math.clip(guiy, 0, 1)
		}
	
		this.transmit(this.val);
		this.draw();
		if (this.val.index >= 1) {
			if (this.looping) {
				this.val.index -= 1;
			} else {
				this.stop();
			}
		}
	}
}

/** @method start
	Start ramp from beginning. If set to loop, will loop the ramp until stopped. */
envelope.prototype.start = function() {
	this.active = true;
	this.val.index = 0;
}

/** @method stop
	Stop the ramp and set progress to 0. */
envelope.prototype.stop = function() {
	this.active = false;
	this.val.index = 0;
	this.draw();
}
},{"../core/widget":55,"../utils/math":58,"util":51}],67:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class ghost (alpha) 
	Interface gesture capture / playback (in development)    
	
	```html
	<canvas nx="ghost"></canvas>
	```
	<canvas nx="ghost" style="margin-left:25px"></canvas>
*/

var ghost = module.exports = function(target) {
	
	this.defaultSize = { width: 100, height: 50 };
	widget.call(this, target);
	
	//define unique attributes
	this.recording = false;
	this.playing = false;
	this.maxLength = 2000;
	this.components = new Array();
	this.buffer = new Array();
	//this.moment is for the record head
	this.moment = 0;
	//this.needle is for the playback head
	this.needle = 0;
	this.val = new Object();
	this.rate = 1;
	this.start = 0;
	this.end = 1;
	this.size = 0;
	this.looping = true;
	this.boundLog = this.log.bind(this)
	this.direction = 1;
	//settings
	this.noise = 0;
	this.loopstart = 0;
	this.loopend = 0;
	this.mode = "linear";   // linear,bounce,random,wander,pattern/dream
	//init
	this.init();

	this.boundAdv = this.advance.bind(this);
	nx.aniItems.push(this.boundAdv)

}

util.inherits(ghost, widget);


ghost.prototype.init = function() {
	this.draw();
}

ghost.prototype.watch = function() {
	for (var key in nx.widgets) {
		this.connect(nx.widgets[key]);
	}
}
	
	//sets a new component to be recorded
ghost.prototype.connect = function(target) {
	var compIndex = this.components.length;
	this.components.push(target);
	target.tapeNum = compIndex;
	target.isRecording = true;
	target.recorder = this;
	this.buffer[compIndex] = new Object();
	for (var key in target.val) {
		this.buffer[compIndex][key] = new Array();
	}
	
}
	
	//the actual recording function
ghost.prototype.write = function(index, val) {
	if (this.moment>=this.maxLength) {
		this.stop();
	}
	for (var key in val) {
		if (this.buffer[index][key]) {
			this.buffer[index][key][this.moment] = val[key];
		}
	}
	this.draw();
}
	

ghost.prototype.draw = function() {

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height)
	}

	var quad = this.width/4;
	var quad2 = this.width-quad;
	
	if (!this.recording) {
		with (this.context) {
			fillStyle = "#e33";
			beginPath()
			arc(quad,this.height/2,quad*0.8,0,Math.PI*2)
			fill()
			closePath();
			textAlign = "center"
			textBaseline = "middle"
			font = "normal "+this.height/6+"px courier"
			fillStyle = this.colors.fill
			fillText("rec",quad,this.height/2)
		}
	} else {
		with (this.context) {
			fillStyle = "#e33";
			fillRect(quad*0.4,quad*0.4,quad*1.2,quad*1.2)
		}
	}
	
	if (!this.playing) {
		with (this.context) {
			fillStyle = this.colors.border
			beginPath()
			arc(quad2,this.height/2,quad*0.8,0,Math.PI*2)
			fill()
			closePath()
			textAlign = "center"
			textBaseline = "middle"
			font = "normal "+this.height/6+"px courier"
			fillStyle = this.colors.fill
			fillText("play",quad2,this.height/2)
		}
	} else {
		with (this.context) {
			strokeStyle = this.colors.border
			lineWidth = this.width/30
			beginPath()
			arc(quad2,this.height/2,quad*0.8,0,Math.PI*2)
			stroke()
			closePath()
			var sec = ~~(this.needle/30)
			textAlign = "center"
			textBaseline = "middle"
			font = "normal "+this.height/3+"px courier"
			fillStyle = this.colors.border
			fillText(sec,quad2,this.height/2+2)
		}
	}
}

ghost.prototype.record = function() {
	this.moment = 0;
	nx.aniItems.push(this.boundLog)
	this.recording = true;
}

ghost.prototype.log = function() {
	for (var i=0;i<this.components.length;i++) {
		var sender = this.components[i];
		this.write(this.components[i].tapeNum,this.components[i].val);
	}
	this.moment++;
}

ghost.prototype.stop = function() {
	nx.removeAni(this.boundLog);
	this.size = this.moment;
	this.recording = false;
	this.draw();
}


ghost.prototype.scan = function(x) {
	// loop through the widgets that were recorded
	for (var i=0;i<this.components.length;i++) {
		//sender is the current widget we're looking at
		var sender = this.components[i];
		//loop through the widget's gesture buffer
		for (var key in this.buffer[sender.tapeNum]) {
			if (this.buffer[sender.tapeNum][key]) {
				//create a new val object
				var val = new Object();
				//make sure we're not looking out of bounds of the buffer
				var max = this.buffer[sender.tapeNum][key][~~this.needle+1] ? this.buffer[sender.tapeNum][key][~~this.needle+1] : this.buffer[sender.tapeNum][key][~~this.needle]
				if (this.buffer[sender.tapeNum][key][~~this.needle-this.direction] != undefined && this.buffer[sender.tapeNum][key][~~this.needle] != this.buffer[sender.tapeNum][key][~~this.needle-this.direction]) {
					// create the value pair
					val[key] = nx.interp(this.needle - ~~this.needle, this.buffer[sender.tapeNum][key][~~this.needle], max)
					val[key] += Math.random() * this.noise - this.noise/2;
					val[key] = nx.clip(val[key],0,1)
					//set the widget with the value from the buffer
					sender.set(val, true)
				}
			}
		}
	}
}



//this.moment is for the record head
//this.needle is for the playback head

ghost.prototype.play = function(rate,start,end) {
	rate ? this.rate = rate : false;
	if (start) {
		this.needle = this.moment-1;
		this.start = start;
	} else {
		this.needle = this.moment-1;
		this.start = 0;
	} 
	if (this.mode=="linear") {
		this.direction = 1;
	}
	end ? this.end = end : this.end = 1
	this.playing = true;
}

ghost.prototype.pause = function() {
	this.playing = false;
}

ghost.prototype.loop = function() {
	
}

ghost.prototype.advance = function() {
	if (this.playing) {
		if (this.mode == "linear" || this.mode == "bounce") {
			this.needle += this.rate*this.direction;
		} else if (this.mode=="random") {
			this.needle = nx.random((this.end-this.start)*this.size)+this.start*this.size;
			console.log(this.needle)
		} else if (this.mode=="wander") {
			var dir = 3
			this.needle > this.size*0.75 ? dir-- : null;
			this.needle < this.size*0.25 ? dir++ : null;
			this.needle += this.rate*this.direction * (nx.random(dir)-1);
		}

		if (this.needle/this.size < this.end && this.needle/this.size > this.start) {
			this.scan();
		} else if (this.looping) {
			if (this.mode=="linear") {
				this.needle = this.start*this.size + 1;
			} else {
				this.direction = this.direction * -1
			}
		} else {
			this.playing = false;
		}
		this.draw();
	}
}
	

ghost.prototype.click = function(e) {
	if (this.clickPos.x<this.width/2) {
		if (this.recording) {
			this.stop()
		} else {
			this.record()
		}
	} else {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
		this.draw();
	}
}
},{"../core/widget":55,"../utils/math":58,"util":51}],68:[function(require,module,exports){
module.exports = {
  banner: require('./banner'),
  button: require('./button'),
  colors: require('./colors'),
  comment: require('./comment'),
  dial: require('./dial'),
  envelope: require('./envelope'),
  ghost: require('./ghost'),
  joints: require('./joints'),
  keyboard: require('./keyboard'),
  matrix: require('./matrix'),
  message: require('./message'),
  metro: require('./metro'),
  mouse: require('./mouse'),
  multislider: require('./multislider'),
  multitouch: require('./multitouch'),
  number: require('./number'),
  position: require('./position'),
  remix: require('./remix'),
  range: require('./range'),
  select: require('./select'),
  slider: require('./slider'),
  string: require('./string'),
  tabs: require('./tabs'),
  tilt: require('./tilt'),
  toggle: require('./toggle'),
  typewriter: require('./typewriter'),
  vinyl: require('./vinyl')
}
},{"./banner":61,"./button":62,"./colors":63,"./comment":64,"./dial":65,"./envelope":66,"./ghost":67,"./joints":69,"./keyboard":70,"./matrix":71,"./message":72,"./metro":73,"./mouse":74,"./multislider":75,"./multitouch":76,"./number":77,"./position":78,"./range":79,"./remix":80,"./select":81,"./slider":82,"./string":83,"./tabs":84,"./tilt":85,"./toggle":86,"./typewriter":87,"./vinyl":88}],69:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class joints      
	2D slider with connections to several points; a proximity-based multislider.
	```html
	<canvas nx="joints"></canvas>
	```
	<canvas nx="joints" style="margin-left:25px"></canvas>
*/

var joints = module.exports = function (target) {
	this.defaultSize = { width: 150, height: 150 };
	widget.call(this, target);
	
	/* @property {integer} nodeSize The size of the proximity points in pixels */
	this.nodeSize = this.width/14; 
	this.values = [0,0];

	/** @property {object}  val  
		| &nbsp; | data
		| --- | ---
		| *x* | x position of touch/mouse
		| *y* | y position of touch/mouse
		| *node0* | nearness to first node if within range (float 0-1)
		| *node1* | nearness to second node if within range (float 0-1)
		| *node2* | nearness to third node if within range (float 0-1)
		| etc... | &nbsp;
		
	*/
	this.val = {
		x: 0.35,
		y: 0.35,
		node1: 0
	}
	/** @property {array} joints An array of objects with x and y properties detailing coordinates of each proximity node.
	```js
		// The widget will now have only 2 proximity points, instead of 8
		joints1.joints = [
		&nbsp; { x: 20 , y: 100 },
		&nbsp; { x: 75 , y: 150 }
		]
	```
	 */
	this.joints = [
		{ x: this.width/1.2 , y: this.height/1.2 },
		{ x: this.width/2 , y: this.height/1.3 },
		{ x: this.width/4.2 , y: this.height/1.1 },
		
		{ x: this.width/1.4 , y: this.height/2.2 },
		{ x: this.width/2.1 , y: this.height/1.8 },
		{ x: this.width/5 , y: this.height/2.4 },
		
		{ x: this.width/2.8 , y: this.height/6 },
		{ x: this.width/6 , y: this.height/3.7 }
	
	]
	this.threshold = this.width / 3;
}
util.inherits(joints, widget);

joints.prototype.init = function() {
	this.draw();
}

joints.prototype.draw = function() {
	this.erase();

	this.drawingX = this.val.x * this.width;
	this.drawingY = this.val.y * this.height;

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		if (this.val.x != null) {
			this.drawNode();
		}
		else {
			fillStyle = this.colors.border;
			font = "14px courier";
			fillText(this.default_text, 10, 20);
		}	
		fillStyle = this.colors.accent;
		strokeStyle = this.colors.border;
		for (var i in this.joints) {
			beginPath();
				arc(this.joints[i].x, this.joints[i].y, this.nodeSize/2, 0, Math.PI*2, true);					
				fill();
			closePath();
			var cnctX = Math.abs(this.joints[i].x-this.drawingX);
			var cnctY = Math.abs(this.joints[i].y-this.drawingY);
			var strength = cnctX + cnctY;
			if (strength < this.threshold) {
				beginPath();
					moveTo(this.joints[i].x, this.joints[i].y);
					lineTo(this.drawingX,this.drawingY);
					strokeStyle = this.colors.accent;
					lineWidth = math.scale( strength, 0, this.threshold, this.nodeSize/2, 5 );
					stroke();
				closePath();
				var scaledstrength = math.scale( strength, 0, this.threshold, 1, 0 );
				this.val["node"+i] = scaledstrength;
			}
		}
	}
	
	this.drawLabel();
}

joints.prototype.drawNode = function() {
	//stay within right/left bounds
	if (this.drawingX<(this.nodeSize)) {
		this.drawingX = this.nodeSize;
	} else if (this.drawingX>(this.width-this.nodeSize)) {
		this.drawingX = this.width - this.nodeSize;
	}
	//stay within top/bottom bounds
	if (this.drawingY < this.nodeSize) {
		this.drawingY = this.nodeSize;
	} else if (this.drawingY>(this.height-this.nodeSize)) {
		this.drawingY = this.height - this.nodeSize;
	}

	with (this.context) {
		globalAlpha=1;
		beginPath();
			fillStyle = this.colors.accent;
			strokeStyle = this.colors.border;
			lineWidth = this.lineWidth;
			arc(this.drawingX, this.drawingY, this.nodeSize, 0, Math.PI*2, true);					
			fill();
		closePath();
	}
}

joints.prototype.click = function() {
	this.val = new Object();
	this.val.x = this.clickPos.x/this.width;
	this.val.y = this.clickPos.y/this.height;
	this.draw();
	this.transmit(this.val);
	this.connections = new Array();
    
}

joints.prototype.move = function() {
	this.val = new Object();
	if (this.clicked) {
		this.val.x = this.clickPos.x/this.width;
		this.val.y = this.clickPos.y/this.height;
		this.draw();
		this.transmit(this.val);
		this.connections = new Array();
	}
}


joints.prototype.release = function() {
		this.anix = this.deltaMove.x/this.width;
		this.aniy = (this.deltaMove.y)/this.height;
	
}

/** @method animate
	Add simple physics to the widget
	@param {string} [type] Currently accepts "bounce" or "none".
*/

joints.prototype.animate = function(aniType) {
	
	switch (aniType) {
		case "bounce":
			nx.aniItems.push(this.aniBounce.bind(this));
			break;
		case "none":
			nx.aniItems.splice(nx.aniItems.indexOf(this.aniBounce));
			break;
	}
	
}

joints.prototype.anix = 0;
joints.prototype.aniy = 0;

joints.prototype.aniBounce = function() {
	if (!this.clicked && this.val.x) {
		this.val.x += (this.anix);
		this.val.y += (this.aniy);
		this.anix = math.bounce(this.val.x, 0.1, 0.9, this.anix);
		this.aniy = math.bounce(this.val.y, 0.1, 0.9, this.aniy);
		this.draw();
		this.transmit(this.val);
	}
}

},{"../core/widget":55,"../utils/math":58,"util":51}],70:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');
var drawing = require('../utils/drawing');
var math = require('../utils/math');

/** 
	@class keyboard      
	Piano keyboard which outputs MIDI
	```html
	<canvas nx="keyboard"></canvas>
	```
	<canvas nx="keyboard" style="margin-left:25px"></canvas>
*/

var keyboard = module.exports = function (target) {

	this.defaultSize = { width: 300, height: 75 };
	widget.call(this, target);

	/** @property {integer} octaves Number of octaves on the keyboard */
	this.octaves = 3;
	this.white = {
		width:0,
		height:0
	}
	this.black = {
		width:0,
		height:0
	}
	this.wkeys = new Array();
	this.bkeys = new Array();

	/** @property {array} keypattern Array of 'w' and 'b' denoting the pattern of white and black keys. This can be customized! The pattern can be any number of keys, however each black key must be surrounded by two white keys.
	```js
		//This key pattern would put a black key between every white key
		keyboard1.keypattern = ['w','b','w','b','w','b','w','b','w','b','w','b']
		keyboard1.init()

		//This key pattern uses only white keys
		keyboard2.keypattern = ['w','w','w','w','w','w','w','w','w','w','w','w']
		keyboard2.init()
	```


	 */
	this.keypattern = ['w','b','w','b','w','w','b','w','b','w','b','w']
	this.keys = new Array();
	/** @property {integer} midibase The MIDI note value of the lowest note on the keyboard. Defaults to 48. */
	this.midibase = 48;
	this.lineWidth = 1;

	//to enable multitouch
	this.fingers = [
		{ 
			key: -1,
			pkey: -1

		}
	]
	this.multitouch = false; // will auto switch to true if experiences 2 simultaneous touches
	this.oneleft = false;

	/** @property {string} mode Play mode. Currently accepts "button" (default) or "sustain" in which each key acts as a toggle. */	
	this.mode = "button" // modes: "button", "sustain" and, possibly in future, "aftertouch"

	// for each key: x, y, w, h, color, on, note

	/** @property {object}  val   Core interactive values and data output
		| &nbsp; | data
		| --- | ---
		| *on* | 0 if noteon, 1 if noteoff
		| *note* | MIDI value of key pressed
		| *midi* | paired MIDI message as a string - example "20 0" - This is to allow for simultaneous arrival of the MIDI pair if sent as an OSC message. 
	*/
	this.val = {
		on: 0,
		note: 0,
		midi: "0 0"
	};

	this.init();
	
}
util.inherits(keyboard, widget);

keyboard.prototype.init = function() {

	//recap from header
	this.white = {
		width:0,
		height:0
	}
	this.black = {
		width:0,
		height:0
	}
	this.wkeys = new Array();
	this.bkeys = new Array();

	/** @property {array} keys Array of key objects. This may be of use in combination with the keyboard.toggle method. */
	this.keys = new Array();

	//new stuff
	this.white.num = 0;
	for (var i=0;i<this.keypattern.length;i++) {
		this.keypattern[i]=='w' ? this.white.num++ : null;
	}
	this.white.num *= this.octaves;

	this.white.width = this.width/this.white.num
	this.white.height = this.height

	this.black.width = this.white.width*0.6
	this.black.height = this.height*0.6

	for (var i=0;i<this.keypattern.length*this.octaves;i++) {
		this.keys[i] = {
			note: i+this.midibase,
			on: false
		}
		switch (this.keypattern[i%this.keypattern.length]) {
			case 'w':
				this.keys[i].x =  this.wkeys.length*this.white.width,
				this.keys[i].y = 0,
				this.keys[i].w = this.white.width,
				this.keys[i].h = this.white.height,
				this.keys[i].type = 'w';
				this.keys[i].index = i;
				this.wkeys.push(this.keys[i]);

				break;
			case 'b':
				this.keys[i].x = this.wkeys.length*this.white.width - this.black.width/2,
				this.keys[i].y = 0,
				this.keys[i].w = this.black.width,
				this.keys[i].h = this.black.height,
				this.keys[i].type = 'b';
				this.keys[i].index = i;
				this.bkeys.push(this.keys[i]);
				break;
		}
	}


	this.draw();
}

keyboard.prototype.draw = function() {

	with (this.context) {
		strokeStyle = this.colors.border;
		lineWidth = 1;
			
		for (var i in this.wkeys) {
			fillStyle = this.wkeys[i].on ? this.colors.border : this.colors.fill
			strokeRect(this.wkeys[i].x,0,this.white.width,this.white.height);
			fillRect(this.wkeys[i].x,0,this.white.width,this.white.height);
		}
		for (var i in this.bkeys) {
			fillStyle = this.bkeys[i].on ? this.colors.border : this.colors.black
			fillRect(this.bkeys[i].x,0,this.black.width,this.black.height);
		}
		//strokeRect(0,0,this.width,this.height);
	}
	this.drawLabel();
}

/** @method toggle
	Manually toggle a key on or off, and transmit the new state.
	@param {object} [key]  A key object (from the .keys array) to be turned on or off
	@param {boolean} [on/off]  (Optional) Whether the key should be turned on (true) or off (false). If this parameter is left out, the key will switch to its opposite state.
	```js
	// Turns the first key on
	keyboard1.toggle( keyboard1.keys[0], true );
	```
*/
keyboard.prototype.toggle = function(key, data) {
	if (this.mode=="button") {
		if (key) {
			if (data) {
				key.on = data;
			} else {
				key.on = !key.on;
			}

			var on = key.on ? 1 : 0;
			var amp = math.invert(this.clickPos.y/this.height) * 128;
			amp = math.prune(math.clip(amp,5,128),0);

			this.val = { 
				on: on*amp,
				note: key.note,
				midi: key.note + " " + on
			};
			this.transmit(this.val);
			this.draw();
		}
	} else if (this.mode=="sustain") {
		if (key) {
			if (data) {
				key.on = data;
			} else {
				key.on = !key.on;
			}

			var on = key.on ? 1 : 0;
			var amp = math.invert(this.clickPos.y/this.height) * 128;
			amp = math.prune(math.clip(amp,5,128),0);

			this.val = { 
				on: on*amp,
				note: key.note,
				midi: key.note + " " + on
			};
			this.transmit(this.val);
			this.draw();
		}

	}

}

keyboard.prototype.whichKey = function (x, y){

	for (var i in this.bkeys) {
		if (drawing.isInside({"x":x,"y":y}, this.bkeys[i])) {
			return this.bkeys[i]
		}
	}

	var keyx = ~~(x/this.white.width);
	if (keyx>=this.wkeys.length) { keyx = this.wkeys.length-1 }
	if (keyx<0) { keyx = 0 }
	return this.wkeys[keyx];
}

keyboard.prototype.click = function(e) {
	if (this.clickPos.touches.length>1 || this.multitouch) {
		if (this.clickPos.touches.length>=2 && this.oneleft) {
			this.oneleft = false;
		}
		for (var j=0;j<this.clickPos.touches.length;j++) {
			this.multitouch = true;
			this.fingers[j] = {
				key: this.whichKey(this.clickPos.touches[j].x, this.clickPos.touches[j].y)
			}
			if (!this.fingers[j].key.on) {
				this.fingers[j].key.on = true;
			}
		}
	} else {
		this.fingers[0].pkey = this.fingers[0].key;
		this.fingers[0].key = this.whichKey(this.clickPos.x, this.clickPos.y);
		this.toggle(this.fingers[0].key)
	}
}

keyboard.prototype.move = function(e) {
	var debug = document.getElementById("debug");
	if (this.clickPos.touches.length>1 || this.multitouch) {
		this.keysinuse = new Array();
		for (var j=0;j<this.clickPos.touches.length;j++) {
			this.fingers[j] = {
				key: this.whichKey(this.clickPos.touches[j].x, this.clickPos.touches[j].y)
			}
			if (!this.fingers[j].key.on) {
				this.toggle(this.fingers[j].key, true)
			}
			this.keysinuse.push(this.fingers[j].key.index)
		}
		for (var j=0;j<this.keys.length;j++) {
			if (this.keys[j].on  && this.keysinuse.indexOf(this.keys[j].index)<0) {
				this.toggle(this.keys[j], false);
			}
		}
	} else {
		this.fingers[0].pkey = this.fingers[0].key;
		this.fingers[0].key = this.whichKey(this.clickPos.x, this.clickPos.y);
		if (this.fingers[0].key && this.fingers[0].key.index != this.fingers[0].pkey.index) {
			this.toggle(this.fingers[0].key, true);
			this.toggle(this.fingers[0].pkey, false);
		}
	}
}

keyboard.prototype.release = function(e) {
	if (this.clickPos.touches.length>1 || this.multitouch) {
		this.keysinuse = new Array();
		for (var j=0;j<this.clickPos.touches.length;j++) { 
			if (this.oneleft && this.clickPos.touches.length==1) {
				break;
			}
			this.fingers[j] = {
				key: this.whichKey(this.clickPos.touches[j].x, this.clickPos.touches[j].y)
			}
			this.keysinuse.push(this.fingers[j].key.index)
		}
		for (var j=0;j<this.keys.length;j++) {
			if (this.keys[j].on  && this.keysinuse.indexOf(this.keys[j].index)<0) {
				this.toggle(this.keys[j], false);
			}
		}
		if (this.clickPos.touches.length==1) { this.oneleft = true }
	} else {
		if (this.mode=="button") {
			this.toggle(this.fingers[0].key, false);
		}
	}
}








},{"../core/widget":55,"../utils/drawing":57,"../utils/math":58,"util":51}],71:[function(require,module,exports){
var math = require('../utils/math');
var drawing = require('../utils/drawing');
var util = require('util');
var widget = require('../core/widget');

/** 
	@class matrix      
	Matrix of toggles, with sequencer functionality.
	```html
	<canvas nx="matrix"></canvas>
	```
	<canvas nx="matrix" style="margin-left:25px"></canvas>
*/


var matrix = module.exports = function (target) {
	this.defaultSize = { width: 100, height: 100 };
	widget.call(this, target);
	

	/** @property {integer}  row   Number of rows in the matrix
	```js
		matrix1.row = 2;
		matrix1.init()
	```
	*/
	this.row = 4;

	/** @property {integer}  col   Number of columns in the matrix
	```js
		matrix1.col = 10;
		matrix1.init()
	```
	*/
	this.col = 4;
	
	this.cellHgt;
	this.cellWid;

	/** @property {array}  matrix   Nested array of matrix values. Cells can be manually altered using .matrix (see code), however this will *not* cause the new value to be transmit. See .setCell() to set/transmit cell values.
	```js
		//Turn on the cell at row 1 column 2
		matrix1.matrix[1][2] = 1
		matrix1.draw()


		//Turn off the cell at row 3 column 0
		matrix1.matrix[3][0] = 0
		matrix1.draw()
	```
	*/
	this.matrix;

	/** @property {object}  val   Core values and data output
		| &nbsp; | data
		| --- | ---
		| *row* | Current row being changed
		| *col* | Current column being changed
		| *level* | Whether cell is on or off (0 or 1)
		| *list * | Array of values in highlighted column (if sequencing)
	*/
	this.val = {
		row: 0,
		col: 0,
		level: 0,
		list: new Array()
	}

	//for mouse logic
	this.cur;
	this.prev;

	/** @property {boolean}  erasing   Whether or not mouse clicks will erase cells. Set to true automatically if you click on an "on" cell. */
	this.erasing = false;

	/** @property {integer}  place   When sequencing, the current column. */
	this.place = null;

	this.starttime;
	this.thisframe = 0;
	this.lastframe = 0;
	this.context.lineWidth = 1;

	this.sequencing = false;
	
	/** @property {string}  sequenceMode  Sequence pattern (currently accepts "linear" which is default, or "random") */
	this.sequenceMode = "linear"; // "linear" or "random". future options would be "wander" (drunk) or "markov"

	/** @property {integer}  bpm   Beats per minute (if sequencing)
	```js
		matrix1.bpm = 120;
	```
	*/
	this.bpm = 120;
	this.init();
	
}
util.inherits(matrix, widget);



matrix.prototype.init = function() {

	this.lineWidth = 1;
	
	this.matrix = null;
	// generate 2D matrix array
	this.matrix = new Array(this.col)
	for (var i=0;i<this.col;i++) {
		this.matrix[i] = new Array(this.row)
		for (var j=0;j<this.row;j++) {
			this.matrix[i][j] = 0; // set value of each matrix cell
		}
	}


	this.draw();
	
}

matrix.prototype.draw = function() {

	this.cellWid = this.width/this.col;
	this.cellHgt = this.height/this.row;

	for (var i=0;i<this.row;i++){
		for (var j=0;j<this.col;j++) {
			var st_x = j*this.cellWid // starting point(left)
			j==0 ? st_x += 0 : null;
			var st_y = i*this.cellHgt; // starting point(top)
			i==0 ? st_y += 0 : null;
			var boxwid = this.cellWid;
			var boxhgt = this.cellHgt;

			
			with (this.context) {
				strokeStyle = this.colors.border;
				if (this.matrix[j][i] > 0) {
					fillStyle = this.colors.accent;
				} else {
					fillStyle = this.colors.fill;
				}
				fillRect(st_x, st_y, boxwid, boxhgt);
				strokeRect(st_x, st_y, boxwid, boxhgt);
			
				// sequencer highlight
				if (this.place == j) {
					globalAlpha = 0.4;
					fillStyle = this.colors.border;
					fillRect(st_x, st_y, boxwid, boxhgt);
					globalAlpha = 1;
				}

			}
		} 
	}
	this.drawLabel();
}



matrix.prototype.click = function(e) {

	this.cur = {
		col: ~~(this.clickPos.x/this.cellWid),
		row: ~~(this.clickPos.y/this.cellHgt)
	}

	if (this.matrix[this.cur.col][this.cur.row]) {
		this.matrix[this.cur.col][this.cur.row] = 0;
		this.erasing = true;
	} else {
		this.matrix[this.cur.col][this.cur.row] = 1;
		this.erasing = false;
	}

	this.cur.value = this.matrix[this.cur.col][this.cur.row]
	this.prev = this.cur;

//	var data = this.matrix[this.cur.col];
//	data = data.join();
//	data = data.replace(/\,/g," ");

	this.val = {
		row: this.cur.row,
		col: this.cur.col,
		level: this.cur.value
	}

	this.transmit(this.val);
	this.draw();
}

matrix.prototype.move = function(e) {
	if (this.clicked) {
		
		this.cur = {
			col: ~~(this.clickPos.x/this.cellWid),
			row: ~~(this.clickPos.y/this.cellHgt)
		}

		if (this.cur.row < this.row && this.cur.col < this.col && this.cur.row >= 0 && this.cur.col >=0) {
			if (this.cur.col!=this.prev.col || this.cur.row != this.prev.row) {
				if (this.erasing) {
					this.matrix[this.cur.col][this.cur.row] = 0;
				} else {
					this.matrix[this.cur.col][this.cur.row] = 1;
				}

				this.cur.value = this.matrix[this.cur.col][this.cur.row]
				this.prev = this.cur;

				this.val = {
					row: this.cur.row,
					col: this.cur.col,
					level: this.cur.value
				}

				this.transmit(this.val);
				this.draw();
			}
		}

	}
}


/** @method setCell
Manually set an individual cell on/off and transmit the new value.
@param {integer} [col] The column of the cell to be turned on/off
@param {integer} [row] The row of the cell to be turned on/off
@param {boolean} [on/off] Whether the cell should be turned on/off

```js
	// Turns cell on at column 1 row 3
	matrix1.setCell(1,3,true);
```
*/
matrix.prototype.setCell = function(col,row,on) {

	var value = on ? 1 : 0;
	this.matrix[col][row] = value

	this.val = {
		row: row,
		col: col,
		level: value
	}

	this.transmit(this.val);
	this.draw();

}

/** @method sequence
@param {float} [bpm] Beats per minute of the pulse
Turns the matrix into a sequencer.

```js
	matrix1.sequence(240);
```
*/
matrix.prototype.sequence = function(bpm) {

	if (bpm) {
		this.bpm = bpm;
	}	
	this.sequencing = true;
	requestAnimationFrame(this.seqStep.bind(this));
 
}

/** @method stop
Stops the matrix sequencer.

```js
	matrix1.stop();
```
*/
matrix.prototype.stop = function() {
	this.sequencing = false;
}

matrix.prototype.seqStep = function() {

    var now = new Date().getTime();
    var dt = now - nx.starttime;

    this.thisframe = ~~(dt/(60000/this.bpm));

    if (this.thisframe != this.lastframe) {

		if (this.sequenceMode=="linear") {
			this.place++;
		} else if (this.sequenceMode=="random") {
			this.place = math.random(this.col);
		}
		if (this.place>=this.col) {
			this.place = 0;
		}

		if (this.place==null) {
			this.place = 0;
		}

		this.jumpToCol(this.place);

    }

    this.lastframe = this.thisframe;
    if (this.sequencing) {
		requestAnimationFrame(this.seqStep.bind(this));
	}
}

/** @method jumpToCol
Jump to a certain column of the matrix, highlight it, and output its values as an array. Column numbers start at 0.

```js
	matrix1.jumpToCol(1);
```
*/

matrix.prototype.jumpToCol = function(place) {
		this.place = place
		this.val = {
			list: this.matrix[this.place]
		}
		this.transmit(this.val);
		this.draw();
}


matrix.prototype.customDestroy = function() {
	this.stop();
}

},{"../core/widget":55,"../utils/drawing":57,"../utils/math":58,"util":51}],72:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class message      
	Send a string of text.
	```html
	<canvas nx="message"></canvas>
	```
	<canvas nx="message" style="margin-left:25px"></canvas>
*/

var message = module.exports = function (target) {
	
	this.defaultSize = { width: 100, height: 30 };
	widget.call(this, target);
	

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *value* | Text of message, as string
	*/

	this.val = {
		value: "send a message"
	}

	/** @property {integer} size Text size in px */
	this.size = 12;
	
}
util.inherits(message, widget);

message.prototype.init = function() {
	if (this.canvas.getAttribute("label")) {
		this.val.value = this.canvas.getAttribute("label");
	}
	//this.size = Math.sqrt((this.width * this.height) / (this.val.message.length));
	this.draw();
}

message.prototype.draw = function() {
	this.erase();
	with (this.context) {
		if (this.clicked) {
			fillStyle = this.colors.accent;
		} else {
			fillStyle = this.colors.fill;
		}
		fillRect(0,0,this.width,this.height)
		
		if (this.clicked) {
			fillStyle = this.colors.white;
		} else {
			fillStyle = this.colors.black;
		}
		textAlign = "left";
		font = this.size+"px courier";
	}
	this.wrapText(this.val.value, 5, 1+this.size, this.width-6, this.size);
}

message.prototype.click = function(e) {
	this.draw();
	this.transmit(this.val);
}

message.prototype.release = function(e) {
	this.draw();
}
},{"../core/widget":55,"util":51}],73:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class metro      
	Bouncing ball metronome
	```html
	<canvas nx="metro"></canvas>
	```
	<canvas nx="metro" style="margin-left:25px"></canvas>
*/

var metro = module.exports = function (target) {
	this.defaultSize = { width: 100, height: 20 };
	widget.call(this, target);

	//define unique attributes
	
	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *beat* | Which side the ball is bouncing on (0 if left, 1 if right)
	*/
	this.val = {
		beat: 0
	}

	this.x = 10;
	this.y = 10;
	this.loc = 10;
	this.nodeSize = 10;
	/** @property {float} speed Speed of the ball (default 1) */
	this.speed = 1;
	this.direction = 1;
	/** @property {string} orientation Orientation of metro. Default is "horizontal". */
	this.orientation = "horizontal"
	this.boundary = this.width

	nx.aniItems.push(this.advance.bind(this));
	this.active = true;
	
	this.init();
}
util.inherits(metro, widget);

metro.prototype.init = function() {
	this.nodeSize = Math.min(this.width,this.height)/2;
	if (this.width<this.height) {
		this.orientation = "vertical"
		this.boundary = this.height
	} else {
		this.orientation = "horizontal"
		this.boundary = this.width
	}
	this.x = this.nodeSize;
	this.y = this.nodeSize;
	this.loc = this.nodeSize;

	this.draw();

}

metro.prototype.draw = function() {
	this.erase()
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height); 

		beginPath();
		fillStyle = this.colors.accent;
		arc(this.x, this.y, this.nodeSize, 0, Math.PI*2, true);					
		fill();
		closePath();
	}
	
	this.drawLabel();
}

metro.prototype.click = function() {
}

metro.prototype.move = function() {
	if (this.clicked) {
		this.speed -= (this.deltaMove.y / 50);
	}
}

metro.prototype.release = function() {
}

metro.prototype.advance = function() {
	if (this.speed>=0) {
		this.loc += this.speed * this.direction;
	} else {
		this.loc += this.speed * this.direction;
	}
	if (this.loc-this.nodeSize<0 || this.loc+this.nodeSize>this.boundary) {
		this.val.beat = math.scale(this.direction,-1,1,0,1)
		this.transmit(this.val);
		this.direction *= -1
	}
	if (this.orientation == "vertical") {
		this.y = this.loc
	} else {
		this.x = this.loc
	}
	this.draw();
}

metro.prototype.customDestroy = function() {
	nx.removeAni(this.advance.bind(this))
}
},{"../core/widget":55,"../utils/math":58,"util":51}],74:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');
var math = require('../utils/math');

/** 
	@class mouse      
	Mouse tracker, relative to web browser window.
	```html
	<canvas nx="mouse"></canvas>
	```
	<canvas nx="mouse" style="margin-left:25px"></canvas>
*/

var mouse = module.exports = function (target) {
	
	this.defaultSize = { width: 98, height: 100 };
	widget.call(this, target);

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *x* | x value of mouse relative to browser
		| *y* | y value of mouse relative to browser
		| *deltax* | x change in mouse from last position
		| *deltay* | y change in mouse from last position
	*/
	this.val = {
		x: 0,
		y: 0,
		deltax: 0, 
		deltay: 0
	}
	this.inside = new Object();
	this.boundmove = this.preMove.bind(this)
	this.mousing = window.addEventListener("mousemove", this.boundmove, false);
	
	this.init();
}
util.inherits(mouse, widget);

mouse.prototype.init = function() {
	
	this.inside.height = this.height;
	this.inside.width = this.width;
	this.inside.left = 0;
	this.inside.top = 0;
	this.inside.quarterwid = (this.inside.width)/4;
	 
	this.draw();
}

mouse.prototype.draw = function() {
	this.erase();

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height); 

		var scaledx = -(this.val.x) * this.height;
		var scaledy = -(this.val.y) * this.height;
		var scaleddx = -(this.val.deltax) * this.height - this.height/2;
		var scaleddy = -(this.val.deltay) * this.height - this.height/2;

		fillStyle = this.colors.accent;
		fillRect(this.inside.left, this.inside.height, this.inside.quarterwid, scaledx);
		fillRect(this.inside.quarterwid, this.inside.height, this.inside.quarterwid, scaledy);
		fillRect(this.inside.quarterwid*2, this.inside.height, this.inside.quarterwid, scaleddx);
		fillRect(this.inside.quarterwid*3, this.inside.height, this.inside.quarterwid, scaleddy);

		globalAlpha = 0.5;
		fillStyle = this.colors.white;
		textAlign = "center";
		font = this.width/7+"px gill sans";
		fillText("x", this.inside.quarterwid*0 + this.inside.quarterwid/2, this.height-7);
		fillText("y", this.inside.quarterwid*1 + this.inside.quarterwid/2, this.height-7);
		fillText("dx", this.inside.quarterwid*2 + this.inside.quarterwid/2, this.height-7);
		fillText("dy", this.inside.quarterwid*3 + this.inside.quarterwid/2, this.height-7);

		globalAlpha = 1;
	}
	
	this.drawLabel();
}

mouse.prototype.move = function(e) {
	this.val = {
		deltax: e.clientX/window.innerWidth - this.val.x,
		deltay: math.invert(e.clientY/window.innerHeight) - this.val.y,
		x: e.clientX/window.innerWidth,
		y: math.invert(e.clientY/window.innerHeight)
	}
	this.draw();
	this.transmit(this.val);

}

mouse.prototype.customDestroy = function() {
	window.removeEventListener("mousemove",  this.boundmove, false);
}
},{"../core/widget":55,"../utils/math":58,"util":51}],75:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class multislider      
	Multiple vertical sliders in one interface.
	```html
	<canvas nx="multislider"></canvas>
	```
	<canvas nx="multislider" style="margin-left:25px"></canvas>
*/
var multislider = module.exports = function (target) {
	
	this.defaultSize = { width: 100, height: 75 };
	widget.call(this, target);
	
	/** @property {integer} sliders Number of sliders in the multislider. (Must call .init() after changing this setting, or set with .setNumberOfSliders) */
	this.sliders = 15;

	/** @property {array}  val   Array of slider values. <br> **Note:** This widget's output is not .val! Transmitted output is:	

		| &nbsp; | data
		| --- | ---
		| *(slider index)* | value of currently changed slider
		| list | all multislider values as list. (if the interface sends to js or node, this list will be an array. if sending to ajax, max7, etc, the list will be a string of space-separated values)

	*/
	
	this.val = new Object();
	for (var i=0;i<this.sliders;i++) {
		this.val[i] = 0.7;
	}
	this.sliderClicked = 0;
	this.oldSliderToMove;
	this.init();
}
util.inherits(multislider, widget);

multislider.prototype.init = function() {
	this.val = new Object();
	for (var i=0;i<this.sliders;i++) {
		this.val[i] = 0.7;
	}
	this.realSpace = { x: this.width, y: this.height }
	this.sliderWidth = this.realSpace.x/this.sliders;
	this.draw();
}

multislider.prototype.draw = function() {
	this.erase();
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		
		strokeStyle = this.colors.accent;
		fillStyle = this.colors.accent;
		lineWidth = 5;
    	
		for(var i=0; i<this.sliders; i++) {
			beginPath();
			moveTo(i*this.sliderWidth, this.height-this.val[i]*this.height);
			lineTo(i*this.sliderWidth + this.sliderWidth, this.height-this.val[i]*this.height);
			stroke();
			lineTo(i*this.sliderWidth + this.sliderWidth, this.height);
			lineTo(i*this.sliderWidth,  this.height);
			globalAlpha = 0.3 - (i%3)*0.1;
			fill();
			closePath();
			globalAlpha = 1;
		}
	}
	this.drawLabel();
}

multislider.prototype.click = function() {
	this.oldSliderToMove = false;
	this.move(true);
}

multislider.prototype.move = function(firstclick) {
	if (this.clicked) {


		if (this.clickPos.touches.length>1) {

			for (var i=0;i<this.clickPos.touches.length;i++) {
				var sliderToMove = Math.floor(this.clickPos.touches[i].x / this.sliderWidth);
				sliderToMove = math.clip(sliderToMove,0,this.sliders-1);
				this.val[sliderToMove] = math.clip(math.invert((this.clickPos.touches[i].y / this.height)),0,1);
			}

		} else {

			var sliderToMove = Math.floor(this.clickPos.x / this.sliderWidth);
			sliderToMove = math.clip(sliderToMove,0,this.sliders-1);
			this.val[sliderToMove] = math.clip(math.invert(this.clickPos.y / this.height),0,1);

			if (this.oldSliderToMove && this.oldSliderToMove > sliderToMove + 1) {
				var missed = this.oldSliderToMove - sliderToMove - 1;
				for (var i=1;i<=missed;i++) {
					this.val[sliderToMove+i] = this.val[sliderToMove] + (this.val[this.oldSliderToMove] - this.val[sliderToMove]) * ((i/(missed+1)));
				}
			} else if (this.oldSliderToMove && sliderToMove > this.oldSliderToMove + 1) {
				var missed = sliderToMove - this.oldSliderToMove - 1;
				for (var i=1;i<=missed;i++) {
					this.val[this.oldSliderToMove+i] = this.val[this.oldSliderToMove] + (this.val[sliderToMove] - this.val[this.oldSliderToMove]) * ((i/(missed+1)));
				}
			}
		
		}
		this.draw();
	}
	var msg = new Object()
	msg[sliderToMove] = this.val[sliderToMove]
	if (this.destination=="js" || this.destination=="node") {
		msg["list"] = this.val;
	} else {
		msg["list"] = new String();
		for (var key in this.val) { msg["list"] += this.val[key] + " " }
	}
	this.transmit(msg);
	this.oldSliderToMove = sliderToMove;
	
}

/** @method setNumberOfSliders
@param {integer} [num] New number of sliders in the multislider */
multislider.prototype.setNumberOfSliders = function(numOfSliders) {
	this.sliders = numOfSliders;
	this.val = new Array();
	for (var i=0;i<this.sliders;i++) {
		this.val.push(0.7);
	}
	this.sliderWidth = this.realSpace.x/this.sliders;
	this.init();
}

/** @method setSliderValue
Sets a slider to new value and transmits.
@param {integer} [slider] Slider to set (slider index starts at 0)
@param {integer} [value] New slider value */
multislider.prototype.setSliderValue = function(slider,value) {
	this.val[slider] = value;
	this.draw();
	var msg = new Object();
	msg[slider] = this.val[slider]
	if (this.destination=="js" || this.destination=="node") {
		msg["list"] = this.val;
	} else {
		msg["list"] = new String();
		for (var key in this.val) { msg["list"] += this.val[key] + " " }
	}
	this.transmit(msg);
}

},{"../core/widget":55,"../utils/math":58,"util":51}],76:[function(require,module,exports){
var math = require('../utils/math');
var drawing = require('../utils/drawing');
var util = require('util');
var widget = require('../core/widget');

/** 
	@class multitouch      
	Multitouch 2d-slider with up to 5 points of touch.
	```html
	<canvas nx="multitouch"></canvas>
	```
	<canvas nx="multitouch" style="margin-left:25px"></canvas>
*/

var multitouch = module.exports = function (target) {
	
	this.defaultSize = { width: 200, height: 200 };
	widget.call(this, target);
	
	//unique attributes
	this.nodeSize = this.width/10;

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *touch1.x* | x position of first touch
		| *touch1.y* | y position of first touch
		| *touch2.x* | x position of second touch (if 2 touches)
		| *touch2.y* | y position of second touch (if 2 touches)
		| *etc* | &nbsp;
	*/
	this.val = {
		touch1: {
			x: 0,
			y: 0
		}
	}
	
	this.nodes = new Array();
	
	/** @property {string}  text  Text that will show when object is static */
	this.text = "multitouch";

	this.rainbow = ["#00f", "#04f", "#08F", "0AF", "0FF"];
	
	/** @property {string}  mode   "normal" or "matrix" mode. "matrix" mode has a GUI of discrete touch areas.
	*/
	this.mode = "normal";

	/** @property {integer}  rows   How many rows in the matrix (matrix mode only)
	*/
	this.rows = 10;

	/** @property {integer}  cols   How many rows in the matrix (matrix mode only)
	*/
	this.cols = 10;

	/** @property {array}  matrixLabels  An array of strings that can provide text labels on cells of the matrix. If shorter than the matrix cells, the array will repeat.
	```
		this.mode = "matrix"
		this.matrixLabels = [ "A", "A#", "B", "C" ]
		this.init();
	```
	*/
	this.matrixLabels = false;

	this.init();
}
util.inherits(multitouch, widget);

multitouch.prototype.init = function() {
	this.nodeSize = this.width/10;
	this.draw();
}

multitouch.prototype.draw = function() {
	this.erase();
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);

		var count = 0;

		if (this.mode == "matrix") {
			for (var j=0;j<this.rows;j++) {
				for (var i=0;i<this.cols;i++) {
					with (this.context) {
						beginPath();
							fillStyle = this.colors.accent;
							strokeStyle = this.colors.border;
							lineWidth = 1;
							var circx = i*this.width/this.cols + (this.width/this.cols)/2;
							var circy = j*this.height/this.rows + (this.height/this.rows)/2;
							arc(circx, circy, (this.height/this.rows)/2, 0, Math.PI*2, true);					
							stroke();
							fillStyle = this.colors.border;
							textAlign = "center";
							textBaseline = "middle";
							if (this.matrixLabels) {
								fillText(this.matrixLabels[count%this.matrixLabels.length], circx, circy);
								count++
							} 
							var thisarea = {
								x: i*this.width/this.cols,
								y: j*this.height/this.rows,
								w: this.width/this.cols,
								h: this.height/this.rows
							}
							if (this.clickPos.touches.length>=1) {
								for (var k=0;k<this.clickPos.touches.length;k++) {
									if (drawing.isInside(this.clickPos.touches[k],thisarea)) {
										globalAlpha=0.5;
										fillStyle = this.colors.accent;
										fill();
										globalAlpha=0.3;
										fillStyle = this.rainbow[k];
										fill();
										globalAlpha=1;
									}
								}
							}
						closePath();
					}
				}
			}
		} else {
			if (this.clickPos.touches.length>=1) {
				for (var i=0;i<this.clickPos.touches.length;i++) {
					
					with (this.context) {
						globalAlpha=0.5;
						beginPath();
						fillStyle = this.colors.accent;
						strokeStyle = this.colors.border;
						lineWidth = this.lineWidth;
						arc(this.clickPos.touches[i].x, this.clickPos.touches[i].y, this.nodeSize, 0, Math.PI*2, true);					
						fill();
						//	stroke();
						closePath();
						globalAlpha=0.3;
						beginPath();
						fillStyle = this.rainbow[i];
						strokeStyle = this.colors.border;
						lineWidth = this.lineWidth;
						arc(this.clickPos.touches[i].x, this.clickPos.touches[i].y, this.nodeSize, 0, Math.PI*2, true);					
						fill();
						//	stroke();
						closePath(); 
						globalAlpha=1;
					}

				}
			}
			else {
				fillStyle = this.colors.border;
				font = "14px courier";
				textAlign = "center";
				
				fillText(this.text, this.width/2, this.height/2);
			}
		}
	}
	this.drawLabel();
}

multitouch.prototype.click = function() {
	this.draw();
	this.sendit();
}

multitouch.prototype.move = function() {
	if (this.clicked) {
		this.draw();
		this.sendit();
	}
}

multitouch.prototype.release = function() {

	if(!this.clicked) {
		this.clickPos.touches = new Array();
		for (var i=0;i<5;i++) {
			this.val["touch"+i] = {
				x: 0,
				y: 0
			}
		}
		this.transmit(this.val);
	}
	
	this.draw();
	this.sendit();
	
}

multitouch.prototype.sendit = function() {
	this.val = new Object();
	for (var i=0;i<this.clickPos.touches.length;i++) {
		this.val["touch"+i] = {
			x: this.clickPos.touches[i].x/this.canvas.width,
			y: math.invert(this.clickPos.touches[i].y/this.canvas.height)
		}
	}
	this.transmit(this.val);
}
},{"../core/widget":55,"../utils/drawing":57,"../utils/math":58,"util":51}],77:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class number      
	Number box
	```html
	<canvas nx="number"></canvas>
	```
	<canvas nx="number" style="margin-left:25px"></canvas>
*/

var number = module.exports = function (target) {
	this.defaultSize = { width: 50, height: 20 };
	widget.call(this, target);
	
	/** @property {object}  val    
		| &nbsp; | data
		| --- | ---
		| *value* | Number value
		
		```js
			// Sets number1.val.value to 20
			number1.set({
				value: 20
			})
		```
	*/
	this.val = {
		value: 0
	}

	/** @property {integer}  decimalPlaces   How many decimal places on the number. This applies to both the output and the interface text. Default is 2. To achieve an int (non-float), set decimalPlaces to 0.

		```js
			// Turns number into an int counter
			number1.decimalPlaces = 0;
		```

	*/ 
	this.decimalPlaces = 2;
	this.lostdata = 0;
	this.actual = 0;
	this.init();
}
util.inherits(number, widget);

number.prototype.init = function() {
	this.draw();
}

number.prototype.draw = function() {
	this.erase();
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		fillStyle = this.colors.black;
		textAlign = "left";
		font = this.height*.6+"px courier";
		textBaseline = 'middle';
		fillText(this.val.value, this.width/10, this.height/2);
	}
}

number.prototype.move = function(e) {
	if (this.clicked) {
		this.val.value += (this.deltaMove.x*.02);
		this.val.value += (this.deltaMove.y*-.1);
		this.val.value += this.lostdata;
		this.actual = this.val.value;
		this.val.value = math.prune(this.val.value,this.decimalPlaces);
		this.lostdata = this.actual - this.val.value;
		this.draw();
		this.transmit(this.val);
	}
}
},{"../core/widget":55,"../utils/math":58,"util":51}],78:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class position      
	Two-dimensional touch slider.
	```html
	<canvas nx="position"></canvas>
	```
	<canvas nx="position" style="margin-left:25px"></canvas>
*/

var position = module.exports = function (target) {
	this.defaultSize = { width: 150, height: 100 };
	widget.call(this, target);
	
	/** @property {integer} nodeSize Size of touch node graphic. */
	this.nodeSize = 15;

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *x* | x position of slider (float 0-1)
		| *y* | y position of slider (float 0-1)
	*/
	this.val = {
		x: 0.5,
		y: 0.5
	}
	
	this.init();
}
util.inherits(position, widget);

position.prototype.init = function() {
	this.nodeSize = Math.min(this.height,this.width)/10;
	this.actualWid = this.width - this.nodeSize*2;
	this.actualHgt = this.height - this.nodeSize*2;
	this.draw();
}

position.prototype.draw = function() {
	this.erase();
	with (this.context) {

		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);

		var drawingX = this.val.x * this.actualWid + this.nodeSize
		var drawingY = math.invert(this.val.y) * this.actualHgt + this.nodeSize

		//stay within right/left bounds
		if (drawingX<(this.nodeSize)) {
			drawingX = this.nodeSize;
		} else if (drawingX>(this.width-this.nodeSize)) {
			drawingX = this.width - this.nodeSize;
		}
		//stay within top/bottom bounds
		if (drawingY<(this.nodeSize)) {
			drawingY = this.nodeSize;
		} else if (drawingY>(this.height-this.nodeSize)) {
			drawingY = this.height - this.nodeSize;
		}
	
		with (this.context) {
			beginPath();
			strokeStyle = this.colors.accent;
			lineWidth = 5;
			moveTo(0,this.height);
			lineTo(this.val.x*this.width,this.height);
			moveTo(0,this.height);
			lineTo(0,math.invert(this.val.y)*this.height);					
			stroke();
			closePath();
			beginPath();
			fillStyle = this.colors.accent;
			arc(drawingX, drawingY, this.nodeSize, 0, Math.PI*2, true);					
			fill();
			closePath();
		}
	}
	
	this.drawLabel();
}

position.prototype.scaleNode = function() {
	var actualX = this.val.x - this.nodeSize;
	var actualY = this.val.y - this.nodeSize;
	var clippedX = math.clip(actualX/this.actualWid, 0, 1);
	var clippedY = math.clip(actualY/this.actualHgt, 0, 1);
	this.val.x = math.prune(clippedX, 3)
	this.val.y = math.prune(clippedY, 3)
	this.val.y = math.invert(this.val.y);
}

position.prototype.click = function() {
	this.val.x = this.clickPos.x;
	this.val.y = this.clickPos.y;
	this.scaleNode();
	this.val["state"] = "click"
	this.transmit(this.val);
	this.draw();
}

position.prototype.move = function() {
	if (this.clicked) {
		this.val.x = this.clickPos.x;
		this.val.y = this.clickPos.y;
		this.scaleNode();
		this.val["state"] = "move"
		this.transmit(this.val);
		this.draw();
	}
}

position.prototype.release = function() {
	this.val.x = this.clickPos.x;
	this.val.y = this.clickPos.y;
	this.scaleNode();
	this.val["state"] = "release"
	this.transmit(this.val);
	this.draw();
	
}


/** @method animate
	Adds animation to the widget.
	@param {string} [type] Type of animation. Currently accepts "none" or "bounce", in which case the touch node can be tossed and bounces.
*/
position.prototype.animate = function(aniType) {
	
	switch (aniType) {
		case "bounce":
			nx.aniItems.push(this.aniBounce.bind(this));
			break;
		case "none":
			nx.aniItems.splice(nx.aniItems.indexOf(this.aniBounce));
			break;
	}
	
}

position.prototype.aniBounce = function() {
	if (!this.clicked && this.val.x) {
		this.val.x += (this.deltaMove.x/2)/this.width;
		this.val.y += (this.deltaMove.y/2)/this.height;
		this.val["state"] = "animated";
		if (math.bounce(this.val.x, 0, 1, this.deltaMove.x) != this.deltaMove.x) {
			this.deltaMove.x = math.bounce(this.val.x, 0, 1, this.deltaMove.x);
			this.val["state"] = "bounce";
		}
		if (math.bounce(this.val.y, 0, 1, this.deltaMove.y) != this.deltaMove.y) {
			this.deltaMove.y = math.bounce(this.val.y, 0, 1, this.deltaMove.y);
			this.val["state"] = "bounce";
		}
		this.transmit(this.val);
		this.draw();
	}
}

position.prototype.customDestroy = function() {
	nx.removeAni(this.aniBounce);
}
},{"../core/widget":55,"../utils/math":58,"util":51}],79:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');
var math = require('../utils/math')

/** 
	@class range      
	Range slider
	```html
	<canvas nx="range"></canvas>
	```
	<canvas nx="range" style="margin-left:25px"></canvas>
*/

var range = module.exports = function (target) {
	this.defaultSize = { width: 100, height: 30 };
	widget.call(this, target);

	/** @property {object}  val  Object containing core interactive aspects of widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *start* | Range start value (float 0-1)
		| *stop* | Range end value (float 0-1)
		| *size* | Distance between ends (float 0-1)
	*/
	this.val = {
		start: 0.3,
		stop: 0.7,
		size: 0.4
	}


	// handling horiz possibility
	/** @property {boolean}  hslider  Whether or not the slider is a horizontal slider. Default is false, but set automatically to true if the slider is wider than it is tall. */  
	this.hslider = false;
	this.handle;
	this.relhandle;
	this.cap;
	this.firsttouch = "start";

	/** @property {string}  mode  Mode of interaction. "edge" mode lets you drag each edge of the range individually. "area" mode (default) lets you drag the range as a whole (with parallel mouse movement) or scale the range as a whole (with transverse mouse movement) */
	this.mode = "area" // modes: "edge", "area"
	this.touchdown = new Object();
	this.init();
}
util.inherits(range, widget);

range.prototype.init = function() {

	//decide if hslider or vslider
	if (this.height>=this.width) {
		this.hslider = false;
	} else {
		this.hslider = true;
	}

	if (this.canvas.getAttribute("label")!=null) {
		this.label = this.canvas.getAttribute("label");
	}

	this.draw();
}

range.prototype.draw = function() {
	this.erase();
		
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		
		fillStyle = this.colors.accent;
	
		if (!this.hslider) {

			var x1 = 0;
			var y1 = this.height-this.val.stop*this.height;
			var x2 = this.width;
			var y2 = this.height-this.val.start*this.height;

			fillRect(x1,y1,x2-x1,y2-y1);
			
			if (nx.showLabels) {

				save();
	 			translate(this.width/2, 0);
				rotate(Math.PI/2);
				textAlign = "left";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, 0);
				globalAlpha = 1;
				restore();
			
			}
		} else {

			var x1 = this.val.start*this.width;
			var y1 = 0;
			var x2 = this.val.stop*this.width;
			var y2 = this.height;
		   
			fillRect(x1,y1,x2-x1,y2-y1);
			
			
			if (nx.showLabels) {

				textAlign = "center";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, this.height/2);
				globalAlpha = 1;
			
			}
		}
	}
}

range.prototype.click = function() {
	if (this.mode=="edge") {
		if (this.hslider) {
			if (Math.abs(this.clickPos.x-this.val.start*this.width) < Math.abs(this.clickPos.x-this.val.stop*this.width)) {
				this.firsttouch = "start"
			} else {
				this.firsttouch = "stop"
			}
		} else {
			if (Math.abs(Math.abs(this.clickPos.y-this.height)-this.val.start*this.height) < Math.abs(Math.abs(this.clickPos.y-this.height)-this.val.stop*this.height)) {
				this.firsttouch = "start"
			} else {
				this.firsttouch = "stop"
			}
		}
	} else if (this.mode=="area") {
		this.touchdown = {
			x: this.clickPos.x,
			y: this.clickPos.y
		}
		this.startval = new Object();
		this.startval.size = this.val.stop - this.val.start;
		this.startval.loc = this.val.start + this.startval.size/2;
	}
	this.move();
}

range.prototype.move = function() {

	if (this.mode=="edge") {
		if (this.hslider) {
			if (this.firsttouch=="start") {
				this.val.start = this.clickPos.x/this.width;
				if (this.clickPos.touches.length>1) {
					this.val.stop = this.clickPos.touches[1].x/this.width;
				}
			} else {
				this.val.stop = this.clickPos.x/this.width;
				if (this.clickPos.touches.length>1) {
					this.val.start = this.clickPos.touches[1].x/this.width;
				}
			}
		} else {
			if (this.firsttouch=="start") {
				this.val.start = math.invert(this.clickPos.y/this.height);
				if (this.clickPos.touches.length>1) {
					this.val.stop = math.invert(this.clickPos.touches[1].y/this.height);
				}
			} else {
				this.val.stop = math.invert(this.clickPos.y/this.height);
				if (this.clickPos.touches.length>1) {
					this.val.start = math.invert(this.clickPos.touches[1].y/this.height);
				}
			}
		}

		if (this.val.stop < this.val.start) {
			this.tempstart = this.val.start;
			this.val.start = this.val.stop;
			this.val.stop = this.tempstart;
			if (this.firsttouch=="start") {
				this.firsttouch = "stop";
			} else {
				this.firsttouch = "start";
			}
		} 
		this.val = {
			start: math.clip(this.val.start, 0, 1),
			stop: math.clip(this.val.stop, 0, 1),
		} 
		this.val['size'] = math.prune(math.clip(Math.abs(this.val.stop - this.val.start), 0, 1), 3)
	
		this.draw();

		this.transmit(this.val);

	} else if (this.mode=="area") {

		if (this.hslider) {
			var moveloc = this.clickPos.x/this.width;
			var movesize = (this.touchdown.y - this.clickPos.y)/this.height;
		} else {
			var moveloc = this.clickPos.y/this.height;
			var movesize = (this.touchdown.x - this.clickPos.x)/this.width;
			moveloc *= -1;
			movesize *= -1;
		}
		movesize /= 3;
		var size = this.startval.size + movesize;
		size = math.clip(size,0.001,1);

		this.val = {
			start: moveloc - size/2,
			stop: moveloc + size/2
		}

		this.val.start = math.clip(this.val.start,0,1);
		this.val.stop = math.clip(this.val.stop,0,1);

		this.draw();

		this.transmit(this.val);

	}
}
},{"../core/widget":55,"../utils/math":58,"util":51}],80:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class remix (alpha)     
	
	```html
	<canvas nx="remix"></canvas>
	```
	<canvas nx="remix" style="margin-left:25px"></canvas>
*/

var remix = module.exports = function(target) {
	
	this.defaultSize = { width: 400, height: 150 };
	widget.call(this, target);
	
	//define unique attributes
	this.maxLength = 2000;
	this.components = new Array();
	this.buffer = new Array();
	this.moment = 0;
	this.val = {
		x: 0.15,
		y: 0.5
	}
	this.rate = 1;
	this.start = 0;
	this.end = 1;
	this.size = 0;
	this.looping = false;
	this.boundLog = this.log.bind(this)
	this.init();

	this.boundAdv = this.advance.bind(this);
	nx.aniItems.push(this.boundAdv)

}

util.inherits(remix, widget);


remix.prototype.init = function() {
	this.draw();
}
	
	//sets a new component to be recorded
remix.prototype.connect = function(target) {
	var compIndex = this.components.length;
	this.components.push(target);
	target.tapeNum = compIndex;
	target.isRecording = true;
	target.recorder = this;
	this.buffer[compIndex] = new Object();
	for (var key in target.val) {
		this.buffer[compIndex][key] = new Array();
	}
	
}
	
	//the actual recording function
remix.prototype.write = function(index, val) {
	if (this.moment>=this.maxLength) {
		this.stop();
	}
	for (var key in val) {
		if (this.buffer[index][key]) {
			this.buffer[index][key][this.moment] = val[key];
		}
	}
	this.draw();
}
	

remix.prototype.draw = function() {

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height)
	}

	if (this.moment>= 0) {
		var nodeWid = this.width / this.moment
	} else {
		var nodeWid = this.width;
	}
	var nodeDrawWid = 5;
	
	var nodeX = this.moment*nodeWid+this.lineWidth/2;
	var nodeY;
	
	if (!this.recording) {
		with (this.context) {
			strokeStyle = this.colors.accent;
			lineWidth = 1;
			
			for (var i=0;i<this.buffer.length;i++) {
				for (var key in this.buffer[i]) {
					for (var j=0;j<this.buffer[i][key].length;j++) {
						pnodeX = (j-1)*nodeWid;
						pnodeY = Math.abs(this.buffer[i][key][j-1]-1)*(this.height);

						nodeX = j*nodeWid;
						nodeY = Math.abs(this.buffer[i][key][j]-1)*(this.height);
						
						beginPath()
							moveTo(pnodeX,pnodeY)
							lineTo(nodeX,nodeY)
							stroke()
						closePath();
						
					}
				}
				
			}
		}
	} else {

		with (this.context) {
			font = "bold "+this.height/3+"px gill sans";
			textAlign = "center";
			textBaseline = "middle"
			fillStyle = "#F00"
			fillText("rec",this.width/2,this.height/2);
		}
	}
}

remix.prototype.record = function() {
	this.moment = 0;
	nx.aniItems.push(this.boundLog)
	this.recording = true;
}

remix.prototype.log = function() {
	for (var i=0;i<this.components.length;i++) {
		var sender = this.components[i];
		this.write(this.components[i].tapeNum,this.components[i].val);
	}
	this.moment++;
}

remix.prototype.stop = function() {
	nx.removeAni(this.boundLog);
	this.size = this.moment;
	this.recording = false;
	this.draw();
}

remix.prototype.scan = function(x) {
	this.needle = x * this.size;
	this.needle = nx.clip(this.needle,0,this.size-1)
	if (this.needle) {
		for (var i=0;i<this.components.length;i++) {
			var sender = this.components[i];
			for (var key in this.buffer[sender.tapeNum]) {
				if (this.buffer[sender.tapeNum][key]) {
					var val = new Object();
					var max = this.buffer[sender.tapeNum][key][~~this.needle+1] ? this.buffer[sender.tapeNum][key][~~this.needle+1] : this.buffer[sender.tapeNum][key][~~this.needle]
					val[key] = nx.interp(this.needle - ~~this.needle, this.buffer[sender.tapeNum][key][~~this.needle], max)
					sender.set(val, true)
				}
			}
		}
	}
}

remix.prototype.play = function(rate,start,end) {
	rate ? this.rate = rate : null;
	if (start) {
		this.needle = start * this.size;
		this.start = start;
	} else {
		this.needle = 0;
		this.start = 0;
	} 
	end ? this.end = end : this.end = 1
	this.playing = true;
}

remix.prototype.loop = function() {
	
}

remix.prototype.advance = function() {
	if (this.playing) {
		this.needle += this.rate;
		if (this.needle/this.size < this.end) {
			this.scan(this.needle/this.size);
		} else if (this.looping) {
			this.needle = this.start;
		} else {
			this.playing = false;
		}
	}
}
	

remix.prototype.click = function(e) {
	if (this.size) {
		this.scan(this.clickPos.x/this.width)
	}
}


remix.prototype.move = function(e) {
	if (this.size) {
		this.scan(this.clickPos.x/this.width)
	}
}
},{"../core/widget":55,"../utils/math":58,"util":51}],81:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class select    
	HTML-style option selector. Outputs the chosen text string. <br> **Note:** Currently the canvas is actaully replaced by an HTML select object. Any inline style on your canvas may be lost in this transformation. To style the resultant select element, we recommend creating CSS styles for the select object using its ID or the select tag.
	```html
	<canvas nx="select" choices="sine,saw,square"></canvas>
	```
	<canvas nx="select" choices="sine,saw,square"></canvas>
*/

var select = module.exports = function (target) {
	this.defaultSize = { width: 200, height: 30 };
	widget.call(this, target);
	
	/** @property {array} choices Desired choices, as an array of strings. Can be initialized with a "choices" HTML attribute of comma-separated text (see example above). 
	```js
	select1.choices = ["PartA", "PartB", "GoNuts"]
	select1.init()
	```
	*/
	this.choices = [ ];

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *value* | Text string of option chosen
	*/
	this.val = new Object();
}
util.inherits(select, widget);

select.prototype.init = function() {
	
	this.canvas.ontouchstart = null;
	this.canvas.ontouchmove = null;
	this.canvas.ontouchend = null;
	
	if (this.canvas.getAttribute("choices")) {
		this.choices = this.canvas.getAttribute("choices");
		this.choices = this.choices.split(",");
	}

	var htmlstr = '<select id="'+this.canvasID+'" style="height:'+this.height+'px;width:'+this.width+'px;font-size:'+this.height/2+'px;" onchange="'+this.canvasID+'.change(this)"></select><canvas height="1px" width="1px" style="display:none"></canvas>'                   
	var canv = this.canvas
	var cstyle = this.canvas.style
	console.log(cstyle)
	var parent = canv.parentNode;
	var newdiv = document.createElement("span");
	newdiv.innerHTML = htmlstr;
	parent.replaceChild(newdiv,canv)
	this.sel = document.getElementById(this.canvasID)
	this.sel.style.float = "left"
	this.sel.style.display = "block"
	for (var prop in cstyle)
    	this.sel.style[prop] = cstyle[prop];


	this.canvas = document.getElementById(this.canvasID);
	
	for (var i=0;i<this.choices.length;i++) {
		var option=document.createElement("option");
		option.text = this.choices[i];
		option.value = this.choices[i];
		this.canvas.add(option,null);
	}
	
}

// should have a modified "set" function
select.prototype.change = function(thisselect) {
	this.val.text = thisselect.value;
	this.transmit(this.val);
}
},{"../core/widget":55,"util":51}],82:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class slider      
	Slider (vertical or horizontal)
	```html
	<canvas nx="slider"></canvas>
	```
	<canvas nx="slider" style="margin-left:25px"></canvas>
*/

var slider = module.exports = function (target) {
	this.defaultSize = { width: 30, height: 100 };
	widget.call(this, target);

	/** @property {object}  val   
		| &nbsp; | data
		| --- | ---
		| *value* | Slider value (float 0-1)
	*/
	this.val.value = 0.7

	/** @property {string}  mode   Set "absolute" or "relative" mode. In absolute mode, slider will jump to click/touch position. In relative mode, it will not.
	```js
	nx.onload = function() {
	&nbsp; // Slider will not jump to touch position.
	&nbsp; slider1.mode = "relative" 
	}
	```
	*/
	this.mode = "absolute";

	/** @property {boolean}  hslider   Whether or not the slider should be horizontal. This is set to true automatically if the canvas is wider than it is tall. To override the default decision, set this property to true to create a horizontal slider, or false to create a vertical slider.
	
	```js
	nx.onload = function() {
	&nbsp; //forces horizontal slider 
	&nbsp; slider1.hslider = true
	&nbsp; slider1.draw();
	&nbsp; //forces vertical slider 
	&nbsp; slider2.hslider = false
	&nbsp; slider2.draw();
	}
	```
	*/
	this.hslider = false;
	this.handle;
	this.relhandle;
	this.cap;
	this.init();
}
util.inherits(slider, widget);

slider.prototype.init = function() {

	//decide if hslider or vslider
	if (this.height>=this.width) {
		this.hslider = false;
	} else {
		this.hslider = true;
	}

	if (this.canvas.getAttribute("label")!=null) {
		this.label = this.canvas.getAttribute("label");
	}

	this.draw();
}

slider.prototype.draw = function() {
	
	this.erase();
		
	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);
		
		fillStyle = this.colors.accent;
	
		if (!this.hslider) {

			var x1 = 0;
			var y1 = this.height-this.val.value*this.height;
			var x2 = this.width;
			var y2 = this.height;

			if (this.val.value>0.01) {
				fillRect(x1,y1,x2-x1,y2-y1);
			}
			
			if (nx.showLabels) {

				save();
	 			translate(this.width/2, 0);
				rotate(Math.PI/2);
				textAlign = "left";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, 0);
				globalAlpha = 1;
				restore();
			
			}
		} else {

			var x1 = 0;
			var y1 = 0;
			var x2 = this.val.value*this.width;
			var y2 = this.height;
		   
			if (this.val.value>0.01) {
				fillRect(x1,y1,x2-x1,y2-y1);
			}
			
			if (nx.showLabels) {
				textAlign = "center";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, this.height/2);
				globalAlpha = 1;
			
			}
		}
	}
}

slider.prototype.click = function() {
	this.move();
}

slider.prototype.move = function() {
	if (this.hslider) {
		this.handle = this.clickPos.x;
		this.relhandle = this.deltaMove.x;
		this.cap = this.width;
	} else {
		this.handle = this.clickPos.y;
		this.relhandle = this.deltaMove.y*-1;
		this.cap = this.height
	}

	if (this.mode=="absolute") {
		if (this.clicked) {
			if (!this.hslider) {
				this.val.value = math.prune((Math.abs((math.clip(this.clickPos.y/this.height, 0, 1)) - 1)),3);
			} else {	
				this.val.value = math.prune(math.clip(this.clickPos.x/this.width, 0, 1),3);
			}
			this.draw();
		}
	} else if (this.mode=="relative") {
		if (this.clicked) {
			if (!this.hslider) {
				this.val.value = math.clip((this.val.value + ((this.deltaMove.y*-1)/this.height)),0,1);
			} else {
				this.val.value = math.clip((this.val.value + ((this.deltaMove.x)/this.width)),0,1);
			}
			this.draw();
		}
	}
	this.transmit(this.val);
}
},{"../core/widget":55,"../utils/math":58,"util":51}],83:[function(require,module,exports){
var util = require('util');
var widget = require('../core/widget');

/** 
	@class string      
	Animated model of a plucked string interface.
	```html
	<canvas nx="string"></canvas>
	```
	<canvas nx="string" style="margin-left:25px"></canvas>
*/

var string = module.exports = function (target) {
	this.defaultSize = { width: 150, height: 75 };
	widget.call(this, target);
	
	/** @property {object}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *string* | Index of the string that is plucked (starts at 0)
		| *x* | Where on the string the pluck occured (float 0-1);
	*/
	this.val = {
		string: 0,
		x: 0
	}
	/** @property {integer}  numberOfStrings How many strings in the widget. We recommend setting this property with .setStrings() */
	this.numberOfStrings = 10;
	this.strings = new Array();
	this.abovestring = new Array();
	/** @property {integer}  friction  How quickly the string slows down */
	this.friction = 1;
	
	var stringdiv;

	this.init();

	nx.aniItems.push(this.draw.bind(this));
}
util.inherits(string, widget);

string.prototype.init = function() {
	stringdiv = this.height/(this.numberOfStrings + 1);
	for (var i=0;i<this.numberOfStrings;i++) {
		this.strings[i] = {
			x1: this.lineWidth,
			y1: stringdiv*(1+i),
			x2: this.width - this.lineWidth,
			y2: stringdiv*(i+1),
			held: false, // whether or not it's gripped
			vibrating: false, // whether or not its vibrating
			force: 0, // amount of force of pull on string
			maxstretch: 0, // vibration cap (in Y domain)
			stretch: 0, // current point vibrating in y domain
			direction: 0, // which direction it's vibrating
			above: false // is mouse above or below string
		};
	}
	this.draw();
}

string.prototype.pulse = function() {
	this.draw();
}

/* @method setStrings Sets how many strings are in the widget.
	```js
	string1.setStrings(20);
	``` 
	*/
string.prototype.setStrings = function(val) {
	this.numberOfStrings = val;
	this.strings = new Array();
	this.init();
}

string.prototype.draw = function() {
	this.erase();
	this.makeRoundedBG();
	with (this.context) {
		strokeStyle = this.colors.border;
		fillStyle = this.colors.fill;
		lineWidth = this.lineWidth;
	//	stroke();
		fill();
		
		strokeStyle = this.colors.accent;

		for (var i = 0;i<this.strings.length;i++) {

			var st = this.strings[i];

			if (st.vibrating) {
				if (st.maxstretch < 0) {
					st.vibrating = false;
					st.held = false;
				}
				st.stretch = st.stretch + st.direction;
				
				if (Math.abs(st.stretch) > st.maxstretch) {
					//st.direction *= (-0.99);
					st.direction *= -1;
					st.stretch = st.stretch + st.direction;
					st.maxstretch = st.maxstretch - this.friction;

					st.direction = (st.direction / Math.abs(st.direction)) * (st.maxstretch/1)
				}

				beginPath();
				moveTo(st.x1, st.y1);
				quadraticCurveTo(this.width/2, st.y1+st.stretch, st.x2, st.y2);
				stroke();
				closePath();
				st.on = true;


			} else if (st.held) {
					//will draw rounded
					//if mouse is higher than string and gripup
					//or if mouse is 
					//	if (this.clickPos.y-st.y1<0 && st.gripup || this.clickPos.y-st.y1>0 && !st.gripup) {
					beginPath();
					moveTo(st.x1, st.y1);
					quadraticCurveTo(this.clickPos.x, this.clickPos.y, st.x2, st.y2);
					stroke();
					closePath();
					st.on = true;	
					/*	} else {
					beginPath();
					moveTo(st.x1, st.y1);
					lineTo(st.x2, st.y2);
					stroke();
					closePath();
				} */
			} else {
				beginPath();
				moveTo(st.x1, st.y1);
				lineTo(st.x2, st.y2);
				stroke();
				closePath();
				if (st.on) {
					st.on = false;
				}
			}
		}
	}
	this.drawLabel();
}

string.prototype.click = function() {
	for (var i = 0;i<this.numberOfStrings;i++) {
		this.strings[i].above = (this.clickPos.y<this.strings[i].y1);
	}
	this.draw();
}

string.prototype.move = function() {
	if (this.clicked) {
		for (var i = 0;i<this.strings.length;i++) {

			//if crosses string
			if (this.strings[i].above != (this.clickPos.y<this.strings[i].y1) ) {
				this.strings[i].held = true;
				this.strings[i].above ^= true;
			}

			if (this.strings[i].held && Math.abs(this.clickPos.y - this.strings[i].y1) > this.height/(this.strings.length*3)) {

				this.pluck(i)
				
			}
		}
	}
}

string.prototype.release = function() {
	for (var i = 0;i<this.strings.length;i++) {
		if (this.strings[i].held) {
			this.pluck(i);
		}
	}	
}

string.prototype.pluck = function(which) {
	var i = which;
	this.val = {
		string: i,
		x: this.clickPos.x/this.width
	}
	this.transmit(this.val);
	this.strings[i].held = false;
	this.strings[i].force = this.clickPos.y - this.strings[i].y1;
	this.strings[i].maxstretch = Math.abs(this.clickPos.y - this.strings[i].y1);
	this.strings[i].stretch = this.clickPos.y - this.strings[i].y1;
	this.strings[i].vibrating = true;
	this.strings[i].direction = (this.clickPos.y - this.strings[i].y1)/Math.abs(this.clickPos.y - this.strings[i].y1) * ((this.clickPos.y - this.strings[i].y1)/-1.2);
}

string.prototype.customDestroy = function() {
	nx.removeAni(this.draw.bind(this));
}
},{"../core/widget":55,"util":51}],84:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class tabs   
	
	```html
	<canvas nx="tabs"></canvas>
	```
	<canvas nx="tabs" style="margin-left:25px"></canvas>
*/

var tabs = module.exports = function(target) {
	
	this.defaultSize = { width: 150, height: 50 };
	widget.call(this, target);
	
	//define unique attributes
	this.choice = 0;
	this.val = {
		index: 0,
		text: ""
	}
	this.tabwid = 0;
	this.options = ["one", "two", "three"]
	//init
	this.init();

}

util.inherits(tabs, widget);


tabs.prototype.init = function() {
	this.draw();
}


tabs.prototype.draw = function() {

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height)

		textAlign = "center"
		textBaseline = "middle"
		font = "normal "+this.height/5+"px courier"
	}

	this.tabwid = this.width/this.options.length

	for (var i=0;i<this.options.length;i++) {
		if (i==this.choice) {
			var tabcol = this.colors.accent;
			var textcol = this.colors.white;
		} else {
			var tabcol = this.colors.fill;
			var textcol = this.colors.black;
		}
		with (this.context) {
			fillStyle=tabcol;
			fillRect(this.tabwid*i,0,this.tabwid,this.height)
			if (i!=this.options.length-1) {
				beginPath();
				moveTo(this.tabwid*(i+1),0)
				lineTo(this.tabwid*(i+1),this.height)
				lineWidth = 1;
				strokeStyle = this.colors.border
				stroke()
				closePath()
			}
			fillStyle=textcol;
			fillText(this.options[i],this.tabwid*i+this.tabwid/2,this.height/2)
		}
		
	}
}


tabs.prototype.click = function() {
	this.choice = ~~(this.clickPos.x / this.tabwid);
	this.val = {
		index: this.choice,
		text: this.options[this.choice]
	}
	this.transmit(this.val)
	this.draw();
}
},{"../core/widget":55,"../utils/math":58,"util":51}],85:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class tilt      
	Mobile and Mac/Chrome-compatible tilt sensor. May not work on all devices! <br> **Notes:** Clicking on this widget toggles it inactive or active. <br>
	We recommend not calling .init() on this object after the original initialization, because it will add additional redundant tilt listeners to your document.
	```html
	<canvas nx="tilt"></canvas>
	```
	<canvas nx="tilt" style="margin-left:25px"></canvas>
*/

var tilt = module.exports = function (target) {
	this.defaultSize = { width: 50, height: 50 };
	widget.call(this, target);
	
	this.tiltLR;
	this.tiltFB;
	this.z;
	/** @property {boolean} active Whether or not the tilt widget is on (animating and transmitting data). */
	this.active = true;

	/** @property {object}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *x* | X-axis rotation if supported (-1 to 1)
		| *y* | Y-axis rotation if supported (-1 to 1)
		| *z* | Z-axis rotation if supported (-1 to 1 or possibly 0 to 360 depending on device)
	*/
	this.val = {
		x: 0,
		y: 0,
		z: 0
	}

	/** @property {string}  text   Text shown on tilt object
	*/
	
	this.text = "TILT";
	this.init();

	this.boundChromeTilt = this.chromeTilt.bind(this)
	this.boundMozTilt = this.mozTilt.bind(this)

	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', this.boundChromeTilt, false);
	} else if (window.OrientationEvent) {
	  	window.addEventListener('MozOrientation', this.boundMozTilt, false);
	} else {
	  	console.log("Not supported on your device or browser.")
	}
	
}
util.inherits(tilt, widget);

tilt.prototype.deviceOrientationHandler = function() {
	
	this.val = {
		x: math.prune(this.tiltLR/90,3),
		y: math.prune(this.tiltFB/90,3),
		z: math.prune(this.z,3)
	}

	if (this.active) {
		this.transmit(this.val);
	}
	
}

tilt.prototype.chromeTilt = function(eventData) {
    this.tiltLR = eventData.gamma;
		this.tiltFB = eventData.beta;
		this.z = eventData.alpha
    this.deviceOrientationHandler();
    this.draw();
}

tilt.prototype.mozTilt = function(eventData) {
    this.tiltLR = eventData.x * 90;
    // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
    // We also need to invert the value so tilting the device towards us (forward) 
    // results in a positive value. 
    this.tiltFB = eventData.y * -90;
    this.z = eventData.z;
    this.deviceOrientationHandler();
    this.draw();
}

tilt.prototype.init = function() {
	this.draw();
}

tilt.prototype.draw = function() {
	
	this.erase();

	with (this.context) {
		fillStyle = this.colors.fill;
	    fillRect(0,0,this.width,this.height);

		save(); 
		translate(this.width/2,this.height/2)
		rotate(-this.val.x*Math.PI/2);
		translate(-this.width/2,-this.height/2)
	    globalAlpha = 0.4;

	    if (this.active) {
	    	fillStyle = this.colors.accent;
	    } else {
	    	fillStyle = this.colors.border;
	    }

		fillRect(-this.width,this.height*(this.val.y/2)+this.height/2,this.width*3,this.height*2)
		font = "bold "+this.height/5+"px gill sans";
		textAlign = "center";
		fillText(this.text, this.width/2, this.height*(this.val.y/2)+this.height/2+this.height/15);
		globalAlpha = 1;
		restore();
	}
	this.drawLabel();
}

tilt.prototype.click = function() {
	this.active = !this.active;
}

tilt.prototype.customDestroy = function() {
	this.active = false;
	window.removeEventListener("deviceorientation",this.boundChromeTilt,false);
	window.removeEventListener("mozOrientation",this.boundMozTilt,false);
}
},{"../core/widget":55,"../utils/math":58,"util":51}],86:[function(require,module,exports){
var drawing = require('../utils/drawing');
var util = require('util');
var widget = require('../core/widget');

/** 
	@class toggle      
	On/off toggle
	```html
	<canvas nx="toggle"></canvas>
	```
	<canvas nx="toggle" style="margin-left:25px"></canvas>
*/

var toggle = module.exports = function (target) {
	this.defaultSize = { width: 50, height: 50 };
	widget.call(this, target);
	
	this.mindim = this.height>this.width ? this.width : this.height;

	/** @property {object}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *value*| 1 if on, 0 if off
	*/
	this.val = {
		value: 0
	}
	this.init();
}
util.inherits(toggle, widget);

toggle.prototype.init = function() {
	this.fontsize = this.mindim/4;
	this.draw();
}

toggle.prototype.draw = function() {
	
	this.erase()

	with (this.context) {
		if (this.val.value) {
			fillStyle = this.colors.accent;
		} else {
			fillStyle = this.colors.fill;
		}
		fillRect(0,0,this.width,this.height);
		font = "bold "+this.fontsize+"px gill sans"
		textAlign = "center"
		if (this.val.value) {
			fillStyle = this.colors.white
			fillText("on", this.width/2, this.height/2 + this.fontsize/3.5 );	
		} else {
			globalAlpha = 0.6;
			fillStyle = this.colors.black
			fillText("off", this.width/2, this.height/2 + this.fontsize/3.5 );
			globalAlpha = 1;
		}
	}

	this.drawLabel();
	
}

toggle.prototype.click = function() {
	if (!this.val.value) {
		this.val.value = 1;
	} else {
		this.val.value = 0;
	}
	this.draw();
	this.transmit(this.val);
}
},{"../core/widget":55,"../utils/drawing":57,"util":51}],87:[function(require,module,exports){
var drawing = require('../utils/drawing');
var util = require('util');
var widget = require('../core/widget');

/** 
	@class typewriter      
	Computer keyboard listener and visualization. (Desktop only) <br> **Note:** Clicking on the widget toggles it inactive or active, which can be useful if you need to temporarily type without triggering the widget's events.
	```html
	<canvas nx="typewriter"></canvas>
	```
	<canvas nx="typewriter" style="margin-left:25px"></canvas>
*/

var typewriter = module.exports = function (target) {
	this.defaultSize = { width: 175, height: 75 };
	widget.call(this, target);

	
	this.letter = ""
	this.keywid = this.width/14.5;
	this.keyhgt = this.height/5

	/** @property {boolean}  active  Whether or not the widget is on (listening for events and transmitting values).*/ 
	this.active = true;

	/** @property {object}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *key* | symbol of key pressed (example: "a")
		| *ascii* | ascii value of key pressed (example: 48)
		| *on* | 0 if key is being pressed, 1 if key is being released
	*/
	this.val = {
		key: "",
		ascii: 0,
		on: 0
	}

	this.rows = [
		[
			{ symbol: "`", value: 192, width: 1, on: false },
			{ symbol: "1", value: 49, width: 1, on: false  },
			{ symbol: "2", value: 50, width: 1, on: false  },
			{ symbol: "3", value: 51, width: 1, on: false  },
			{ symbol: "4", value: 52, width: 1, on: false  },
			{ symbol: "5", value: 53, width: 1, on: false  },
			{ symbol: "6", value: 54, width: 1, on: false  },
			{ symbol: "7", value: 55, width: 1, on: false  },
			{ symbol: "8", value: 56, width: 1, on: false  },
			{ symbol: "9", value: 57, width: 1, on: false  },
			{ symbol: "0", value: 48, width: 1, on: false  },
			{ symbol: "-", value: 189, width: 1, on: false  },
			{ symbol: "=", value: 187, width: 1, on: false  },
			{ symbol: "delete", value: 46, width: 1.5, on: false  }
		],
		[
			{ symbol: "tab", value: 10, width: 1.5, on: false  },
			{ symbol: "q", value: 81, width: 1, on: false  },
			{ symbol: "w", value: 87, width: 1, on: false  },
			{ symbol: "e", value: 69, width: 1, on: false  },
			{ symbol: "r", value: 82, width: 1, on: false  },
			{ symbol: "t", value: 84, width: 1, on: false  },
			{ symbol: "y", value: 89, width: 1, on: false  },
			{ symbol: "u", value: 85, width: 1, on: false  },
			{ symbol: "i", value: 73, width: 1, on: false  },
			{ symbol: "o", value: 79, width: 1, on: false  },
			{ symbol: "p", value: 80, width: 1, on: false  },
			{ symbol: "[", value: 219, width: 1, on: false  },
			{ symbol: "]", value: 221, width: 1, on: false  },
			{ symbol: "\\", value: 220, width: 1, on: false  }
		],
		[
			{ symbol: "caps", value: 20, width: 1.75, on: false  },
			{ symbol: "a", value: 65, width: 1, on: false  },
			{ symbol: "s", value: 83, width: 1, on: false  },
			{ symbol: "d", value: 68, width: 1, on: false  },
			{ symbol: "f", value: 70, width: 1, on: false  },
			{ symbol: "g", value: 71, width: 1, on: false  },
			{ symbol: "h", value: 72, width: 1, on: false  },
			{ symbol: "j", value: 74, width: 1, on: false  },
			{ symbol: "k", value: 75, width: 1, on: false  },
			{ symbol: "l", value: 76, width: 1, on: false  },
			{ symbol: ";", value: 186, width: 1, on: false  },
			{ symbol: "'", value: 222, width: 1, on: false  },
			{ symbol: "enter", value: 13, width: 1.75, on: false }
		],
		[
			{ symbol: "shift", value: 16, width: 2.25, on: false  },
			{ symbol: "z", value: 90, width: 1, on: false  },
			{ symbol: "x", value: 88, width: 1, on: false  },
			{ symbol: "c", value: 67, width: 1, on: false  },
			{ symbol: "v", value: 86, width: 1, on: false  },
			{ symbol: "b", value: 66, width: 1, on: false  },
			{ symbol: "n", value: 78, width: 1, on: false  },
			{ symbol: "m", value: 77, width: 1, on: false  },
			{ symbol: ",", value: 10, width: 1, on: false  },
			{ symbol: ".", value: 10, width: 1, on: false  },
			{ symbol: "/", value: 10, width: 1, on: false  },
			{ symbol: "shift", value: 16, width: 2.25, on: false }
		],
		[
			{ symbol: "fn", value: 10, width: 1, on: false  },
			{ symbol: "ctrl", value: 17, width: 1, on: false  },
			{ symbol: "opt", value: 10, width: 1, on: false  },
			{ symbol: "cmd", value: 10, width: 1.25, on: false  },
			{ symbol: "space", value: 32, width: 5, on: false  },
			{ symbol: "cmd", value: 10, width: 1, on: false  },
			{ symbol: "opt", value: 10, width: 1, on: false  },
			{ symbol: "<", value: 37, width: .81, on: false  },
			{ symbol: "^", value: 38, width: .81, on: false  },
			{ symbol: "v", value: 39, width: .81, on: false  },
			{ symbol: ">", value: 40, width: .81, on: false  }
		]
	]

	this.boundType = this.type.bind(this);
	this.boundUntype = this.untype.bind(this);
	window.addEventListener("keydown", this.boundType);
	window.addEventListener("keyup", this.boundUntype);

	this.init();
}
util.inherits(typewriter, widget);
	
typewriter.prototype.init = function() {

	this.keywid = this.width/14.5;
	this.keyhgt = this.height/5
	
	this.draw();
}

typewriter.prototype.draw = function() {	// erase
	this.erase();

	if (!this.active) {
		this.context.globalAlpha = 0.4
	} else {
		this.context.globalAlpha = 1
	}

	with (this.context) {

		strokeStyle = this.colors.border 
		fillStyle = this.colors.accent 
		lineWidth = 1

		for (var i=0;i<this.rows.length;i++) {
			var currkeyL = 0;
			for (var j=0;j<this.rows[i].length;j++) {

				if (this.val.key==this.rows[i][j].symbol) {
					if (this.val.on) {
						this.rows[i][j].on = true;
					} else {
						this.rows[i][j].on = false;
					}
				}

				drawing.makeRoundRect(this.context, currkeyL , i*this.keyhgt,this.keywid*this.rows[i][j].width,this.keyhgt,4);
					
				if (this.rows[i][j].on) {
					fillStyle = this.colors.accent 
					strokeStyle = this.colors.accent 
					fill()
					stroke()
				} else {
					fillStyle = this.colors.fill 
					strokeStyle = this.colors.border 

					fill()
					stroke()
				}
	
				currkeyL += this.keywid*this.rows[i][j].width;

			}
		}

		if (this.val.on) {
			globalAlpha = 0.7
			fillStyle = this.colors.border;
			font = this.height+"px courier";
			textAlign = "center";
			textBaseline = "middle";
			fillText(this.val.key, this.width/2, this.height/2);
			
			globalAlpha = 1
		}

		if (!this.active) {
			globalAlpha = 0.7
			fillStyle = this.colors.border;
			font = (this.height/2)+"px courier";
			textAlign = "center";
			textBaseline = "middle"
			fillText("inactive", this.width/2, this.height/2);
		}
	}

	this.drawLabel();
}

typewriter.prototype.click = function(e) {
	this.active = !this.active;
	this.draw();
}

typewriter.prototype.type = function(e) {
	if (this.active) {
		var currKey = e.which;
		for (var i=0;i<this.rows.length;i++) {
			for (var j=0;j<this.rows[i].length;j++) {
				if (currKey == this.rows[i][j].value) {
					this.val.key = this.rows[i][j].symbol;
					this.val.on = 1;
					this.val.ascii = e.which;
					this.transmit(this.val);
					break;
				}
			}
		}
		this.draw();
	}	
}

typewriter.prototype.untype = function(e) {
	if (this.active) {
		var currKey = e.which;
		for (var i=0;i<this.rows.length;i++) {
			for (var j=0;j<this.rows[i].length;j++) {
				if (currKey == this.rows[i][j].value) {
				//	this.rows[i][j].on = false;
					this.val.key = this.rows[i][j].symbol;
					this.val.on = 0;
					this.val.ascii = e.which;
					this.transmit(this.val);
					break;
				}
			}
		}
		this.draw();
	}
}

typewriter.prototype.customDestroy = function() {
	window.removeEventListener("keydown", this.boundType);
	window.removeEventListener("keyup", this.boundUntype);
}
},{"../core/widget":55,"../utils/drawing":57,"util":51}],88:[function(require,module,exports){
var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class vinyl      
	For the boom bap
	```html
	<canvas nx="vinyl"></canvas>
	```
	<canvas nx="vinyl" style="margin-left:25px"></canvas>
*/

var vinyl = module.exports = function (target) {
	this.defaultSize = { width: 100, height: 100 };
	widget.call(this, target);
	
	this.circleSize;

	/** @property speed The rotation increment. Default is 0.05. Not to be confused with .val.speed (see below) which is the data output. During rotation, .speed will always move towards .defaultSpeed */
	this.speed = 0.05;
	/** @property defaultSpeed The "steady-state" rotation increment. Default is 0.05. During rotation, if .speed is changed, it will gradually move towards this. */
	this.defaultspeed = 0.05
	this.rotation = 0;
	this.hasMovedOnce = false;
	/** @property {float}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties: 
		| &nbsp; | data
		| --- | ---
		| *speed*| Current speed of the record player's rotation (normal is 1)
	*/
	this.val = {
		speed: 0
	}
	this.init();
	nx.aniItems.push(this.spin.bind(this));
}
util.inherits(vinyl, widget);

vinyl.prototype.init = function() {

	this.circleSize = (Math.min(this.center.x, this.center.y)-this.lineWidth);
	this.draw();
}

vinyl.prototype.draw = function() {
	this.erase()

	with (this.context) {
		strokeStyle = this.colors.border;
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height)
		
		//draw main circle
		beginPath();
		fillStyle = this.colors.black;
		arc(this.center.x, this.center.y, this.circleSize-5, 0, Math.PI*2, true);
		fill();
		closePath();


		//draw circle in center
		beginPath();
		fillStyle = this.colors.accent;
		arc(this.center.x, this.center.y*1, this.circleSize/4, 0, Math.PI*2, false);
		fill()
		closePath();


		//draw tint
		beginPath();
		globalAlpha = 0.5;
		fillStyle = this.colors.fill;
		arc(this.center.x, this.center.y, this.circleSize, this.rotation, this.rotation + 0.4, false);
		lineTo(this.center.x, this.center.y);
		arc(this.center.x, this.center.y, this.circleSize, this.rotation+Math.PI, this.rotation +Math.PI+ 0.4, false);
		lineTo(this.center.x, this.center.y);
		fill();
		globalAlpha = 1;
		closePath(); 


		//draw white circle in center
		beginPath();
		fillStyle = this.colors.white;
		arc(this.center.x, this.center.y*1, this.circleSize/16, 0, Math.PI*2, false);
		fill()
		closePath(); 

	}

	this.drawLabel();
}

vinyl.prototype.click = function(e) {
	this.hasMovedOnce = false;
	this.lastRotation = this.rotation
	this.grabAngle = this.rotation % (Math.PI*2)
	this.grabPos = math.toPolar(this.clickPos.x-this.center.x,this.clickPos.y-this.center.y).angle

}

vinyl.prototype.move = function() {

	if (!this.hasMovedOnce) {
		this.hasMovedOnce = true;
		this.grabAngle = this.rotation % (Math.PI*2)
		this.grabPos = math.toPolar(this.clickPos.x-this.center.x,this.clickPos.y-this.center.y).angle
	}

	this.rotation = math.toPolar(this.clickPos.x-this.center.x,this.clickPos.y-this.center.y).angle + this.grabAngle - this.grabPos	


}

vinyl.prototype.release = function() {
	this.speed = ((this.rotation - this.lastRotation) + (this.lastRotation-this.lastRotation2))/2 ;
}

vinyl.prototype.spin = function() {

	if (this.clicked) { 
		this.speed /= 1.1;
	} else {
		this.speed = this.speed*0.9 + this.defaultspeed*0.1
	}

	// may need to math.clip(this.val.speed,-10,10);
	this.val.speed = (this.rotation - this.lastRotation) * 20; // normalizes it to 1

	this.lastRotation2 = this.lastRotation
	this.lastRotation = this.rotation

	this.rotation += this.speed

	this.draw();

	this.transmit(this.val)
	
}

vinyl.prototype.customDestroy = function() {
	nx.removeAni(this.spin.bind(this));
}
},{"../core/widget":55,"../utils/math":58,"util":51}],89:[function(require,module,exports){
var debug = require('debug')('nightmare');
var fs = require('fs');

/**
 * Use a `plugin` function.
 *
 * We need to insert the plugin's functions at the beginning of the queue
 * and then replace all the later functions at the end.
 *
 * @param {Function} plugin
 * @param {Function} done
 * @return {Nightmare}
 */

exports.use = function(plugin, done){
  debug('.use()-ing a plugin');
  var cache = this.queue;
  this.queue = [];
  plugin(this);
  var self = this;
  this.queue = this.queue.concat(cache);
  done();
};

/**
 * Go to a new url.
 *
 * @param {String} url
 * @param {Function} done
 */

exports.goto = function(url, done) {
  debug('.goto() url: ' + url);
  this.page.open(url, function(status) {
    debug('.goto() page loaded: ' + status);
    setTimeout(done, 500);
  });
};

/**
 * Go back.
 *
 */

exports.back = function(done) {
  debug('.back()');
  this.page.goBack();
  done();
};

/**
 * Go forward.
 *
 * @param {Function} done
 */

exports.forward = function(done) {
  debug('.forward()');
  this.page.goForward();
  done();
};

/**
 * Refresh the page.
 *
 * @param {Function} done
 */

exports.refresh = function(done) {
  debug('.refresh()-ing the page');
  this.page.evaluate(function(selector) {
    document.location.reload(true);
  }, done);
};

/**
 * Get the url of the page.
 *
 * @param {Function} callback
 * @param {Function} done
 */

exports.url = function(callback, done) {
  debug('.url() getting it');
  this.page.evaluate(function() {
    return document.location.href;
  }, function(url) {
    callback(url);
    done();
  });
};

/**
 * Get the title of the page.
 *
 * @param {Function} callback
 * @param {Function} done
 */

exports.title = function(callback, done) {
  debug('.title() getting it');
  this.page.evaluate(function() {
    return document.title;
  }, function(title) {
    callback(title);
    done();
  });
};

/**
 * Determine if a selector is visible on a page.
 *
 * @param {String} selector
 * @param {Function} callback
 * @param {Function} done
 */

exports.visible = function(selector, callback, done) {
  debug('.visible() for ' + selector);
  this.page.evaluate(function(selector) {
    var elem = document.querySelector(selector);
    if (elem) return (elem.offsetWidth > 0 && elem.offsetHeight > 0);
    else return false;
  }, function(result) {
    callback(result);
    done();
  }, selector);
};


/**
 * Determine if a selector exists on a page.
 *
 * @param {String} selector
 * @param {Function} callback
 * @param {Function} done
 */

exports.exists = function(selector, callback, done) {
  debug('.exists() for ' + selector);
  this.page.evaluate(function(selector) {
    return (document.querySelector(selector)!==null);
  }, function(result) {
    callback(result);
    done();
  }, selector);
};

/**
 * Inject a JavaScript or CSS file onto the page
 *
 * @param {String} type
 * @param {String} file
 * @param {Function} done
 */

exports.inject = function(type, file, done){
  debug('.inject()-ing a file');
  var startTag, endTag;
  if ( type !== "js" && type !== "css" ){
    debug('unsupported file type in .inject()');
    done();
  }
  if (type === "js"){
    startTag = "<script>";
    endTag = "</script>";
  }
  else if (type === "css"){
    startTag = "<style>";
    endTag = "</style>";
  }
  var self = this;
  this.page.getContent(function (pageContent) {
    var injectedContents = fs.readFileSync(file);
    var content = pageContent + startTag + injectedContents + endTag;
    self.page.setContent(content, null, done);
  });
};

/**
 * Click an element.
 *
 * @param {String} selector
 * @param {Function} done
 */

exports.click = function(selector, done) {
  debug('.click() on ' + selector);
  this.page.evaluate(function (selector) {
    var element = document.querySelector(selector);
    var event = document.createEvent('MouseEvent');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
  }, done, selector);
};

/**
 * Type into an element.
 *
 * @param {String} selector
 * @param {String} text
 * @param {Function} done
 */

exports.type = function(selector, text, done) {
  debug('.type() %s into %s', text, selector);
  var self = this;
  this.page.evaluate(function(selector, text){
    document.querySelector(selector).focus();
  }, function(){
    self.page.sendEvent('keypress', text, null, null, 0);
    done();
  }, selector, text);
};

/**
 * Check a checkbox, fire change event
 *
 * @param {String} selector
 * @param {Function} done
 */

exports.check = function(selector, done) {
  debug('.check() ' + selector);
  this.page.evaluate(function(selector) {
    var element = document.querySelector(selector);
    var event = document.createEvent('HTMLEvents');
    element.checked = true;
    event.initEvent('change', true, true);
    element.dispatchEvent(event);

  }, done, selector);
};

/**
 * Choose an option from a select dropdown
 *
 *
 *
 * @param {String} selector
 * @param {String} option value
 * @param {Function} done
 */

exports.select = function(selector, option, done) {
  debug('.select() ' + selector);
  this.page.evaluate(function(selector, option) {
    var element = document.querySelector(selector);
    var event = document.createEvent('HTMLEvents');
    element.value = option;
    event.initEvent('change', true, true);
    element.dispatchEvent(event);
  }, done, selector, option);
};


/**
 * Scroll to a specific location on the page
 *
 * @param {Number} Top
 * @param {Number} Left
 */

exports.scrollTo = function(top, left, done) {
  debug('.scrollTo() top: ' + top + ', left: ' + left);
  this.page.set('scrollPosition', {
    top: top,
    left: left
  }, done);
};

/**
 * Upload a path into a file input.
 *
 * @param {String} selector
 * @param {String} path
 * @param {Function} done
 */

exports.upload = function(selector, path, done) {
  debug('.upload() to ' + selector + ' with ' + path);
  if (fs.existsSync(path)) {
    this.page.uploadFile(selector, path, impatient(done, this.options.timeout));
  }
  else {
    debug('invalid file path for upload: %s', path);
    done(new Error('File does not exist to upload.'));
  }
};

/**
 * Wait for various states.
 *
 * @param {Null|Number|String|Function} condition
 */

exports.wait = function(/* args */) {
  var page = this.page;
  var args = arguments;
  var done = args[args.length-1];
  var self = this;

  // null
  if (args.length === 1) {
    debug('.wait() for the next page load');
    this.afterNextPageLoad(done);
  }
  else if (args.length === 2) {
    var condition = args[0];
    if (typeof condition === 'number') {
      var ms = condition;
      debug('.wait() for ' + ms + 'ms');
      setTimeout(done, ms);
    }
    else if (typeof condition === 'string') {
      var selector = condition;
      debug('.wait() for the element ' + selector);
      // we lose the clojure when it goes to phantom, so we have to
      // force it with string concatenation and eval
      eval("var elementPresent = function() {"+
      "  var element = document.querySelector('"+selector+"');"+
      "  return (element ? true : false);" +
      "};");
      this.untilOnPage(elementPresent, true, function (present) {
        if (!present) self.onTimeout('timeout elapsed before selector "'+selector+'" became present');
        done(null, present);
      }, selector);
    }
  }
  // wait for on-page fn==value
  else if (args.length > 2) {
    var fn = args[0];
    var value = args[1];
    if (args.length === 3) {
      debug('.wait() for fn==' + value);
      this.untilOnPage(fn, value, function (val) {
        if (val !== value) self.onTimeout('timeout elapsed before fn==='+value);
        done(null, value);
      });
    }
    else if (args.length === 4) {
      var delay = args[2];
      debug('.wait() for fn==' + value + ' with refreshes every ' + delay);
      this.refreshUntilOnPage(fn, value, delay, function (val) {
        if (val !== value) self.onTimeout('timeout elapsed before fn==='+value);
        done(null, value);
      });
    }
  }
};

/**
 * Take a screenshot.
 *
 * @param {String} path
 * @param {Function} done
 */

exports.screenshot = function (path, done) {
  var formats = ['png', 'gif', 'jpeg', 'jpg', 'pdf'];
  var ext = path.substring(path.indexOf('.') + 1);
  if (!~formats.join(',').indexOf(ext)) {
    done(new Error('Must include file extension in `path`.'));
  }
  debug('.screenshot() saved to ' + path);
  this.page.render(path, done);
};

/**
 * Render a PDF.
 *
 * @param {String} path
 * @param {Function} done
 */

exports.pdf = function (path, done) {
  debug('.pdf() saved to ' + path);
  this.page.set('paperSize', {
    format: 'A4',
    orientation: 'portrait',
    margin: '2cm'
  });
  this.page.render(path, {format: 'pdf', quality: '100'}, done);
};

/**
 * Run the function on the page.
 *
 * @param {Function} func
 * @param {Function} callback
 * @param {...} args
 */

exports.evaluate = function (func, callback/**, arg1, arg2...*/) {
  // The last argument is the internal completion callback, but
  // "callback" is the external callback provided by the user.
  // We need to wrap them.
  var args = [].slice.call(arguments);
  var external = callback;
  var internal = args[args.length-1];
  var wrapped = function() {
    external.apply(null, arguments);
    internal();
  };
  args[1] = wrapped;
  debug('.evaluate() fn on the page');
  this.page.evaluate.apply(this.page, args);
};

/**
 * Set the viewport.
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Function} done
 */

exports.viewport = function (width, height, done) {
  debug('.viewport() to ' + width + ' x ' + height);
  var viewport = { width: width, height: height };
  this.page.set('viewportSize', viewport, done);
};

/**
 * Set the zoom factor.
 *
 * @param {Number} zoomFactor
 * @param {Function} done
 */

exports.zoom = function (zoomFactor, done) {
  this.page.set('zoomFactor', zoomFactor, done);
};

/**
 * Handles page events.
 *
 * @param {String} type
 * @param {Function} callback
 * @param {Function} done
 *
 * See readme for event types.
 */
exports.on = function (type, callback, done) {
  // Timeouts are handled at the nightmare level
  if (type === 'timeout') {
    this.onTimeout = callback;
    done();
  }
  // The onExit callback is special-cased here too
  else if (type === 'exit') {
    this.onExit = callback;
    done();
  }
  // resourceRequestStarted has a special function...
  else if (type === 'resourceRequestStarted') {
    var args = [].slice.call(arguments);
    args = args.slice(1, args.length-1); // callback OR callback with args
    this.page.onResourceRequested.apply(this.page, args);
    done();
  }
  // All other events handled natively in phantomjs
  else {
    var pageEvent = 'on' + type.charAt(0).toUpperCase() + type.slice(1);
    this.page.set(pageEvent, callback, done);
  }
};

/*
 * Sets up basic authentication.
 *
 * @param {String} user
 * @param {Function} password
 */

exports.authentication = function(user, password, done) {
  var self = this;
  this.page.get('settings', function(settings){
    settings.userName = user;
    settings.password = password;
    self.page.set('settings', settings, done);
  });
};

/**
 * Set the useragent.
 *
 * @param {String} useragent
 * @param {Function} done
 */

exports.agent =
exports.useragent = function(useragent, done) {
  debug('.useragent() to ' + useragent);
  this.page.set('settings.userAgent', useragent, done);
};

/**
 * Impatiently call the function after a timeout, if it hasn't been called yet.
 *
 * @param {Function} fn
 * @param {Number} timeout
 */

function impatient(fn, timeout) {
  var called = false;
  var wrapper = function() {
    if (!called) fn.apply(null, arguments);
    called = true;
  };
  setTimeout(wrapper, timeout);
  return wrapper;
}

/*
 * Sets the headers.
 * @param {Object} headers
 */

exports.headers = function(headers, done) {
  this.page.setHeaders(headers, done);
};

},{"debug":92,"fs":18}],90:[function(require,module,exports){
var phantom = require('phantom');
var debug = require('debug')('nightmare');
var defaults = require('defaults');
var clone = require('clone');
var once = require('once');
var actions = require('./actions');
var noop = function () {};

/**
 * Expose `Nightmare`.
 */

module.exports = Nightmare;

/**
 * Global PORT to avoid EADDRINUSE
 */

var PORT = 13200;

/**
 * Default options.
 *
 * http://phantomjs.org/api/command-line.html
 */

var DEFAULTS = {
  timeout: 5000,
  interval: 50,
  weak: true,
  loadImages: true,
  ignoreSslErrors: true,
  sslProtocol: 'any',
  proxy: null,
  proxyType: null,
  proxyAuth: null,
  cookiesFile: null,
  webSecurity: true
};

/**
 * Initialize a new `Nightmare`.
 *
 * @param {Object} options
 */

function Nightmare (options) {
  if (!(this instanceof Nightmare)) return new Nightmare(options);
  this.options = defaults(clone(options) || {}, DEFAULTS);
  this.queue = [];
}

/**
 * Run all the queued methods.
 *
 * @param {Function} callback
 */

Nightmare.prototype.run = function(callback) {
  var self = this;
  debug('run');
  this.setup(function () {
    setTimeout(next, 0);
    function next(err) {
      var item = self.queue.shift();
      if (!item) {
        self.teardownInstance();
        return (callback || noop)(err, self);
      }
      var method = item[0];
      var args = item[1];
      args.push(once(next));
      method.apply(self, args);
    }
  });
};

/**
 * Set up a fresh phantomjs page.
 *
 * @param {Function} done
 * @api private
 */

Nightmare.prototype.setup = function(done) {
  var self = this;
  this.setupInstance(function(instance) {
    debug('.setup() phantom instance created');
    instance.createPage(function(page) {
      self.page = page;
      debug('.setup() phantom page created');
      done();
    });
  });
};

/**
 * Safely set up a fresh phantomjs instance.
 *
 * @param {Function} done
 * @api private
 */

Nightmare.prototype.setupInstance = function(done) {
  debug('.setup() creating phantom instance with options %s', JSON.stringify(this.options));
  if (this.initializingPhantomJS) {
    var self = this;
    var check = setInterval(function() {
      if (self.phantomJS) {
        clearInterval(check);
        done(self.phantomJS);
      }
    }, 50);
  }
  else {
    this.initializingPhantomJS = true;
    this.createInstance(done);
  }
};

/**
 * Create a phantomjs instance.
 *
 * @param {Function} done
 * @api private
 */

Nightmare.prototype.createInstance = function(done) {
  var flags = [];
  flags.push('--load-images='+this.options.loadImages);
  flags.push('--ignore-ssl-errors='+this.options.ignoreSslErrors);
  flags.push('--ssl-protocol='+this.options.sslProtocol);
  flags.push('--web-security='+this.options.webSecurity);
  if (this.options.proxy !== null) {
    flags.push('--proxy='+this.options.proxy);
  }
  if (this.options.proxyType !== null) {
    flags.push('--proxy-type='+this.options.proxyType);
  }
  if (this.options.proxyAuth !== null) {
    flags.push('--proxy-auth='+this.options.proxyAuth);
  }
  if (this.options.cookiesFile !== null) {
    flags.push('--cookies-file='+this.options.cookiesFile);
  }

  // dnode options for compilation on windows
  var dnodeOpts = {};
  if (this.options.weak === false) {
     dnodeOpts = { weak : false };
  }

  // combine flags, options and callback into args
  var args = flags;
  args.push({
    port: this.options.port || getPort(),
    dnodeOpts: dnodeOpts,
    path: this.options.phantomPath,
    onExit: this.handleCrash.bind(this)
  });
  var self = this;
  args.push(function(instance) {
    self.phantomJS = instance;
    done(instance);
  });
  phantom.create.apply(phantom, args);

  // clear the timeout handler
  this.onTimeout = noop;
};

/**
 * Tear down a phantomjs instance.
 *
 * @api private
 */

Nightmare.prototype.teardownInstance = function() {
  this.initializingPhantomJS = false;
  this.phantomJS.exit(0);
  debug('.teardownInstance() tearing down');

};

/**
 * Check function on page until it becomes true.
 *
 * @param {Function} check
 * @param {Object} value
 * @param {Function} then
 * @api private
 */

Nightmare.prototype.untilOnPage = function(check, value, then) {
  var page = this.page;
  var condition = false;
  var args = [].slice.call(arguments).slice(3);
  var hasCondition = function() {
    args.unshift(function(res) {
      condition = res;
    });
    args.unshift(check);
    page.evaluate.apply(page, args);
    return condition === value;
  };
  until(hasCondition, this.options.timeout, this.options.interval, then);
};

/**
 * Check function on page until it becomes true.
 *
 * @param {Function} check
 * @param {Object} value
 * @param {Number} delay
 * @param {Function} then
 * @api private
 */

Nightmare.prototype.refreshUntilOnPage = function(check, value, delay, then) {
  var page = this.page;
  debug('.wait() checking for condition after refreshing every ' + delay);
  var interval = setInterval(function() {
    page.evaluate(check, function(result) {
      if (result === value) {
        debug('.wait() saw value match after refresh');
        clearInterval(interval);
        then();
      }
      else {
        debug('.wait() refreshing the page (no match on value=' + result + ')');
        page.evaluate(function() {
          document.location.reload(true);
        });
      }
    });
  }, delay);
};

/**
 * Trigger the callback after the next page load.
 *
 * @param {Function} callback
 * @api private
 */

Nightmare.prototype.afterNextPageLoad = function(callback) {
  var isUnloaded = function() {
    return (document.readyState !== "complete");
  };
  var isLoaded = function() {
    return (document.readyState === "complete");
  };
  var self = this;
  self.untilOnPage(isUnloaded, true, function() {
    debug('.wait() detected page unload');
    self.untilOnPage(isLoaded, true, function(res) {
      debug('.wait() detected page load');
      callback();
    });
  });
};

/**
 * Handles the phantom process ending/crashing unexpectedly.
 *
 * If an `onExit` handler has been bound (via `Nightmare#on('exit', ...)`)
 * then that will be called. Otherwise, the error will be re-thrown.
 *
 * @param {Number} code
 * @param {String} [signal]
 */

Nightmare.prototype.handleCrash = function (code, signal) {
  // if a handler is defined, call it
  if (this.onExit) {
    this.onExit(code, signal);

  // otherwise, if we have a non-zero code we'll throw a better error message
  // than the `phantom` lib would.
  } else if (code !== 0) {
    var err = new Error('the phantomjs process ended unexpectedly');
    err.code = code;
    err.signal = signal;
    throw err;
  }
};

/**
 * Check function until it becomes true.
 *
 * @param {Function} check
 * @param {Number} timeout
 * @param {Number} interval
 * @param {Function} then
 */

function until(check, timeout, interval, then) {
  var start = Date.now();
  var checker = setInterval(function() {
    var diff = Date.now() - start;
    var res = check();
    if (res || diff > timeout) {
      clearInterval(checker);
      then(res);
    }
  }, interval);
}

/**
 * Attach all the actions.
 */

Object.keys(actions).forEach(function (name) {
  var fn = actions[name];
  Nightmare.prototype[name] = function() {
    debug('queueing action "' + name + '"');
    var args = [].slice.call(arguments);
    this.queue.push([fn, args]);
    return this;
  };
});

/**
 * Generate new port globally to avoid EADDRINUSE.
 */

function getPort() {
  PORT++;
  return PORT;
}

},{"./actions":89,"clone":91,"debug":92,"defaults":93,"once":94,"phantom":109}],91:[function(require,module,exports){
(function (Buffer){
'use strict';

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

// shim for Node's 'util' package
// DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
var util = {
  isArray: function (ar) {
    return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
  },
  isDate: function (d) {
    return typeof d === 'object' && objectToString(d) === '[object Date]';
  },
  isRegExp: function (re) {
    return typeof re === 'object' && objectToString(re) === '[object RegExp]';
  },
  getRegExpFlags: function (re) {
    var flags = '';
    re.global && (flags += 'g');
    re.ignoreCase && (flags += 'i');
    re.multiline && (flags += 'm');
    return flags;
  }
};


if (typeof module === 'object')
  module.exports = clone;

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/

function clone(parent, circular, depth, prototype) {
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (util.isArray(parent)) {
      child = [];
    } else if (util.isRegExp(parent)) {
      child = new RegExp(parent.source, util.getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (util.isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }
      
      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

}).call(this,require("buffer").Buffer)
},{"buffer":19}],92:[function(require,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],93:[function(require,module,exports){
var clone = require('clone');

module.exports = function(options, defaults) {
  options = options || {};

  Object.keys(defaults).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = clone(defaults[key]);
    }
  });

  return options;
};
},{"clone":91}],94:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

},{}],95:[function(require,module,exports){
var dnode = require('./lib/dnode');

module.exports = function (cons, opts) {
    return new dnode(cons, opts);
};

},{"./lib/dnode":96}],96:[function(require,module,exports){
(function (process){
var protocol = require('dnode-protocol');
var Stream = require('stream');
var json = typeof JSON === 'object' ? JSON : require('jsonify');

module.exports = dnode;
dnode.prototype = {};
(function () { // browsers etc
    for (var key in Stream.prototype) {
        dnode.prototype[key] = Stream.prototype[key];
    }
})();

function dnode (cons, opts) {
    Stream.call(this);
    var self = this;
    
    self.opts = opts || {};
    
    self.cons = typeof cons === 'function'
        ? cons
        : function () { return cons || {} }
    ;
    
    self.readable = true;
    self.writable = true;
    
    process.nextTick(function () {
        if (self._ended) return;
        self.proto = self._createProto();
        self.proto.start();
        
        if (!self._handleQueue) return;
        for (var i = 0; i < self._handleQueue.length; i++) {
            self.handle(self._handleQueue[i]);
        }
    });
}

dnode.prototype._createProto = function () {
    var self = this;
    var proto = protocol(function (remote) {
        if (self._ended) return;
        
        var ref = self.cons.call(this, remote, self);
        if (typeof ref !== 'object') ref = this;
        
        self.emit('local', ref, self);
        
        return ref;
    }, self.opts.proto);
    
    proto.on('remote', function (remote) {
        self.emit('remote', remote, self);
        self.emit('ready'); // backwards compatability, deprecated
    });
    
    proto.on('request', function (req) {
        if (!self.readable) return;
        
        if (self.opts.emit === 'object') {
            self.emit('data', req);
        }
        else self.emit('data', json.stringify(req) + '\n');
    });
    
    proto.on('fail', function (err) {
        // errors that the remote end was responsible for
        self.emit('fail', err);
    });
    
    proto.on('error', function (err) {
        // errors that the local code was responsible for
        self.emit('error', err);
    });
    
    return proto;
};

dnode.prototype.write = function (buf) {
    if (this._ended) return;
    var self = this;
    var row;
    
    if (buf && typeof buf === 'object'
    && buf.constructor && buf.constructor.name === 'Buffer'
    && buf.length
    && typeof buf.slice === 'function') {
        // treat like a buffer
        if (!self._bufs) self._bufs = [];
        
        // treat like a buffer
        for (var i = 0, j = 0; i < buf.length; i++) {
            if (buf[i] === 0x0a) {
                self._bufs.push(buf.slice(j, i));
                
                var line = '';
                for (var k = 0; k < self._bufs.length; k++) {
                    line += String(self._bufs[k]);
                }
                
                try { row = json.parse(line) }
                catch (err) { return self.end() }
                
                j = i + 1;
                
                self.handle(row);
                self._bufs = [];
            }
        }
        
        if (j < buf.length) self._bufs.push(buf.slice(j, buf.length));
    }
    else if (buf && typeof buf === 'object') {
        // .isBuffer() without the Buffer
        // Use self to pipe JSONStream.parse() streams.
        self.handle(buf);
    }
    else {
        if (typeof buf !== 'string') buf = String(buf);
        if (!self._line) self._line = '';
        
        for (var i = 0; i < buf.length; i++) {
            if (buf.charCodeAt(i) === 0x0a) {
                try { row = json.parse(self._line) }
                catch (err) { return self.end() }
                
                self._line = '';
                self.handle(row);
            }
            else self._line += buf.charAt(i)
        }
    }
};

dnode.prototype.handle = function (row) {
    if (!this.proto) {
        if (!this._handleQueue) this._handleQueue = [];
        this._handleQueue.push(row);
    }
    else this.proto.handle(row);
};

dnode.prototype.end = function () {
    if (this._ended) return;
    this._ended = true;
    this.writable = false;
    this.readable = false;
    this.emit('end');
};

dnode.prototype.destroy = function () {
    this.end();
};

}).call(this,require('_process'))
},{"_process":31,"dnode-protocol":97,"jsonify":102,"stream":47}],97:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var scrubber = require('./lib/scrub');
var objectKeys = require('./lib/keys');
var forEach = require('./lib/foreach');
var isEnumerable = require('./lib/is_enum');

module.exports = function (cons, opts) {
    return new Proto(cons, opts);
};

(function () { // browsers bleh
    for (var key in EventEmitter.prototype) {
        Proto.prototype[key] = EventEmitter.prototype[key];
    }
})();

function Proto (cons, opts) {
    var self = this;
    EventEmitter.call(self);
    if (!opts) opts = {};
    
    self.remote = {};
    self.callbacks = { local : [], remote : [] };
    self.wrap = opts.wrap;
    self.unwrap = opts.unwrap;
    
    self.scrubber = scrubber(self.callbacks.local);
    
    if (typeof cons === 'function') {
        self.instance = new cons(self.remote, self);
    }
    else self.instance = cons || {};
}

Proto.prototype.start = function () {
    this.request('methods', [ this.instance ]);
};

Proto.prototype.cull = function (id) {
    delete this.callbacks.remote[id];
    this.emit('request', {
        method : 'cull',
        arguments : [ id ]
    });
};

Proto.prototype.request = function (method, args) {
    var scrub = this.scrubber.scrub(args);
    
    this.emit('request', {
        method : method,
        arguments : scrub.arguments,
        callbacks : scrub.callbacks,
        links : scrub.links
    });
};

Proto.prototype.handle = function (req) {
    var self = this;
    var args = self.scrubber.unscrub(req, function (id) {
        if (self.callbacks.remote[id] === undefined) {
            // create a new function only if one hasn't already been created
            // for a particular id
            var cb = function () {
                self.request(id, [].slice.apply(arguments));
            };
            self.callbacks.remote[id] = self.wrap ? self.wrap(cb, id) : cb;
            return cb;
        }
        return self.unwrap
            ? self.unwrap(self.callbacks.remote[id], id)
            : self.callbacks.remote[id]
        ;
    });
    
    if (req.method === 'methods') {
        self.handleMethods(args[0]);
    }
    else if (req.method === 'cull') {
        forEach(args, function (id) {
            delete self.callbacks.local[id];
        });
    }
    else if (typeof req.method === 'string') {
        if (isEnumerable(self.instance, req.method)) {
            self.apply(self.instance[req.method], args);
        }
        else {
            self.emit('fail', new Error(
                'request for non-enumerable method: ' + req.method
            ));
        }
    }
    else if (typeof req.method == 'number') {
        var fn = self.callbacks.local[req.method];
        if (!fn) {
            self.emit('fail', new Error('no such method'));
        }
        else self.apply(fn, args);
    }
};

Proto.prototype.handleMethods = function (methods) {
    var self = this;
    if (typeof methods != 'object') {
        methods = {};
    }
    
    // copy since assignment discards the previous refs
    forEach(objectKeys(self.remote), function (key) {
        delete self.remote[key];
    });
    
    forEach(objectKeys(methods), function (key) {
        self.remote[key] = methods[key];
    });
    
    self.emit('remote', self.remote);
    self.emit('ready');
};

Proto.prototype.apply = function (f, args) {
    try { f.apply(undefined, args) }
    catch (err) { this.emit('error', err) }
};

},{"./lib/foreach":98,"./lib/is_enum":99,"./lib/keys":100,"./lib/scrub":101,"events":23}],98:[function(require,module,exports){
module.exports = function forEach (xs, f) {
    if (xs.forEach) return xs.forEach(f)
    for (var i = 0; i < xs.length; i++) {
        f.call(xs, xs[i], i);
    }
}

},{}],99:[function(require,module,exports){
var objectKeys = require('./keys');

module.exports = function (obj, key) {
    if (Object.prototype.propertyIsEnumerable) {
        return Object.prototype.propertyIsEnumerable.call(obj, key);
    }
    var keys = objectKeys(obj);
    for (var i = 0; i < keys.length; i++) {
        if (key === keys[i]) return true;
    }
    return false;
};

},{"./keys":100}],100:[function(require,module,exports){
module.exports = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

},{}],101:[function(require,module,exports){
var traverse = require('traverse');
var objectKeys = require('./keys');
var forEach = require('./foreach');

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) if (xs[i] === x) return i;
    return -1;
}

// scrub callbacks out of requests in order to call them again later
module.exports = function (callbacks) {
    return new Scrubber(callbacks);
};

function Scrubber (callbacks) {
    this.callbacks = callbacks;
}

// Take the functions out and note them for future use
Scrubber.prototype.scrub = function (obj) {
    var self = this;
    var paths = {};
    var links = [];
    
    var args = traverse(obj).map(function (node) {
        if (typeof node === 'function') {
            var i = indexOf(self.callbacks, node);
            if (i >= 0 && !(i in paths)) {
                // Keep previous function IDs only for the first function
                // found. This is somewhat suboptimal but the alternatives
                // are worse.
                paths[i] = this.path;
            }
            else {
                var id = self.callbacks.length;
                self.callbacks.push(node);
                paths[id] = this.path;
            }
            
            this.update('[Function]');
        }
        else if (this.circular) {
            links.push({ from : this.circular.path, to : this.path });
            this.update('[Circular]');
        }
    });
    
    return {
        arguments : args,
        callbacks : paths,
        links : links
    };
};
 
// Replace callbacks. The supplied function should take a callback id and
// return a callback of its own.
Scrubber.prototype.unscrub = function (msg, f) {
    var args = msg.arguments || [];
    forEach(objectKeys(msg.callbacks || {}), function (sid) {
        var id = parseInt(sid, 10);
        var path = msg.callbacks[id];
        traverse.set(args, path, f(id));
    });
    
    forEach(msg.links || [], function (link) {
        var value = traverse.get(args, link.from);
        traverse.set(args, link.to, value);
    });
    
    return args;
};

},{"./foreach":98,"./keys":100,"traverse":107}],102:[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":103,"./lib/stringify":104}],103:[function(require,module,exports){
var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};

},{}],104:[function(require,module,exports){
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};

},{}],105:[function(require,module,exports){
var Stream = require('stream');
var sockjs = require('sockjs-client');
var resolve = require('url').resolve;
var parse = require('url').parse;

module.exports = function (u, cb) {
    var uri = parse(u).protocol ? u : resolve(window.location.href, u);
    
    var stream = new Stream;
    stream.readable = true;
    stream.writable = true;
    
    var ready = false;
    var buffer = [];
    
    var sock = sockjs(uri);
    stream.sock = sock;
    
    stream.write = function (msg) {
        if (!ready || buffer.length) buffer.push(msg)
        else sock.send(msg)
    };
    
    stream.end = function (msg) {
        if (msg !== undefined) stream.write(msg);
        if (!ready) {
            stream._ended = true;
            return;
        }
        stream.writable = false;
        sock.close();
    };
    
    stream.destroy = function () {
        stream._ended = true;
        stream.writable = stream.readable = false;
        buffer.length = 0
        sock.close();
    };
    
    sock.onopen = function () {
        if (typeof cb === 'function') cb();
        ready = true;
        for (var i = 0; i < buffer.length; i++) {
            sock.send(buffer[i]);
        }
        buffer = [];
        stream.emit('connect');
        if (stream._ended) stream.end();
    };
    
    sock.onmessage = function (e) {
        stream.emit('data', e.data);
    };
    
    sock.onclose = function () {
        stream.emit('end');
        stream.writable = false;
        stream.readable = false;
    };
    
    return stream;
};

},{"sockjs-client":106,"stream":47,"url":49}],106:[function(require,module,exports){
/* SockJS client, version 0.3.1.7.ga67f.dirty, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()


//     [*] Including lib/index.js
// Public object
var SockJS = (function(){
              var _document = document;
              var _window = window;
              var utils = {};


//         [*] Including lib/reventtarget.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
var REventTarget = function() {};
REventTarget.prototype.addEventListener = function (eventType, listener) {
    if(!this._listeners) {
         this._listeners = {};
    }
    if(!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    if(utils.arrIndexOf(arr, listener) === -1) {
        arr.push(listener);
    }
    return;
};

REventTarget.prototype.removeEventListener = function (eventType, listener) {
    if(!(this._listeners && (eventType in this._listeners))) {
        return;
    }
    var arr = this._listeners[eventType];
    var idx = utils.arrIndexOf(arr, listener);
    if (idx !== -1) {
        if(arr.length > 1) {
            this._listeners[eventType] = arr.slice(0, idx).concat( arr.slice(idx+1) );
        } else {
            delete this._listeners[eventType];
        }
        return;
    }
    return;
};

REventTarget.prototype.dispatchEvent = function (event) {
    var t = event.type;
    var args = Array.prototype.slice.call(arguments, 0);
    if (this['on'+t]) {
        this['on'+t].apply(this, args);
    }
    if (this._listeners && t in this._listeners) {
        for(var i=0; i < this._listeners[t].length; i++) {
            this._listeners[t][i].apply(this, args);
        }
    }
};
//         [*] End of lib/reventtarget.js


//         [*] Including lib/simpleevent.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SimpleEvent = function(type, obj) {
    this.type = type;
    if (typeof obj !== 'undefined') {
        for(var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            this[k] = obj[k];
        }
    }
};

SimpleEvent.prototype.toString = function() {
    var r = [];
    for(var k in this) {
        if (!this.hasOwnProperty(k)) continue;
        var v = this[k];
        if (typeof v === 'function') v = '[function]';
        r.push(k + '=' + v);
    }
    return 'SimpleEvent(' + r.join(', ') + ')';
};
//         [*] End of lib/simpleevent.js


//         [*] Including lib/eventemitter.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventEmitter = function(events) {
    this.events = events || [];
};
EventEmitter.prototype.emit = function(type) {
    var that = this;
    var args = Array.prototype.slice.call(arguments, 1);
    if (!that.nuked && that['on'+type]) {
        that['on'+type].apply(that, args);
    }
    if (utils.arrIndexOf(that.events, type) === -1) {
        utils.log('Event ' + JSON.stringify(type) +
                  ' not listed ' + JSON.stringify(that.events) +
                  ' in ' + that);
    }
};

EventEmitter.prototype.nuke = function(type) {
    var that = this;
    that.nuked = true;
    for(var i=0; i<that.events.length; i++) {
        delete that[that.events[i]];
    }
};
//         [*] End of lib/eventemitter.js


//         [*] Including lib/utils.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var random_string_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
utils.random_string = function(length, max) {
    max = max || random_string_chars.length;
    var i, ret = [];
    for(i=0; i < length; i++) {
        ret.push( random_string_chars.substr(Math.floor(Math.random() * max),1) );
    }
    return ret.join('');
};
utils.random_number = function(max) {
    return Math.floor(Math.random() * max);
};
utils.random_number_string = function(max) {
    var t = (''+(max - 1)).length;
    var p = Array(t+1).join('0');
    return (p + utils.random_number(max)).slice(-t);
};

// Assuming that url looks like: http://asdasd:111/asd
utils.getOrigin = function(url) {
    url += '/';
    var parts = url.split('/').slice(0, 3);
    return parts.join('/');
};

utils.isSameOriginUrl = function(url_a, url_b) {
    // location.origin would do, but it's not always available.
    if (!url_b) url_b = _window.location.href;

    return (url_a.split('/').slice(0,3).join('/')
                ===
            url_b.split('/').slice(0,3).join('/'));
};

utils.getParentDomain = function(url) {
    // ipv4 ip address
    if (/^[0-9.]*$/.test(url)) return url;
    // ipv6 ip address
    if (/^\[/.test(url)) return url;
    // no dots
    if (!(/[.]/.test(url))) return url;

    var parts = url.split('.').slice(1);
    return parts.join('.');
};

utils.objectExtend = function(dst, src) {
    for(var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};

var WPrefix = '_jp';

utils.polluteGlobalNamespace = function() {
    if (!(WPrefix in _window)) {
        _window[WPrefix] = {};
    }
};

utils.closeFrame = function (code, reason) {
    return 'c'+JSON.stringify([code, reason]);
};

utils.userSetCode = function (code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
utils.countRTO = function (rtt) {
    var rto;
    if (rtt > 100) {
        rto = 3 * rtt; // rto > 300msec
    } else {
        rto = rtt + 200; // 200msec < rto <= 300msec
    }
    return rto;
}

utils.log = function() {
    if (_window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

utils.bind = function(fun, that) {
    if (fun.bind) {
        return fun.bind(that);
    } else {
        return function() {
            return fun.apply(that, arguments);
        };
    }
};

utils.flatUrl = function(url) {
    return url.indexOf('?') === -1 && url.indexOf('#') === -1;
};

utils.amendUrl = function(url) {
    var dl = _document.location;
    if (!url) {
        throw new Error('Wrong url for SockJS');
    }
    if (!utils.flatUrl(url)) {
        throw new Error('Only basic urls are supported in SockJS');
    }

    //  '//abc' --> 'http://abc'
    if (url.indexOf('//') === 0) {
        url = dl.protocol + url;
    }
    // '/abc' --> 'http://localhost:80/abc'
    if (url.indexOf('/') === 0) {
        url = dl.protocol + '//' + dl.host + url;
    }
    // strip trailing slashes
    url = url.replace(/[/]+$/,'');
    return url;
};

// IE doesn't support [].indexOf.
utils.arrIndexOf = function(arr, obj){
    for(var i=0; i < arr.length; i++){
        if(arr[i] === obj){
            return i;
        }
    }
    return -1;
};

utils.arrSkip = function(arr, obj) {
    var idx = utils.arrIndexOf(arr, obj);
    if (idx === -1) {
        return arr.slice();
    } else {
        var dst = arr.slice(0, idx);
        return dst.concat(arr.slice(idx+1));
    }
};

// Via: https://gist.github.com/1133122/2121c601c5549155483f50be3da5305e83b8c5df
utils.isArray = Array.isArray || function(value) {
    return {}.toString.call(value).indexOf('Array') >= 0
};

utils.delay = function(t, fun) {
    if(typeof t === 'function') {
        fun = t;
        t = 0;
    }
    return setTimeout(fun, t);
};


// Chars worth escaping, as defined by Douglas Crockford:
//   https://github.com/douglascrockford/JSON-js/blob/47a9882cddeb1e8529e07af9736218075372b8ac/json2.js#L196
var json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    json_lookup = {
"\u0000":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003",
"\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007",
"\b":"\\b","\t":"\\t","\n":"\\n","\u000b":"\\u000b","\f":"\\f","\r":"\\r",
"\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011",
"\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015",
"\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019",
"\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d",
"\u001e":"\\u001e","\u001f":"\\u001f","\"":"\\\"","\\":"\\\\",
"\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086",
"\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a",
"\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e",
"\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092",
"\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096",
"\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a",
"\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d","\u009e":"\\u009e",
"\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601",
"\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f",
"\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d",
"\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029",
"\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d",
"\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061",
"\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065",
"\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069",
"\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d",
"\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0",
"\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4",
"\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8",
"\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc",
"\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"};

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
var extra_escapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
    extra_lookup;

// JSON Quote string. Use native implementation when possible.
var JSONQuote = (JSON && JSON.stringify) || function(string) {
    json_escapable.lastIndex = 0;
    if (json_escapable.test(string)) {
        string = string.replace(json_escapable, function(a) {
            return json_lookup[a];
        });
    }
    return '"' + string + '"';
};

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unroll_lookup = function(escapable) {
    var i;
    var unrolled = {}
    var c = []
    for(i=0; i<65536; i++) {
        c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function (a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
//    http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
utils.quote = function(string) {
    var quoted = JSONQuote(string);

    // In most cases this should be very fast and good enough.
    extra_escapable.lastIndex = 0;
    if(!extra_escapable.test(quoted)) {
        return quoted;
    }

    if(!extra_lookup) extra_lookup = unroll_lookup(extra_escapable);

    return quoted.replace(extra_escapable, function(a) {
        return extra_lookup[a];
    });
}

var _all_protocols = ['websocket',
                      'xdr-streaming',
                      'xhr-streaming',
                      'iframe-eventsource',
                      'iframe-htmlfile',
                      'xdr-polling',
                      'xhr-polling',
                      'iframe-xhr-polling',
                      'jsonp-polling'];

utils.probeProtocols = function() {
    var probed = {};
    for(var i=0; i<_all_protocols.length; i++) {
        var protocol = _all_protocols[i];
        // User can have a typo in protocol name.
        probed[protocol] = SockJS[protocol] &&
                           SockJS[protocol].enabled();
    }
    return probed;
};

utils.detectProtocols = function(probed, protocols_whitelist, info) {
    var pe = {},
        protocols = [];
    if (!protocols_whitelist) protocols_whitelist = _all_protocols;
    for(var i=0; i<protocols_whitelist.length; i++) {
        var protocol = protocols_whitelist[i];
        pe[protocol] = probed[protocol];
    }
    var maybe_push = function(protos) {
        var proto = protos.shift();
        if (pe[proto]) {
            protocols.push(proto);
        } else {
            if (protos.length > 0) {
                maybe_push(protos);
            }
        }
    }

    // 1. Websocket
    if (info.websocket !== false) {
        maybe_push(['websocket']);
    }

    // 2. Streaming
    if (pe['xhr-streaming'] && !info.null_origin) {
        protocols.push('xhr-streaming');
    } else {
        if (pe['xdr-streaming'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-streaming');
        } else {
            maybe_push(['iframe-eventsource',
                        'iframe-htmlfile']);
        }
    }

    // 3. Polling
    if (pe['xhr-polling'] && !info.null_origin) {
        protocols.push('xhr-polling');
    } else {
        if (pe['xdr-polling'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-polling');
        } else {
            maybe_push(['iframe-xhr-polling',
                        'jsonp-polling']);
        }
    }
    return protocols;
}
//         [*] End of lib/utils.js


//         [*] Including lib/dom.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// May be used by htmlfile jsonp and transports.
var MPrefix = '_sockjs_global';
utils.createHook = function() {
    var window_id = 'a' + utils.random_string(8);
    if (!(MPrefix in _window)) {
        var map = {};
        _window[MPrefix] = function(window_id) {
            if (!(window_id in map)) {
                map[window_id] = {
                    id: window_id,
                    del: function() {delete map[window_id];}
                };
            }
            return map[window_id];
        }
    }
    return _window[MPrefix](window_id);
};



utils.attachMessage = function(listener) {
    utils.attachEvent('message', listener);
};
utils.attachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.addEventListener(event, listener, false);
    } else {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        _document.attachEvent("on" + event, listener);
        // I get 'window' for ie8.
        _window.attachEvent("on" + event, listener);
    }
};

utils.detachMessage = function(listener) {
    utils.detachEvent('message', listener);
};
utils.detachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.removeEventListener(event, listener, false);
    } else {
        _document.detachEvent("on" + event, listener);
        _window.detachEvent("on" + event, listener);
    }
};


var on_unload = {};
// Things registered after beforeunload are to be called immediately.
var after_unload = false;

var trigger_unload_callbacks = function() {
    for(var ref in on_unload) {
        on_unload[ref]();
        delete on_unload[ref];
    };
};

var unload_triggered = function() {
    if(after_unload) return;
    after_unload = true;
    trigger_unload_callbacks();
};

// Onbeforeunload alone is not reliable. We could use only 'unload'
// but it's not working in opera within an iframe. Let's use both.
utils.attachEvent('beforeunload', unload_triggered);
utils.attachEvent('unload', unload_triggered);

utils.unload_add = function(listener) {
    var ref = utils.random_string(8);
    on_unload[ref] = listener;
    if (after_unload) {
        utils.delay(trigger_unload_callbacks);
    }
    return ref;
};
utils.unload_del = function(ref) {
    if (ref in on_unload)
        delete on_unload[ref];
};


utils.createIframe = function (iframe_url, error_callback) {
    var iframe = _document.createElement('iframe');
    var tref, unload_ref;
    var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {iframe.onload = null;} catch (x) {}
        iframe.onerror = null;
    };
    var cleanup = function() {
        if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
                if(iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = null;
            }, 0);
            utils.unload_del(unload_ref);
        }
    };
    var onerror = function(r) {
        if (iframe) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    iframe.src = iframe_url;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function(){onerror('onerror');};
    iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function(){onerror('onload timeout');}, 2000);
    };
    _document.body.appendChild(iframe);
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};

utils.createHtmlfile = function (iframe_url, error_callback) {
    var doc = new ActiveXObject('htmlfile');
    var tref, unload_ref;
    var iframe;
    var unattach = function() {
        clearTimeout(tref);
    };
    var cleanup = function() {
        if (doc) {
            unattach();
            utils.unload_del(unload_ref);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
        }
    };
    var onerror = function(r)  {
        if (doc) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[WPrefix] = _window[WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframe_url;
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};
//         [*] End of lib/dom.js


//         [*] Including lib/dom2.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AbstractXHRObject = function(){};
AbstractXHRObject.prototype = new EventEmitter(['chunk', 'finish']);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var that = this;

    try {
        that.xhr = new XMLHttpRequest();
    } catch(x) {};

    if (!that.xhr) {
        try {
            that.xhr = new _window.ActiveXObject('Microsoft.XMLHTTP');
        } catch(x) {};
    }
    if (_window.ActiveXObject || _window.XDomainRequest) {
        // IE8 caches even POSTs
        url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);
    }

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        that.xhr.open(method, url, true);
    } catch(e) {
        // IE raises an exception on wrong port.
        that.emit('finish', 0, '');
        that._cleanup();
        return;
    };

    if (!opts || !opts.no_credentials) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."
        that.xhr.withCredentials = 'true';
    }
    if (opts && opts.headers) {
        for(var key in opts.headers) {
            that.xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    that.xhr.onreadystatechange = function() {
        if (that.xhr) {
            var x = that.xhr;
            switch (x.readyState) {
            case 3:
                // IE doesn't like peeking into responseText or status
                // on Microsoft.XMLHTTP and readystate=3
                try {
                    var status = x.status;
                    var text = x.responseText;
                } catch (x) {};
                // IE does return readystate == 3 for 404 answers.
                if (text && text.length > 0) {
                    that.emit('chunk', status, text);
                }
                break;
            case 4:
                that.emit('finish', x.status, x.responseText);
                that._cleanup(false);
                break;
            }
        }
    };
    that.xhr.send(payload);
};

AbstractXHRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xhr) return;
    utils.unload_del(that.unload_ref);

    // IE needs this field to be a function
    that.xhr.onreadystatechange = function(){};

    if (abort) {
        try {
            that.xhr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

var XHRCorsObject = utils.XHRCorsObject = function() {
    var that = this, args = arguments;
    utils.delay(function(){that._start.apply(that, args);});
};
XHRCorsObject.prototype = new AbstractXHRObject();

var XHRLocalObject = utils.XHRLocalObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){
        that._start(method, url, payload, {
            no_credentials: true
        });
    });
};
XHRLocalObject.prototype = new AbstractXHRObject();



// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
var XDRObject = utils.XDRObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){that._start(method, url, payload);});
};
XDRObject.prototype = new EventEmitter(['chunk', 'finish']);
XDRObject.prototype._start = function(method, url, payload) {
    var that = this;
    var xdr = new XDomainRequest();
    // IE caches even POSTs
    url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);

    var onerror = xdr.ontimeout = xdr.onerror = function() {
        that.emit('finish', 0, '');
        that._cleanup(false);
    };
    xdr.onprogress = function() {
        that.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
        that.emit('finish', 200, xdr.responseText);
        that._cleanup(false);
    };
    that.xdr = xdr;
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        // Fails with AccessDenied if port number is bogus
        that.xdr.open(method, url);
        that.xdr.send(payload);
    } catch(x) {
        onerror();
    }
};

XDRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xdr) return;
    utils.unload_del(that.unload_ref);

    that.xdr.ontimeout = that.xdr.onerror = that.xdr.onprogress =
        that.xdr.onload = null;
    if (abort) {
        try {
            that.xdr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xdr = null;
};

XDRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

// 1. Is natively via XHR
// 2. Is natively via XDR
// 3. Nope, but postMessage is there so it should work via the Iframe.
// 4. Nope, sorry.
utils.isXHRCorsCapable = function() {
    if (_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        return 1;
    }
    // XDomainRequest doesn't work if page is served from file://
    if (_window.XDomainRequest && _document.domain) {
        return 2;
    }
    if (IframeTransport.enabled()) {
        return 3;
    }
    return 4;
};
//         [*] End of lib/dom2.js


//         [*] Including lib/sockjs.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SockJS = function(url, dep_protocols_whitelist, options) {
    if (this === window) {
        // makes `new` optional
        return new SockJS(url, dep_protocols_whitelist, options);
    }
    
    var that = this, protocols_whitelist;
    that._options = {devel: false, debug: false, protocols_whitelist: [],
                     info: undefined, rtt: undefined};
    if (options) {
        utils.objectExtend(that._options, options);
    }
    that._base_url = utils.amendUrl(url);
    that._server = that._options.server || utils.random_number_string(1000);
    if (that._options.protocols_whitelist &&
        that._options.protocols_whitelist.length) {
        protocols_whitelist = that._options.protocols_whitelist;
    } else {
        // Deprecated API
        if (typeof dep_protocols_whitelist === 'string' &&
            dep_protocols_whitelist.length > 0) {
            protocols_whitelist = [dep_protocols_whitelist];
        } else if (utils.isArray(dep_protocols_whitelist)) {
            protocols_whitelist = dep_protocols_whitelist
        } else {
            protocols_whitelist = null;
        }
        if (protocols_whitelist) {
            that._debug('Deprecated API: Use "protocols_whitelist" option ' +
                        'instead of supplying protocol list as a second ' +
                        'parameter to SockJS constructor.');
        }
    }
    that._protocols = [];
    that.protocol = null;
    that.readyState = SockJS.CONNECTING;
    that._ir = createInfoReceiver(that._base_url);
    that._ir.onfinish = function(info, rtt) {
        that._ir = null;
        if (info) {
            if (that._options.info) {
                // Override if user supplies the option
                info = utils.objectExtend(info, that._options.info);
            }
            if (that._options.rtt) {
                rtt = that._options.rtt;
            }
            that._applyInfo(info, rtt, protocols_whitelist);
            that._didClose();
        } else {
            that._didClose(1002, 'Can\'t connect to server', true);
        }
    };
};
// Inheritance
SockJS.prototype = new REventTarget();

SockJS.version = "0.3.1.7.ga67f.dirty";

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._debug = function() {
    if (this._options.debug)
        utils.log.apply(utils, arguments);
};

SockJS.prototype._dispatchOpen = function() {
    var that = this;
    if (that.readyState === SockJS.CONNECTING) {
        if (that._transport_tref) {
            clearTimeout(that._transport_tref);
            that._transport_tref = null;
        }
        that.readyState = SockJS.OPEN;
        that.dispatchEvent(new SimpleEvent("open"));
    } else {
        // The server might have been restarted, and lost track of our
        // connection.
        that._didClose(1006, "Server lost session");
    }
};

SockJS.prototype._dispatchMessage = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
            return;
    that.dispatchEvent(new SimpleEvent("message", {data: data}));
};

SockJS.prototype._dispatchHeartbeat = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
        return;
    that.dispatchEvent(new SimpleEvent('heartbeat', {}));
};

SockJS.prototype._didClose = function(code, reason, force) {
    var that = this;
    if (that.readyState !== SockJS.CONNECTING &&
        that.readyState !== SockJS.OPEN &&
        that.readyState !== SockJS.CLOSING)
            throw new Error('INVALID_STATE_ERR');
    if (that._ir) {
        that._ir.nuke();
        that._ir = null;
    }

    if (that._transport) {
        that._transport.doCleanup();
        that._transport = null;
    }

    var close_event = new SimpleEvent("close", {
        code: code,
        reason: reason,
        wasClean: utils.userSetCode(code)});

    if (!utils.userSetCode(code) &&
        that.readyState === SockJS.CONNECTING && !force) {
        if (that._try_next_protocol(close_event)) {
            return;
        }
        close_event = new SimpleEvent("close", {code: 2000,
                                                reason: "All transports failed",
                                                wasClean: false,
                                                last_event: close_event});
    }
    that.readyState = SockJS.CLOSED;

    utils.delay(function() {
                   that.dispatchEvent(close_event);
                });
};

SockJS.prototype._didMessage = function(data) {
    var that = this;
    var type = data.slice(0, 1);
    switch(type) {
    case 'o':
        that._dispatchOpen();
        break;
    case 'a':
        var payload = JSON.parse(data.slice(1) || '[]');
        for(var i=0; i < payload.length; i++){
            that._dispatchMessage(payload[i]);
        }
        break;
    case 'm':
        var payload = JSON.parse(data.slice(1) || 'null');
        that._dispatchMessage(payload);
        break;
    case 'c':
        var payload = JSON.parse(data.slice(1) || '[]');
        that._didClose(payload[0], payload[1]);
        break;
    case 'h':
        that._dispatchHeartbeat();
        break;
    }
};

SockJS.prototype._try_next_protocol = function(close_event) {
    var that = this;
    if (that.protocol) {
        that._debug('Closed transport:', that.protocol, ''+close_event);
        that.protocol = null;
    }
    if (that._transport_tref) {
        clearTimeout(that._transport_tref);
        that._transport_tref = null;
    }

    while(1) {
        var protocol = that.protocol = that._protocols.shift();
        if (!protocol) {
            return false;
        }
        // Some protocols require access to `body`, what if were in
        // the `head`?
        if (SockJS[protocol] &&
            SockJS[protocol].need_body === true &&
            (!_document.body ||
             (typeof _document.readyState !== 'undefined'
              && _document.readyState !== 'complete'))) {
            that._protocols.unshift(protocol);
            that.protocol = 'waiting-for-load';
            utils.attachEvent('load', function(){
                that._try_next_protocol();
            });
            return true;
        }

        if (!SockJS[protocol] ||
              !SockJS[protocol].enabled(that._options)) {
            that._debug('Skipping transport:', protocol);
        } else {
            var roundTrips = SockJS[protocol].roundTrips || 1;
            var to = ((that._options.rto || 0) * roundTrips) || 5000;
            that._transport_tref = utils.delay(to, function() {
                if (that.readyState === SockJS.CONNECTING) {
                    // I can't understand how it is possible to run
                    // this timer, when the state is CLOSED, but
                    // apparently in IE everythin is possible.
                    that._didClose(2007, "Transport timeouted");
                }
            });

            var connid = utils.random_string(8);
            var trans_url = that._base_url + '/' + that._server + '/' + connid;
            that._debug('Opening transport:', protocol, ' url:'+trans_url,
                        ' RTO:'+that._options.rto);
            that._transport = new SockJS[protocol](that, trans_url,
                                                   that._base_url);
            return true;
        }
    }
};

SockJS.prototype.close = function(code, reason) {
    var that = this;
    if (code && !utils.userSetCode(code))
        throw new Error("INVALID_ACCESS_ERR");
    if(that.readyState !== SockJS.CONNECTING &&
       that.readyState !== SockJS.OPEN) {
        return false;
    }
    that.readyState = SockJS.CLOSING;
    that._didClose(code || 1000, reason || "Normal closure");
    return true;
};

SockJS.prototype.send = function(data) {
    var that = this;
    if (that.readyState === SockJS.CONNECTING)
        throw new Error('INVALID_STATE_ERR');
    if (that.readyState === SockJS.OPEN) {
        that._transport.doSend(utils.quote('' + data));
    }
    return true;
};

SockJS.prototype._applyInfo = function(info, rtt, protocols_whitelist) {
    var that = this;
    that._options.info = info;
    that._options.rtt = rtt;
    that._options.rto = utils.countRTO(rtt);
    that._options.info.null_origin = !_document.domain;
    var probed = utils.probeProtocols();
    that._protocols = utils.detectProtocols(probed, protocols_whitelist, info);
};
//         [*] End of lib/sockjs.js


//         [*] Including lib/trans-websocket.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var WebSocketTransport = SockJS.websocket = function(ri, trans_url) {
    var that = this;
    var url = trans_url + '/websocket';
    if (url.slice(0, 5) === 'https') {
        url = 'wss' + url.slice(5);
    } else {
        url = 'ws' + url.slice(4);
    }
    that.ri = ri;
    that.url = url;
    var Constructor = _window.WebSocket || _window.MozWebSocket;

    that.ws = new Constructor(that.url);
    that.ws.onmessage = function(e) {
        that.ri._didMessage(e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onbeforeunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    that.unload_ref = utils.unload_add(function(){that.ws.close()});
    that.ws.onclose = function() {
        that.ri._didMessage(utils.closeFrame(1006, "WebSocket connection broken"));
    };
};

WebSocketTransport.prototype.doSend = function(data) {
    this.ws.send('[' + data + ']');
};

WebSocketTransport.prototype.doCleanup = function() {
    var that = this;
    var ws = that.ws;
    if (ws) {
        ws.onmessage = ws.onclose = null;
        ws.close();
        utils.unload_del(that.unload_ref);
        that.unload_ref = that.ri = that.ws = null;
    }
};

WebSocketTransport.enabled = function() {
    return !!(_window.WebSocket || _window.MozWebSocket);
};

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;
//         [*] End of lib/trans-websocket.js


//         [*] Including lib/trans-sender.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var BufferedSender = function() {};
BufferedSender.prototype.send_constructor = function(sender) {
    var that = this;
    that.send_buffer = [];
    that.sender = sender;
};
BufferedSender.prototype.doSend = function(message) {
    var that = this;
    that.send_buffer.push(message);
    if (!that.send_stop) {
        that.send_schedule();
    }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.send_schedule_wait = function() {
    var that = this;
    var tref;
    that.send_stop = function() {
        that.send_stop = null;
        clearTimeout(tref);
    };
    tref = utils.delay(25, function() {
        that.send_stop = null;
        that.send_schedule();
    });
};

BufferedSender.prototype.send_schedule = function() {
    var that = this;
    if (that.send_buffer.length > 0) {
        var payload = '[' + that.send_buffer.join(',') + ']';
        that.send_stop = that.sender(that.trans_url,
                                     payload,
                                     function() {
                                         that.send_stop = null;
                                         that.send_schedule_wait();
                                     });
        that.send_buffer = [];
    }
};

BufferedSender.prototype.send_destructor = function() {
    var that = this;
    if (that._send_stop) {
        that._send_stop();
    }
    that._send_stop = null;
};

var jsonPGenericSender = function(url, payload, callback) {
    var that = this;

    if (!('_send_form' in that)) {
        var form = that._send_form = _document.createElement('form');
        var area = that._send_area = _document.createElement('textarea');
        area.name = 'd';
        form.style.display = 'none';
        form.style.position = 'absolute';
        form.method = 'POST';
        form.enctype = 'application/x-www-form-urlencoded';
        form.acceptCharset = "UTF-8";
        form.appendChild(area);
        _document.body.appendChild(form);
    }
    var form = that._send_form;
    var area = that._send_area;
    var id = 'a' + utils.random_string(8);
    form.target = id;
    form.action = url + '/jsonp_send?i=' + id;

    var iframe;
    try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = _document.createElement('<iframe name="'+ id +'">');
    } catch(x) {
        iframe = _document.createElement('iframe');
        iframe.name = id;
    }
    iframe.id = id;
    form.appendChild(iframe);
    iframe.style.display = 'none';

    try {
        area.value = payload;
    } catch(e) {
        utils.log('Your browser is seriously broken. Go home! ' + e.message);
    }
    form.submit();

    var completed = function(e) {
        if (!iframe.onerror) return;
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        utils.delay(500, function() {
                       iframe.parentNode.removeChild(iframe);
                       iframe = null;
                   });
        area.value = '';
        callback();
    };
    iframe.onerror = iframe.onload = completed;
    iframe.onreadystatechange = function(e) {
        if (iframe.readyState == 'complete') completed();
    };
    return completed;
};

var createAjaxSender = function(AjaxObject) {
    return function(url, payload, callback) {
        var xo = new AjaxObject('POST', url + '/xhr_send', payload);
        xo.onfinish = function(status, text) {
            callback(status);
        };
        return function(abort_reason) {
            callback(0, abort_reason);
        };
    };
};
//         [*] End of lib/trans-sender.js


//         [*] Including lib/trans-jsonp-receiver.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Parts derived from Socket.io:
//    https://github.com/LearnBoost/socket.io/blob/0.6.17/lib/socket.io/transports/jsonp-polling.js
// and jQuery-JSONP:
//    https://code.google.com/p/jquery-jsonp/source/browse/trunk/core/jquery.jsonp.js
var jsonPGenericReceiver = function(url, callback) {
    var tref;
    var script = _document.createElement('script');
    var script2;  // Opera synchronous load trick.
    var close_script = function(frame) {
        if (script2) {
            script2.parentNode.removeChild(script2);
            script2 = null;
        }
        if (script) {
            clearTimeout(tref);
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror =
                script.onload = script.onclick = null;
            script = null;
            callback(frame);
            callback = null;
        }
    };

    // IE9 fires 'error' event after orsc or before, in random order.
    var loaded_okay = false;
    var error_timer = null;

    script.id = 'a' + utils.random_string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = function(e) {
        if (!error_timer) {
            // Delay firing close_script.
            error_timer = setTimeout(function() {
                if (!loaded_okay) {
                    close_script(utils.closeFrame(
                        1006,
                        "JSONP script loaded abnormally (onerror)"));
                }
            }, 1000);
        }
    };
    script.onload = function(e) {
        close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onload)"));
    };

    script.onreadystatechange = function(e) {
        if (/loaded|closed/.test(script.readyState)) {
            if (script && script.htmlFor && script.onclick) {
                loaded_okay = true;
                try {
                    // In IE, actually execute the script.
                    script.onclick();
                } catch (x) {}
            }
            if (script) {
                close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"));
            }
        }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && _document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!/opera/i.test(navigator.userAgent)) {
            // Naively assume we're in IE
            try {
                script.htmlFor = script.id;
                script.event = "onclick";
            } catch (x) {}
            script.async = true;
        } else {
            // Opera, second sync script hack
            script2 = _document.createElement('script');
            script2.text = "try{var a = document.getElementById('"+script.id+"'); if(a)a.onerror();}catch(x){};";
            script.async = script2.async = false;
        }
    }
    if (typeof script.async !== 'undefined') {
        script.async = true;
    }

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    tref = setTimeout(function() {
                          close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (timeout)"));
                      }, 35000);

    var head = _document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
        head.insertBefore(script2, head.firstChild);
    }
    return close_script;
};
//         [*] End of lib/trans-jsonp-receiver.js


//         [*] Including lib/trans-jsonp-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// mssage could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors


var JsonPTransport = SockJS['jsonp-polling'] = function(ri, trans_url) {
    utils.polluteGlobalNamespace();
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(jsonPGenericSender);
    that._schedule_recv();
};

// Inheritnace
JsonPTransport.prototype = new BufferedSender();

JsonPTransport.prototype._schedule_recv = function() {
    var that = this;
    var callback = function(data) {
        that._recv_stop = null;
        if (data) {
            // no data - heartbeat;
            if (!that._is_closing) {
                that.ri._didMessage(data);
            }
        }
        // The message can be a close message, and change is_closing state.
        if (!that._is_closing) {
            that._schedule_recv();
        }
    };
    that._recv_stop = jsonPReceiverWrapper(that.trans_url + '/jsonp',
                                           jsonPGenericReceiver, callback);
};

JsonPTransport.enabled = function() {
    return true;
};

JsonPTransport.need_body = true;


JsonPTransport.prototype.doCleanup = function() {
    var that = this;
    that._is_closing = true;
    if (that._recv_stop) {
        that._recv_stop();
    }
    that.ri = that._recv_stop = null;
    that.send_destructor();
};


// Abstract away code that handles global namespace pollution.
var jsonPReceiverWrapper = function(url, constructReceiver, user_callback) {
    var id = 'a' + utils.random_string(6);
    var url_id = url + '?c=' + escape(WPrefix + '.' + id);
    // Callback will be called exactly once.
    var callback = function(frame) {
        delete _window[WPrefix][id];
        user_callback(frame);
    };

    var close_script = constructReceiver(url_id, callback);
    _window[WPrefix][id] = close_script;
    var stop = function() {
        if (_window[WPrefix][id]) {
            _window[WPrefix][id](utils.closeFrame(1000, "JSONP user aborted read"));
        }
    };
    return stop;
};
//         [*] End of lib/trans-jsonp-polling.js


//         [*] Including lib/trans-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AjaxBasedTransport = function() {};
AjaxBasedTransport.prototype = new BufferedSender();

AjaxBasedTransport.prototype.run = function(ri, trans_url,
                                            url_suffix, Receiver, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(createAjaxSender(AjaxObject));
    that.poll = new Polling(ri, Receiver,
                            trans_url + url_suffix, AjaxObject);
};

AjaxBasedTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.poll) {
        that.poll.abort();
        that.poll = null;
    }
};

// xhr-streaming
var XhrStreamingTransport = SockJS['xhr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XHRCorsObject);
};

XhrStreamingTransport.prototype = new AjaxBasedTransport();

XhrStreamingTransport.enabled = function() {
    // Support for CORS Ajax aka Ajax2? Opera 12 claims CORS but
    // doesn't do streaming.
    return (_window.XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest() &&
            (!/opera/i.test(navigator.userAgent)));
};
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
XhrStreamingTransport.need_body = true;


// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/


// xdr-streaming
var XdrStreamingTransport = SockJS['xdr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XDRObject);
};

XdrStreamingTransport.prototype = new AjaxBasedTransport();

XdrStreamingTransport.enabled = function() {
    return !!_window.XDomainRequest;
};
XdrStreamingTransport.roundTrips = 2; // preflight, ajax



// xhr-polling
var XhrPollingTransport = SockJS['xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRCorsObject);
};

XhrPollingTransport.prototype = new AjaxBasedTransport();

XhrPollingTransport.enabled = XhrStreamingTransport.enabled;
XhrPollingTransport.roundTrips = 2; // preflight, ajax


// xdr-polling
var XdrPollingTransport = SockJS['xdr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XDRObject);
};

XdrPollingTransport.prototype = new AjaxBasedTransport();

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.roundTrips = 2; // preflight, ajax
//         [*] End of lib/trans-xhr.js


//         [*] Including lib/trans-iframe.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Few cool transports do work only for same-origin. In order to make
// them working cross-domain we shall use iframe, served form the
// remote domain. New browsers, have capabilities to communicate with
// cross domain iframe, using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var IframeTransport = function() {};

IframeTransport.prototype.i_constructor = function(ri, trans_url, base_url) {
    var that = this;
    that.ri = ri;
    that.origin = utils.getOrigin(base_url);
    that.base_url = base_url;
    that.trans_url = trans_url;

    var iframe_url = base_url + '/iframe.html';
    if (that.ri._options.devel) {
        iframe_url += '?t=' + (+new Date);
    }
    that.window_id = utils.random_string(8);
    iframe_url += '#' + that.window_id;

    that.iframeObj = utils.createIframe(iframe_url, function(r) {
                                            that.ri._didClose(1006, "Unable to load an iframe (" + r + ")");
                                        });

    that.onmessage_cb = utils.bind(that.onmessage, that);
    utils.attachMessage(that.onmessage_cb);
};

IframeTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.iframeObj) {
        utils.detachMessage(that.onmessage_cb);
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (that.iframeObj.iframe.contentWindow) {
                that.postMessage('c');
            }
        } catch (x) {}
        that.iframeObj.cleanup();
        that.iframeObj = null;
        that.onmessage_cb = that.iframeObj = null;
    }
};

IframeTransport.prototype.onmessage = function(e) {
    var that = this;
    if (e.origin !== that.origin) return;
    var window_id = e.data.slice(0, 8);
    var type = e.data.slice(8, 9);
    var data = e.data.slice(9);

    if (window_id !== that.window_id) return;

    switch(type) {
    case 's':
        that.iframeObj.loaded();
        that.postMessage('s', JSON.stringify([SockJS.version, that.protocol, that.trans_url, that.base_url]));
        break;
    case 't':
        that.ri._didMessage(data);
        break;
    }
};

IframeTransport.prototype.postMessage = function(type, data) {
    var that = this;
    that.iframeObj.post(that.window_id + type + (data || ''), that.origin);
};

IframeTransport.prototype.doSend = function (message) {
    this.postMessage('m', message);
};

IframeTransport.enabled = function() {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
    return ((typeof _window.postMessage === 'function' ||
            typeof _window.postMessage === 'object') && (!konqueror));
};
//         [*] End of lib/trans-iframe.js


//         [*] Including lib/trans-iframe-within.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var curr_window_id;

var postMessage = function (type, data) {
    if(parent !== _window) {
        parent.postMessage(curr_window_id + type + (data || ''), '*');
    } else {
        utils.log("Can't postMessage, no parent window.", type, data);
    }
};

var FacadeJS = function() {};
FacadeJS.prototype._didClose = function (code, reason) {
    postMessage('t', utils.closeFrame(code, reason));
};
FacadeJS.prototype._didMessage = function (frame) {
    postMessage('t', frame);
};
FacadeJS.prototype._doSend = function (data) {
    this._transport.doSend(data);
};
FacadeJS.prototype._doCleanup = function () {
    this._transport.doCleanup();
};

utils.parent_origin = undefined;

SockJS.bootstrap_iframe = function() {
    var facade;
    curr_window_id = _document.location.hash.slice(1);
    var onMessage = function(e) {
        if(e.source !== parent) return;
        if(typeof utils.parent_origin === 'undefined')
            utils.parent_origin = e.origin;
        if (e.origin !== utils.parent_origin) return;

        var window_id = e.data.slice(0, 8);
        var type = e.data.slice(8, 9);
        var data = e.data.slice(9);
        if (window_id !== curr_window_id) return;
        switch(type) {
        case 's':
            var p = JSON.parse(data);
            var version = p[0];
            var protocol = p[1];
            var trans_url = p[2];
            var base_url = p[3];
            if (version !== SockJS.version) {
                utils.log("Incompatibile SockJS! Main site uses:" +
                          " \"" + version + "\", the iframe:" +
                          " \"" + SockJS.version + "\".");
            }
            if (!utils.flatUrl(trans_url) || !utils.flatUrl(base_url)) {
                utils.log("Only basic urls are supported in SockJS");
                return;
            }

            if (!utils.isSameOriginUrl(trans_url) ||
                !utils.isSameOriginUrl(base_url)) {
                utils.log("Can't connect to different domain from within an " +
                          "iframe. (" + JSON.stringify([_window.location.href, trans_url, base_url]) +
                          ")");
                return;
            }
            facade = new FacadeJS();
            facade._transport = new FacadeJS[protocol](facade, trans_url, base_url);
            break;
        case 'm':
            facade._doSend(data);
            break;
        case 'c':
            if (facade)
                facade._doCleanup();
            facade = null;
            break;
        }
    };

    // alert('test ticker');
    // facade = new FacadeJS();
    // facade._transport = new FacadeJS['w-iframe-xhr-polling'](facade, 'http://host.com:9999/ticker/12/basd');

    utils.attachMessage(onMessage);

    // Start
    postMessage('s');
};
//         [*] End of lib/trans-iframe-within.js


//         [*] Including lib/info.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var InfoReceiver = function(base_url, AjaxObject) {
    var that = this;
    utils.delay(function(){that.doXhr(base_url, AjaxObject);});
};

InfoReceiver.prototype = new EventEmitter(['finish']);

InfoReceiver.prototype.doXhr = function(base_url, AjaxObject) {
    var that = this;
    var t0 = (new Date()).getTime();
    var xo = new AjaxObject('GET', base_url + '/info');

    var tref = utils.delay(8000,
                           function(){xo.ontimeout();});

    xo.onfinish = function(status, text) {
        clearTimeout(tref);
        tref = null;
        if (status === 200) {
            var rtt = (new Date()).getTime() - t0;
            var info = JSON.parse(text);
            if (typeof info !== 'object') info = {};
            that.emit('finish', info, rtt);
        } else {
            that.emit('finish');
        }
    };
    xo.ontimeout = function() {
        xo.close();
        that.emit('finish');
    };
};

var InfoReceiverIframe = function(base_url) {
    var that = this;
    var go = function() {
        var ifr = new IframeTransport();
        ifr.protocol = 'w-iframe-info-receiver';
        var fun = function(r) {
            if (typeof r === 'string' && r.substr(0,1) === 'm') {
                var d = JSON.parse(r.substr(1));
                var info = d[0], rtt = d[1];
                that.emit('finish', info, rtt);
            } else {
                that.emit('finish');
            }
            ifr.doCleanup();
            ifr = null;
        };
        var mock_ri = {
            _options: {},
            _didClose: fun,
            _didMessage: fun
        };
        ifr.i_constructor(mock_ri, base_url, base_url);
    }
    if(!_document.body) {
        utils.attachEvent('load', go);
    } else {
        go();
    }
};
InfoReceiverIframe.prototype = new EventEmitter(['finish']);


var InfoReceiverFake = function() {
    // It may not be possible to do cross domain AJAX to get the info
    // data, for example for IE7. But we want to run JSONP, so let's
    // fake the response, with rtt=2s (rto=6s).
    var that = this;
    utils.delay(function() {
        that.emit('finish', {}, 2000);
    });
};
InfoReceiverFake.prototype = new EventEmitter(['finish']);

var createInfoReceiver = function(base_url) {
    if (utils.isSameOriginUrl(base_url)) {
        // If, for some reason, we have SockJS locally - there's no
        // need to start up the complex machinery. Just use ajax.
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    }
    switch (utils.isXHRCorsCapable()) {
    case 1:
        return new InfoReceiver(base_url, utils.XHRCorsObject);
    case 2:
        return new InfoReceiver(base_url, utils.XDRObject);
    case 3:
        // Opera
        return new InfoReceiverIframe(base_url);
    default:
        // IE 7
        return new InfoReceiverFake();
    };
};


var WInfoReceiverIframe = FacadeJS['w-iframe-info-receiver'] = function(ri, _trans_url, base_url) {
    var ir = new InfoReceiver(base_url, utils.XHRLocalObject);
    ir.onfinish = function(info, rtt) {
        ri._didMessage('m'+JSON.stringify([info, rtt]));
        ri._didClose();
    }
};
WInfoReceiverIframe.prototype.doCleanup = function() {};
//         [*] End of lib/info.js


//         [*] Including lib/trans-iframe-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceIframeTransport = SockJS['iframe-eventsource'] = function () {
    var that = this;
    that.protocol = 'w-iframe-eventsource';
    that.i_constructor.apply(that, arguments);
};

EventSourceIframeTransport.prototype = new IframeTransport();

EventSourceIframeTransport.enabled = function () {
    return ('EventSource' in _window) && IframeTransport.enabled();
};

EventSourceIframeTransport.need_body = true;
EventSourceIframeTransport.roundTrips = 3; // html, javascript, eventsource


// w-iframe-eventsource
var EventSourceTransport = FacadeJS['w-iframe-eventsource'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/eventsource', EventSourceReceiver, utils.XHRLocalObject);
}
EventSourceTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-eventsource.js


//         [*] Including lib/trans-iframe-xhr-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrPollingIframeTransport = SockJS['iframe-xhr-polling'] = function () {
    var that = this;
    that.protocol = 'w-iframe-xhr-polling';
    that.i_constructor.apply(that, arguments);
};

XhrPollingIframeTransport.prototype = new IframeTransport();

XhrPollingIframeTransport.enabled = function () {
    return _window.XMLHttpRequest && IframeTransport.enabled();
};

XhrPollingIframeTransport.need_body = true;
XhrPollingIframeTransport.roundTrips = 3; // html, javascript, xhr


// w-iframe-xhr-polling
var XhrPollingITransport = FacadeJS['w-iframe-xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRLocalObject);
};

XhrPollingITransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-xhr-polling.js


//         [*] Including lib/trans-iframe-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// This transport generally works in any browser, but will cause a
// spinning cursor to appear in any browser other than IE.
// We may test this transport in all browsers - why not, but in
// production it should be only run in IE.

var HtmlFileIframeTransport = SockJS['iframe-htmlfile'] = function () {
    var that = this;
    that.protocol = 'w-iframe-htmlfile';
    that.i_constructor.apply(that, arguments);
};

// Inheritance.
HtmlFileIframeTransport.prototype = new IframeTransport();

HtmlFileIframeTransport.enabled = function() {
    return IframeTransport.enabled();
};

HtmlFileIframeTransport.need_body = true;
HtmlFileIframeTransport.roundTrips = 3; // html, javascript, htmlfile


// w-iframe-htmlfile
var HtmlFileTransport = FacadeJS['w-iframe-htmlfile'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/htmlfile', HtmlfileReceiver, utils.XHRLocalObject);
};
HtmlFileTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-htmlfile.js


//         [*] Including lib/trans-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var Polling = function(ri, Receiver, recv_url, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.Receiver = Receiver;
    that.recv_url = recv_url;
    that.AjaxObject = AjaxObject;
    that._scheduleRecv();
};

Polling.prototype._scheduleRecv = function() {
    var that = this;
    var poll = that.poll = new that.Receiver(that.recv_url, that.AjaxObject);
    var msg_counter = 0;
    poll.onmessage = function(e) {
        msg_counter += 1;
        that.ri._didMessage(e.data);
    };
    poll.onclose = function(e) {
        that.poll = poll = poll.onmessage = poll.onclose = null;
        if (!that.poll_is_closing) {
            if (e.reason === 'permanent') {
                that.ri._didClose(1006, 'Polling error (' + e.reason + ')');
            } else {
                that._scheduleRecv();
            }
        }
    };
};

Polling.prototype.abort = function() {
    var that = this;
    that.poll_is_closing = true;
    if (that.poll) {
        that.poll.abort();
    }
};
//         [*] End of lib/trans-polling.js


//         [*] Including lib/trans-receiver-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceReceiver = function(url) {
    var that = this;
    var es = new EventSource(url);
    es.onmessage = function(e) {
        that.dispatchEvent(new SimpleEvent('message',
                                           {'data': unescape(e.data)}));
    };
    that.es_close = es.onerror = function(e, abort_reason) {
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = abort_reason ? 'user' :
            (es.readyState !== 2 ? 'network' : 'permanent');
        that.es_close = es.onmessage = es.onerror = null;
        // EventSource reconnects automatically.
        es.close();
        es = null;
        // Safari and chrome < 15 crash if we close window before
        // waiting for ES cleanup. See:
        //   https://code.google.com/p/chromium/issues/detail?id=89155
        utils.delay(200, function() {
                        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
                    });
    };
};

EventSourceReceiver.prototype = new REventTarget();

EventSourceReceiver.prototype.abort = function() {
    var that = this;
    if (that.es_close) {
        that.es_close({}, true);
    }
};
//         [*] End of lib/trans-receiver-eventsource.js


//         [*] Including lib/trans-receiver-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var _is_ie_htmlfile_capable;
var isIeHtmlfileCapable = function() {
    if (_is_ie_htmlfile_capable === undefined) {
        if ('ActiveXObject' in _window) {
            try {
                _is_ie_htmlfile_capable = !!new ActiveXObject('htmlfile');
            } catch (x) {}
        } else {
            _is_ie_htmlfile_capable = false;
        }
    }
    return _is_ie_htmlfile_capable;
};


var HtmlfileReceiver = function(url) {
    var that = this;
    utils.polluteGlobalNamespace();

    that.id = 'a' + utils.random_string(6, 26);
    url += ((url.indexOf('?') === -1) ? '?' : '&') +
        'c=' + escape(WPrefix + '.' + that.id);

    var constructor = isIeHtmlfileCapable() ?
        utils.createHtmlfile : utils.createIframe;

    var iframeObj;
    _window[WPrefix][that.id] = {
        start: function () {
            iframeObj.loaded();
        },
        message: function (data) {
            that.dispatchEvent(new SimpleEvent('message', {'data': data}));
        },
        stop: function () {
            that.iframe_close({}, 'network');
        }
    };
    that.iframe_close = function(e, abort_reason) {
        iframeObj.cleanup();
        that.iframe_close = iframeObj = null;
        delete _window[WPrefix][that.id];
        that.dispatchEvent(new SimpleEvent('close', {reason: abort_reason}));
    };
    iframeObj = constructor(url, function(e) {
                                that.iframe_close({}, 'permanent');
                            });
};

HtmlfileReceiver.prototype = new REventTarget();

HtmlfileReceiver.prototype.abort = function() {
    var that = this;
    if (that.iframe_close) {
        that.iframe_close({}, 'user');
    }
};
//         [*] End of lib/trans-receiver-htmlfile.js


//         [*] Including lib/trans-receiver-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrReceiver = function(url, AjaxObject) {
    var that = this;
    var buf_pos = 0;

    that.xo = new AjaxObject('POST', url, null);
    that.xo.onchunk = function(status, text) {
        if (status !== 200) return;
        while (1) {
            var buf = text.slice(buf_pos);
            var p = buf.indexOf('\n');
            if (p === -1) break;
            buf_pos += p+1;
            var msg = buf.slice(0, p);
            that.dispatchEvent(new SimpleEvent('message', {data: msg}));
        }
    };
    that.xo.onfinish = function(status, text) {
        that.xo.onchunk(status, text);
        that.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
    }
};

XhrReceiver.prototype = new REventTarget();

XhrReceiver.prototype.abort = function() {
    var that = this;
    if (that.xo) {
        that.xo.close();
        that.dispatchEvent(new SimpleEvent('close', {reason: 'user'}));
        that.xo = null;
    }
};
//         [*] End of lib/trans-receiver-xhr.js


//         [*] Including lib/test-hooks.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// For testing
SockJS.getUtils = function(){
    return utils;
};

SockJS.getIframeTransport = function(){
    return IframeTransport;
};
//         [*] End of lib/test-hooks.js

                  return SockJS;
          })();
if ('_sockjs_onload' in window) setTimeout(_sockjs_onload, 1);

// AMD compliance
if (typeof define === 'function' && define.amd) {
    define('sockjs', [], function(){return SockJS;});
}

if (typeof module === 'object' && module && module.exports) {
    module.exports = SockJS;
}
//     [*] End of lib/index.js

// [*] End of lib/all.js


},{}],107:[function(require,module,exports){
var traverse = module.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f },
            after : function (f) { modifiers.after = f },
            pre : function (f) { modifiers.pre = f },
            post : function (f) { modifiers.post = f },
            stop : function () { alive = false },
            block : function () { keepGoing = false }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node)
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src.getTime ? src.getTime() : src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
    return key in obj;
};

},{}],108:[function(require,module,exports){
(function (process){
var cSpawn = require('child_process').spawn;
var os = require('os').type();

exports = module.exports = spawn;
function spawn(command, args, options) {
  if (os === 'Windows_NT') {
    command = command.replace(/\//g, '\\');
    
    if (command === 'rm') {
      command = 'rmdir';
      if (args[0] === '-rf' || args[0] == '-fr') {
        args[0] = '/q';
        args.unshift('/s');
      }
      if (args[0] === '-f') {
        args[0] = '/q';
      }
      if (args[0] === '-r') {
        args[0] = '/s';
      }
    }
    args = args || [];
    options = options || {};
    var match, matchA;
    if (matchA = /((?:[A-Z_]+\=[^ \=]+ )+)?([^\r\n]+)/.exec(command)) {
      try {
        var file = require('fs').readFileSync(matchA[2], 'utf8');
        if (match = /\#\!\/usr\/bin\/env ([^\r\n]+)/.exec(file)) {
          args.unshift(matchA[2]);
          command = (matchA[1] || '') + match[1];
        }
      } catch (ex) { }
    }

    if (match = /((?:[A-Z_]+\=[^ \=]+ )+)([^\r\n]+)/.exec(command)) {
      command = match[2];

      options.env = options.env || shallowClone(process.env);

      var env = match[1].split(' ');
      env.forEach(function (v) {
        v = v.split('=');
        if (v.length === 2) {
          options.env[v[0]] = v[1];
        }
      });
    }

    args.unshift(command);
    args.unshift('/c');
    args.unshift('/d');
    command = 'cmd';
  }
  return cSpawn(command, args, options);
}

function shallowClone(obj) {
  var out = {};
  Object.keys(obj)
    .forEach(function (key) {
      out[key] = obj[key];
    });
  return out;
}
}).call(this,require('_process'))
},{"_process":31,"child_process":18,"fs":18,"os":30}],109:[function(require,module,exports){
(function (process,__dirname){
// Generated by CoffeeScript 1.7.1
(function() {
  var dnode, http, onSignal, phanta, shoe, spawn, startPhantomProcess, wrap,
    __slice = [].slice;

  dnode = require('dnode');

  http = require('http');

  shoe = require('shoe');

  spawn = require('win-spawn');

  phanta = [];

  startPhantomProcess = function(binary, port, hostname, args) {
    return spawn(binary, args.concat([__dirname + '/shim.js', port, hostname]));
  };

  onSignal = function() {
    var phantom, _i, _len;
    for (_i = 0, _len = phanta.length; _i < _len; _i++) {
      phantom = phanta[_i];
      phantom.exit();
    }
    return process.exit();
  };

  process.on('exit', function() {
    var phantom, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = phanta.length; _i < _len; _i++) {
      phantom = phanta[_i];
      _results.push(phantom.exit());
    }
    return _results;
  });

  process.on('SIGINT', onSignal);

  process.on('SIGTERM', onSignal);

  wrap = function(ph) {
    ph.callback = function(fn) {
      return '__phantomCallback__' + fn.toString();
    };
    ph._createPage = ph.createPage;
    return ph.createPage = function(cb) {
      return ph._createPage(function(page) {
        page._evaluate = page.evaluate;
        page.evaluate = function() {
          var args, cb, fn;
          fn = arguments[0], cb = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
          return page._evaluate.apply(page, [fn.toString(), cb].concat(args));
        };
        page._onResourceRequested = page.onResourceRequested;
        page.onResourceRequested = function() {
          var args, cb, fn;
          fn = arguments[0], cb = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
          return page._onResourceRequested.apply(page, [fn.toString(), cb].concat(args));
        };
        return cb(page);
      });
    };
  };

  module.exports = {
    create: function() {
      var arg, args, cb, httpServer, key, options, phantom, ps, sock, value, _i, _len, _ref;
      args = [];
      options = {};
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        switch (typeof arg) {
          case 'function':
            cb = arg;
            break;
          case 'string':
            args.push(arg);
            break;
          case 'object':
            options = arg;
        }
      }
      if (typeof options.parameters === 'object') {
        _ref = options.parameters;
        for (key in _ref) {
          value = _ref[key];
          args.push('--' + key + '=' + value);
        }
      }
      if (options.path == null) {
        options.path = '';
      }
      if (options.binary == null) {
        options.binary = options.path + 'phantomjs';
      }
      if (options.port == null) {
        options.port = 0;
      }
      if (options.hostname == null) {
        options.hostname = 'localhost';
      }
      if (options.dnodeOpts == null) {
        options.dnodeOpts = {};
      }
      ps = null;
      phantom = null;
      httpServer = http.createServer();
      httpServer.listen(options.port, options.hostname);
      httpServer.on('listening', function() {
        var hostname, port;
        port = httpServer.address().port;
        hostname = httpServer.address().address;
        ps = startPhantomProcess(options.binary, port, hostname, args);
        ps.stdout.on('data', options.onStdout || function(data) {
          return console.log("phantom stdout: " + data);
        });
        ps.stderr.on('data', options.onStderr || function(data) {
          return module.exports.stderrHandler(data.toString('utf8'));
        });
        ps.on('error', function(err) {
          httpServer.close();
          if ((err != null ? err.code : void 0) === 'ENOENT') {
            return console.error("phantomjs-node: You don't have 'phantomjs' installed");
          } else {
            throw err;
          }
        });
        return ps.on('exit', function(code, signal) {
          var p;
          httpServer.close();
          if (phantom) {
            if (typeof phantom.onExit === "function") {
              phantom.onExit();
            }
            phanta = (function() {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = phanta.length; _j < _len1; _j++) {
                p = phanta[_j];
                if (p !== phantom) {
                  _results.push(p);
                }
              }
              return _results;
            })();
          }
          if (options.onExit) {
            return options.onExit(code, signal);
          } else {
            console.assert(signal == null, "signal killed phantomjs: " + signal);
            return console.assert(code === 0, "abnormal phantomjs exit code: " + code);
          }
        });
      });
      sock = shoe(function(stream) {
        var d;
        d = dnode({}, options.dnodeOpts);
        d.on('remote', function(phantom) {
          wrap(phantom);
          phantom.process = ps;
          phanta.push(phantom);
          return typeof cb === "function" ? cb(phantom) : void 0;
        });
        d.pipe(stream);
        return stream.pipe(d);
      });
      return sock.install(httpServer, '/dnode');
    },
    stderrHandler: function(message) {
      if (message.match(/(No such method.*socketSentData)|(CoreText performance note)/)) {
        return;
      }
      return console.warn("phantom stderr: " + message);
    }
  };

}).call(this);

}).call(this,require('_process'),"/node_modules/nightmare/node_modules/phantom")
},{"_process":31,"dnode":95,"http":24,"shoe":105,"win-spawn":108}],110:[function(require,module,exports){
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.NProgress = factory();
  }

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.1.6';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   * 
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;
    
    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() == "resolved") {
        return this;
      }
      
      if (current == 0) {
        NProgress.start();
      }
      
      initial++;
      current++;
      
      $promise.always(function() {
        current--;
        if (current == 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });
      
      return this;
    };
    
  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent')
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});


},{}],111:[function(require,module,exports){
(function (root) {
	"use strict";
	var Tone;
	//constructs the main Tone object
	function MainModule(func){
		Tone = func();
	}
	//invokes each of the modules with the main Tone object as the argument
	function ToneModule(func){
		func(Tone);
	}

	/**
	 *  Tone.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2014-2015 Yotam Mann
	 */
	MainModule(function(){

		

		//////////////////////////////////////////////////////////////////////////
		//	WEB AUDIO CONTEXT
		///////////////////////////////////////////////////////////////////////////

		//borrowed from underscore.js
		function isUndef(val){
			return val === void 0;
		}

		//borrowed from underscore.js
		function isFunction(val){
			return typeof val === "function";
		}

		var audioContext;

		//polyfill for AudioContext and OfflineAudioContext
		if (isUndef(window.AudioContext)){
			window.AudioContext = window.webkitAudioContext;
		} 
		if (isUndef(window.OfflineAudioContext)){
			window.OfflineAudioContext = window.webkitOfflineAudioContext;
		} 

		if (!isUndef(AudioContext)){
			audioContext = new AudioContext();
		} else {
			throw new Error("Web Audio is not supported in this browser");
		}

		//SHIMS////////////////////////////////////////////////////////////////////

		if (!isFunction(AudioContext.prototype.createGain)){
			AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
		}
		if (!isFunction(AudioContext.prototype.createDelay)){
			AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
		}
		if (!isFunction(AudioContext.prototype.createPeriodicWave)){
			AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
		}
		if (!isFunction(AudioBufferSourceNode.prototype.start)){
			AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
		}
		if (!isFunction(AudioBufferSourceNode.prototype.stop)){
			AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
		}
		if (!isFunction(OscillatorNode.prototype.start)){
			OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
		}
		if (!isFunction(OscillatorNode.prototype.stop)){
			OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;	
		}
		if (!isFunction(OscillatorNode.prototype.setPeriodicWave)){
			OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable;	
		}
		//extend the connect function to include Tones
		AudioNode.prototype._nativeConnect = AudioNode.prototype.connect;
		AudioNode.prototype.connect = function(B, outNum, inNum){
			if (B.input){
				if (Array.isArray(B.input)){
					if (isUndef(inNum)){
						inNum = 0;
					}
					this.connect(B.input[inNum]);
				} else {
					this.connect(B.input, outNum, inNum);
				}
			} else {
				try {
					if (B instanceof AudioNode){
						this._nativeConnect(B, outNum, inNum);
					} else {
						this._nativeConnect(B, outNum);
					}
				} catch (e) {
					throw new Error("error connecting to node: "+B);
				}
			}
		};

		///////////////////////////////////////////////////////////////////////////
		//	TONE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  @class  Tone is the base class of all other classes.  
		 *  
		 *  @constructor
		 *  @alias Tone
		 *  @param {number} [inputs=1] the number of input nodes
		 *  @param {number} [outputs=1] the number of output nodes
		 */
		var Tone = function(inputs, outputs){

			/**
			 *  the input node(s)
			 *  @type {GainNode|Array}
			 */
			if (isUndef(inputs) || inputs === 1){
				this.input = this.context.createGain();
			} else if (inputs > 1){
				this.input = new Array(inputs);
			}

			/**
			 *  the output node(s)
			 *  @type {GainNode|Array}
			 */
			if (isUndef(outputs) || outputs === 1){
				this.output = this.context.createGain();
			} else if (outputs > 1){
				this.output = new Array(inputs);
			}
		};

		/**
		 *  Set the parameters at once. Either pass in an
		 *  object mapping parameters to values, or to set a
		 *  single parameter, by passing in a string and value.
		 *  @example
		 *  //set values using an object
		 *  filter.set({
		 *  	"frequency" : 300,
		 *  	"type" : highpass
		 *  });
		 *  //or
		 *  filter.set("type", "highpass");
		 *  //ramp to the value 220 over 3 seconds. 
		 *  oscillator.set({
		 *  	"frequency" : 220
		 *  }, 3);
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Tone.Time=} rampTime
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.set = function(params, value, rampTime){
			if (typeof params === "object"){
				rampTime = value;
			} else if (typeof params === "string"){
				var tmpObj = {};
				tmpObj[params] = value;
				params = tmpObj;
			}
			for (var attr in params){
				var param = this[attr];
				if (isUndef(param)){
					continue;
				}
				value = params[attr];
				if (param instanceof Tone.Signal){
					if (param.value !== value){
						if (isUndef(rampTime)){
							param.value = value;
						} else {
							param.rampTo(value, rampTime);
						}
					}
				} else if (param instanceof AudioParam){
					if (param.value !== value){
						param.value = value;
					}				
				} else if (param instanceof Tone){
					param.set(value);
				} else if (param !== value){
					this[attr] = value;
				}
			}
			return this;
		};

		/**
		 *  Get the object's attributes. 
		 *  @example
		 *  osc.get();
		 *  //returns {"type" : "sine", "frequency" : 440, ...etc}
		 *  osc.get("type"); //returns { "type" : "sine"}
		 *  @param {Array=} params the parameters to get, otherwise will return 
		 *  					   all available.r
		 */
		Tone.prototype.get = function(params){
			if (isUndef(params)){
				params = this._collectDefaults(this.constructor);
			}
			var ret = {};
			for (var i = 0; i < params.length; i++){
				var attr = params[i];
				var param = this[attr];
				if (param instanceof Tone.Signal){
					ret[attr] = param.value;
				} else if (param instanceof AudioParam){
					ret[attr] = param.value;
				} else if (param instanceof Tone){
					ret[attr] = param.get();
				} else if (!isFunction(param) && !isUndef(param)){
					ret[attr] = param;
				} 
			}
			return ret;
		};

		/**
		 *  collect all of the default attributes in one
		 *  @private
		 *  @param {function} constr the constructor to find the defaults from
		 *  @return {Array} all of the attributes which belong to the class
		 */
		Tone.prototype._collectDefaults = function(constr){
			var ret = [];
			if (!isUndef(constr.defaults)){
				ret = Object.keys(constr.defaults);
			}
			if (!isUndef(constr._super)){
				ret = ret.concat(this._collectDefaults(constr._super));
			}
			return ret;
		};

		/**
		 *  Set the preset if it exists. 
		 *  @param {string} presetName the name of the preset
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.setPreset = function(presetName){
			if (!this.isUndef(this.preset) && this.preset.hasOwnProperty(presetName)){
				this.set(this.preset[presetName]);
			}
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		//	CLASS VARS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  A static pointer to the audio context accessible as `Tone.context`. 
		 *  @type {AudioContext}
		 */
		Tone.context = audioContext;

		/**
		 *  The audio context.
		 *  @type {AudioContext}
		 */
		Tone.prototype.context = Tone.context;

		/**
		 *  the default buffer size
		 *  @type {number}
		 *  @static
		 *  @const
		 */
		Tone.prototype.bufferSize = 2048;

		/**
		 *  the delay time of a single buffer frame
		 *  @type {number}
		 *  @static
		 *  @const
		 */
		Tone.prototype.bufferTime = Tone.prototype.bufferSize / Tone.context.sampleRate;
		
		///////////////////////////////////////////////////////////////////////////
		//	CONNECTIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  disconnect and dispose
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.dispose = function(){
			if (!this.isUndef(this.input)){
				if (this.input instanceof AudioNode){
					this.input.disconnect();
				} 
				this.input = null;
			}
			if (!this.isUndef(this.output)){
				if (this.output instanceof AudioNode){
					this.output.disconnect();
				} 
				this.output = null;
			}
			return this;
		};

		/**
		 *  a silent connection to the DesinationNode
		 *  which will ensure that anything connected to it
		 *  will not be garbage collected
		 *  
		 *  @private
		 */
		var _silentNode = null;

		/**
		 *  makes a connection to ensure that the node will not be garbage collected
		 *  until 'dispose' is explicitly called
		 *
		 *  use carefully. circumvents JS and WebAudio's normal Garbage Collection behavior
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.noGC = function(){
			this.output.connect(_silentNode);
			return this;
		};

		AudioNode.prototype.noGC = function(){
			this.connect(_silentNode);
			return this;
		};

		/**
		 *  connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
		 *  @param  {Tone | AudioParam | AudioNode} unit 
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.connect = function(unit, outputNum, inputNum){
			if (Array.isArray(this.output)){
				outputNum = this.defaultArg(outputNum, 0);
				this.output[outputNum].connect(unit, 0, inputNum);
			} else {
				this.output.connect(unit, outputNum, inputNum);
			}
			return this;
		};

		/**
		 *  disconnect the output
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.disconnect = function(outputNum){
			if (Array.isArray(this.output)){
				outputNum = this.defaultArg(outputNum, 0);
				this.output[outputNum].disconnect();
			} else {
				this.output.disconnect();
			}
			return this;
		};

		/**
		 *  connect together all of the arguments in series
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.connectSeries = function(){
			if (arguments.length > 1){
				var currentUnit = arguments[0];
				for (var i = 1; i < arguments.length; i++){
					var toUnit = arguments[i];
					currentUnit.connect(toUnit);
					currentUnit = toUnit;
				}
			}
			return this;
		};

		/**
		 *  fan out the connection from the first argument to the rest of the arguments
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.connectParallel = function(){
			var connectFrom = arguments[0];
			if (arguments.length > 1){
				for (var i = 1; i < arguments.length; i++){
					var connectTo = arguments[i];
					connectFrom.connect(connectTo);
				}
			}
			return this;
		};

		/**
		 *  Connect the output of this node to the rest of the nodes in series.
		 *  @example
		 *  //connect a node to an effect, panVol and then to the master output
		 *  node.chain(effect, panVol, Tone.Master);
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.chain = function(){
			if (arguments.length > 0){
				var currentUnit = this;
				for (var i = 0; i < arguments.length; i++){
					var toUnit = arguments[i];
					currentUnit.connect(toUnit);
					currentUnit = toUnit;
				}
			}
			return this;
		};

		/**
		 *  connect the output of this node to the rest of the nodes in parallel.
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.fan = function(){
			if (arguments.length > 0){
				for (var i = 0; i < arguments.length; i++){
					this.connect(arguments[i]);
				}
			}
			return this;
		};

		//give native nodes chain and fan methods
		AudioNode.prototype.chain = Tone.prototype.chain;
		AudioNode.prototype.fan = Tone.prototype.fan;

		///////////////////////////////////////////////////////////////////////////
		//	UTILITIES / HELPERS / MATHS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  if a the given is undefined, use the fallback. 
		 *  if both given and fallback are objects, given
		 *  will be augmented with whatever properties it's
		 *  missing which are in fallback
		 *
		 *  warning: if object is self referential, it will go into an an 
		 *  infinite recursive loop. 
		 *  
		 *  @param  {*} given    
		 *  @param  {*} fallback 
		 *  @return {*}          
		 */
		Tone.prototype.defaultArg = function(given, fallback){
			if (typeof given === "object" && typeof fallback === "object"){
				var ret = {};
				//make a deep copy of the given object
				for (var givenProp in given) {
					ret[givenProp] = this.defaultArg(given[givenProp], given[givenProp]);
				}
				for (var prop in fallback) {
					ret[prop] = this.defaultArg(given[prop], fallback[prop]);
				}
				return ret;
			} else {
				return isUndef(given) ? fallback : given;
			}
		};

		/**
		 *  returns the args as an options object with given arguments
		 *  mapped to the names provided. 
		 *
		 *  if the args given is an array containing an object, it is assumed
		 *  that that's already the options object and will just return it. 
		 *  
		 *  @param  {Array} values  the 'arguments' object of the function
		 *  @param  {Array.<string>} keys the names of the arguments as they
		 *                                 should appear in the options object
		 *  @param {Object=} defaults optional defaults to mixin to the returned 
		 *                            options object                              
		 *  @return {Object}       the options object with the names mapped to the arguments
		 */
		Tone.prototype.optionsObject = function(values, keys, defaults){
			var options = {};
			if (values.length === 1 && typeof values[0] === "object"){
				options = values[0];
			} else {
				for (var i = 0; i < keys.length; i++){
					options[keys[i]] = values[i];
				}
			}
			if (!this.isUndef(defaults)){
				return this.defaultArg(options, defaults);
			} else {
				return options;
			}
		};

		/**
		 *  test if the arg is undefined
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is undefined
		 *  @function
		 */
		Tone.prototype.isUndef = isUndef;

		/**
		 *  test if the arg is a function
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a function
		 *  @function
		 */
		Tone.prototype.isFunction = isFunction;

		/**
		 *  interpolate the input value (0-1) to be between outputMin and outputMax
		 *  @param  {number} input     
		 *  @param  {number} outputMin 
		 *  @param  {number} outputMax 
		 *  @return {number}           
		 */
		Tone.prototype.interpolate = function(input, outputMin, outputMax){
			return input*(outputMax - outputMin) + outputMin;
		};

		/**
		 *  normalize the input to 0-1 from between inputMin to inputMax
		 *  @param  {number} input    
		 *  @param  {number} inputMin 
		 *  @param  {number} inputMax 
		 *  @return {number}          
		 */
		Tone.prototype.normalize = function(input, inputMin, inputMax){
			//make sure that min < max
			if (inputMin > inputMax){
				var tmp = inputMax;
				inputMax = inputMin;
				inputMin = tmp;
			} else if (inputMin == inputMax){
				return 0;
			}
			return (input - inputMin) / (inputMax - inputMin);
		};

		///////////////////////////////////////////////////////////////////////////
		// GAIN CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  equal power gain scale
		 *  good for cross-fading
		 *  @param  {number} percent (0-1)
		 *  @return {number}         output gain (0-1)
		 */
		Tone.prototype.equalPowerScale = function(percent){
			var piFactor = 0.5 * Math.PI;
			return Math.sin(percent * piFactor);
		};

		/**
		 *  convert db scale to gain scale (0-1)
		 *  @param  {number} db
		 *  @return {number}   
		 */
		Tone.prototype.dbToGain = function(db) {
			return Math.pow(2, db / 6);
		};

		/**
		 *  convert gain scale to decibels
		 *  @param  {number} gain (0-1)
		 *  @return {number}   
		 */
		Tone.prototype.gainToDb = function(gain) {
			return  20 * (Math.log(gain) / Math.LN10);
		};

		///////////////////////////////////////////////////////////////////////////
		//	TIMING
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  @return {number} the currentTime from the AudioContext
		 */
		Tone.prototype.now = function(){
			return this.context.currentTime;
		};

		/**
		 *  convert a sample count to seconds
		 *  @param  {number} samples 
		 *  @return {number}         
		 */
		Tone.prototype.samplesToSeconds = function(samples){
			return samples / this.context.sampleRate;
		};

		/**
		 *  convert a time into samples
		 *  
		 *  @param  {Tone.time} time
		 *  @return {number}         
		 */
		Tone.prototype.toSamples = function(time){
			var seconds = this.toSeconds(time);
			return Math.round(seconds * this.context.sampleRate);
		};

		/**
		 *  convert time to seconds
		 *
		 *  this is a simplified version which only handles numbers and 
		 *  'now' relative numbers. If the Transport is included this 
		 *  method is overridden to include many other features including 
		 *  notationTime, Frequency, and transportTime
		 *  
		 *  @param  {number=} time 
		 *  @param {number=} now if passed in, this number will be 
		 *                       used for all 'now' relative timings
		 *  @return {number}   	seconds in the same timescale as the AudioContext
		 */
		Tone.prototype.toSeconds = function(time, now){
			now = this.defaultArg(now, this.now());
			if (typeof time === "number"){
				return time; //assuming that it's seconds
			} else if (typeof time === "string"){
				var plusTime = 0;
				if(time.charAt(0) === "+") {
					time = time.slice(1);	
					plusTime = now;			
				} 
				return parseFloat(time) + plusTime;
			} else {
				return now;
			}
		};

		///////////////////////////////////////////////////////////////////////////
		// FREQUENCY CONVERSION
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  true if the input is in the format number+hz
		 *  i.e.: 10hz
		 *
		 *  @param {number} freq 
		 *  @return {boolean} 
		 *  @function
		 */
		Tone.prototype.isFrequency = (function(){
			var freqFormat = new RegExp(/\d*\.?\d+hz$/i);
			return function(freq){
				return freqFormat.test(freq);
			};
		})();

		/**
		 *  Convert a frequency into seconds.
		 *  Accepts numbers and strings: i.e. `"10hz"` or 
		 *  `10` both return `0.1`. 
		 *  
		 *  @param  {number|string} freq 
		 *  @return {number}      
		 */
		Tone.prototype.frequencyToSeconds = function(freq){
			return 1 / parseFloat(freq);
		};

		/**
		 *  Convert a number in seconds to a frequency.
		 *  @param  {number} seconds 
		 *  @return {number}         
		 */
		Tone.prototype.secondsToFrequency = function(seconds){
			return 1/seconds;
		};

		///////////////////////////////////////////////////////////////////////////
		//	INHERITANCE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  have a child inherit all of Tone's (or a parent's) prototype
		 *  to inherit the parent's properties, make sure to call 
		 *  Parent.call(this) in the child's constructor
		 *
		 *  based on closure library's inherit function
		 *
		 *  @static
		 *  @param  {function} 	child  
		 *  @param  {function=} parent (optional) parent to inherit from
		 *                             if no parent is supplied, the child
		 *                             will inherit from Tone
		 */
		Tone.extend = function(child, parent){
			if (isUndef(parent)){
				parent = Tone;
			}
			function TempConstructor(){}
			TempConstructor.prototype = parent.prototype;
			child.prototype = new TempConstructor();
			/** @override */
			child.prototype.constructor = child;
			child._super = parent;
		};

		///////////////////////////////////////////////////////////////////////////
		//	CONTEXT
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  array of callbacks to be invoked when a new context is added
		 *  @private 
		 *  @private
		 */
		var newContextCallbacks = [];

		/**
		 *  invoke this callback when a new context is added
		 *  will be invoked initially with the first context
		 *  @private 
		 *  @static
		 *  @param {function(AudioContext)} callback the callback to be invoked
		 *                                           with the audio context
		 */
		Tone._initAudioContext = function(callback){
			//invoke the callback with the existing AudioContext
			callback(Tone.context);
			//add it to the array
			newContextCallbacks.push(callback);
		};

		/**
		 *  Tone.js automatically creates a context on init, but if you are working
		 *  with other libraries which also create an AudioContext, it can be
		 *  useful to set your own. If you are going to set your own context, 
		 *  be sure to do it at the start of your code, before creating any objects.
		 *  @static
		 *  @param {AudioContext} ctx The new audio context to set
		 */
		Tone.setContext = function(ctx){
			//set the prototypes
			Tone.prototype.context = ctx;
			Tone.context = ctx;
			//invoke all the callbacks
			for (var i = 0; i < newContextCallbacks.length; i++){
				newContextCallbacks[i](ctx);
			}
		};

		/**
		 *  Bind this to a touchstart event to start the audio on mobile devices. 
		 *  <br>
		 *  http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api/12569290#12569290
		 *  @static
		 */
		Tone.startMobile = function(){
			var osc = Tone.context.createOscillator();
			var silent = Tone.context.createGain();
			silent.gain.value = 0;
			osc.connect(silent);
			silent.connect(Tone.context.destination);
			var now = Tone.context.currentTime;
			osc.start(now);
			osc.stop(now+1);
		};

		//setup the context
		Tone._initAudioContext(function(audioContext){
			//set the bufferTime
			Tone.prototype.bufferTime = Tone.prototype.bufferSize / audioContext.sampleRate;
			_silentNode = audioContext.createGain();
			_silentNode.gain.value = 0;
			_silentNode.connect(audioContext.destination);
		});

		console.log("%c * Tone.js r4 * ", "background: #000; color: #fff");

		return Tone;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class  Base class for all Signals
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */
		Tone.SignalBase = function(){

		};

		Tone.extend(Tone.SignalBase);

		/**
		 *  When signals connect to other signals or AudioParams, 
		 *  they take over the output value of that signal or AudioParam. 
		 *  For all other nodes, the behavior is the same as a normal `connect`. 
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
		 *  @param {number} [outputNumber=0] 
		 *  @param {number} [inputNumber=0] 
		 *  @returns {Tone.SignalBase} `this`
		 */
		Tone.SignalBase.prototype.connect = function(node, outputNumber, inputNumber){
			//zero it out so that the signal can have full control
			if (node.constructor === Tone.Signal){
				//cancel changes
				node._value.cancelScheduledValues(0);
				//reset the value
				node._value.value = 0;
			} else if (node instanceof AudioParam){
				node.cancelScheduledValues(0);
				node.value = 0;
			} 
			Tone.prototype.connect.call(this, node, outputNumber, inputNumber);
			return this;
		};

		return Tone.SignalBase;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Wraps the WaveShaperNode
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {function(number, number)|Array|number} mapping the function used to define the values. 
		 *                                    The mapping function should take two arguments: 
		 *                                    the first is the value at the current position 
		 *                                    and the second is the array position. 
		 *                                    If the argument is an array, that array will be
		 *                                    set as the wave shapping function
		 *  @param {number} [bufferLen=1024] the length of the WaveShaperNode buffer.
		 *  @example
		 *  var timesTwo = new Tone.WaveShaper(function(val){
		 *  	return val * 2;
		 *  }, 2048);
		 */
		Tone.WaveShaper = function(mapping, bufferLen){

			/**
			 *  the waveshaper
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._shaper = this.input = this.output = this.context.createWaveShaper();

			/**
			 *  the waveshapers curve
			 *  @type {Float32Array}
			 *  @private
			 */
			this._curve = null;

			if (Array.isArray(mapping)){
				this.curve = mapping;
			} else if (isFinite(mapping) || this.isUndef(mapping)){
				this._curve = new Float32Array(this.defaultArg(mapping, 1024));
			} else if (this.isFunction(mapping)){
				this._curve = new Float32Array(this.defaultArg(bufferLen, 1024));
				this.setMap(mapping);
			} 
		};

		Tone.extend(Tone.WaveShaper, Tone.SignalBase);

		/**
		 *  uses a mapping function to set the value of the curve
		 *  @param {function(number, number)} mapping the function used to define the values. 
		 *                                    The mapping function should take two arguments: 
		 *                                    the first is the value at the current position 
		 *                                    and the second is the array position
		 *  @returns {Tone.WaveShaper} `this`
		 */
		Tone.WaveShaper.prototype.setMap = function(mapping){
			for (var i = 0, len = this._curve.length; i < len; i++){
				var normalized = (i / (len)) * 2 - 1;
				this._curve[i] = mapping(normalized, i);
			}
			this._shaper.curve = this._curve;
			return this;
		};

		/**
		 * The array to set as the waveshaper curve
		 * @memberOf Tone.WaveShaper#
		 * @type {Array}
		 * @name curve
		 */
		Object.defineProperty(Tone.WaveShaper.prototype, "curve", {
			get : function(){
				return this._shaper.curve;
			},
			set : function(mapping){
				//fixes safari WaveShaperNode bug
				if (this._isSafari()){
					var first = mapping[0];
					mapping.unshift(first);	
				}
				this._curve = new Float32Array(mapping);
				this._shaper.curve = this._curve;
			}
		});

		/**
		 * The oversampling. Can either be "none", "2x" or "4x"
		 * @memberOf Tone.WaveShaper#
		 * @type {string}
		 * @name curve
		 */
		Object.defineProperty(Tone.WaveShaper.prototype, "oversample", {
			get : function(){
				return this._shaper.oversample;
			},
			set : function(oversampling){
				this._shaper.oversample = oversampling;
			}
		});

		/**
		 *  returns true if the browser is safari
		 *  @return  {boolean} 
		 *  @private
		 */
		Tone.WaveShaper.prototype._isSafari = function(){
			var ua = navigator.userAgent.toLowerCase(); 
			return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
		};

		/**
		 *  clean up
		 *  @returns {Tone.WaveShaper} `this`
		 */
		Tone.WaveShaper.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._shaper.disconnect();
			this._shaper = null;
			this._curve = null;
			return this;
		};

		return Tone.WaveShaper;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Constant audio-rate signal.
		 *          Tone.Signal is a core component which allows for sample-accurate 
		 *          synchronization of many components. Tone.Signal can be scheduled 
		 *          with all of the functions available to AudioParams
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number|AudioParam} [value=0] initial value or the AudioParam to control
		 *                                       note that the signal has no output
		 *                                       if an AudioParam is passed in.
		 *  @param {Tone.Signal.Unit} [units=Number] unit the units the signal is in
		 *  @example
		 *  var signal = new Tone.Signal(10);
		 */
		Tone.Signal = function(value, units){

			/**
			 * the units the signal is in
			 * @type {Tone.Signal.Type}
			 */
			this.units = this.defaultArg(units, Tone.Signal.Units.Number);

			/**
			 * The node where the constant signal value is scaled.
			 * @type {AudioParam}
			 * @private
			 */
			this.output = this._scaler = this.context.createGain();

			/**
			 * The node where the value is set.
			 * @type {AudioParam}
			 * @private
			 */
			this.input = this._value = this._scaler.gain;

			if (value instanceof AudioParam){
				this._scaler.connect(value);
				//zero out the value
				value.value = 0;
			} else {
				this.value = this.defaultArg(value, Tone.Signal.defaults.value);
			}

			//connect the constant 1 output to the node output
			Tone.Signal._constant.chain(this._scaler);
		};

		Tone.extend(Tone.Signal, Tone.SignalBase);

		/**
		 *  The default values
		 *  @type  {Object}
		 *  @static
		 *  @const
		 */
		Tone.Signal.defaults = {
			"value" : 0
		};

		/**
		 * The value of the signal. 
		 * @memberOf Tone.Signal#
		 * @type {Tone.Time|Tone.Frequency|number}
		 * @name value
		 */
		Object.defineProperty(Tone.Signal.prototype, "value", {
			get : function(){
				return this._toUnits(this._value.value);
			},
			set : function(value){
				var convertedVal = this._fromUnits(value);
				//is this what you want?
				this.cancelScheduledValues(0);
				this._value.value = convertedVal;
			}
		});

		/**
		 * @private
		 * @param  {Tone.Time|Tone.Volume|Tone.Frequency|number|undefined} val the value to convert
		 * @return {number}     the number which the value should be set to
		 */
		Tone.Signal.prototype._fromUnits = function(val){
			switch(this.units){
				case Tone.Signal.Units.Time: 
					return this.toSeconds(val);
				case Tone.Signal.Units.Frequency: 
					return this.toFrequency(val);
				case Tone.Signal.Units.Decibels: 
					return this.dbToGain(val);
				case Tone.Signal.Units.Normal: 
					return Math.min(Math.max(val, 0), 1);
				case Tone.Signal.Units.Audio: 
					return Math.min(Math.max(val, -1), 1);
				default:
					return val;
			}
		};

		/**
		 * convert to the desired units
		 * @private
		 * @param  {number} val the value to convert
		 * @return {number}
		 */
		Tone.Signal.prototype._toUnits = function(val){
			switch(this.units){
				case Tone.Signal.Units.Decibels: 
					return this.gainToDb(val);
				default:
					return val;
			}
		};

		/**
		 *  Schedules a parameter value change at the given time.
		 *  @param {number}		value 
		 *  @param {Tone.Time}  time 
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.setValueAtTime = function(value, time){
			value = this._fromUnits(value);
			this._value.setValueAtTime(value, this.toSeconds(time));
			return this;
		};

		/**
		 *  Creates a schedule point with the current value at the current time.
		 *
		 *  @param {number=} now (optionally) pass the now value in
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.setCurrentValueNow = function(now){
			now = this.defaultArg(now, this.now());
			var currentVal = this._value.value;
			this.cancelScheduledValues(now);
			this._value.setValueAtTime(currentVal, now);
			return this;
		};

		/**
		 *  Schedules a linear continuous change in parameter value from the 
		 *  previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Tone.Time} endTime 
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.linearRampToValueAtTime = function(value, endTime){
			value = this._fromUnits(value);
			this._value.linearRampToValueAtTime(value, this.toSeconds(endTime));
			return this;
		};

		/**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Tone.Time} endTime 
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.exponentialRampToValueAtTime = function(value, endTime){
			value = this._fromUnits(value);
			//can't go below a certain value
			value = Math.max(0.00001, value);
			this._value.exponentialRampToValueAtTime(value, this.toSeconds(endTime));
			return this;
		};

		/**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the current time and current value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Tone.Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} `this`
		 *  @example
		 *  //exponentially ramp to the value 2 over 4 seconds. 
		 *  signal.exponentialRampToValueNow(2, 4);
		 */
		Tone.Signal.prototype.exponentialRampToValueNow = function(value, rampTime ){
			var now = this.now();
			this.setCurrentValueNow(now);
			this.exponentialRampToValueAtTime(value, now + this.toSeconds(rampTime ));
			return this;
		};

		/**
		 *  Schedules an linear continuous change in parameter value from 
		 *  the current time and current value to the given value at the given time.
		 *  
		 *  @param  {number} value   
		 *  @param  {Tone.Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} `this`
		 *  @example
		 *  //linearly ramp to the value 4 over 3 seconds. 
		 *  signal.linearRampToValueNow(4, 3);
		 */
		Tone.Signal.prototype.linearRampToValueNow = function(value, rampTime){
			var now = this.now();
			this.setCurrentValueNow(now);
			this.linearRampToValueAtTime(value, now + this.toSeconds(rampTime));
			return this;
		};

		/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value        
		 *  @param {Tone.Time} startTime    
		 *  @param {number} timeConstant 
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.setTargetAtTime = function(value, startTime, timeConstant){
			value = this._fromUnits(value);
			this._value.setTargetAtTime(value, this.toSeconds(startTime), timeConstant);
			return this;
		};

		/**
		 *  Sets an array of arbitrary parameter values starting at the given time
		 *  for the given duration.
		 *  	
		 *  @param {Array<number>} values    
		 *  @param {Tone.Time} startTime 
		 *  @param {Tone.Time} duration  
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.setValueCurveAtTime = function(values, startTime, duration){
			for (var i = 0; i < values.length; i++){
				values[i] = this._fromUnits(values[i]);
			}
			this._value.setValueCurveAtTime(values, this.toSeconds(startTime), this.toSeconds(duration));
			return this;
		};

		/**
		 *  Cancels all scheduled parameter changes with times greater than or 
		 *  equal to startTime.
		 *  
		 *  @param  {Tone.Time} startTime
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.cancelScheduledValues = function(startTime){
			this._value.cancelScheduledValues(this.toSeconds(startTime));
			return this;
		};

		/**
		 *  Ramps to the given value over the duration of the rampTime. 
		 *  Automatically selects the best ramp type (exponential or linear)
		 *  depending on the `units` of the signal
		 *  
		 *  @param  {number} value   
		 *  @param  {Tone.Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} `this`
		 *  @example
		 *  //ramp to the value either linearly or exponentially 
		 *  //depending on the "units" value of the signal
		 *  signal.rampTo(0, 10);
		 */
		Tone.Signal.prototype.rampTo = function(value, rampTime){
			rampTime = this.defaultArg(rampTime, 0);
			if (this.units === Tone.Signal.Units.Frequency || this.units === Tone.Signal.Units.BPM){
				this.exponentialRampToValueNow(value, rampTime);
			} else {
				this.linearRampToValueNow(value, rampTime);
			}
			return this;
		};

		/**
		 *  dispose and disconnect
		 *  @returns {Tone.Signal} `this`
		 */
		Tone.Signal.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._value = null;
			this._scaler = null;
			return this;
		};

		/**
		 * The units the Signal is in
		 * @enum {string}
		 */
		Tone.Signal.Units = {
			/** The default type. */
			Number : "number",
			/** Tone.Time will be converted into seconds. */
			Time : "time",
			/** Tone.Frequency will be converted into hertz. */
			Frequency : "frequency",
			/** A Gain value. */
			Gain : "gain",
			/** Within normal range [0,1]. */
			Normal : "normal",
			/** Within normal range [-1,1]. */
			Audio : "audio",
			/** In decibels. */
			Decibels : "db",
			/** In half-step increments, i.e. 12 is an octave above the root. */
			Interval : "interval",
			/** Beats per minute. */
			BPM : "bpm"
		};

		///////////////////////////////////////////////////////////////////////////
		//	STATIC
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  the constant signal generator
		 *  @static
		 *  @private
		 *  @const
		 *  @type {OscillatorNode}
		 */
		Tone.Signal._generator = null;

		/**
		 *  the signal generator waveshaper. makes the incoming signal
		 *  only output 1 for all inputs.
		 *  @static
		 *  @private
		 *  @const
		 *  @type {Tone.WaveShaper}
		 */
		Tone.Signal._constant = null;

		/**
		 *  initializer function
		 */
		Tone._initAudioContext(function(audioContext){
			Tone.Signal._generator = audioContext.createOscillator();
			Tone.Signal._constant = new Tone.WaveShaper([1,1]);
			Tone.Signal._generator.connect(Tone.Signal._constant);
			Tone.Signal._generator.start(0);
			Tone.Signal._generator.noGC();
		});

		return Tone.Signal;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Pow applies an exponent to the incoming signal. The incoming signal
		 *         must be in the range -1,1
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} exp the exponent to apply to the incoming signal, must be at least 2. 
		 *  @example
		 *  var pow = new Tone.Pow(2);
		 *  var sig = new Tone.Signal(0.5).connect(pow);
		 *  //output of pow is 0.25. 
		 */
		Tone.Pow = function(exp){

			/**
			 * the exponent
			 * @private
			 * @type {number}
			 */
			this._exp = this.defaultArg(exp, 1);

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._expScaler = this.input = this.output = new Tone.WaveShaper(this._expFunc(this._exp), 8192);
		};

		Tone.extend(Tone.Pow, Tone.SignalBase);

		/**
		 * The value of the exponent
		 * @memberOf Tone.Pow#
		 * @type {number}
		 * @name value
		 */
		Object.defineProperty(Tone.Pow.prototype, "value", {
			get : function(){
				return this._exp;
			},
			set : function(exp){
				this._exp = exp;
				this._expScaler.setMap(this._expFunc(this._exp));
			}
		});


		/**
		 *  the function which maps the waveshaper
		 *  @param   {number} exp
		 *  @return {function}
		 *  @private
		 */
		Tone.Pow.prototype._expFunc = function(exp){
			return function(val){
				return Math.pow(Math.abs(val), exp);
			};
		};

		/**
		 *  clean up
		 *  @returns {Tone.Pow} `this`
		 */
		Tone.Pow.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._expScaler.dispose();
			this._expScaler = null;
			return this;
		};

		return Tone.Pow;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  ADSR envelope generator attaches to an AudioParam or Signal. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Tone.Time|Object} [attack=0.01]	the attack time in seconds
		 *  @param {Tone.Time} [decay=0.1]	the decay time in seconds
		 *  @param {number} [sustain=0.5] 	a percentage (0-1) of the full amplitude
		 *  @param {Tone.Time} [release=1]	the release time in seconds
		 *  @example
		 *  var gainNode = Tone.context.createGain();
		 *  var env = new Tone.Envelope({
		 *  	"attack" : 0.1,
		 *  	"decay" : 0.2,
		 *  	"sustain" : 1,
		 *  	"release" : 0.8,
		 *  });
		 *  env.connect(gainNode.gain);
		 */
		Tone.Envelope = function(){

			//get all of the defaults
			var options = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], Tone.Envelope.defaults);

			/** 
			 *  The attack time
			 *  @type {Tone.Time}
			 */
			this.attack = options.attack;

			/**
			 *  The decay time
			 *  @type {Tone.Time}
			 */
			this.decay = options.decay;
			
			/**
			 *  the sustain is a value between 0-1
			 *  @type {number}
			 */
			this.sustain = options.sustain;

			/**
			 *  The release time
			 *  @type {Tone.Time}
			 */
			this.release = options.release;

			/**
			 *  the signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
			this._sig = this.output = new Tone.Signal(0);
		};

		Tone.extend(Tone.Envelope);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 */
		Tone.Envelope.defaults = {
			"attack" : 0.01,
			"decay" : 0.1,
			"sustain" : 0.5,
			"release" : 1,
		};

		/**
		 *  the envelope time multipler
		 *  @type {number}
		 *  @private
		 */
		Tone.Envelope.prototype._timeMult = 0.25;

		/**
		 *  Trigger the attack/decay portion of the ADSR envelope. 
		 *  @param  {Tone.Time} [time=now]
		 *  @param {number} [velocity=1] the velocity of the envelope scales the vales.
		 *                               number between 0-1
		 *  @returns {Tone.Envelope} `this`
		 *  @example
		 *  //trigger the attack 0.5 seconds from now with a velocity of 0.2
		 *  env.triggerAttack("+0.5", 0.2);
		 */
		Tone.Envelope.prototype.triggerAttack = function(time, velocity){
			velocity = this.defaultArg(velocity, 1);
			var attack = this.toSeconds(this.attack);
			var decay = this.toSeconds(this.decay);
			var scaledMax = velocity;
			var sustainVal = this.sustain * scaledMax;
			time = this.toSeconds(time);
			this._sig.cancelScheduledValues(time);
			this._sig.setTargetAtTime(scaledMax, time, attack * this._timeMult);
			this._sig.setTargetAtTime(sustainVal, time + attack, decay * this._timeMult);	
			return this;
		};
		
		/**
		 *  Triggers the release of the envelope.
		 *  @param  {Tone.Time} [time=now]
		 *  @returns {Tone.Envelope} `this`
		 *  @example
		 *  //trigger release immediately
		 *  env.triggerRelease();
		 */
		Tone.Envelope.prototype.triggerRelease = function(time){
			time = this.toSeconds(time);
			this._sig.cancelScheduledValues(time);
			var release = this.toSeconds(this.release);
			this._sig.setTargetAtTime(0, time, release * this._timeMult);
			return this;
		};

		/**
		 *  Trigger the attack and release after a sustain time
		 *  @param {Tone.Time} duration the duration of the note
		 *  @param {Tone.Time} [time=now] the time of the attack
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.Envelope} `this`
		 *  @example
		 *  //trigger the attack and then the release after 0.6 seconds.
		 *  env.triggerAttackRelease(0.6);
		 */
		Tone.Envelope.prototype.triggerAttackRelease = function(duration, time, velocity) {
			time = this.toSeconds(time);
			this.triggerAttack(time, velocity);
			this.triggerRelease(time + this.toSeconds(duration));
			return this;
		};

		/**
		 *  Borrows the connect method from {@link Tone.Signal}
		 *  @function
		 */
		Tone.Envelope.prototype.connect = Tone.Signal.prototype.connect;

		/**
		 *  disconnect and dispose
		 *  @returns {Tone.Envelope} `this`
		 */
		Tone.Envelope.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._sig.dispose();
			this._sig = null;
			return this;
		};

		return Tone.Envelope;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class  An Envelope connected to a gain node which can be used as an amplitude envelope.
		 *  
		 *  @constructor
		 *  @extends {Tone.Envelope}
		 *  @param {Tone.Time|Object} [attack=0.01]	the attack time in seconds
		 *  @param {Tone.Time} [decay=0.1]	the decay time in seconds
		 *  @param {number} [sustain=0.5] 	a percentage (0-1) of the full amplitude
		 *  @param {Tone.Time} [release=1]	the release time in seconds
		 *  @example
		 *  
		 *  var ampEnv = new Tone.AmplitudeEnvelope(0.1, 0.2, 1, 0.8);
		 *  var osc = new Tone.Oscillator();
		 *  //or with an object
		 *  osc.chain(ampEnv, Tone.Master);
		 */
		Tone.AmplitudeEnvelope = function(){

			Tone.Envelope.apply(this, arguments);

			/**
			 *  the input node
			 *  @type {GainNode}
			 *  @private
			 */
			this.input = this.output = this.context.createGain();

			this._sig.connect(this.output.gain);
		};

		Tone.extend(Tone.AmplitudeEnvelope, Tone.Envelope);

		return Tone.AmplitudeEnvelope;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A thin wrapper around the DynamicsCompressorNode
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} [threshold=-24] threshold in decibels
		 *  @param {number} [ratio=12] gain reduction ratio
		 *  @example
		 *  var comp = new Tone.Compressor(-30, 3);
		 */
		Tone.Compressor = function(){

			var options = this.optionsObject(arguments, ["threshold", "ratio"], Tone.Compressor.defaults);

			/**
			 *  the compressor node
			 *  @type {DynamicsCompressorNode}
			 *  @private
			 */
			this._compressor = this.context.createDynamicsCompressor();

			/**
			 *  the input and output
			 */
			this.input = this.output = this._compressor;

			/**
			 *  the threshold vaue
			 *  @type {AudioParam}
			 */
			this.threshold = this._compressor.threshold;

			/**
			 *  The attack parameter
			 *  @type {Tone.Signal}
			 */
			this.attack = new Tone.Signal(this._compressor.attack, Tone.Signal.Units.Time);

			/**
			 *  The release parameter
			 *  @type {Tone.Signal}
			 */
			this.release = new Tone.Signal(this._compressor.release, Tone.Signal.Units.Time);

			/**
			 *  The knee parameter
			 *  @type {AudioParam}
			 */
			this.knee = this._compressor.knee;

			/**
			 *  The ratio value
			 *  @type {AudioParam}
			 */
			this.ratio = this._compressor.ratio;

			//set the defaults
			this.set(options);
		};

		Tone.extend(Tone.Compressor);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Compressor.defaults = {
			"ratio" : 12,
			"threshold" : -24,
			"release" : 0.25,
			"attack" : 0.003,
			"knee" : 30
		};

		/**
		 *  clean up
		 *  @returns {Tone.Compressor} `this`
		 */
		Tone.Compressor.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._compressor.disconnect();
			this._compressor = null;
			this.attack.dispose();
			this.attack = null;
			this.release.dispose();
			this.release = null;
			this.threshold = null;
			this.ratio = null;
			this.knee = null;
			return this;
		};

		return Tone.Compressor;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Add a signal and a number or two signals. <br><br>
		 *         input 0: augend. input 1: addend. <br><br>
		 *         Add can be used in two ways, either constructed with a value,
		 *         or constructed with no initial value and with signals connected
		 *         to each of its two inputs. 
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value if no value is provided, Tone.Add will sum the first
		 *                         and second inputs. 
		 *  @example
		 *  var signal = new Tone.Signal(2);
		 *  var add = new Tone.Add(2);
		 *  signal.connect(add);
		 *  //the output of add equals 4
		 *
		 *  //if constructed with no arguments
		 *  //it will add the first and second inputs
		 *  var add = new Tone.Add();
		 *  var sig0 = new Tone.Signal(3).connect(add, 0, 0);
		 *  var sig1 = new Tone.Signal(4).connect(add, 0, 1);
		 *  //the output of add equals 7. 
		 */
		Tone.Add = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */
			this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain();

			/**
			 *  @private
			 *  @type {Tone.Signal}
			 */
			this._value = this.input[1] = new Tone.Signal(value);

			this._value.connect(this._sum);
		};

		Tone.extend(Tone.Add, Tone.Signal);
		
		/**
		 *  dispose method
		 *  @returns {Tone.Add} `this`
		 */
		Tone.Add.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._sum.disconnect();
			this._sum = null;
			this._value.dispose();
			this._value = null;
			return this;
		}; 

		return Tone.Add;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Multiply the incoming signal by a number or Multiply two signals.
		 *          input 0: multiplicand.
		 *          input 1: multiplier.
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value constant value to multiple. if no value is provided
		 *                         it will be multiplied by the value of input 1.
		 *  @example
		 *  var mult = new Tone.Multiply(3);
		 *  var sig = new Tone.Signal(2).connect(mult);
		 *  //output of mult is 6. 
		 */
		Tone.Multiply = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  the input node is the same as the output node
			 *  it is also the GainNode which handles the scaling of incoming signal
			 *  
			 *  @type {GainNode}
			 *  @private
			 */
			this._mult = this.input[0] = this.output = this.context.createGain();

			/**
			 *  the scaling parameter
			 *  @type {AudioParam}
			 *  @private
			 */
			this._value = this.input[1] = this.output.gain;
			
			this._value.value = this.defaultArg(value, 0);
		};

		Tone.extend(Tone.Multiply, Tone.Signal);

		/**
		 *  clean up
		 *  @returns {Tone.Multiply} `this`
		 */
		Tone.Multiply.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._mult = null;
			this._value = null;
			return this;
		}; 

		return Tone.Multiply;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class Negate the incoming signal. i.e. an input signal of 10 will output -10
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var neg = new Tone.Negate();
		 *  var sig = new Tone.Signal(-2).connect(neg);
		 *  //output of neg is positive 2. 
		 */
		Tone.Negate = function(){
			/**
			 *  negation is done by multiplying by -1
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._multiply = this.input = this.output= new Tone.Multiply(-1);
		};

		Tone.extend(Tone.Negate, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.Negate} `this`
		 */
		Tone.Negate.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._multiply.dispose();
			this._multiply = null;
			return this;
		}; 

		return Tone.Negate;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Subtract a signal and a number or two signals. 
		 *         input 0 : minuend.
		 *         input 1 : subtrahend
		 *
		 *  @extends {Tone.Signal}
		 *  @constructor
		 *  @param {number=} value value to subtract from the incoming signal. If the value
		 *                         is omitted, it will subtract the second signal from the first
		 *  @example
		 *  var sub = new Tone.Subtract(1);
		 *  var sig = new Tone.Signal(4).connect(sub);
		 *  //the output of sub is 3. 
		 */
		Tone.Subtract = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */
			this._sum = this.input[0] = this.output = this.context.createGain();

			/**
			 *  negate the input of the second input before connecting it
			 *  to the summing node.
			 *  @type {Tone.Negate}
			 *  @private
			 */
			this._neg = new Tone.Negate();

			/**
			 *  the node where the value is set
			 *  @private
			 *  @type {Tone.Signal}
			 */
			this._value = this.input[1] = new Tone.Signal(value);

			this._value.chain(this._neg, this._sum);
		};

		Tone.extend(Tone.Subtract, Tone.Signal);

		/**
		 *  clean up
		 *  @returns {Tone.SignalBase} `this`
		 */
		Tone.Subtract.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._neg.dispose();
			this._neg = null;
			this._sum.disconnect();
			this._sum = null;
			this._value.dispose();
			this._value = null;
			return this;
		};

		return Tone.Subtract;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  GreaterThanZero outputs 1 when the input is strictly greater than zero
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var gt0 = new Tone.GreaterThanZero();
		 *  var sig = new Tone.Signal(0.01).connect(gt0);
		 *  //the output of gt0 is 1. 
		 *  sig.value = 0;
		 *  //the output of gt0 is 0. 
		 */
		Tone.GreaterThanZero = function(){
			
			/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._thresh = this.output = new Tone.WaveShaper(function(val){
				if (val <= 0){
					return 0;
				} else {
					return 1;
				}
			});

			/**
			 *  scale the first thresholded signal by a large value.
			 *  this will help with values which are very close to 0
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = this.input = new Tone.Multiply(10000);

			//connections
			this._scale.connect(this._thresh);
		};

		Tone.extend(Tone.GreaterThanZero, Tone.SignalBase);

		/**
		 *  dispose method
		 *  @returns {Tone.GreaterThanZero} `this`
		 */
		Tone.GreaterThanZero.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._scale.dispose();
			this._scale = null;
			this._thresh.dispose();
			this._thresh = null;
			return this;
		};

		return Tone.GreaterThanZero;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  EqualZero outputs 1 when the input is strictly greater than zero
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var eq0 = new Tone.EqualZero();
		 *  var sig = new Tone.Signal(0).connect(eq0);
		 *  //the output of eq0 is 1. 
		 */
		Tone.EqualZero = function(){

			/**
			 *  scale the incoming signal by a large factor
			 *  @private
			 *  @type {Tone.Multiply}
			 */
			this._scale = this.input = new Tone.Multiply(10000);
			
			/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._thresh = new Tone.WaveShaper(function(val){
				if (val === 0){
					return 1;
				} else {
					return 0;
				}
			}, 128);

			/**
			 *  threshold the output so that it's 0 or 1
			 *  @type {Tone.GreaterThanZero}
			 *  @private
			 */
			this._gtz = this.output = new Tone.GreaterThanZero();

			//connections
			this._scale.chain(this._thresh, this._gtz);
		};

		Tone.extend(Tone.EqualZero, Tone.SignalBase);

		/**
		 *  dispose method
		 *  @returns {Tone.EqualZero} `this`
		 */
		Tone.EqualZero.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._gtz.dispose();
			this._gtz = null;
			this._scale.dispose();
			this._scale = null;
			this._thresh.dispose();
			this._thresh = null;
			return this;
		};

		return Tone.EqualZero;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Output 1 if the signal is equal to the value, otherwise outputs 0. 
		 *          Can accept two signals if connected to inputs 0 and 1.
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} value the number to compare the incoming signal to
		 *  @example
		 *  var eq = new Tone.Equal(3);
		 *  var sig = new Tone.Signal(3).connect(eq);
		 *  //the output of eq is 1. 
		 */
		Tone.Equal = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  subtract the value from the incoming signal
			 *  
			 *  @type {Tone.Add}
			 *  @private
			 */
			this._sub = this.input[0] = new Tone.Subtract(value);

			/**
			 *  @type {Tone.EqualZero}
			 *  @private
			 */
			this._equals = this.output = new Tone.EqualZero();

			this._sub.connect(this._equals);
			this.input[1] = this._sub.input[1];
		};

		Tone.extend(Tone.Equal, Tone.SignalBase);

		/**
		 * The value to compare to the incoming signal.
		 * @memberOf Tone.Equal#
		 * @type {number}
		 * @name value
		 */
		Object.defineProperty(Tone.Equal.prototype, "value", {
			get : function(){
				return this._sub.value;
			},
			set : function(value){
				this._sub.value = value;
			}
		});

		/**
		 *  dispose method
		 *  @returns {Tone.Equal} `this`
		 */
		Tone.Equal.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._equals.disconnect();
			this._equals = null;
			this._sub.dispose();
			this._sub = null;
			return this;
		};

		return Tone.Equal;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Select between any number of inputs, sending the one 
		 *         selected by the gate signal to the output
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [sourceCount=2] the number of inputs the switch accepts
		 *  @example
		 *  var sel = new Tone.Select(2);
		 *  var sigA = new Tone.Signal(10).connect(sel, 0, 0);
		 *  var sigB = new Tone.Signal(20).connect(sel, 0, 1);
		 *  sel.gate.value = 0;
		 *  //sel outputs 10 (the value of sigA);
		 *  sel.gate.value = 1;
		 *  //sel outputs 20 (the value of sigB);
		 */
		Tone.Select = function(sourceCount){

			sourceCount = this.defaultArg(sourceCount, 2);

			Tone.call(this, sourceCount, 1);

			/**
			 *  the control signal
			 *  @type {Tone.Signal}
			 */
			this.gate = new Tone.Signal(0);

			//make all the inputs and connect them
			for (var i = 0; i < sourceCount; i++){
				var switchGate = new SelectGate(i);
				this.input[i] = switchGate;
				this.gate.connect(switchGate.selecter);
				switchGate.connect(this.output);
			}
		};

		Tone.extend(Tone.Select, Tone.SignalBase);

		/**
		 *  open one of the inputs and close the other
		 *  @param {number} which open one of the gates (closes the other)
		 *  @param {Tone.Time=} time the time when the switch will open
		 *  @returns {Tone.Select} `this`
		 *  @example
		 *  //open input 1 in a half second from now
		 *  sel.select(1, "+0.5");
		 */
		Tone.Select.prototype.select = function(which, time){
			//make sure it's an integer
			which = Math.floor(which);
			this.gate.setValueAtTime(which, this.toSeconds(time));
			return this;
		};

		/**
		 *  dispose method
		 *  @returns {Tone.Select} `this`
		 */
		Tone.Select.prototype.dispose = function(){
			this.gate.dispose();
			for (var i = 0; i < this.input.length; i++){
				this.input[i].dispose();
				this.input[i] = null;
			}
			Tone.prototype.dispose.call(this);
			this.gate = null;
			return this;
		}; 

		////////////START HELPER////////////

		/**
		 *  helper class for Tone.Select representing a single gate
		 *  @constructor
		 *  @extends {Tone}
		 *  @private
		 */
		var SelectGate = function(num){

			/**
			 *  the selector
			 *  @type {Tone.Equal}
			 */
			this.selecter = new Tone.Equal(num);

			/**
			 *  the gate
			 *  @type {GainNode}
			 */
			this.gate = this.input = this.output = this.context.createGain();

			//connect the selecter to the gate gain
			this.selecter.connect(this.gate.gain);
		};

		Tone.extend(SelectGate);

		/**
		 *  clean up
		 *  @private
		 */
		SelectGate.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.selecter.dispose();
			this.gate.disconnect();
			this.selecter = null;
			this.gate = null;
		};

		////////////END HELPER////////////

		//return Tone.Select
		return Tone.Select;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class IfThenElse has three inputs. When the first input (if) is true (i.e. === 1), 
		 *         then it will pass the second input (then) through to the output, otherwise, 
		 *         if it's not true (i.e. === 0) then it will pass the third input (else) 
		 *         through to the output. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var ifThenElse = new Tone.IfThenElse();
		 *  var ifSignal = new Tone.Signal(1).connect(ifThenElse, 0, 0);
		 *  var thenSignal = new Tone.PWMOscillator().connect(ifThenElse, 0, 1);
		 *  var elseSignal = new Tone.PulseOscillator().connect(ifThenElse, 0, 2);
		 *  //ifThenElse outputs thenSignal
		 *  signal.value = 0;
		 *  //now ifThenElse outputs elseSignal
		 */
		Tone.IfThenElse = function(){

			Tone.call(this, 3, 0);

			/**
			 *  the selector node which is responsible for the routing
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._selector = this.output = new Tone.Select(2);

			//the input mapping
			this.if = this.input[0] = this._selector.gate;
			this.then = this.input[1] = this._selector.input[1];
			this.else = this.input[2] = this._selector.input[0];
		};

		Tone.extend(Tone.IfThenElse, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.IfThenElse} `this`
		 */
		Tone.IfThenElse.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._selector.dispose();
			this._selector = null;
			this.if = null;
			this.then = null;
			this.else = null;
			return this;
		};

		return Tone.IfThenElse;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class OR the inputs together. True if at least one of the inputs is true. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var or = new Tone.OR(2);
		 *  var sigA = new Tone.Signal(0)connect(or, 0, 0);
		 *  var sigB = new Tone.Signal(1)connect(or, 0, 1);
		 *  //output of or is 1 because at least
		 *  //one of the inputs is equal to 1. 
		 */
		Tone.OR = function(inputCount){

			inputCount = this.defaultArg(inputCount, 2);
			Tone.call(this, inputCount, 0);

			/**
			 *  a private summing node
			 *  @type {GainNode}
			 *  @private
			 */
			this._sum = this.context.createGain();

			/**
			 *  @type {Tone.Equal}
			 *  @private
			 */
			this._gtz = new Tone.GreaterThanZero();

			/**
			 *  the output
			 *  @type {Tone.Equal}
			 *  @private
			 */
			this.output = this._gtz;

			//make each of the inputs an alias
			for (var i = 0; i < inputCount; i++){
				this.input[i] = this._sum;
			}
			this._sum.connect(this._gtz);
		};

		Tone.extend(Tone.OR, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.OR} `this`
		 */
		Tone.OR.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._gtz.dispose();
			this._gtz = null;
			this._sum.disconnect();
			this._sum = null;
			return this;
		};

		return Tone.OR;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class and returns 1 when all the inputs are equal to 1
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} [inputCount=2] the number of inputs. NOTE: all inputs are
		 *                                 connected to the single AND input node
		 *  @example
		 *  var and = new Tone.AND(2);
		 *  var sigA = new Tone.Signal(0).connect(and, 0, 0);
		 *  var sigB = new Tone.Signal(1).connect(and, 0, 1);
		 *  //the output of and is 0. 
		 */
		Tone.AND = function(inputCount){

			inputCount = this.defaultArg(inputCount, 2);

			Tone.call(this, inputCount, 0);

			/**
			 *  @type {Tone.Equal}
			 *  @private
			 */
			this._equals = this.output = new Tone.Equal(inputCount);

			//make each of the inputs an alias
			for (var i = 0; i < inputCount; i++){
				this.input[i] = this._equals;
			}
		};

		Tone.extend(Tone.AND, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.AND} `this`
		 */
		Tone.AND.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._equals.dispose();
			this._equals = null;
			return this;
		};

		return Tone.AND;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Just an alias for EqualZero. but has the same effect as a NOT operator. 
		 *          Outputs 1 when input equals 0. 
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var not = new Tone.NOT();
		 *  var sig = new Tone.Signal(1).connect(not);
		 *  //output of not equals 0. 
		 *  sig.value = 0;
		 *  //output of not equals 1.
		 */
		Tone.NOT = Tone.EqualZero;

		return Tone.NOT;
	});
	ToneModule( 
		function(Tone){

		

		/**
		 *  @class  Output 1 if the signal is greater than the value, otherwise outputs 0.
		 *          can compare two signals or a signal and a number. 
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} [value=0] the value to compare to the incoming signal
		 *  @example
		 *  var gt = new Tone.GreaterThan(2);
		 *  var sig = new Tone.Signal(4).connect(gt);
		 *  //output of gt is equal 1. 
		 */
		Tone.GreaterThan = function(value){

			Tone.call(this, 2, 0);
			
			/**
			 *  subtract the amount from the incoming signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */
			this._value = this.input[0] = new Tone.Subtract(value);
			this.input[1] = this._value.input[1];

			/**
			 *  compare that amount to zero
			 *  @type {Tone.GreaterThanZero}
			 *  @private
			 */
			this._gtz = this.output = new Tone.GreaterThanZero();

			//connect
			this._value.connect(this._gtz);
		};

		Tone.extend(Tone.GreaterThan, Tone.Signal);

		/**
		 *  dispose method
		 *  @returns {Tone.GreaterThan} `this`
		 */
		Tone.GreaterThan.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._value.dispose();
			this._value = null;
			this._gtz.dispose();
			this._gtz = null;
			return this;
		};

		return Tone.GreaterThan;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  Output 1 if the signal is less than the value, otherwise outputs 0.
		 *          Can compare two signals or a signal and a number. <br><br>
		 *          input 0: left hand side of comparison.<br><br>
		 *          input 1: right hand side of comparison.
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} [value=0] the value to compare to the incoming signal
		 *  @example
		 *  var lt = new Tone.LessThan(2);
		 *  var sig = new Tone.Signal(-1).connect(lt);
		 *  //lt outputs 1 because sig < 2
		 */
		Tone.LessThan = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  negate the incoming signal
			 *  @type {Tone.Negate}
			 *  @private
			 */
			this._neg = this.input[0] = new Tone.Negate();

			/**
			 *  input < value === -input > -value
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
			this._gt = this.output = new Tone.GreaterThan();

			/**
			 *  negate the signal coming from the second input
			 *  @private
			 *  @type {Tone.Negate}
			 */
			this._rhNeg = new Tone.Negate();

			/**
			 *  the node where the value is set
			 *  @private
			 *  @type {Tone.Signal}
			 */
			this._value = this.input[1] = new Tone.Signal(value);

			//connect
			this._neg.connect(this._gt);
			this._value.connect(this._rhNeg);	
			this._rhNeg.connect(this._gt, 0, 1);
		};

		Tone.extend(Tone.LessThan, Tone.Signal);

		/**
		 *  dispose method
		 *  @returns {Tone.LessThan} `this`
		 */
		Tone.LessThan.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._neg.dispose();
			this._neg = null;
			this._gt.dispose();
			this._gt = null;
			this._rhNeg.dispose();
			this._rhNeg = null;
			this._value.dispose();
			this._value = null;
			return this;
		};

		return Tone.LessThan;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class return the absolute value of an incoming signal
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var signal = new Tone.Signal(-1);
		 *  var abs = new Tone.Abs();
		 *  signal.connect(abs);
		 *  //the output of abs is 1. 
		 */
		Tone.Abs = function(){
			Tone.call(this, 1, 0);

			/**
			 *  @type {Tone.LessThan}
			 *  @private
			 */
			this._ltz = new Tone.LessThan(0);

			/**
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._switch = this.output = new Tone.Select(2);
			
			/**
			 *  @type {Tone.Negate}
			 *  @private
			 */
			this._negate = new Tone.Negate();

			//two signal paths, positive and negative
			this.input.connect(this._switch, 0, 0);
			this.input.connect(this._negate);
			this._negate.connect(this._switch, 0, 1);
			
			//the control signal
			this.input.chain(this._ltz, this._switch.gate);
		};

		Tone.extend(Tone.Abs, Tone.SignalBase);

		/**
		 *  dispose method
		 *  @returns {Tone.Abs} `this`
		 */
		Tone.Abs.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._switch.dispose();
			this._switch = null;
			this._ltz.dispose();
			this._ltz = null;
			this._negate.dispose();
			this._negate = null;
			return this;
		}; 

		return Tone.Abs;
	});
	ToneModule( function(Tone){

		

		/**
		 * 	@class  outputs the greater of two signals. If a number is provided in the constructor
		 * 	        it will use that instead of the signal. 
		 * 	
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} max max value if provided. if not provided, it will use the
		 *                       signal value from input 1. 
		 *  @example
		 *  var max = new Tone.Max(2);
		 *  var sig = new Tone.Signal(3).connect(max);
		 *  //max outputs 3
		 *  sig.value = 1;
		 *  //max outputs 2
		 */
		Tone.Max = function(max){

			Tone.call(this, 2, 0);
			this.input[0] = this.context.createGain();

			/**
			 *  the max signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
			this._value = this.input[1] = new Tone.Signal(max);

			/**
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._ifThenElse = this.output = new Tone.IfThenElse();

			/**
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._gt = new Tone.GreaterThan();

			//connections
			this.input[0].chain(this._gt, this._ifThenElse.if);
			this.input[0].connect(this._ifThenElse.then);
			this._value.connect(this._ifThenElse.else);
			this._value.connect(this._gt, 0, 1);
		};

		Tone.extend(Tone.Max, Tone.Signal);

		/**
		 *  clean up
		 *  @returns {Tone.Max} `this`
		 */
		Tone.Max.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._value.dispose();
			this._ifThenElse.dispose();
			this._gt.dispose();
			this._value = null;
			this._ifThenElse = null;
			this._gt = null;
			return this;
		};

		return Tone.Max;
	});
	ToneModule( function(Tone){

		

		/**
		 * 	@class  Outputs the lesser of two signals. If a number is given 
		 * 	        in the constructor, it will use a signal and a number. 
		 * 	
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} min the minimum to compare to the incoming signal
		 *  @example
		 *  var min = new Tone.Min(2);
		 *  var sig = new Tone.Signal(3).connect(min);
		 *  //min outputs 2
		 *  sig.value = 1;
		 *  //min outputs 1
		 */
		Tone.Min = function(min){

			Tone.call(this, 2, 0);
			this.input[0] = this.context.createGain();

			/**
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._ifThenElse = this.output = new Tone.IfThenElse();

			/**
			 *  @type {Tone.Select}
			 *  @private
			 */
			this._lt = new Tone.LessThan();

			/**
			 *  the min signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
			this._value = this.input[1] = new Tone.Signal(min);

			//connections
			this.input[0].chain(this._lt, this._ifThenElse.if);
			this.input[0].connect(this._ifThenElse.then);
			this._value.connect(this._ifThenElse.else);
			this._value.connect(this._lt, 0, 1);
		};

		Tone.extend(Tone.Min, Tone.Signal);

		/**
		 *  clean up
		 *  @returns {Tone.Min} `this`
		 */
		Tone.Min.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._value.dispose();
			this._ifThenElse.dispose();
			this._lt.dispose();
			this._value = null;
			this._ifThenElse = null;
			this._lt = null;
			return this;
		};

		return Tone.Min;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Signal-rate modulo operator. Only works in audio range [-1, 1] and for modulus
		 *         values less than 1. 
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} modulus the modulus to apply
		 *  @example
		 *  var mod = new Tone.Modulo(0.2)
		 *  var sig = new Tone.Signal(0.5).connect(mod);
		 *  //mod outputs 0.1
		 */
		Tone.Modulo = function(modulus){

			Tone.call(this, 1, 1);

			/**
			 *  A waveshaper gets the integer multiple of 
			 *  the input signal and the modulus.
			 *  @private
			 *  @type {Tone.WaveShaper}
			 */
			this._shaper = new Tone.WaveShaper(Math.pow(2, 16));

			/**
			 *  the integer multiple is multiplied by the modulus
			 *  @type  {Tone.Multiply}
			 *  @private
			 */
			this._multiply = new Tone.Multiply();

			/**
			 *  and subtracted from the input signal
			 *  @type  {Tone.Subtract}
			 *  @private
			 */
			this._subtract = this.output = new Tone.Subtract();

			/**
			 *  the modulus signal
			 *  @type  {Tone.Signal}
			 *  @private
			 */
			this._modSignal = new Tone.Signal(modulus);

			//connections
			this.input.fan(this._shaper, this._subtract);
			this._modSignal.connect(this._multiply, 0, 0);
			this._shaper.connect(this._multiply, 0, 1);
			this._multiply.connect(this._subtract, 0, 1);
			this._setWaveShaper(modulus);
		};

		Tone.extend(Tone.Modulo, Tone.SignalBase);

		/**
		 *  @param  {number}  mod  the modulus to apply
		 *  @private
		 */
		Tone.Modulo.prototype._setWaveShaper = function(mod){
			this._shaper.setMap(function(val){
				var multiple = Math.floor((val + 0.0001) / mod);
				return multiple;
			});
		};

		/**
		 * The modulus value.
		 * @memberOf Tone.Modulo#
		 * @type {number}
		 * @name value
		 */
		Object.defineProperty(Tone.Modulo.prototype, "value", {
			get : function(){
				return this._modSignal.value;
			},
			set : function(mod){
				this._modSignal.value = mod;
				this._setWaveShaper(mod);
			}
		});

		/**
		 * clean up
		 *  @returns {Tone.Modulo} `this`
		 */
		Tone.Modulo.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._shaper.dispose();
			this._shaper = null;
			this._multiply.dispose();
			this._multiply = null;
			this._subtract.dispose();
			this._subtract = null;
			this._modSignal.dispose();
			this._modSignal = null;
			return this;
		};

		return Tone.Modulo;
	});
	ToneModule( 
		function(Tone){

		

		/**
		 *  @class evaluate an expression at audio rate. 
		 *         parsing code modified from https://code.google.com/p/tapdigit/
		 *         Copyright 2011 2012 Ariya Hidayat, New BSD License
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {string} expr the expression to generate
		 *  @example
		 *  //adds the signals from input 0 and input 1.
		 *  var expr = new Tone.Expr("$0 + $1");
		 */
		Tone.Expr = function(){

			var expr = this._replacements(Array.prototype.slice.call(arguments));
			var inputCount = this._parseInputs(expr);

			/**
			 *  hold onto all of the nodes for disposal
			 *  @type {Array}
			 *  @private
			 */
			this._nodes = [];

			/**
			 *  The inputs. The length is determined by the expression. 
			 *  @type {Array}
			 */
			this.input = new Array(inputCount);

			//create a gain for each input
			for (var i = 0; i < inputCount; i++){
				this.input[i] = this.context.createGain();
			}

			//parse the syntax tree
			var tree = this._parseTree(expr);
			//evaluate the results
			var result;
			try {
				result = this._eval(tree);
			} catch (e){
				this._disposeNodes();
				throw new Error("Could evaluate expression: "+expr);
			}

			/**
			 *  The output node is the result of the expression
			 *  @type {Tone}
			 */
			this.output = result;
		};

		Tone.extend(Tone.Expr, Tone.SignalBase);

		//some helpers to cut down the amount of code
		function applyBinary(Constructor, args, self){
			var op = new Constructor();
			self._eval(args[0]).connect(op, 0, 0);
			self._eval(args[1]).connect(op, 0, 1);
			return op;
		}
		function applyUnary(Constructor, args, self){
			var op = new Constructor();
			self._eval(args[0]).connect(op, 0, 0);
			return op;
		}
		function getNumber(arg){
			return arg ? parseFloat(arg) : undefined;
		}
		function literalNumber(arg){
			return arg && arg.args ? parseFloat(arg.args) : undefined;
		}

		/*
		 *  the Expressions that Tone.Expr can parse.
		 *
		 *  each expression belongs to a group and contains a regexp 
		 *  for selecting the operator as well as that operators method
		 *  
		 *  @type {Object}
		 *  @private
		 */
		Tone.Expr._Expressions = {
			//values
			"value" : {
				"signal" : {
					regexp : /^\d+\.\d+|^\d+/,
					method : function(arg){
						var sig = new Tone.Signal(getNumber(arg));
						return sig;
					}
				},
				"input" : {
					regexp : /^\$\d/,
					method : function(arg, self){
						return self.input[getNumber(arg.substr(1))];
					}
				}
			},
			//syntactic glue
			"glue" : {
				"(" : {
					regexp : /^\(/,
				},
				")" : {
					regexp : /^\)/,
				},
				"," : {
					regexp : /^,/,
				}
			},
			//functions
			"func" : {
				"abs" :  {
					regexp : /^abs/,
					method : applyUnary.bind(this, Tone.Abs)
				},
				"min" : {
					regexp : /^min/,
					method : applyBinary.bind(this, Tone.Min)
				},
				"max" : {
					regexp : /^max/,
					method : applyBinary.bind(this, Tone.Max)
				},
				"if" :  {
					regexp : /^if/,
					method : function(args, self){
						var op = new Tone.IfThenElse();
						self._eval(args[0]).connect(op.if);
						self._eval(args[1]).connect(op.then);
						self._eval(args[2]).connect(op.else);
						return op;
					}
				},
				"gt0" : {
					regexp : /^gt0/,
					method : applyUnary.bind(this, Tone.GreaterThanZero)
				},
				"eq0" : {
					regexp : /^eq0/,
					method : applyUnary.bind(this, Tone.EqualZero)
				},
				"mod" : {
					regexp : /^mod/,
					method : function(args, self){
						var modulus = literalNumber(args[1]);
						var op = new Tone.Modulo(modulus);
						self._eval(args[0]).connect(op);
						return op;
					}
				},
				"pow" : {
					regexp : /^pow/,
					method : function(args, self){
						var exp = literalNumber(args[1]);
						var op = new Tone.Pow(exp);
						self._eval(args[0]).connect(op);
						return op;
					}
				},
			},
			//binary expressions
			"binary" : {
				"+" : {
					regexp : /^\+/,
					precedence : 1,
					method : applyBinary.bind(this, Tone.Add)
				},
				"-" : {
					regexp : /^\-/,
					precedence : 1,
					method : function(args, self){
						//both unary and binary op
						if (args.length === 1){
							return applyUnary(Tone.Negate, args, self);
						} else {
							return applyBinary(Tone.Subtract, args, self);
						}
					}
				},
				"*" : {
					regexp : /^\*/,
					precedence : 0,
					method : applyBinary.bind(this, Tone.Multiply)
				},
				">" : {
					regexp : /^\>/,
					precedence : 2,
					method : applyBinary.bind(this, Tone.GreaterThan)
				},
				"<" : {
					regexp : /^</,
					precedence : 2,
					method : applyBinary.bind(this, Tone.LessThan)
				},
				"==" : {
					regexp : /^==/,
					precedence : 3,
					method : applyBinary.bind(this, Tone.Equal)
				},
				"&&" : {
					regexp : /^&&/,
					precedence : 4,
					method : applyBinary.bind(this, Tone.AND)
				},
				"||" : {
					regexp : /^\|\|/,
					precedence : 5,
					method : applyBinary.bind(this, Tone.OR)
				},
			},
			//unary expressions
			"unary" : {
				"-" : {
					regexp : /^\-/,
					method : applyUnary.bind(this, Tone.Negate)
				},
				"!" : {
					regexp : /^\!/,
					method : applyUnary.bind(this, Tone.NOT)
				},
			},
		};
			
		/**
		 *  @param   {string} expr the expression string
		 *  @return  {number}      the input count
		 *  @private
		 */
		Tone.Expr.prototype._parseInputs = function(expr){
			var inputArray = expr.match(/\$\d/g);
			var inputMax = 0;
			if (inputArray !== null){
				for (var i = 0; i < inputArray.length; i++){
					var inputNum = parseInt(inputArray[i].substr(1)) + 1;
					inputMax = Math.max(inputMax, inputNum);
				}
			}
			return inputMax;
		};

		/**
		 *  @param   {Array} args 	an array of arguments
		 *  @return  {string} the results of the replacements being replaced
		 *  @private
		 */
		Tone.Expr.prototype._replacements = function(args){
			var expr = args.shift();
			for (var i = 0; i < args.length; i++){
				expr = expr.replace(/\%/i, args[i]);
			}
			return expr;
		};

		/**
		 *  tokenize the expression based on the Expressions object
		 *  @param   {string} expr 
		 *  @return  {Object}      returns two methods on the tokenized list, next and peek
		 *  @private
		 */
		Tone.Expr.prototype._tokenize = function(expr){
			var position = -1;
			var tokens = [];

			while(expr.length > 0){
				expr = expr.trim();
				var token =  getNextToken(expr);
				tokens.push(token);
				expr = expr.substr(token.value.length);
			}

			function getNextToken(expr){
				for (var type in Tone.Expr._Expressions){
					var group = Tone.Expr._Expressions[type];
					for (var opName in group){
						var op = group[opName];
						var reg = op.regexp;
						var match = expr.match(reg);
						if (match !== null){
							return {
								type : type,
								value : match[0],
								method : op.method
							};
						}
					}
				}
				throw new SyntaxError("Unexpected token "+expr);
			}

			return {
				next : function(){
					return tokens[++position];
				},
				peek : function(){
					return tokens[position + 1];
				}
			};
		};

		/**
		 *  recursively parse the string expression into a syntax tree
		 *  
		 *  @param   {string} expr 
		 *  @return  {Object}
		 *  @private
		 */
		Tone.Expr.prototype._parseTree = function(expr){
			var lexer = this._tokenize(expr);
			var isUndef = this.isUndef.bind(this);

			function matchSyntax(token, syn) {
				return !isUndef(token) && 
					token.type === "glue" &&
					token.value === syn;
			}

			function matchGroup(token, groupName, prec) {
				var ret = false;
				var group = Tone.Expr._Expressions[groupName];
				if (!isUndef(token)){
					for (var opName in group){
						var op = group[opName];
						if (op.regexp.test(token.value)){
							if (!isUndef(prec)){
								if(op.precedence === prec){	
									return true;
								}
							} else {
								return true;
							}
						}
					}
				}
				return ret;
			}

			function parseExpression(precedence) {
				if (isUndef(precedence)){
					precedence = 5;
				}
				var expr;
				if (precedence < 0){
					expr = parseUnary();
				} else {
					expr = parseExpression(precedence-1);
				}
				var token = lexer.peek();
				while (matchGroup(token, "binary", precedence)) {
					token = lexer.next();
					expr = {
						operator: token.value,
						method : token.method,
						args : [
							expr,
							parseExpression(precedence)
						]
					};
					token = lexer.peek();
				}
				return expr;
			}

			function parseUnary() {
				var token, expr;
				token = lexer.peek();
				if (matchGroup(token, "unary")) {
					token = lexer.next();
					expr = parseUnary();
					return {
						operator: token.value,
						method : token.method,
						args : [expr]
					};
				}
				return parsePrimary();
			}

			function parsePrimary() {
				var token, expr;
				token = lexer.peek();
				if (isUndef(token)) {
					throw new SyntaxError("Unexpected termination of expression");
				}
				if (token.type === "func") {
					token = lexer.next();
					return parseFunctionCall(token);
				}
				if (token.type === "value") {
					token = lexer.next();
					return {
						method : token.method,
						args : token.value
					};
				}
				if (matchSyntax(token, "(")) {
					lexer.next();
					expr = parseExpression();
					token = lexer.next();
					if (!matchSyntax(token, ")")) {
						throw new SyntaxError("Expected )");
					}
					return expr;
				}
				throw new SyntaxError("Parse error, cannot process token " + token.value);
			}

			function parseFunctionCall(func) {
				var token, args = [];
				token = lexer.next();
				if (!matchSyntax(token, "(")) {
					throw new SyntaxError("Expected ( in a function call \"" + func.value + "\"");
				}
				token = lexer.peek();
				if (!matchSyntax(token, ")")) {
					args = parseArgumentList();
				}
				token = lexer.next();
				if (!matchSyntax(token, ")")) {
					throw new SyntaxError("Expected ) in a function call \"" + func.value + "\"");
				}
				return {
					method : func.method,
					args : args,
					name : name
				};
			}

			function parseArgumentList() {
				var token, expr, args = [];
				while (true) {
					expr = parseExpression();
					if (isUndef(expr)) {
						// TODO maybe throw exception?
						break;
					}
					args.push(expr);
					token = lexer.peek();
					if (!matchSyntax(token, ",")) {
						break;
					}
					lexer.next();
				}
				return args;
			}

			return parseExpression();
		};

		/**
		 *  recursively evaluate the expression tree
		 *  @param   {Object} tree 
		 *  @return  {AudioNode}      the resulting audio node from the expression
		 *  @private
		 */
		Tone.Expr.prototype._eval = function(tree){
			if (!this.isUndef(tree)){
				var node = tree.method(tree.args, this);
				this._nodes.push(node);
				return node;
			} 
		};

		/**
		 *  dispose all the nodes
		 *  @private
		 */
		Tone.Expr.prototype._disposeNodes = function(){
			for (var i = 0; i < this._nodes.length; i++){
				var node = this._nodes[i];
				if (this.isFunction(node.dispose)) {
					node.dispose();
				} else if (this.isFunction(node.disconnect)) {
					node.disconnect();
				}
				node = null;
				this._nodes[i] = null;
			}
			this._nodes = null;
		};

		/**
		 *  clean up
		 */
		Tone.Expr.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._disposeNodes();
		};

		return Tone.Expr;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Convert an incoming signal between 0, 1 to an equal power gain scale.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var eqPowGain = new Tone.EqualPowerGain();
		 */
		Tone.EqualPowerGain = function(){

			/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._eqPower = this.input = this.output = new Tone.WaveShaper(function(val){
				if (Math.abs(val) < 0.001){
					//should output 0 when input is 0
					return 0;
				} else {
					return this.equalPowerScale(val);
				}
			}.bind(this), 4096);
		};

		Tone.extend(Tone.EqualPowerGain, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.EqualPowerGain} `this`
		 */
		Tone.EqualPowerGain.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._eqPower.dispose();
			this._eqPower = null;
			return this;
		};

		return Tone.EqualPowerGain;
	});
	ToneModule( function(Tone){

		

		/**
		 * @class  Equal power fading control values:<br>
		 * 	       0 = 100% input 0<br>
		 * 	       1 = 100% input 1<br>
		 *
		 * @constructor
		 * @extends {Tone}
		 * @param {number} [initialFade=0.5]
		 * @example
		 * var crossFade = new Tone.CrossFade(0.5);
		 * effectA.connect(crossFade, 0, 0);
		 * effectB.connect(crossFade, 0, 1);
		 * crossFade.fade.value = 0;
		 * // ^ only effectA is output
		 * crossFade.fade.value = 1;
		 * // ^ only effectB is output
		 * crossFade.fade.value = 0.5;
		 * // ^ the two signals are mixed equally. 
		 */		
		Tone.CrossFade = function(initialFade){

			Tone.call(this, 2, 1);

			/**
			 *  the first input. input "a".
			 *  @type {GainNode}
			 */
			this.a = this.input[0] = this.context.createGain();

			/**
			 *  the second input. input "b"
			 *  @type {GainNode}
			 */
			this.b = this.input[1] = this.context.createGain();

			/**
			 *  0 is 100% signal `a` (input 0) and 1 is 100% signal `b` (input 1).
			 *  Values between 0-1.
			 *  
			 *  @type {Tone.Signal}
			 */
			this.fade = new Tone.Signal(this.defaultArg(initialFade, 0.5), Tone.Signal.Units.Normal);

			/**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */
			this._equalPowerA = new Tone.EqualPowerGain();

			/**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */
			this._equalPowerB = new Tone.EqualPowerGain();
			
			/**
			 *  invert the incoming signal
			 *  @private
			 *  @type {Tone}
			 */
			this._invert = new Tone.Expr("1 - $0");

			//connections
			this.a.connect(this.output);
			this.b.connect(this.output);
			this.fade.chain(this._equalPowerB, this.b.gain);
			this.fade.chain(this._invert, this._equalPowerA, this.a.gain);
		};

		Tone.extend(Tone.CrossFade);

		/**
		 *  clean up
		 *  @returns {Tone.CrossFade} `this`
		 */
		Tone.CrossFade.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._equalPowerA.dispose();
			this._equalPowerA = null;
			this._equalPowerB.dispose();
			this._equalPowerB = null;
			this.fade.dispose();
			this.fade = null;
			this._invert.dispose();
			this._invert = null;
			this.a.disconnect();
			this.a = null;
			this.b.disconnect();
			this.b = null;
			return this;
		};

		return Tone.CrossFade;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class  Filter object which allows for all of the same native methods
		 *          as the BiquadFilter (with AudioParams implemented as Tone.Signals)
		 *          but adds the ability to set the filter rolloff at -12 (default), 
		 *          -24 and -48. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number|Object} [freq=350] the frequency
		 *  @param {string} [type=lowpass] the type of filter
		 *  @param {number} [rolloff=-12] the rolloff which is the drop per octave. 
		 *                                 3 choices: -12, -24, and -48
		 *  @example
		 *  var filter = new Tone.Filter(200, "highpass");
		 */
		Tone.Filter = function(){
			Tone.call(this);

			var options = this.optionsObject(arguments, ["frequency", "type", "rolloff"], Tone.Filter.defaults);

			/**
			 *  the filter(s)
			 *  @type {Array.<BiquadFilterNode>}
			 *  @private
			 */
			this._filters = [];

			/**
			 *  the frequency of the filter
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Signal.Units.Frequency);

			/**
			 *  the detune parameter
			 *  @type {Tone.Signal}
			 */
			this.detune = new Tone.Signal(0);

			/**
			 *  the gain of the filter, only used in certain filter types
			 *  @type {AudioParam}
			 */
			this.gain = new Tone.Signal(options.gain, Tone.Signal.Units.Decibels);

			/**
			 *  the Q or Quality of the filter
			 *  @type {Tone.Signal}
			 */
			this.Q = new Tone.Signal(options.Q);

			/**
			 *  the type of the filter
			 *  @type {string}
			 *  @private
			 */
			this._type = options.type;

			/**
			 *  the rolloff value of the filter
			 *  @type {number}
			 *  @private
			 */
			this._rolloff = options.rolloff;

			//set the rolloff;
			this.rolloff = options.rolloff;
		};

		Tone.extend(Tone.Filter);

		/**
		 *  the default parameters
		 *
		 *  @static
		 *  @type {Object}
		 */
		Tone.Filter.defaults = {
			"type" : "lowpass",
			"frequency" : 350,
			"rolloff" : -12,
			"Q" : 1,
			"gain" : 0,
		};

		/**
		 * The type of the filter. Types: "lowpass", "highpass", 
		 * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking". 
		 * @memberOf Tone.Filter#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.Filter.prototype, "type", {
			get : function(){
				return this._type;
			},
			set : function(type){
				var types = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];
				if (types.indexOf(type)=== -1){
					throw new TypeError("Tone.Filter does not have filter type "+type);
				}
				this._type = type;
				for (var i = 0; i < this._filters.length; i++){
					this._filters[i].type = type;
				}
			}
		});

		/**
		 * The rolloff of the filter which is the drop in db
		 * per octave. Implemented internally by cascading filters.
		 * Only accepts the values -12, -24, and -48.
		 * @memberOf Tone.Filter#
		 * @type {number}
		 * @name rolloff
		 */
		Object.defineProperty(Tone.Filter.prototype, "rolloff", {
			get : function(){
				return this._rolloff;
			},
			set : function(rolloff){
				var cascadingCount = Math.log(rolloff / -12) / Math.LN2 + 1;
				//check the rolloff is valid
				if (cascadingCount % 1 !== 0){
					throw new RangeError("Filter rolloff can only be -12, -24, or -48");
				}
				this._rolloff = rolloff;
				//first disconnect the filters and throw them away
				this.input.disconnect();
				for (var i = 0; i < this._filters.length; i++) {
					this._filters[i].disconnect();
					this._filters[i] = null;
				}
				this._filters = new Array(cascadingCount);
				for (var count = 0; count < cascadingCount; count++){
					var filter = this.context.createBiquadFilter();
					filter.type = this._type;
					this.frequency.connect(filter.frequency);
					this.detune.connect(filter.detune);
					this.Q.connect(filter.Q);
					this.gain.connect(filter.gain);
					this._filters[count] = filter;
				}
				//connect them up
				var connectionChain = [this.input].concat(this._filters).concat([this.output]);
				this.connectSeries.apply(this, connectionChain);
			}
		});

		/**
		 *  clean up
		 *  @return {Tone.Filter} `this`
		 */
		Tone.Filter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			for (var i = 0; i < this._filters.length; i++) {
				this._filters[i].disconnect();
				this._filters[i] = null;
			}
			this._filters = null;
			this.frequency.dispose();
			this.Q.dispose();
			this.frequency = null;
			this.Q = null;
			this.detune.dispose();
			this.detune = null;
			this.gain.dispose();
			this.gain = null;
			return this;
		};

		return Tone.Filter;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Split the incoming signal into three bands (low, mid, high)
		 *         with two crossover frequency controls. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} lowFrequency the low/mid crossover frequency
		 *  @param {number} highFrequency the mid/high crossover frequency
		 */
		Tone.MultibandSplit = function(){
			var options = this.optionsObject(arguments, ["lowFrequency", "highFrequency"], Tone.MultibandSplit.defaults);

			/**
			 *  the input
			 *  @type {GainNode}
			 *  @private
			 */
			this.input = this.context.createGain();

			/**
			 *  the outputs
			 *  @type {Array}
			 *  @private
			 */
			this.output = new Array(3);

			/**
			 *  the low band
			 *  @type {Tone.Filter}
			 */
			this.low = this.output[0] = new Tone.Filter(0, "lowpass");

			/**
			 *  the lower filter of the mid band
			 *  @type {Tone.Filter}
			 *  @private
			 */
			this._lowMidFilter = new Tone.Filter(0, "highpass");

			/**
			 *  the mid band
			 *  @type {Tone.Filter}
			 */
			this.mid = this.output[1] = new Tone.Filter(0, "lowpass");

			/**
			 *  the high band
			 *  @type {Tone.Filter}
			 */
			this.high = this.output[2] = new Tone.Filter(0, "highpass");

			/**
			 *  the low/mid crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.lowFrequency = new Tone.Signal(options.lowFrequency);

			/**
			 *  the mid/high crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.highFrequency = new Tone.Signal(options.highFrequency);

			this.input.fan(this.low, this.high);
			this.input.chain(this._lowMidFilter, this.mid);
			//the frequency control signal
			this.lowFrequency.connect(this.low.frequency);
			this.lowFrequency.connect(this._lowMidFilter.frequency);
			this.highFrequency.connect(this.mid.frequency);
			this.highFrequency.connect(this.high.frequency);
		};

		Tone.extend(Tone.MultibandSplit);

		/**
		 *  @private
		 *  @static
		 *  @type {Object}
		 */
		Tone.MultibandSplit.defaults = {
			"lowFrequency" : 400,
			"highFrequency" : 2500
		};

		/**
		 *  clean up
		 *  @returns {Tone.MultibandSplit} `this`
		 */
		Tone.MultibandSplit.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.low.dispose();
			this._lowMidFilter.dispose();
			this.mid.dispose();
			this.high.dispose();
			this.lowFrequency.dispose();
			this.highFrequency.dispose();
			this.low = null;
			this._lowMidFilter = null;
			this.mid = null;
			this.high = null;
			this.lowFrequency = null;
			this.highFrequency = null;
			return this;
		};

		return Tone.MultibandSplit;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A 3 band EQ with control over low, mid, and high gain as
		 *         well as the low and high crossover frequencies. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  
		 *  @param {number|object} [lowLevel=0] the gain applied to the lows (in db)
		 *  @param {number} [midLevel=0] the gain applied to the mid (in db)
		 *  @param {number} [highLevel=0] the gain applied to the high (in db)
		 *  @example
		 *  var eq = new Tone.EQ(-10, 3, -20);
		 */
		Tone.EQ = function(){

			var options = this.optionsObject(arguments, ["low", "mid", "high"], Tone.EQ.defaults);

			/**
			 *  the output node
			 *  @type {GainNode}
			 *  @private
			 */
			this.output = this.context.createGain();

			/**
			 *  the multiband split
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */
			this._multibandSplit = this.input = new Tone.MultibandSplit({
				"lowFrequency" : options.lowFrequency,
				"highFrequency" : options.highFrequency
			});

			/**
			 *  the low gain
			 *  @type {GainNode}
			 *  @private
			 */
			this._lowGain = this.context.createGain();

			/**
			 *  the mid gain
			 *  @type {GainNode}
			 *  @private
			 */
			this._midGain = this.context.createGain();

			/**
			 *  the high gain
			 *  @type {GainNode}
			 *  @private
			 */
			this._highGain = this.context.createGain();

			/**
			 * The gain in decibels of the low part
			 * @type {Tone.Signal}
			 */
			this.low = new Tone.Signal(this._lowGain.gain, Tone.Signal.Units.Decibels);

			/**
			 * The gain in decibels of the mid part
			 * @type {Tone.Signal}
			 */
			this.mid = new Tone.Signal(this._midGain.gain, Tone.Signal.Units.Decibels);

			/**
			 * The gain in decibels of the high part
			 * @type {Tone.Signal}
			 */
			this.high = new Tone.Signal(this._highGain.gain, Tone.Signal.Units.Decibels);

			/**
			 *  the low/mid crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.lowFrequency = this._multibandSplit.lowFrequency;

			/**
			 *  the mid/high crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.highFrequency = this._multibandSplit.highFrequency;

			//the frequency bands
			this._multibandSplit.low.chain(this._lowGain, this.output);
			this._multibandSplit.mid.chain(this._midGain, this.output);
			this._multibandSplit.high.chain(this._highGain, this.output);
			//set the gains
			this.high.value = options.low;
			this.mid.value = options.mid;
			this.low.value = options.high;
		};

		Tone.extend(Tone.EQ);

		/**
		 *  the default values
		 *  @type {Object}
		 *  @static
		 */
		Tone.EQ.defaults = {
			"low" : 0,
			"mid" : 0,
			"high" : 0,
			"lowFrequency" : 400,
			"highFrequency" : 2500
		};

		/**
		 *  clean up
		 *  @returns {Tone.EQ} `this`
		 */
		Tone.EQ.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._multibandSplit.dispose();
			this._multibandSplit = null;
			this.lowFrequency = null;
			this.highFrequency = null;
			this._lowGain.disconnect();
			this._lowGain = null;
			this._midGain.disconnect();
			this._midGain = null;
			this._highGain.disconnect();
			this._highGain = null;
			this.low.dispose();
			this.low = null;
			this.mid.dispose();
			this.mid = null;
			this.high.dispose();
			this.high = null;
			return this;
		};

		return Tone.EQ;
	});
	ToneModule( function(Tone){

		
		
		/**
		 *  @class  Performs a linear scaling on an input signal.
		 *          Scales a normal gain input range [0,1] to between
		 *          outputMin and outputMax
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0]
		 *  @param {number} [outputMax=1]
		 *  @example
		 *  var scale = new Tone.Scale(50, 100);
		 *  var signal = new Tone.Signal(0.5).connect(scale);
		 *  //the output of scale equals 75
		 */
		Tone.Scale = function(outputMin, outputMax){

			/** 
			 *  @private
			 *  @type {number}
			 */
			this._outputMin = this.defaultArg(outputMin, 0);

			/** 
			 *  @private
			 *  @type {number}
			 */
			this._outputMax = this.defaultArg(outputMax, 1);


			/** 
			 *  @private
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = this.input = new Tone.Multiply(1);
			
			/** 
			 *  @private
			 *  @type {Tone.Add}
			 *  @private
			 */
			this._add = this.output = new Tone.Add(0);

			this._scale.connect(this._add);
			this._setRange();
		};

		Tone.extend(Tone.Scale, Tone.SignalBase);

		/**
		 * The minimum output value.
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.Scale.prototype, "min", {
			get : function(){
				return this._outputMin;
			},
			set : function(min){
				this._outputMin = min;
				this._setRange();
			}
		});

		/**
		 * The maximum output value.
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.Scale.prototype, "max", {
			get : function(){
				return this._outputMax;
			},
			set : function(max){
				this._outputMax = max;
				this._setRange();
			}
		});

		/**
		 *  set the values
		 *  @private
		 */
		Tone.Scale.prototype._setRange = function() {
			this._add.value = this._outputMin;
			this._scale.value = this._outputMax - this._outputMin;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Scale} `this`
		 */
		Tone.Scale.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._add.dispose();
			this._add = null;
			this._scale.dispose();
			this._scale = null;
			return this;
		}; 

		return Tone.Scale;
	});

	ToneModule( 
	function(Tone){
		
		/**
		 *  @class  Performs an exponential scaling on an input signal.
		 *          Scales a normal gain range [0,1] exponentially
		 *          to the output range of outputMin to outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0]
		 *  @param {number} [outputMax=1]
		 *  @param {number} [exponent=2] the exponent which scales the incoming signal
		 */
		Tone.ScaleExp = function(outputMin, outputMax, exponent){

			/**
			 *  scale the input to the output range
			 *  @type {Tone.Scale}
			 *  @private
			 */
			this._scale = this.output = new Tone.Scale(outputMin, outputMax);

			/**
			 *  @private
			 *  @type {Tone.Pow}
			 *  @private
			 */
			this._exp = this.input = new Tone.Pow(this.defaultArg(exponent, 2));

			this._exp.connect(this._scale);
		};

		Tone.extend(Tone.ScaleExp, Tone.SignalBase);

		/**
		 * The minimum output value.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name exponent
		 */
		Object.defineProperty(Tone.ScaleExp.prototype, "exponent", {
			get : function(){
				return this._exp.value;
			},
			set : function(exp){
				this._exp.value = exp;
			}
		});

		/**
		 * The minimum output value.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.ScaleExp.prototype, "min", {
			get : function(){
				return this._scale.min;
			},
			set : function(min){
				this._scale.min = min;
			}
		});

		/**
		 * The maximum output value.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.ScaleExp.prototype, "max", {
			get : function(){
				return this._scale.max;
			},
			set : function(max){
				this._scale.max = max;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.ScaleExp} `this`
		 */
		Tone.ScaleExp.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._scale.dispose();
			this._scale = null;
			this._exp.dispose();
			this._exp = null;
			return this;
		}; 


		return Tone.ScaleExp;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class A comb filter with feedback.
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} [minDelay=0.01] the minimum delay time which the filter can have
		 *  @param {number} [maxDelay=1] the maximum delay time which the filter can have
		 */
		Tone.FeedbackCombFilter = function(){

			Tone.call(this);
			var options = this.optionsObject(arguments, ["minDelay", "maxDelay"], Tone.FeedbackCombFilter.defaults);

			var minDelay = options.minDelay;
			var maxDelay = options.maxDelay;
			//the delay * samplerate = number of samples. 
			// buffersize / number of samples = number of delays needed per buffer frame
			var delayCount = Math.ceil(this.bufferSize / (minDelay * this.context.sampleRate));
			//set some ranges
			delayCount = Math.min(delayCount, 10);
			delayCount = Math.max(delayCount, 1);

			/**
			 *  the number of filter delays
			 *  @type {number}
			 *  @private
			 */
			this._delayCount = delayCount;

			/**
			 *  @type {Array.<FilterDelay>}
			 *  @private
			 */
			this._delays = new Array(this._delayCount);

			/**
			 *  the resonance control
			 *  @type {Tone.Signal}
			 */
			this.resonance = new Tone.Signal(options.resonance, Tone.Signal.Units.Normal);

			/**
			 *  scale the resonance value to the normal range
			 *  @type {Tone.Scale}
			 *  @private
			 */
			this._resScale = new Tone.ScaleExp(0.01, 1 / this._delayCount - 0.001, 0.5);

			/**
			 *  internal flag for keeping track of when frequency
			 *  correction has been used
			 *  @type {boolean}
			 *  @private
			 */
			this._highFrequencies = false;

			/**
			 *  internal counter of delayTime
			 *  @type {Tone.TIme}
			 *  @private
			 */
			this._delayTime = options.delayTime;

			/**
			 *  the feedback node
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedback = this.context.createGain();

			//make the filters
			for (var i = 0; i < this._delayCount; i++) {
				var delay = this.context.createDelay(maxDelay);
				delay.delayTime.value = minDelay;
				delay.connect(this._feedback);
				this._delays[i] = delay;
			}

			//connections
			this.connectSeries.apply(this, this._delays);
			this.input.connect(this._delays[0]);
			//set the delay to the min value initially
			this._feedback.connect(this._delays[0]);
			//resonance control
			this.resonance.chain(this._resScale, this._feedback.gain);
			this._feedback.connect(this.output);
			this.delayTime = options.delayTime;
		};

		Tone.extend(Tone.FeedbackCombFilter);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.FeedbackCombFilter.defaults = {
			"resonance" : 0.5,
			"minDelay" : 0.1,
			"maxDelay" : 1,
			"delayTime" : 0.1
		};

		/**
		 * the delay time of the FeedbackCombFilter
		 * @memberOf Tone.FeedbackCombFilter#
		 * @type {Tone.Time}
		 * @name delayTime
		 */
		Object.defineProperty(Tone.FeedbackCombFilter.prototype, "delayTime", {
			get : function(){
				return this._delayTime;
			},
			set : function(delayAmount){
				this._delayTime = delayAmount;
				delayAmount = this.toSeconds(delayAmount);
				//the number of samples to delay by
				var sampleRate = this.context.sampleRate;
				var delaySamples = sampleRate * delayAmount;
				// delayTime corection when frequencies get high
				var now = this.now() + this.bufferTime;
				var cutoff = 100;
				if (delaySamples < cutoff){
					this._highFrequencies = true;
					var changeNumber = Math.round((delaySamples / cutoff) * this._delayCount);
					for (var i = 0; i < changeNumber; i++) {
						this._delays[i].delayTime.setValueAtTime(1 / sampleRate + delayAmount, now);
					}
					delayAmount = Math.floor(delaySamples) / sampleRate;
				} else if (this._highFrequencies){
					this._highFrequencies = false;
					for (var j = 0; j < this._delays.length; j++) {
						this._delays[j].delayTime.setValueAtTime(delayAmount, now);
					}
				}
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.FeedbackCombFilter} `this`
		 */
		Tone.FeedbackCombFilter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			//dispose the filter delays
			for (var i = 0; i < this._delays.length; i++) {
				this._delays[i].disconnect();
				this._delays[i] = null;
			}
			this._delays = null;
			this.resonance.dispose();
			this.resonance = null;
			this._resScale.dispose();
			this._resScale = null;
			this._feedback.disconnect();
			this._feedback = null;
			return this;
		};

		return Tone.FeedbackCombFilter;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  Follow the envelope of the incoming signal. 
		 *          Careful with small (< 0.02) attack or decay values. 
		 *          The follower has some ripple which gets exaggerated
		 *          by small values. 
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Tone.Time} [attack = 0.05] 
		 *  @param {Tone.Time} [release = 0.5] 
		 *  @example
		 *  var follower = new Tone.Follower(0.2, 0.4);
		 */
		Tone.Follower = function(){

			Tone.call(this);
			var options = this.optionsObject(arguments, ["attack", "release"], Tone.Follower.defaults);

			/**
			 *  @type {Tone.Abs}
			 *  @private
			 */
			this._abs = new Tone.Abs();

			/**
			 *  the lowpass filter which smooths the input
			 *  @type {BiquadFilterNode}
			 *  @private
			 */
			this._filter = this.context.createBiquadFilter();
			this._filter.type = "lowpass";
			this._filter.frequency.value = 0;
			this._filter.Q.value = -100;

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._frequencyValues = new Tone.WaveShaper();
			
			/**
			 *  @type {Tone.Subtract}
			 *  @private
			 */
			this._sub = new Tone.Subtract();

			/**
			 *  @type {DelayNode}
			 *  @private
			 */
			this._delay = this.context.createDelay();
			this._delay.delayTime.value = this.bufferTime;

			/**
			 *  this keeps it far from 0, even for very small differences
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._mult = new Tone.Multiply(10000);

			/**
			 *  @private
			 *  @type {number}
			 */
			this._attack = options.attack;

			/**
			 *  @private
			 *  @type {number}
			 */
			this._release = options.release;

			//the smoothed signal to get the values
			this.input.chain(this._abs, this._filter, this.output);
			//the difference path
			this._abs.connect(this._sub, 0, 1);
			this._filter.chain(this._delay, this._sub);
			//threshold the difference and use the thresh to set the frequency
			this._sub.chain(this._mult, this._frequencyValues, this._filter.frequency);
			//set the attack and release values in the table
			this._setAttackRelease(this._attack, this._release);
		};

		Tone.extend(Tone.Follower);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.Follower.defaults = {
			"attack" : 0.05, 
			"release" : 0.5
		};

		/**
		 *  sets the attack and release times in the wave shaper
		 *  @param   {Tone.Time} attack  
		 *  @param   {Tone.Time} release 
		 *  @private
		 */
		Tone.Follower.prototype._setAttackRelease = function(attack, release){
			var minTime = this.bufferTime;
			attack = this.secondsToFrequency(this.toSeconds(attack));
			release = this.secondsToFrequency(this.toSeconds(release));
			attack = Math.max(attack, minTime);
			release = Math.max(release, minTime);
			this._frequencyValues.setMap(function(val){
				if (val <= 0){
					return attack;
				} else {
					return release;
				} 
			});
		};

		/**
		 * The attack time.
		 * @memberOf Tone.Follower#
		 * @type {Tone.Time}
		 * @name attack
		 */
		Object.defineProperty(Tone.Follower.prototype, "attack", {
			get : function(){
				return this._attack;
			},
			set : function(attack){
				this._attack = attack;
				this._setAttackRelease(this._attack, this._release);	
			}
		});

		/**
		 * The release time.
		 * @memberOf Tone.Follower#
		 * @type {Tone.Time}
		 * @name release
		 */
		Object.defineProperty(Tone.Follower.prototype, "release", {
			get : function(){
				return this._release;
			},
			set : function(release){
				this._release = release;
				this._setAttackRelease(this._attack, this._release);	
			}
		});

		/**
		 *  borrows the connect method from Signal so that the output can be used
		 *  as a control signal {@link Tone.Signal}
		 *  @function
		 */
		Tone.Follower.prototype.connect = Tone.Signal.prototype.connect;

		/**
		 *  dispose
		 *  @returns {Tone.Follower} `this`
		 */
		Tone.Follower.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._filter.disconnect();
			this._filter = null;
			this._frequencyValues.disconnect();
			this._frequencyValues = null;
			this._delay.disconnect();
			this._delay = null;
			this._sub.disconnect();
			this._sub = null;
			this._abs.dispose();
			this._abs = null;
			this._mult.dispose();
			this._mult = null;
			this._curve = null;
			return this;
		};

		return Tone.Follower;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Only pass signal through when it's signal exceeds the
		 *          specified threshold.
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} [threshold = -40] the threshold in Decibels
		 *  @param {Tone.Time} [attack = 0.1] the follower's attack time
		 *  @param {Tone.Time} [release = 0.1] the follower's release time
		 *  @example
		 *  var gate = new Tone.Gate(-30, 0.2, 0.3);
		 */
		Tone.Gate = function(){
			
			Tone.call(this);
			var options = this.optionsObject(arguments, ["threshold", "attack", "release"], Tone.Gate.defaults);

			/**
			 *  @type {Tone.Follower}
			 *  @private
			 */
			this._follower = new Tone.Follower(options.attack, options.release);

			/**
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
			this._gt = new Tone.GreaterThan(this.dbToGain(options.threshold));

			//the connections
			this.input.connect(this.output);
			//the control signal
			this.input.chain(this._gt, this._follower, this.output.gain);
		};

		Tone.extend(Tone.Gate);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.Gate.defaults = {
			"attack" : 0.1, 
			"release" : 0.1,
			"threshold" : -40
		};

		/**
		 * The threshold of the gate in decibels
		 * @memberOf Tone.Gate#
		 * @type {number}
		 * @name threshold
		 */
		Object.defineProperty(Tone.Gate.prototype, "threshold", {
			get : function(){
				return this.gainToDb(this._gt.value);
			}, 
			set : function(thresh){
				this._gt.value = this.dbToGain(thresh);
			}
		});

		/**
		 * The attack speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Tone.Time}
		 * @name attack
		 */
		Object.defineProperty(Tone.Gate.prototype, "attack", {
			get : function(){
				return this._follower.attack;
			}, 
			set : function(attackTime){
				this._follower.attack = attackTime;
			}
		});

		/**
		 * The release speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Tone.Time}
		 * @name release
		 */
		Object.defineProperty(Tone.Gate.prototype, "release", {
			get : function(){
				return this._follower.release;
			}, 
			set : function(releaseTime){
				this._follower.release = releaseTime;
			}
		});

		/**
		 *  dispose
		 *  @returns {Tone.Gate} `this`
		 */
		Tone.Gate.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._follower.dispose();
			this._gt.dispose();
			this._follower = null;
			this._gt = null;
			return this;
		};

		return Tone.Gate;
	});
	ToneModule( function(Tone){

		
		
		/**
		 *  @class  a sample accurate clock built on an oscillator.
		 *          Invokes the tick method at the set rate
		 *
		 * 	@private
		 * 	@constructor
		 * 	@extends {Tone}
		 * 	@param {Tone.Frequency} frequency the rate of the callback
		 * 	@param {function} callback the callback to be invoked with the time of the audio event
		 */
		Tone.Clock = function(frequency, callback){

			/**
			 *  the oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */
			this._oscillator = null;

			/**
			 *  the script processor which listens to the oscillator
			 *  @type {ScriptProcessorNode}
			 *  @private
			 */
			this._jsNode = this.context.createScriptProcessor(this.bufferSize, 1, 1);
			this._jsNode.onaudioprocess = this._processBuffer.bind(this);

			/**
			 *  the rate control signal
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(frequency);

			/**
			 *  whether the tick is on the up or down
			 *  @type {boolean}
			 *  @private
			 */
			this._upTick = false;

			/**
			 *  the callback which is invoked on every tick
			 *  with the time of that tick as the argument
			 *  @type {function(number)}
			 */
			this.tick = callback;

			//setup
			this._jsNode.noGC();
		};

		Tone.extend(Tone.Clock);

		/**
		 *  start the clock
		 *  @param {Tone.Time} time the time when the clock should start
		 *  @returns {Tone.Clock} `this`
		 */
		Tone.Clock.prototype.start = function(time){
			if (!this._oscillator){
				this._oscillator = this.context.createOscillator();
				this._oscillator.type = "square";
				this._oscillator.connect(this._jsNode);
				//connect it up
				this.frequency.connect(this._oscillator.frequency);
				this._upTick = false;
				var startTime = this.toSeconds(time);
				this._oscillator.start(startTime);
			}
			return this;
		};

		/**
		 *  stop the clock
		 *  @param {Tone.Time} time the time when the clock should stop
		 *  @param {function} onend called when the oscilator stops
		 *  @returns {Tone.Clock} `this`
		 */
		Tone.Clock.prototype.stop = function(time, onend){
			if (this._oscillator){
				var now = this.now();
				var stopTime = this.toSeconds(time, now);
				this._oscillator.stop(stopTime);
				this._oscillator = null;
				//set a timeout for when it stops
				if (time){
					setTimeout(onend, (stopTime - now) * 1000);
				} else {
					onend();
				}
			}
			return this;
		};

		/**
		 *  @private
		 *  @param  {AudioProcessingEvent} event
		 */
		Tone.Clock.prototype._processBuffer = function(event){
			var now = this.defaultArg(event.playbackTime, this.now());
			var bufferSize = this._jsNode.bufferSize;
			var incomingBuffer = event.inputBuffer.getChannelData(0);
			var upTick = this._upTick;
			var self = this;
			for (var i = 0; i < bufferSize; i++){
				var sample = incomingBuffer[i];
				if (sample > 0 && !upTick){
					upTick = true;	
					//get the callback out of audio thread
					setTimeout(function(){
						//to account for the double buffering
						var tickTime = now + self.samplesToSeconds(i + bufferSize * 2);
						return function(){
							if (self.tick){
								self.tick(tickTime);
							}
						};
					}(), 0); // jshint ignore:line
				} else if (sample < 0 && upTick){
					upTick = false;
				}
			}
			this._upTick = upTick;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Clock} `this`
		 */
		Tone.Clock.prototype.dispose = function(){
			this._jsNode.disconnect();
			this.frequency.dispose();
			this.frequency = null;
			if (this._oscillator){
				this._oscillator.disconnect();
				this._oscillator = null;
			}
			this._jsNode.onaudioprocess = function(){};
			this._jsNode = null;
			this.tick = null;
			return this;
		};

		return Tone.Clock;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  Time can be descibed in a number of ways. 
		 *  Any Method which accepts Tone.Time as a parameter will accept: 
		 *  
		 *  Numbers, which will be taken literally as the time (in seconds). 
		 *  
		 *  Notation, ("4n", "8t") describes time in BPM and time signature relative values. 
		 *  
		 *  Transport Time, ("4:3:2") will also provide tempo and time signature relative times 
		 *  in the form BARS:QUARTERS:SIXTEENTHS.
		 *  
		 *  Frequency, ("8hz") is converted to the length of the cycle in seconds.
		 *  
		 *  Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as 
		 *  "the current time plus whatever expression follows".
		 *  
		 *  Expressions, ("3:0 + 2 - (1m / 7)") any of the above can also be combined 
		 *  into a mathematical expression which will be evaluated to compute the desired time.
		 *  
		 *  No Argument, for methods which accept time, no argument will be interpreted as 
		 *  "now" (i.e. the currentTime).
		 *
		 *  [Tone.Time Wiki](https://github.com/TONEnoTONE/Tone.js/wiki/Time)
		 *  
		 *  @typedef {number|string|undefined} Tone.Time 
		 */

		/**
		 *  @class  Oscillator-based transport allows for simple musical timing
		 *          supports tempo curves and time changes. Do not construct
		 *          an instance of the transport. One is automatically created 
		 *          on init and additional transports cannot be created. <br><br>
		 *          If you need to schedule highly independent callback functions,
		 *          check out {@link Tone.Clock}.
		 *
		 *  @extends {Tone}
		 */
		Tone.Transport = function(){

			/**
			 *  watches the main oscillator for timing ticks
			 *  initially starts at 120bpm
			 *  
			 *  @private
			 *  @type {Tone.Clock}
			 */
			this._clock = new Tone.Clock(0, this._processTick.bind(this));

			/** 
			 * 	If the transport loops or not.
			 *  @type {boolean}
			 */
			this.loop = false;

			/**
			 *  the bpm value
			 *  @type {Tone.Signal}
			 */
			this.bpm = new Tone.Signal(120, Tone.Signal.Units.BPM);

			/**
			 *  the signal scalar
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._bpmMult = new Tone.Multiply(1/60 * tatum);

			/**
			 * 	The state of the transport. 
			 *  @type {TransportState}
			 */
			this.state = TransportState.STOPPED;

			//connect it all up
			this.bpm.chain(this._bpmMult, this._clock.frequency);
		};

		Tone.extend(Tone.Transport);

		/**
		 *  the defaults
		 *  @type {Object}
		 *  @const
		 *  @static
		 */
		Tone.Transport.defaults = {
			"bpm" : 120,
			"swing" : 0,
			"swingSubdivision" : "16n",
			"timeSignature" : 4,
			"loopStart" : 0,
			"loopEnd" : "4m"
		};

		/** 
		 * @private
		 * @type {number}
		 */
		var tatum = 12;

		/** 
		 * @private 
		 * @type {number} 
		 */
		var timelineTicks = 0;

		/** 
		 * @private 
		 * @type {number} 
		 */
		var transportTicks = 0;

		/**
		 *  Which subdivision the swing is applied to.
		 *  defaults to an 16th note
		 *  @private
		 *  @type {number}
		 */
		var swingSubdivision = "16n";

		/**
		 *  controls which beat the swing is applied to
		 *  defaults to an 16th note
		 *  @private
		 *  @type {number}
		 */
		var swingTatum = 3;

		/**
		 *  controls which beat the swing is applied to
		 *  @private
		 *  @type {number}
		 */
		var swingAmount = 0;

		/** 
		 * @private
		 * @type {number}
		 */
		var transportTimeSignature = 4;

		/** 
		 * @private
		 * @type {number}
		 */
		var loopStart = 0;

		/** 
		 * @private
		 * @type {number}
		 */
		var loopEnd = tatum * 4;

		/** 
		 * @private
		 * @type {Array}
		 */
		var intervals = [];
		
		/** 
		 * @private
		 * @type {Array}
		 */
		var timeouts = [];
		
		/** 
		 * @private
		 * @type {Array}
		 */
		var transportTimeline = [];
		
		/** 
		 * @private
		 * @type {number}
		 */
		var timelineProgress = 0;

		/** 
		 *  All of the synced components
		 *  @private 
		 *  @type {Array<Tone>}
		 */
		var SyncedSources = [];

		/** 
		 *  All of the synced Signals
		 *  @private 
		 *  @type {Array<Tone.Signal>}
		 */
		var SyncedSignals = [];

		/**
		 *  @enum
		 */
		 var TransportState = {
		 	STARTED : "started",
		 	PAUSED : "paused",
		 	STOPPED : "stopped"
		 };

		///////////////////////////////////////////////////////////////////////////////
		//	TICKS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  called on every tick
		 *  @param   {number} tickTime clock relative tick time
		 *  @private
		 */
		Tone.Transport.prototype._processTick = function(tickTime){
			if (this.state === TransportState.STARTED){
				if (swingAmount > 0 && 
					timelineTicks % tatum !== 0 && //not on a downbeat
					timelineTicks % swingTatum === 0){
					//add some swing
					tickTime += this._ticksToSeconds(swingTatum) * swingAmount;
				}
				processIntervals(tickTime);
				processTimeouts(tickTime);
				processTimeline(tickTime);
				transportTicks += 1;
				timelineTicks += 1;
				if (this.loop){
					if (timelineTicks === loopEnd){
						this._setTicks(loopStart);
					}
				}
			}
		};

		/**
		 *  jump to a specific tick in the timeline
		 *  updates the timeline callbacks
		 *  
		 *  @param   {number} ticks the tick to jump to
		 *  @private
		 */
		Tone.Transport.prototype._setTicks = function(ticks){
			timelineTicks = ticks;
			for (var i = 0; i < transportTimeline.length; i++){
				var timeout = transportTimeline[i];
				if (timeout.callbackTick() >= ticks){
					timelineProgress = i;
					break;
				}
			}
		};

		///////////////////////////////////////////////////////////////////////////////
		//	EVENT PROCESSING
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  process the intervals
		 *  @param  {number} time 
		 */
		var processIntervals = function(time){
			for (var i = 0, len = intervals.length; i<len; i++){
				var interval = intervals[i];
				if (interval.testInterval(transportTicks)){
					interval.doCallback(time);
				}
			}
		};

		/**
		 *  process the timeouts
		 *  @param  {number} time 
		 */
		var processTimeouts = function(time){
			var removeTimeouts = 0;
			for (var i = 0, len = timeouts.length; i<len; i++){
				var timeout = timeouts[i];
				var callbackTick = timeout.callbackTick();
				if (callbackTick <= transportTicks){
					timeout.doCallback(time);
					removeTimeouts++;
				} else if (callbackTick > transportTicks){
					break;
				} 
			}
			//remove the timeouts off the front of the array after they've been called
			timeouts.splice(0, removeTimeouts);
		};

		/**
		 *  process the transportTimeline events
		 *  @param  {number} time 
		 */
		var processTimeline = function(time){
			for (var i = timelineProgress, len = transportTimeline.length; i<len; i++){
				var evnt = transportTimeline[i];
				var callbackTick = evnt.callbackTick();
				if (callbackTick === timelineTicks){
					timelineProgress = i;
					evnt.doCallback(time);
				} else if (callbackTick > timelineTicks){
					break;
				} 
			}
		};

		///////////////////////////////////////////////////////////////////////////////
		//	INTERVAL
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Set a callback for a recurring event.
		 *
		 *  @param {function} callback
		 *  @param {Tone.Time}   interval 
		 *  @return {number} the id of the interval
		 *  @example
		 *  //triggers a callback every 8th note with the exact time of the event
		 *  Tone.Transport.setInterval(function(time){
		 *  	envelope.triggerAttack(time);
		 *  }, "8n");
		 */
		Tone.Transport.prototype.setInterval = function(callback, interval, ctx){
			var tickTime = this._toTicks(interval);
			var timeout = new TimelineEvent(callback, ctx, tickTime, transportTicks);
			intervals.push(timeout);
			return timeout.id;
		};

		/**
		 *  clear an interval from the processing array
		 *  @param  {number} rmInterval 	the interval to remove
		 *  @return {boolean}            	true if the event was removed
		 */
		Tone.Transport.prototype.clearInterval = function(rmInterval){
			for (var i = 0; i < intervals.length; i++){
				var interval = intervals[i];
				if (interval.id === rmInterval){
					intervals.splice(i, 1);
					return true;
				}
			}
			return false;
		};

		/**
		 *  removes all of the intervals that are currently set
		 *  @return {boolean}            	true if the event was removed
		 */
		Tone.Transport.prototype.clearIntervals = function(){
			var willRemove = intervals.length > 0;
			intervals = [];
			return willRemove;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	TIMEOUT
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Set a timeout to occur after time from now. NB: the transport must be 
		 *  running for this to be triggered. All timeout events are cleared when the 
		 *  transport is stopped. 
		 *
		 *  @param {function} callback 
		 *  @param {Tone.Time}   time     
		 *  @return {number} the id of the timeout for clearing timeouts
		 *  @example
		 *  //trigger an event to happen 1 second from now
		 *  Tone.Transport.setTimeout(function(time){
		 *  	player.start(time);
		 *  }, 1)
		 */
		Tone.Transport.prototype.setTimeout = function(callback, time, ctx){
			var ticks = this._toTicks(time);
			var timeout = new TimelineEvent(callback, ctx, ticks + transportTicks, 0);
			//put it in the right spot
			for (var i = 0, len = timeouts.length; i<len; i++){
				var testEvnt = timeouts[i];
				if (testEvnt.callbackTick() > timeout.callbackTick()){
					timeouts.splice(i, 0, timeout);
					return timeout.id;
				}
			}
			//otherwise push it on the end
			timeouts.push(timeout);
			return timeout.id;
		};

		/**
		 *  clear the timeout based on it's ID
		 *  @param  {number} timeoutID 
		 *  @return {boolean}           true if the timeout was removed
		 */
		Tone.Transport.prototype.clearTimeout = function(timeoutID){
			for (var i = 0; i < timeouts.length; i++){
				var testTimeout = timeouts[i];
				if (testTimeout.id === timeoutID){
					timeouts.splice(i, 1);
					return true;
				}
			}
			return false;
		};

		/**
		 *  removes all of the timeouts that are currently set
		 *  @return {boolean}            	true if the event was removed
		 */
		Tone.Transport.prototype.clearTimeouts = function(){
			var willRemove = timeouts.length > 0;
			timeouts = [];
			return willRemove;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	TIMELINE
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Timeline events are synced to the transportTimeline of the Tone.Transport
		 *  Unlike Timeout, Timeline events will restart after the 
		 *  Tone.Transport has been stopped and restarted. 
		 *
		 *  @param {function} 	callback 	
		 *  @param {Tome.Time}  timeout  
		 *  @return {number} 				the id for clearing the transportTimeline event
		 *  @example
		 *  //trigger the start of a part on the 16th measure
		 *  Tone.Transport.setTimeline(function(time){
		 *  	part.start(time);
		 *  }, "16m");
		 */
		Tone.Transport.prototype.setTimeline = function(callback, timeout, ctx){
			var ticks = this._toTicks(timeout);
			var timelineEvnt = new TimelineEvent(callback, ctx, ticks, 0);
			//put it in the right spot
			for (var i = timelineProgress, len = transportTimeline.length; i<len; i++){
				var testEvnt = transportTimeline[i];
				if (testEvnt.callbackTick() > timelineEvnt.callbackTick()){
					transportTimeline.splice(i, 0, timelineEvnt);
					return timelineEvnt.id;
				}
			}
			//otherwise push it on the end
			transportTimeline.push(timelineEvnt);
			return timelineEvnt.id;
		};

		/**
		 *  clear the transportTimeline event from the 
		 *  @param  {number} timelineID 
		 *  @return {boolean} true if it was removed
		 */
		Tone.Transport.prototype.clearTimeline = function(timelineID){
			for (var i = 0; i < transportTimeline.length; i++){
				var testTimeline = transportTimeline[i];
				if (testTimeline.id === timelineID){
					transportTimeline.splice(i, 1);
					return true;
				}
			}
			return false;
		};

		/**
		 *  remove all events from the timeline
		 *  @returns {boolean} true if the events were removed
		 */
		Tone.Transport.prototype.clearTimelines = function(){
			timelineProgress = 0;
			var willRemove = transportTimeline.length > 0;
			transportTimeline = [];
			return willRemove;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	TIME CONVERSIONS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  turns the time into
		 *  @param  {Tone.Time} time
		 *  @return {number}   
		 *  @private   
		 */
		Tone.Transport.prototype._toTicks = function(time){
			//get the seconds
			var seconds = this.toSeconds(time);
			var quarter = this.notationToSeconds("4n");
			var quarters = seconds / quarter;
			var tickNum = quarters * tatum;
			//quantize to tick value
			return Math.round(tickNum);
		};

		/**
		 *  convert ticks into seconds
		 *  
		 *  @param  {number} ticks 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {number}               seconds
		 *  @private
		 */
		Tone.Transport.prototype._ticksToSeconds = function(ticks, bpm, timeSignature){
			ticks = Math.floor(ticks);
			var quater = this.notationToSeconds("4n", bpm, timeSignature);
			return (quater * ticks) / (tatum);
		};

		/**
		 *  returns the time of the next beat
		 *  @param  {string} [subdivision="4n"]
		 *  @return {number} 	the time in seconds of the next subdivision
		 */
		Tone.Transport.prototype.nextBeat = function(subdivision){
			subdivision = this.defaultArg(subdivision, "4n");
			var tickNum = this._toTicks(subdivision);
			var remainingTicks = (transportTicks % tickNum);
			var nextTick = remainingTicks;
			if (remainingTicks > 0){
				nextTick = tickNum - remainingTicks;
			}
			return this._ticksToSeconds(nextTick);
		};


		///////////////////////////////////////////////////////////////////////////////
		//	START/STOP/PAUSE
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  start the transport and all sources synced to the transport
		 *  
		 *  @param  {Tone.Time} time
		 *  @param  {Tone.Time=} offset the offset position to start
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.start = function(time, offset){
			if (this.state === TransportState.STOPPED || this.state === TransportState.PAUSED){
				if (!this.isUndef(offset)){
					this._setTicks(this._toTicks(offset));
				}
				this.state = TransportState.STARTED;
				var startTime = this.toSeconds(time);
				this._clock.start(startTime);
				//call start on each of the synced sources
				for (var i = 0; i < SyncedSources.length; i++){
					var source = SyncedSources[i].source;
					var delay = SyncedSources[i].delay;
					source.start(startTime + delay);
				}
			}
			return this;
		};


		/**
		 *  stop the transport and all sources synced to the transport
		 *  
		 *  @param  {Tone.Time} time
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.stop = function(time){
			if (this.state === TransportState.STARTED || this.state === TransportState.PAUSED){
				var stopTime = this.toSeconds(time);
				this._clock.stop(stopTime, this._onended.bind(this));
				//call start on each of the synced sources
				for (var i = 0; i < SyncedSources.length; i++){
					var source = SyncedSources[i].source;
					source.stop(stopTime);
				}
			} else {
				this._onended();
			}
			return this;
		};

		/**
		 *  invoked when the transport is stopped
		 *  @private
		 */
		Tone.Transport.prototype._onended = function(){
			transportTicks = 0;
			this._setTicks(0);
			this.clearTimeouts();
			this.state = TransportState.STOPPED;
		};

		/**
		 *  pause the transport and all sources synced to the transport
		 *  
		 *  @param  {Tone.Time} time
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.pause = function(time){
			if (this.state === TransportState.STARTED){
				this.state = TransportState.PAUSED;
				var stopTime = this.toSeconds(time);
				this._clock.stop(stopTime);
				//call pause on each of the synced sources
				for (var i = 0; i < SyncedSources.length; i++){
					var source = SyncedSources[i].source;
					source.pause(stopTime);
				}
			}
			return this;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	SETTERS/GETTERS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Time signature as just the numerator over 4. 
		 *  For example 4/4 would be just 4 and 6/8 would be 3.
		 *  @memberOf Tone.Transport#
		 *  @type {number}
		 *  @name timeSignature
		 */
		Object.defineProperty(Tone.Transport.prototype, "timeSignature", {
			get : function(){
				return transportTimeSignature;
			},
			set : function(numerator){
				transportTimeSignature = numerator;
			}
		});


		/**
		 * The loop start point
		 * @memberOf Tone.Transport#
		 * @type {Tone.Time}
		 * @name loopStart
		 */
		Object.defineProperty(Tone.Transport.prototype, "loopStart", {
			get : function(){
				return this._ticksToSeconds(loopStart);
			},
			set : function(startPosition){
				loopStart = this._toTicks(startPosition);
			}
		});

		/**
		 * The loop end point
		 * @memberOf Tone.Transport#
		 * @type {Tone.Time}
		 * @name loopEnd
		 */
		Object.defineProperty(Tone.Transport.prototype, "loopEnd", {
			get : function(){
				return this._ticksToSeconds(loopEnd);
			},
			set : function(endPosition){
				loopEnd = this._toTicks(endPosition);
			}
		});

		/**
		 *  shorthand loop setting
		 *  @param {Tone.Time} startPosition 
		 *  @param {Tone.Time} endPosition   
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.setLoopPoints = function(startPosition, endPosition){
			this.loopStart = startPosition;
			this.loopEnd = endPosition;
			return this;
		};

		/**
		 *  The swing value. Between 0-1 where 1 equal to 
		 *  the note + half the subdivision.
		 *  @memberOf Tone.Transport#
		 *  @type {number}
		 *  @name swing
		 */
		Object.defineProperty(Tone.Transport.prototype, "swing", {
			get : function(){
				return swingAmount * 2;
			},
			set : function(amount){
				//scale the values to a normal range
				swingAmount = amount * 0.5;
			}
		});

		/**
		 *  Set the subdivision which the swing will be applied to. 
		 *  The default values is a 16th note. Value must be less 
		 *  than a quarter note.
		 *  
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {Tone.Time}
		 *  @name swingSubdivision
		 */
		Object.defineProperty(Tone.Transport.prototype, "swingSubdivision", {
			get : function(){
				return swingSubdivision;
			},
			set : function(subdivision){
				//scale the values to a normal range
				swingSubdivision = subdivision;
				swingTatum = this._toTicks(subdivision);
			}
		});

		/**
		 *  The Transport's position in MEASURES:BEATS:SIXTEENTHS.
		 *  Setting the value will jump to that position right away. 
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {string}
		 *  @name position
		 */
		Object.defineProperty(Tone.Transport.prototype, "position", {
			get : function(){
				var quarters = timelineTicks / tatum;
				var measures = Math.floor(quarters / transportTimeSignature);
				var sixteenths = Math.floor((quarters % 1) * 4);
				quarters = Math.floor(quarters) % transportTimeSignature;
				var progress = [measures, quarters, sixteenths];
				return progress.join(":");
			},
			set : function(progress){
				var ticks = this._toTicks(progress);
				this._setTicks(ticks);
			}
		});

		///////////////////////////////////////////////////////////////////////////////
		//	SYNCING
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Sync a source to the transport so that 
		 *  @param  {Tone.Source} source the source to sync to the transport
		 *  @param {Tone.Time} delay (optionally) start the source with a delay from the transport
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.syncSource = function(source, startDelay){
			SyncedSources.push({
				source : source,
				delay : this.toSeconds(this.defaultArg(startDelay, 0))
			});
			return this;
		};

		/**
		 *  remove the source from the list of Synced Sources
		 *  
		 *  @param  {Tone.Source} source [description]
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.unsyncSource = function(source){
			for (var i = 0; i < SyncedSources.length; i++){
				if (SyncedSources[i].source === source){
					SyncedSources.splice(i, 1);
				}
			}
			return this;
		};

		/**
		 *  attaches the signal to the tempo control signal so that 
		 *  any changes in the tempo will change the signal in the same
		 *  ratio. 
		 *  
		 *  @param  {Tone.Signal} signal 
		 *  @param {number=} ratio Optionally pass in the ratio between
		 *                         the two signals. Otherwise it will be computed
		 *                         based on their current values. 
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.syncSignal = function(signal, ratio){
			if (!ratio){
				//get the sync ratio
				if (signal._value.value !== 0){
					ratio = signal._value.value / this.bpm.value;
				} else {
					ratio = 0;
				}
			}
			var ratioSignal = this.context.createGain();
			ratioSignal.gain.value = ratio;
			this.bpm.chain(ratioSignal, signal._value);
			SyncedSignals.push({
				"ratio" : ratioSignal,
				"signal" : signal,
				"initial" : signal._value.value
			});
			signal._value.value = 0;
			return this;
		};

		/**
		 *  Unsyncs a previously synced signal from the transport's control
		 *  @param  {Tone.Signal} signal 
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.unsyncSignal = function(signal){
			for (var i = 0; i < SyncedSignals.length; i++){
				var syncedSignal = SyncedSignals[i];
				if (syncedSignal.signal === signal){
					syncedSignal.ratio.disconnect();
					syncedSignal.signal._value.value = syncedSignal.initial;
					SyncedSignals.splice(i, 1);
				}
			}
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Transport} `this`
		 */
		Tone.Transport.prototype.dispose = function(){
			this._clock.dispose();
			this._clock = null;
			this.bpm.dispose();
			this.bpm = null;
			this._bpmMult.dispose();
			this._bpmMult = null;
			return this;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	TIMELINE EVENT
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  @static
		 *  @type {number}
		 */
		var TimelineEventIDCounter = 0;

		/**
		 *  A Timeline event
		 *
		 *  @constructor
		 *  @private
		 *  @param {function(number)} callback   
		 *  @param {Object}   context    
		 *  @param {number}   tickTime
	 	 *  @param {number}   startTicks
		 */
		var TimelineEvent = function(callback, context, tickTime, startTicks){
			this.startTicks = startTicks;
			this.tickTime = tickTime;
			this.callback = callback;
			this.context = context;
			this.id = TimelineEventIDCounter++;
		};
		
		/**
		 *  invoke the callback in the correct context
		 *  passes in the playback time
		 *  
		 *  @param  {number} playbackTime 
		 */
		TimelineEvent.prototype.doCallback = function(playbackTime){
			this.callback.call(this.context, playbackTime); 
		};

		/**
		 *  get the tick which the callback is supposed to occur on
		 *  
		 *  @return {number} 
		 */
		TimelineEvent.prototype.callbackTick = function(){
			return this.startTicks + this.tickTime;
		};

		/**
		 *  test if the tick occurs on the interval
		 *  
		 *  @param  {number} tick 
		 *  @return {boolean}      
		 */
		TimelineEvent.prototype.testInterval = function(tick){
			return (tick - this.startTicks) % this.tickTime === 0;
		};


		///////////////////////////////////////////////////////////////////////////////
		//	AUGMENT TONE'S PROTOTYPE TO INCLUDE TRANSPORT TIMING
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  tests if a string is musical notation
		 *  i.e.:
		 *  	4n = quarter note
		 *   	2m = two measures
		 *    	8t = eighth-note triplet
		 *  defined in "Tone/core/Transport"
		 *  
		 *  @return {boolean} 
		 *  @method isNotation
		 *  @lends Tone.prototype.isNotation
		 */
		Tone.prototype.isNotation = (function(){
			var notationFormat = new RegExp(/[0-9]+[mnt]$/i);
			return function(note){
				return notationFormat.test(note);
			};
		})();

		/**
		 *  tests if a string is transportTime
		 *  i.e. :
		 *  	1:2:0 = 1 measure + two quarter notes + 0 sixteenth notes
		 *  defined in "Tone/core/Transport"
		 *  	
		 *  @return {boolean} 
		 *
		 *  @method isTransportTime
		 *  @lends Tone.prototype.isTransportTime
		 */
		Tone.prototype.isTransportTime = (function(){
			var transportTimeFormat = new RegExp(/^\d+(\.\d+)?:\d+(\.\d+)?(:\d+(\.\d+)?)?$/i);
			return function(transportTime){
				return transportTimeFormat.test(transportTime);
			};
		})();

		/**
		 *
		 *  convert notation format strings to seconds
		 *  defined in "Tone/core/Transport"
		 *  
		 *  @param  {string} notation     
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature 
		 *  @return {number} 
		 *                
		 */
		Tone.prototype.notationToSeconds = function(notation, bpm, timeSignature){
			bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
			timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
			var beatTime = (60 / bpm);
			var subdivision = parseInt(notation, 10);
			var beats = 0;
			if (subdivision === 0){
				beats = 0;
			}
			var lastLetter = notation.slice(-1);
			if (lastLetter === "t"){
				beats = (4 / subdivision) * 2/3;
			} else if (lastLetter === "n"){
				beats = 4 / subdivision;
			} else if (lastLetter === "m"){
				beats = subdivision * timeSignature;
			} else {
				beats = 0;
			}
			return beatTime * beats;
		};

		/**
		 *  convert transportTime into seconds
		 *  defined in "Tone/core/Transport"
		 *  
		 *  ie: 4:2:3 == 4 measures + 2 quarters + 3 sixteenths
		 *
		 *  @param  {string} transportTime 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {number}               seconds
		 *
		 *  @lends Tone.prototype.transportTimeToSeconds
		 */
		Tone.prototype.transportTimeToSeconds = function(transportTime, bpm, timeSignature){
			bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
			timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
			var measures = 0;
			var quarters = 0;
			var sixteenths = 0;
			var split = transportTime.split(":");
			if (split.length === 2){
				measures = parseFloat(split[0]);
				quarters = parseFloat(split[1]);
			} else if (split.length === 1){
				quarters = parseFloat(split[0]);
			} else if (split.length === 3){
				measures = parseFloat(split[0]);
				quarters = parseFloat(split[1]);
				sixteenths = parseFloat(split[2]);
			}
			var beats = (measures * timeSignature + quarters + sixteenths / 4);
			return beats * this.notationToSeconds("4n");
		};

		/**
		 *  Convert seconds to the closest transportTime in the form 
		 *  	measures:quarters:sixteenths
		 *  defined in "Tone/core/Transport"
		 *
		 *  @method toTransportTime
		 *  
		 *  @param {Tone.Time} seconds 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {string}  
		 *  
		 *  @lends Tone.prototype.toTransportTime
		 */
		Tone.prototype.toTransportTime = function(time, bpm, timeSignature){
			var seconds = this.toSeconds(time, bpm, timeSignature);
			bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
			timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
			var quarterTime = this.notationToSeconds("4n");
			var quarters = seconds / quarterTime;
			var measures = Math.floor(quarters / timeSignature);
			var sixteenths = Math.floor((quarters % 1) * 4);
			quarters = Math.floor(quarters) % timeSignature;
			var progress = [measures, quarters, sixteenths];
			return progress.join(":");
		};

		/**
		 *  Convert a frequency representation into a number.
		 *  Defined in "Tone/core/Transport".
		 *  	
		 *  @param  {Tone.Frequency} freq 
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number}      the frequency in hertz
		 */
		Tone.prototype.toFrequency = function(freq, now){
			if (this.isFrequency(freq)){
				return parseFloat(freq);
			} else if (this.isNotation(freq) || this.isTransportTime(freq)) {
				return this.secondsToFrequency(this.toSeconds(freq, now));
			} else {
				return freq;
			}
		};

		/**
		 *  Convert Tone.Time into seconds.
		 *  Defined in "Tone/core/Transport".
		 *  
		 *  Unlike the method which it overrides, this takes into account 
		 *  transporttime and musical notation.
		 *
		 *  Time : 1.40
		 *  Notation: 4n|1m|2t
		 *  TransportTime: 2:4:1 (measure:quarters:sixteens)
		 *  Now Relative: +3n
		 *  Math: 3n+16n or even very complicated expressions ((3n*2)/6 + 1)
		 *
		 *  @override
		 *  @param  {Tone.Time} time       
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number} 
		 */
		Tone.prototype.toSeconds = function(time, now){
			now = this.defaultArg(now, this.now());
			if (typeof time === "number"){
				return time; //assuming that it's seconds
			} else if (typeof time === "string"){
				var plusTime = 0;
				if(time.charAt(0) === "+") {
					plusTime = now;
					time = time.slice(1);
				} 
				var components = time.split(/[\(\)\-\+\/\*]/);
				if (components.length > 1){
					var originalTime = time;
					for(var i = 0; i < components.length; i++){
						var symb = components[i].trim();
						if (symb !== ""){
							var val = this.toSeconds(symb);
							time = time.replace(symb, val);
						}
					}
					try {
						//i know eval is evil, but i think it's safe here
						time = eval(time); // jshint ignore:line
					} catch (e){
						throw new EvalError("problem evaluating Tone.Time: "+originalTime);
					}
				} else if (this.isNotation(time)){
					time = this.notationToSeconds(time);
				} else if (this.isTransportTime(time)){
					time = this.transportTimeToSeconds(time);
				} else if (this.isFrequency(time)){
					time = this.frequencyToSeconds(time);
				} else {
					time = parseFloat(time);
				}
				return time + plusTime;
			} else {
				return now;
			}
		};

		var TransportConstructor = Tone.Transport;

		Tone._initAudioContext(function(){
			if (typeof Tone.Transport === "function"){
				//a single transport object
				Tone.Transport = new Tone.Transport();
			} else {
				//stop the clock
				Tone.Transport.stop();
				//get the previous bpm
				var bpm = Tone.Transport.bpm.value;
				//destory the old clock
				Tone.Transport._clock.dispose();
				//make new Transport insides
				TransportConstructor.call(Tone.Transport);
				//set the bpm
				Tone.Transport.bpm.value = bpm;
			}
		});

		return Tone.Transport;
	});

	ToneModule( function(Tone){

		
		
		/**
		 *  @class  A single master output which is connected to the
		 *          AudioDestinationNode. It provides useful conveniences
		 *          such as the ability to set the global volume and mute
		 *          the entire application. Additionally, it accepts
		 *          a master send/receive for adding final compression, 
		 *          limiting or effects to your application. <br><br>
		 *          Like the Transport, the Master output is created for you
		 *          on initialization. It does not need to be created.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */
		Tone.Master = function(){
			Tone.call(this);

			/**
			 * the unmuted volume
			 * @type {number}
			 * @private
			 */
			this._unmutedVolume = 1;

			/**
			 * the volume of the output in decibels
			 * @type {Tone.Signal}
			 */
			this.volume = new Tone.Signal(this.output.gain, Tone.Signal.Units.Decibels);
			
			//connections
			this.input.chain(this.output, this.context.destination);
		};

		Tone.extend(Tone.Master);

		/**
		 *  Mutethe output
		 *  @returns {Tone.Master} `this`
		 */
		Tone.Master.prototype.mute = function(){
			this._unmutedVolume = this.volume.value;
			//maybe it should ramp here?
			this.volume.value = -Infinity;
			return this;
		};

		/**
		 *  Unmute the output. Will return the volume to it's value before 
		 *  the output was muted. 
		 *  @returns {Tone.Master} `this`
		 */
		Tone.Master.prototype.mute = function(){
			this.volume.value = this._unmutedVolume;
			return this;
		};

		/**
		 *  route the master signal to the node's input. 
		 *  NOTE: this will disconnect the previously connected node
		 *  @param {AudioNode|Tone} node the node to use as the entry
		 *                               point to the master chain
		 *  @returns {Tone.Master} `this`
		 */
		Tone.Master.prototype.send = function(node){
			//disconnect the previous node
			this.input.disconnect();
			this.input.connect(node);
			return this;
		};

		/**
		 *  the master effects chain return point
		 *  @param {AudioNode|Tone} node the node to connect 
		 *  @returns {Tone.Master} `this`
		 */
		Tone.Master.prototype.receive = function(node){
			node.connect(this.output);
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		//	AUGMENT TONE's PROTOTYPE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  connect 'this' to the master output
		 *  defined in "Tone/core/Master"
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.toMaster = function(){
			this.connect(Tone.Master);
			return this;
		};

		/**
		 *  Also augment AudioNode's prototype to include toMaster
		 *  as a convenience
		 *  @returns {AudioNode} `this`
		 */
		AudioNode.prototype.toMaster = function(){
			this.connect(Tone.Master);
			return this;
		};

		var MasterConstructor = Tone.Master;

		/**
		 *  initialize the module and listen for new audio contexts
		 */
		Tone._initAudioContext(function(){
			//a single master output
			if (!Tone.prototype.isUndef(Tone.Master)){
				Tone.Master = new MasterConstructor();
			} else {
				MasterConstructor.prototype.dispose.call(Tone.Master);
				MasterConstructor.call(Tone.Master);
			}
		});

		return Tone.Master;
	});
	ToneModule( function(Tone){

		
		
		/**
		 *  @class  Base class for sources.
		 *          Sources have start/stop/pause and 
		 *          the ability to be synced to the 
		 *          start/stop/pause of Tone.Transport.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */	
		Tone.Source = function(options){
			//unlike most ToneNodes, Sources only have an output and no input
			Tone.call(this, 0, 1);
			options = this.defaultArg(options, Tone.Source.defaults);

			/**
			 * The onended callback when the source is done playing.
			 * @type {function}
			 * @example
			 *  source.onended = function(){
			 *  	console.log("the source is done playing");
			 *  }
			 */
			this.onended = options.onended;

			/**
			 *  the next time the source is started
			 *  @type {number}
			 *  @private
			 */
			this._nextStart = Infinity;

			/**
			 *  the next time the source is stopped
			 *  @type {number}
			 *  @private
			 */
			this._nextStop = Infinity;

			/**
			 * The volume of the output in decibels.
			 * @type {Tone.Signal}
			 * @example
			 * source.volume.value = -6;
			 */
			this.volume = new Tone.Signal(this.output.gain, Tone.Signal.Units.Decibels);

			/**
			 * 	keeps track of the timeout for chaning the state
			 * 	and calling the onended
			 *  @type {number}
			 *  @private
			 */
			this._timeout = -1;
		};

		Tone.extend(Tone.Source);

		/**
		 *  The default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Source.defaults = {
			"onended" : function(){},
			"volume" : 0,
		};

		/**
		 *  @enum {string}
		 */
		Tone.Source.State = {
			STARTED : "started",
			PAUSED : "paused",
			STOPPED : "stopped",
	 	};

		/**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.Source.State}
		 *  @readOnly
		 *  @memberOf Tone.Source#
		 *  @name state
		 */
		Object.defineProperty(Tone.Source.prototype, "state", {
			get : function(){
				return this._stateAtTime(this.now());
			}
		});

		/**
		 *  Get the state of the source at the specified time.
		 *  @param  {Tone.Time}  time
		 *  @return  {Tone.Source.State} 
		 *  @private
		 */
		Tone.Source.prototype._stateAtTime = function(time){
			time = this.toSeconds(time);
			if (this._nextStart <= time && this._nextStop > time){
				return Tone.Source.State.STARTED;
			} else if (this._nextStop <= time){
				return Tone.Source.State.STOPPED;
			} else {
				return Tone.Source.State.STOPPED;
			}
		};

		/**
		 *  Start the source at the time.
		 *  @param  {Tone.Time} [time=now]
		 *  @returns {Tone.Source} `this`
		 *  @example
		 *  source.start("+0.5"); //starts the source 0.5 seconds from now
		 */
		Tone.Source.prototype.start = function(time){
			time = this.toSeconds(time);
			if (this._stateAtTime(time) !== Tone.Source.State.STARTED || this.retrigger){
				this._nextStart = time;
				this._nextStop = Infinity;
				this._start.apply(this, arguments);
			}
			return this;
		};

		/**
		 * 	stop the source
		 *  @param  {Tone.Time} [time=now]
		 *  @returns {Tone.Source} `this`
		 *  @example
		 *  source.stop(); // stops the source immediately
		 */
		Tone.Source.prototype.stop = function(time){
			var now = this.now();
			time = this.toSeconds(time, now);
			if (this._stateAtTime(time) === Tone.Source.State.STARTED){
				this._nextStop = this.toSeconds(time);
				clearTimeout(this._timeout);
				var diff = time - now;
				if (diff > 0){
					//add a small buffer before invoking the callback
					this._timeout = setTimeout(this.onended, diff * 1000 + 20);
				} else {
					this.onended();
				}
				this._stop.apply(this, arguments);
			}
			return this;
		};

		/**
		 *  Not ready yet. 
	 	 *  @private
	 	 *  @abstract
		 *  @param  {Tone.Time} time 
		 *  @returns {Tone.Source} `this`
		 */
		Tone.Source.prototype.pause = function(time){
			//if there is no pause, just stop it
			this.stop(time);
			return this;
		};

		/**
		 *  Sync the source to the Transport so that when the transport
		 *  is started, this source is started and when the transport is stopped
		 *  or paused, so is the source. 
		 *
		 *  @param {Tone.Time} [delay=0] Delay time before starting the source after the
		 *                               Transport has started. 
		 *  @returns {Tone.Source} `this`
		 */
		Tone.Source.prototype.sync = function(delay){
			Tone.Transport.syncSource(this, delay);
			return this;
		};

		/**
		 *  Unsync the source to the Transport. See {@link Tone.Source#sync}
		 *  @returns {Tone.Source} `this`
		 */
		Tone.Source.prototype.unsync = function(){
			Tone.Transport.unsyncSource(this);
			return this;
		};

		/**
		 *	clean up
		 *  @return {Tone.Source} `this`
		 */
		Tone.Source.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.stop();
			clearTimeout(this._timeout);
			this.onended = function(){};
			this.volume.dispose();
			this.volume = null;
		};

		return Tone.Source;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Oscilator with start, pause, stop and sync to Transport methods
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {number|string} [frequency=440] starting frequency
		 *  @param {string} [type="sine"] type of oscillator (sine|square|triangle|sawtooth)
		 *  @example
		 *  var osc = new Tone.Oscillator(440, "sine");
		 */
		Tone.Oscillator = function(){
			
			var options = this.optionsObject(arguments, ["frequency", "type"], Tone.Oscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the main oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */
			this._oscillator = null;
			
			/**
			 *  The frequency control signal in hertz.
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Signal.Units.Frequency);

			/**
			 *  The detune control signal in cents. 
			 *  @type {Tone.Signal}
			 */
			this.detune = new Tone.Signal(options.detune);

			/**
			 *  the periodic wave
			 *  @type {PeriodicWave}
			 *  @private
			 */
			this._wave = null;

			/**
			 *  the phase of the oscillator
			 *  between 0 - 360
			 *  @type {number}
			 *  @private
			 */
			this._phase = options.phase;

			/**
			 *  the type of the oscillator
			 *  @type {string}
			 *  @private
			 */
			this._type = null;
			
			//setup
			this.type = options.type;
			this.phase = this._phase;
		};

		Tone.extend(Tone.Oscillator, Tone.Source);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Oscillator.defaults = {
			"type" : "sine",
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0
		};

		/**
		 *  start the oscillator
		 *  @param  {Tone.Time} [time=now] 
		 *  @private
		 */
		Tone.Oscillator.prototype._start = function(time){
			//new oscillator with previous values
			this._oscillator = this.context.createOscillator();
			this._oscillator.setPeriodicWave(this._wave);
			//connect the control signal to the oscillator frequency & detune
			this._oscillator.connect(this.output);
			this.frequency.connect(this._oscillator.frequency);
			this.detune.connect(this._oscillator.detune);
			//start the oscillator
			this._oscillator.start(this.toSeconds(time));
		};

		/**
		 *  stop the oscillator
		 *  @private
		 *  @param  {Tone.Time} [time=now] (optional) timing parameter
		 *  @returns {Tone.Oscillator} `this`
		 */
		Tone.Oscillator.prototype._stop = function(time){
			if (this._oscillator){
				this._oscillator.stop(this.toSeconds(time));
				this._oscillator = null;
			}
			return this;
		};

		/**
		 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
		 *  will also affect the oscillators frequency. 
		 *  @returns {Tone.Oscillator} `this`
		 *  @example
		 *  Tone.Transport.bpm.value = 120;
		 *  osc.frequency.value = 440;
		 *  osc.syncFrequency();
		 *  Tone.Transport.bpm.value = 240; 
		 *  // the frequency of the oscillator is doubled to 880
		 */
		Tone.Oscillator.prototype.syncFrequency = function(){
			Tone.Transport.syncSignal(this.frequency);
			return this;
		};

		/**
		 *  Unsync the oscillator's frequency from the Transport. 
		 *  See {@link Tone.Oscillator#syncFrequency}.
		 *  @returns {Tone.Oscillator} `this`
		 */
		Tone.Oscillator.prototype.unsyncFrequency = function(){
			Tone.Transport.unsyncSignal(this.frequency);
			return this;
		};

		/**
		 * The type of the oscillator: either sine, square, triangle, or sawtooth.
		 *
		 * Uses PeriodicWave internally even for native types so that it can set the phase.
		 *
		 * PeriodicWave equations are from the Web Audio Source code:
		 * https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium
		 *  
		 * @memberOf Tone.Oscillator#
		 * @type {string}
		 * @name type
		 * @example
		 * osc.type = "square";
		 * osc.type; //returns "square"
		 */
		Object.defineProperty(Tone.Oscillator.prototype, "type", {
			get : function(){
				return this._type;
			},
			set : function(type){
				if (this.type !== type){

					var fftSize = 4096;
					var halfSize = fftSize / 2;

					var real = new Float32Array(halfSize);
					var imag = new Float32Array(halfSize);
					
					// Clear DC and Nyquist.
					real[0] = 0;
					imag[0] = 0;

					var shift = this._phase;	
					for (var n = 1; n < halfSize; ++n) {
						var piFactor = 2 / (n * Math.PI);
						var b; 
						switch (type) {
							case "sine": 
								b = (n === 1) ? 1 : 0;
								break;
							case "square":
								b = (n & 1) ? 2 * piFactor : 0;
								break;
							case "sawtooth":
								b = piFactor * ((n & 1) ? 1 : -1);
								break;
							case "triangle":
								if (n & 1) {
									b = 2 * (piFactor * piFactor) * ((((n - 1) >> 1) & 1) ? -1 : 1);
								} else {
									b = 0;
								}
								break;
							default:
								throw new TypeError("invalid oscillator type: "+type);
						}
						if (b !== 0){
							real[n] = -b * Math.sin(shift);
							imag[n] = b * Math.cos(shift);
						} else {
							real[n] = 0;
							imag[n] = 0;
						}
					}
					var periodicWave = this.context.createPeriodicWave(real, imag);
					this._wave = periodicWave;
					if (this._oscillator !== null){
						this._oscillator.setPeriodicWave(this._wave);
					}
					this._type = type;
				}
			}
		});

		/**
		 * The phase of the oscillator in degrees. 
		 * @memberOf Tone.Oscillator#
		 * @type {number}
		 * @name phase
		 * @example
		 * osc.phase = 180; //flips the phase of the oscillator
		 */
		Object.defineProperty(Tone.Oscillator.prototype, "phase", {
			get : function(){
				return this._phase * (180 / Math.PI);
			}, 
			set : function(phase){
				this._phase = phase * Math.PI / 180;
				//reset the type
				this.type = this._type;
			}
		});

		/**
		 *  dispose and disconnect
		 *  @return {Tone.Oscillator} `this`
		 */
		Tone.Oscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			if (this._oscillator !== null){
				this._oscillator.disconnect();
				this._oscillator = null;
			}
			this.frequency.dispose();
			this.frequency = null;
			this.detune.dispose();
			this.detune = null;
			this._wave = null;
			return this;
		};

		return Tone.Oscillator;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class AudioToGain converts an input range of -1,1 to 0,1
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var a2g = new Tone.AudioToGain();
		 */
		Tone.AudioToGain = function(){

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._norm = this.input = this.output = new Tone.WaveShaper([0,1]);
		};

		Tone.extend(Tone.AudioToGain, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.AND} `this`
		 */
		Tone.AudioToGain.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._norm.disconnect();
			this._norm = null;
			return this;
		};

		return Tone.AudioToGain;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  The Low Frequency Oscillator produces an output signal 
		 *          which can be attached to an AudioParam or Tone.Signal 
		 *          for constant control over that parameter. the LFO can 
		 *          also be synced to the transport to start/stop/pause
		 *          and change when the tempo changes.
		 *
		 *  @constructor
		 *  @extends {Tone.Oscillator}
		 *  @param {Tone.Time} [frequency="4n"]
		 *  @param {number} [outputMin=0]
		 *  @param {number} [outputMax=1]
		 *  @example
		 *  var lfo = new Tone.LFO("4n", 400, 4000);
		 *  lfo.connect(filter.frequency);
		 */
		Tone.LFO = function(){

			var options = this.optionsObject(arguments, ["frequency", "min", "max"], Tone.LFO.defaults);

			/** 
			 *  the oscillator
			 *  @type {Tone.Oscillator}
			 */
			this.oscillator = new Tone.Oscillator({
				"frequency" : options.frequency, 
				"type" : options.type, 
				"phase" : options.phase
			});

			/**
			 *  the lfo's frequency
			 *  @type {Tone.Signal}
			 */
			this.frequency = this.oscillator.frequency;

			/**
			 * The amplitude of the LFO, which controls the output range between
			 * the min and max output. For example if the min is -10 and the max 
			 * is 10, setting the amplitude to 0.5 would make the LFO modulate
			 * between -5 and 5. 
			 * @type {Tone.Signal}
			 */
			this.amplitude = this.oscillator.volume;
			this.amplitude.units = Tone.Signal.Units.Normal;
			this.amplitude.value = options.amplitude;

			/**
			 *  @type {Tone.AudioToGain} 
			 *  @private
			 */
			this._a2g = new Tone.AudioToGain();

			/**
			 *  @type {Tone.Scale} 
			 *  @private
			 */
			this._scaler = this.output = new Tone.Scale(options.min, options.max);

			//connect it up
			this.oscillator.chain(this._a2g, this._scaler);
		};

		Tone.extend(Tone.LFO, Tone.Oscillator);

		/**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.LFO.defaults = {
			"type" : "sine",
			"min" : 0,
			"max" : 1,
			"phase" : 0,
			"frequency" : "4n",
			"amplitude" : 1
		};

		/**
		 *  Start the LFO. 
		 *  @param  {Tone.Time} [time=now] the time the LFO will start
		 *  @returns {Tone.LFO} `this`
		 */
		Tone.LFO.prototype.start = function(time){
			this.oscillator.start(time);
			return this;
		};

		/**
		 *  Stop the LFO. 
		 *  @param  {Tone.Time} [time=now] the time the LFO will stop
		 *  @returns {Tone.LFO} `this`
		 */
		Tone.LFO.prototype.stop = function(time){
			this.oscillator.stop(time);
			return this;
		};

		/**
		 *  Sync the start/stop/pause to the transport 
		 *  and the frequency to the bpm of the transport
		 *
		 *  @param {Tone.Time} [delay=0] the time to delay the start of the
		 *                                LFO from the start of the transport
		 *  @returns {Tone.LFO} `this`
		 *  @example
		 *  lfo.frequency.value = "8n";
		 *  lfo.sync();
		 *  // the rate of the LFO will always be an eighth note, 
		 *  // even as the tempo changes
		 */
		Tone.LFO.prototype.sync = function(delay){
			this.oscillator.sync(delay);
			this.oscillator.syncFrequency();
			return this;
		};

		/**
		 *  unsync the LFO from transport control
		 *  @returns {Tone.LFO} `this`
		 */
		Tone.LFO.prototype.unsync = function(){
			this.oscillator.unsync();
			this.oscillator.unsyncFrequency();
			return this;
		};

		/**
		 * The miniumum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.LFO.prototype, "min", {
			get : function(){
				return this._scaler.min;
			},
			set : function(min){
				this._scaler.min = min;
			}
		});

		/**
		 * The maximum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.LFO.prototype, "max", {
			get : function(){
				return this._scaler.max;
			},
			set : function(max){
				this._scaler.max = max;
			}
		});

		/**
		 * The type of the oscillator: sine, square, sawtooth, triangle. 
		 * @memberOf Tone.LFO#
		 * @type {string}
		 * @name type
		 */
		 Object.defineProperty(Tone.LFO.prototype, "type", {
			get : function(){
				return this.oscillator.type;
			},
			set : function(type){
				this.oscillator.type = type;
			}
		});

		/**
		 * The phase of the LFO
		 * @memberOf Tone.LFO#
		 * @type {string}
		 * @name phase
		 */
		 Object.defineProperty(Tone.LFO.prototype, "phase", {
			get : function(){
				return this.oscillator.phase;
			},
			set : function(phase){
				this.oscillator.phase = phase;
			}
		});

		/**
		 *	Override the connect method so that it 0's out the value 
		 *	if attached to an AudioParam or Tone.Signal. Borrowed from {@link Tone.Signal}
		 *  @function
		 */
		Tone.LFO.prototype.connect = Tone.Signal.prototype.connect;

		/**
		 *  disconnect and dispose
		 *  @returns {Tone.LFO} `this`
		 */
		Tone.LFO.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.oscillator.dispose();
			this.oscillator = null;
			this._scaler.dispose();
			this._scaler = null;
			this._a2g.dispose();
			this._a2g = null;
			this.frequency = null;
			this.amplitude = null;
			return this;
		};

		return Tone.LFO;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A limiter on the incoming signal. Composed of a Tone.Compressor
		 *         with a fast attack and decay value. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} threshold the threshold in decibels
		 *  @example
		 *  var limiter = new Tone.Limiter(-6);
		 */
		Tone.Limiter = function(threshold){

			/**
			 *  the compressor
			 *  @private
			 *  @type {Tone.Compressor}
			 */
			this._compressor = this.input = this.output = new Tone.Compressor({
				"attack" : 0.0001,
				"decay" : 0.0001,
				"threshold" : threshold
			});

			/**
			 * The threshold of of the limiter
			 * @type {AudioParam}
			 */
			this.threshold = this._compressor.threshold;
		};

		Tone.extend(Tone.Limiter);

		/**
		 *  clean up
		 *  @returns {Tone.Limiter} `this`
		 */
		Tone.Limiter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._compressor.dispose();
			this._compressor = null;
			this.threshold = null;
			return this;
		};

		return Tone.Limiter;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A lowpass feedback comb filter. 
		 *         DelayNode -> Lowpass Filter -> feedback
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} [minDelay=0.1] the minimum delay time which the filter can have
		 *  @param {number} [maxDelay=1] the maximum delay time which the filter can have
		 */
		Tone.LowpassCombFilter = function(){

			Tone.call(this);

			var options = this.optionsObject(arguments, ["minDelay", "maxDelay"], Tone.LowpassCombFilter.defaults);

			//the delay * samplerate = number of samples. 
			// buffersize / number of samples = number of delays needed per buffer frame
			var delayCount = Math.ceil(this.bufferSize / (options.minDelay * this.context.sampleRate));
			//set some ranges
			delayCount = Math.min(delayCount, 10);
			delayCount = Math.max(delayCount, 1);

			/**
			 *  the number of filter delays
			 *  @type {number}
			 *  @private
			 */
			this._filterDelayCount = delayCount;

			/**
			 *  @type {Array.<FilterDelay>}
			 *  @private
			 */
			this._filterDelays = new Array(this._filterDelayCount);

			/**
			 *  the dampening control
			 *  @type {Tone.Signal}
			 */
			this.dampening = new Tone.Signal(options.dampening, Tone.Signal.Units.Frequency);

			/**
			 *  the resonance control
			 *  @type {Tone.Signal}
			 */
			this.resonance = new Tone.Signal(options.resonance, Tone.Signal.Units.Normal);

			/**
			 *  scale the resonance value to the normal range
			 *  @type {Tone.Scale}
			 *  @private
			 */
			this._resScale = new Tone.ScaleExp(0.01, 1 / this._filterDelayCount - 0.001, 0.5);

			/**
			 *  internal flag for keeping track of when frequency
			 *  correction has been used
			 *  @type {boolean}
			 *  @private
			 */
			this._highFrequencies = false;

			/**
			 *  internal counter of delayTime
			 *  @type {Tone.Time}
			 *  @private
			 */
			this._delayTime = options.delayTime;

			/**
			 *  the feedback node
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedback = this.context.createGain();

			//make the filters
			for (var i = 0; i < this._filterDelayCount; i++) {
				var filterDelay = new FilterDelay(options.minDelay, this.dampening);
				filterDelay.connect(this._feedback);
				this._filterDelays[i] = filterDelay;
			}

			//connections
			this.input.connect(this._filterDelays[0]);
			this._feedback.connect(this._filterDelays[0]);
			this.connectSeries.apply(this, this._filterDelays);
			//resonance control
			this.resonance.chain(this._resScale, this._feedback.gain);
			this._feedback.connect(this.output);
			//set the delay to the min value initially
			this.delayTime = options.delayTime;
		};

		Tone.extend(Tone.LowpassCombFilter);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.LowpassCombFilter.defaults = {
			"resonance" : 0.5,
			"dampening" : 3000,
			"minDelay" : 0.1,
			"maxDelay" : 1,
			"delayTime" : 0.1
		};

		/**
		 * The delay time of the LowpassCombFilter. Auto corrects
		 * for sample offsets for small delay amounts.
		 * @memberOf Tone.LowpassCombFilter#
		 * @type {Tone.Time}
		 * @name delayTime
		 */
		Object.defineProperty(Tone.LowpassCombFilter.prototype, "delayTime", {
			get : function(){
				return this._delayTime;
			},
			set : function(delayAmount){
				this.setDelayTimeAtTime(delayAmount);
			}
		});

		/**
		 * set the delay time for the comb filter at a specific time. 
		 * @param {Tone.Time} delayAmount the amount of delay time
		 * @param {Tone.Time} [time=now] when the delay time should be set
		 */
		Tone.LowpassCombFilter.prototype.setDelayTimeAtTime = function(delayAmount, time){
			this._delayTime = this.toSeconds(delayAmount);
			//the number of samples to delay by
			var sampleRate = this.context.sampleRate;
			var delaySamples = sampleRate * this._delayTime;
			// delayTime corection when frequencies get high
			time = this.toSeconds(time);
			var cutoff = 100;
			if (delaySamples < cutoff){
				this._highFrequencies = true;
				var changeNumber = Math.round((delaySamples / cutoff) * this._filterDelayCount);
				for (var i = 0; i < changeNumber; i++) {
					this._filterDelays[i].setDelay(1 / sampleRate + this._delayTime, time);
				}
				this._delayTime = Math.floor(delaySamples) / sampleRate;
			} else if (this._highFrequencies){
				this._highFrequencies = false;
				for (var j = 0; j < this._filterDelays.length; j++) {
					this._filterDelays[j].setDelay(this._delayTime, time);
				}
			}
		};

		/**
		 *  clean up
		 *  @returns {Tone.LowpassCombFilter} `this`
		 */
		Tone.LowpassCombFilter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			//dispose the filter delays
			for (var i = 0; i < this._filterDelays.length; i++) {
				this._filterDelays[i].dispose();
				this._filterDelays[i] = null;
			}
			this._filterDelays = null;
			this.dampening.dispose();
			this.dampening = null;
			this.resonance.dispose();
			this.resonance = null;
			this._resScale.dispose();
			this._resScale = null;
			this._feedback.disconnect();
			this._feedback = null;
			return this;
		};

		// BEGIN HELPER CLASS //

		/**
		 *  FilterDelay
		 *  @private
		 *  @constructor
		 *  @extends {Tone}
		 */
		var FilterDelay = function(maxDelay, filterFreq){
			this.delay = this.input = this.context.createDelay(maxDelay);
			this.delay.delayTime.value = maxDelay;

			this.filter = this.output = this.context.createBiquadFilter();
			filterFreq.connect(this.filter.frequency);

			this.filter.type = "lowpass";
			this.filter.Q.value = 0;

			this.delay.connect(this.filter);
		};

		Tone.extend(FilterDelay);

		FilterDelay.prototype.setDelay = function(amount, time) {
			this.delay.delayTime.setValueAtTime(amount, time);
		};

		/**
		 *  clean up
		 */
		FilterDelay.prototype.dispose = function(){
			this.delay.disconnect();
			this.delay = null;
			this.filter.disconnect();
			this.filter = null;
		};

		// END HELPER CLASS //

		return Tone.LowpassCombFilter;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Merge a left and a right channel into a single stereo channel.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @example
		 *  var merge = new Tone.Merge();
		 *  sigLeft.connect(merge.left);
		 *  sigRight.connect(merge.right);
		 */
		Tone.Merge = function(){

			Tone.call(this, 2, 0);

			/**
			 *  The left input channel.
			 *  Alias for input 0
			 *  @type {GainNode}
			 */
			this.left = this.input[0] = this.context.createGain();

			/**
			 *  The right input channel.
			 *  Alias for input 1.
			 *  @type {GainNode}
			 */
			this.right = this.input[1] = this.context.createGain();

			/**
			 *  the merger node for the two channels
			 *  @type {ChannelMergerNode}
			 *  @private
			 */
			this._merger = this.output = this.context.createChannelMerger(2);

			//connections
			this.left.connect(this._merger, 0, 0);
			this.right.connect(this._merger, 0, 1);
		};

		Tone.extend(Tone.Merge);

		/**
		 *  clean up
		 *  @returns {Tone.Merge} `this`
		 */
		Tone.Merge.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.left.disconnect();
			this.left = null;
			this.right.disconnect();
			this.right = null;
			this._merger.disconnect();
			this._merger = null;
			return this;
		}; 

		return Tone.Merge;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class  Get the rms of the input signal with some averaging.
		 *          Can also just get the value of the signal
		 *          or the value in dB. inspired by https://github.com/cwilso/volume-meter/blob/master/volume-meter.js<br><br>
		 *          Note that for signal processing, it's better to use {@link Tone.Follower} which will produce
		 *          an audio-rate envelope follower instead of needing to poll the Meter to get the output.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} [channels=1] number of channels being metered
		 *  @param {number} [smoothing=0.8] amount of smoothing applied to the volume
		 *  @param {number} [clipMemory=0.5] number in seconds that a "clip" should be remembered
		 */
		Tone.Meter = function(channels, smoothing, clipMemory){
			//extends Unit
			Tone.call(this);

			/** 
			 *  The channel count
			 *  @type  {number}
			 *  @private
			 */
			this._channels = this.defaultArg(channels, 1);

			/** 
			 *  the smoothing value
			 *  @type  {number}
			 *  @private
			 */
			this._smoothing = this.defaultArg(smoothing, 0.8);

			/** 
			 *  the amount of time a clip is remember for. 
			 *  @type  {number}
			 *  @private
			 */
			this._clipMemory = this.defaultArg(clipMemory, 0.5) * 1000;

			/** 
			 *  the rms for each of the channels
			 *  @private
			 *  @type {Array<number>}
			 */
			this._volume = new Array(this._channels);

			/** 
			 *  the raw values for each of the channels
			 *  @private
			 *  @type {Array<number>}
			 */
			this._values = new Array(this._channels);

			//zero out the volume array
			for (var i = 0; i < this._channels; i++){
				this._volume[i] = 0;
				this._values[i] = 0;
			}

			/** 
			 *  last time the values clipped
			 *  @private
			 *  @type {number}
			 */
			this._lastClip = 0;
			
			/** 
			 *  @private
			 *  @type {ScriptProcessorNode}
			 */
			this._jsNode = this.context.createScriptProcessor(this.bufferSize, this._channels, 1);
			this._jsNode.onaudioprocess = this._onprocess.bind(this);
			//so it doesn't get garbage collected
			this._jsNode.noGC();

			//signal just passes
			this.input.connect(this.output);
			this.input.connect(this._jsNode);
		};

		Tone.extend(Tone.Meter);

		/**
		 *  called on each processing frame
		 *  @private
		 *  @param  {AudioProcessingEvent} event 
		 */
		Tone.Meter.prototype._onprocess = function(event){
			var bufferSize = this._jsNode.bufferSize;
			var smoothing = this._smoothing;
			for (var channel = 0; channel < this._channels; channel++){
				var input = event.inputBuffer.getChannelData(channel);
				var sum = 0;
				var total = 0;
				var x;
				var clipped = false;
				for (var i = 0; i < bufferSize; i++){
					x = input[i];
					if (!clipped && x > 0.95){
						clipped = true;
						this._lastClip = Date.now();
					}
					total += x;
			    	sum += x * x;
				}
				var average = total / bufferSize;
				var rms = Math.sqrt(sum / bufferSize);
				this._volume[channel] = Math.max(rms, this._volume[channel] * smoothing);
				this._values[channel] = average;
			}
		};

		/**
		 *  get the rms of the signal
		 *  	
		 *  @param  {number} [channel=0] which channel
		 *  @return {number}         the value
		 */
		Tone.Meter.prototype.getLevel = function(channel){
			channel = this.defaultArg(channel, 0);
			var vol = this._volume[channel];
			if (vol < 0.00001){
				return 0;
			} else {
				return vol;
			}
		};

		/**
		 *  get the value of the signal
		 *  @param  {number=} channel 
		 *  @return {number}         
		 */
		Tone.Meter.prototype.getValue = function(channel){
			channel = this.defaultArg(channel, 0);
			return this._values[channel];
		};

		/**
		 *  get the volume of the signal in dB
		 *  @param  {number=} channel 
		 *  @return {number}         
		 */
		Tone.Meter.prototype.getDb = function(channel){
			return this.gainToDb(this.getLevel(channel));
		};

		/**
		 * @returns {boolean} if the audio has clipped in the last 500ms
		 */
		Tone.Meter.prototype.isClipped = function(){
			return Date.now() - this._lastClip < this._clipMemory;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Meter} `this`
		 */
		Tone.Meter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._jsNode.disconnect();
			this._jsNode.onaudioprocess = null;
			this._volume = null;
			this._values = null;
			return this;
		};

		return Tone.Meter;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Coerces the incoming mono or stereo signal into a stereo signal
		 *         where both left and right channels have the same value. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 */
		Tone.Mono = function(){
			Tone.call(this, 1, 0);

			/**
			 *  merge the signal
			 *  @type {Tone.Merge}
			 *  @private
			 */
			this._merge = this.output = new Tone.Merge();

			this.input.connect(this._merge, 0, 0);
			this.input.connect(this._merge, 0, 1);
			this.input.gain.value = this.dbToGain(-10);
		};

		Tone.extend(Tone.Mono);

		/**
		 *  clean up
		 *  @returns {Tone.Mono} `this`
		 */
		Tone.Mono.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._merge.dispose();
			this._merge = null;
			return this;
		};

		return Tone.Mono;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A compressor with seperate controls over low/mid/high dynamics
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Object} options the low/mid/high compressor settings in a single object
		 *  @example
		 *  var multiband = new Tone.MultibandCompressor({
		 *  	"lowFrequency" : 200,
		 *  	"highFrequency" : 1300
		 *  	"low" : {
		 *  		"threshold" : -12
		 *  	}
		 *  })
		 */
		Tone.MultibandCompressor = function(options){

			options = this.defaultArg(arguments, Tone.MultibandCompressor.defaults);

			/**
			 *  split the incoming signal into high/mid/low
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */
			this._splitter = this.input = new Tone.MultibandSplit({
				"lowFrequency" : options.lowFrequency,
				"highFrequency" : options.highFrequency
			});

			/**
			 *  low/mid crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.lowFrequency = this._splitter.lowFrequency;

			/**
			 *  mid/high crossover frequency
			 *  @type {Tone.Signal}
			 */
			this.highFrequency = this._splitter.highFrequency;

			/**
			 *  the output
			 *  @type {GainNode}
			 *  @private
			 */
			this.output = this.context.createGain();

			/**
			 *  the low compressor
			 *  @type {Tone.Compressor}
			 */
			this.low = new Tone.Compressor(options.low);

			/**
			 *  the mid compressor
			 *  @type {Tone.Compressor}
			 */
			this.mid = new Tone.Compressor(options.mid);

			/**
			 *  the high compressor
			 *  @type {Tone.Compressor}
			 */
			this.high = new Tone.Compressor(options.high);

			//connect the compressor
			this._splitter.low.chain(this.low, this.output);
			this._splitter.mid.chain(this.mid, this.output);
			this._splitter.high.chain(this.high, this.output);
		};

		Tone.extend(Tone.MultibandCompressor);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.MultibandCompressor.defaults = {
			"low" : Tone.Compressor.defaults,
			"mid" : Tone.Compressor.defaults,
			"high" : Tone.Compressor.defaults,
			"lowFrequency" : 250,
			"highFrequency" : 2000
		};

		/**
		 *  clean up
		 *  @returns {Tone.MultibandCompressor} `this`
		 */
		Tone.MultibandCompressor.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._splitter.dispose();
			this.low.dispose();
			this.mid.dispose();
			this.high.dispose();
			this._splitter = null;
			this.low = null;
			this.mid = null;
			this.high = null;
			this.lowFrequency = null;
			this.highFrequency = null;
			return this;
		};

		return Tone.MultibandCompressor;
	});
	ToneModule( function(Tone){

		

		/**
		 *	@class  Split the incoming signal into left and right channels
		 *	
		 *  @constructor
		 *  @extends {Tone}
		 *  @example
		 *  var split = new Tone.Split();
		 *  stereoSignal.connect(split);
		 */
		Tone.Split = function(){

			Tone.call(this, 1, 2);

			/** 
			 *  @type {ChannelSplitterNode}
			 *  @private
			 */
			this._splitter = this.context.createChannelSplitter(2);

			/** 
			 *  left channel output
			 *  alais for the first output
			 *  @type {GainNode}
			 */
			this.left = this.output[0] = this.context.createGain();

			/**
			 *  the right channel output
			 *  alais for the second output
			 *  @type {GainNode}
			 */
			this.right = this.output[1] = this.context.createGain();
			
			//connections
			this.input.connect(this._splitter);
			this._splitter.connect(this.left, 0, 0);
			this._splitter.connect(this.right, 1, 0);
		};

		Tone.extend(Tone.Split);

		/**
		 *  dispose method
		 *  @returns {Tone.Split} `this`
		 */
		Tone.Split.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._splitter.disconnect();
			this.left.disconnect();
			this.right.disconnect();
			this.left = null;
			this.right = null;
			this._splitter = null;
			return this;
		}; 

		return Tone.Split;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  Panner. 
		 *  
		 *  @class  Equal Power Gain L/R Panner. Not 3D. 
		 *          0 = 100% Left
		 *          1 = 100% Right
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} [initialPan=0.5] the initail panner value (defaults to 0.5 = center)
		 *  @example
		 *  var panner = new Tone.Panner(1);
		 *  // ^ pan the input signal hard right. 
		 */
		Tone.Panner = function(initialPan){

			Tone.call(this, 1, 0);
			
			/**
			 *  the dry/wet knob
			 *  @type {Tone.CrossFade}
			 *  @private
			 */
			this._crossFade = new Tone.CrossFade();
			
			/**
			 *  @type {Tone.Merge}
			 *  @private
			 */
			this._merger = this.output = new Tone.Merge();
			
			/**
			 *  @type {Tone.Split}
			 *  @private
			 */
			this._splitter = new Tone.Split();
			
			/**
			 *  the pan control
			 *  @type {Tone.Signal}
			 */	
			this.pan = this._crossFade.fade;

			//CONNECTIONS:
			this.input.connect(this._splitter.left);
			this.input.connect(this._splitter.right);
			//left channel is dry, right channel is wet
			this._splitter.connect(this._crossFade, 0, 0);
			this._splitter.connect(this._crossFade, 1, 1);
			//merge it back together
			this._crossFade.a.connect(this._merger.left);
			this._crossFade.b.connect(this._merger.right);

			//initial value
			this.pan.value = this.defaultArg(initialPan, 0.5);
		};

		Tone.extend(Tone.Panner);

		/**
		 *  clean up
		 *  @returns {Tone.Panner} `this`
		 */
		Tone.Panner.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._crossFade.dispose();
			this._crossFade = null;
			this._splitter.dispose();
			this._splitter = null;
			this._merger.dispose();
			this._merger = null;
			this.pan = null;
			return this;
		};

		return Tone.Panner;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A Panner and volume in one.
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @example
		 *  var panVol = new Tone.PanVol(0.25, -12);
		 */
		Tone.PanVol = function(pan, volume){
			/**
			 *  the panning node
			 *  @type {Tone.Panner}
			 *  @private
			 */
			this._panner = this.input = new Tone.Panner(pan);

			/**
			 * the output node
			 * @type {GainNode}
			 */
			this.output = this.context.createGain();

			/**
			 *  The volume control in decibels. 
			 *  @type {Tone.Signal}
			 */
			this.volume = new Tone.Signal(this.output.gain, Tone.Signal.Units.Decibels);
			this.volume.value = this.defaultArg(volume, 0);

			/**
			 *  the panning control
			 *  @type {Tone.Panner}
			 *  @private
			 */
			this.pan = this._panner.pan;

			//connections
			this._panner.connect(this.output);
		};

		Tone.extend(Tone.PanVol);

		/**
		 *  clean up
		 *  @returns {Tone.PanVol} `this`
		 */
		Tone.PanVol.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._panner.dispose();
			this._panner = null;
			this.volume.dispose();
			this.volume = null;
			this.pan = null;
			return this;
		};

		return Tone.PanVol;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @deprecated
		 *  @class  Record an input into an array or AudioBuffer. 
		 *          it is limited in that the recording length needs to be known beforehand. 
		 *          Mostly used internally for testing. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} channels 
		 */
		Tone.Recorder = function(channels){

			console.warn("Tone.Recorder is deprecated. It will be removed in next version");

			Tone.call(this);

			/**
			 *  the number of channels in the recording
			 *  @type {number}
			 */
			this.channels = this.defaultArg(channels, 1);

			/**
			 *  @private
			 *  @type {ScriptProcessorNode}
			 */
			this._jsNode = this.context.createScriptProcessor(this.bufferSize, this.channels, 1);
			this._jsNode.onaudioprocess = this._audioprocess.bind(this);

			/**
			 *  Float32Array for each channel
			 *  @private
			 *  @type {Array<Float32Array>}
			 */
			this._recordBuffers = new Array(this.channels);

			/**
			 *  @type {number}
			 *  @private
			 */
			this._recordStartSample = 0;

			/**
			 *  @type {number}
			 *  @private
			 */
			this._recordEndSample = 0;

			/**
			 *  @type {number}
			 *  @private
			 */
			this._recordDuration = 0;

			/**
			 *  @type {RecordState}
			 */
			this.state = RecordState.STOPPED;

			/** 
			 *  @private
			 *  @type {number}
			 */
			this._recordBufferOffset = 0;

			/** 
			 *  callback invoked when the recording is over
			 *  @private
			 *  @type {function(Float32Array)}
			 */
			this._callback = function(){};

			//connect it up
			this.input.connect(this._jsNode);
			//pass thru audio
			this.input.connect(this.output);
			//so it doesn't get garbage collected
			this._jsNode.noGC();
			//clear it to start
			this.clear();
		};

		Tone.extend(Tone.Recorder);

		/**
		 *  internal method called on audio process
		 *  
		 *  @private
		 *  @param   {AudioProcessorEvent} event 
		 */
		Tone.Recorder.prototype._audioprocess = function(event){
			if (this.state === RecordState.STOPPED){
				return;
			} else if (this.state === RecordState.RECORDING){
				//check if it's time yet
				var now = this.defaultArg(event.playbackTime, this.now());
				var processPeriodStart = this.toSamples(now);
				var bufferSize = this._jsNode.bufferSize;
				var processPeriodEnd = processPeriodStart + bufferSize;
				var bufferOffset, len;
				if (processPeriodStart > this._recordEndSample){
					this.state = RecordState.STOPPED;
					this._callback(this._recordBuffers);
				} else if (processPeriodStart > this._recordStartSample) {
					bufferOffset = 0;
					len = Math.min(this._recordEndSample - processPeriodStart, bufferSize);
					this._recordChannels(event.inputBuffer, bufferOffset, len, bufferSize);
				} else if (processPeriodEnd > this._recordStartSample) {
					len = processPeriodEnd - this._recordStartSample;
					bufferOffset = bufferSize - len;
					this._recordChannels(event.inputBuffer, bufferOffset, len, bufferSize);
				} 

			}
		};

		/**
		 *  record an input channel
		 *  @param   {AudioBuffer} inputBuffer        
		 *  @param   {number} from  
		 *  @param   {number} to  
		 *  @private
		 */
		Tone.Recorder.prototype._recordChannels = function(inputBuffer, from, to, bufferSize){
			var offset = this._recordBufferOffset;
			var buffers = this._recordBuffers;
			for (var channelNum = 0; channelNum < inputBuffer.numberOfChannels; channelNum++){
				var channel = inputBuffer.getChannelData(channelNum);
				if ((from === 0) && (to === bufferSize)){
					//set the whole thing
					this._recordBuffers[channelNum].set(channel, offset);
				} else {
					for (var i = from; i < from + to; i++){
						var zeroed = i - from; 
						buffers[channelNum][zeroed + offset] = channel[i];				
					}
				}
			}
			this._recordBufferOffset += to;
		};	

		/**
		 *  Record for a certain period of time
		 *  
		 *  will clear the internal buffer before starting
		 *  
		 *  @param  {Tone.Time} duration 
		 *  @param  {Tone.Time} wait the wait time before recording
		 *  @param {function(Float32Array)} callback the callback to be invoked when the buffer is done recording
		 *  @returns {Tone.Recorder} `this`
		 */
		Tone.Recorder.prototype.record = function(duration, startTime, callback){
			if (this.state === RecordState.STOPPED){
				this.clear();
				this._recordBufferOffset = 0;
				startTime = this.defaultArg(startTime, 0);
				this._recordDuration = this.toSamples(duration);
				this._recordStartSample = this.toSamples("+"+startTime);
				this._recordEndSample = this._recordStartSample + this._recordDuration;
				for (var i = 0; i < this.channels; i++){
					this._recordBuffers[i] = new Float32Array(this._recordDuration);
				}
				this.state = RecordState.RECORDING;
				this._callback = this.defaultArg(callback, function(){});
			}
			return this;
		};

		/**
		 *  clears the recording buffer
		 *  @returns {Tone.PanVol} `this`
		 */
		Tone.Recorder.prototype.clear = function(){
			for (var i = 0; i < this.channels; i++){
				this._recordBuffers[i] = null;
			}
			this._recordBufferOffset = 0;
			return this;
		};


		/**
		 *  true if there is nothing in the buffers
		 *  @return {boolean} 
		 */
		Tone.Recorder.prototype.isEmpty = function(){
			return this._recordBuffers[0] === null;
		};

		/**
		 *  @return {Array<Float32Array>}
		 */
		Tone.Recorder.prototype.getFloat32Array = function(){
			if (this.isEmpty()){
				return null;
			} else {
				return this._recordBuffers;
			}
		};

		/**
		 *  @return {AudioBuffer}
		 */
		Tone.Recorder.prototype.getAudioBuffer = function(){
			if (this.isEmpty()){
				return null;
			} else {
				var audioBuffer = this.context.createBuffer(this.channels, this._recordBuffers[0].length, this.context.sampleRate);
				for (var channelNum = 0; channelNum < audioBuffer.numberOfChannels; channelNum++){
					var channel = audioBuffer.getChannelData(channelNum);
					channel.set(this._recordBuffers[channelNum]);
				}
				return audioBuffer;
			}
		};

		/**
		 *  clean up
		 *  @returns {Tone.PanVol} `this`
		 */
		Tone.Recorder.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._jsNode.disconnect();
			this._jsNode.onaudioprocess = undefined;
			this._jsNode = null;
			this._recordBuffers = null;
			return this;
		};

		/**
		 *  @enum {string}
		 */
		var RecordState = {
			STOPPED : "stopped",
			SCHEDULED : "scheduled",
			RECORDING : "recording"
		};

		return Tone.Recorder;
	});
	ToneModule( 
		function(Tone){

		

		/**
		 *  @class An envelope which can be scaled to any range. 
		 *         Useful for applying an envelope to a filter
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Tone.Time|Object} [attack=0.01]	the attack time in seconds
		 *  @param {Tone.Time} [decay=0.1]	the decay time in seconds
		 *  @param {number} [sustain=0.5] 	a percentage (0-1) of the full amplitude
		 *  @param {Tone.Time} [release=1]	the release time in seconds
		 *  @example
		 *  var scaledEnv = new Tone.ScaledEnvelope({
		 *  	"attack" : 0.2,
		 *  	"min" : 200,
		 *  	"max" : 2000
		 *  });
		 *  scaledEnv.connect(oscillator.frequency);
		 */
		Tone.ScaledEnvelope = function(){

			//get all of the defaults
			var options = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], Tone.Envelope.defaults);
			Tone.Envelope.call(this, options);
			options = this.defaultArg(options, Tone.ScaledEnvelope.defaults);

			/** 
			 *  scale the incoming signal by an exponent
			 *  @type {Tone.Pow}
			 *  @private
			 */
			this._exp = this.output = new Tone.Pow(options.exponent);

			/**
			 *  scale the signal to the desired range
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = this.output = new Tone.Scale(options.min, options.max);

			this._sig.chain(this._exp, this._scale);
		};

		Tone.extend(Tone.ScaledEnvelope, Tone.Envelope);

		/**
		 *  the default parameters
		 *  @static
		 */
		Tone.ScaledEnvelope.defaults = {
			"min" : 0,
			"max" : 1,
			"exponent" : 1
		};

		/**
		 * The envelope's min output value. This is the value which it
		 * starts at. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "min", {
			get : function(){
				return this._scale.min;
			},
			set : function(min){
				this._scale.min = min;
			}
		});

		/**
		 * The envelope's max output value. In other words, the value
		 * at the peak of the attack portion of the envelope. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "max", {
			get : function(){
				return this._scale.max;
			},
			set : function(max){
				this._scale.max = max;
			}
		});

		/**
		 * The envelope's exponent value. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name exponent
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "exponent", {
			get : function(){
				return this._exp.value;
			},
			set : function(exp){
				this._exp.value = exp;
			}
		});
		
		/**
		 *  clean up
		 *  @returns {Tone.ScaledEnvelope} `this`
		 */
		Tone.ScaledEnvelope.prototype.dispose = function(){
			Tone.Envelope.prototype.dispose.call(this);
			this._scale.dispose();
			this._scale = null;
			this._exp.dispose();
			this._exp = null;
			return this;
		};

		return Tone.ScaledEnvelope;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Buffer loading and storage. Tone.Buffer is used internally by all 
		 *          classes that make requests for audio files such as {@link Tone.Player},
		 *          {@link Tone.Sampler} and {@link Tone.Convolver} .
		 *          <br><br>Aside from load callbacks from individual buffers, Tone.Buffer 
		 *  		provides static methods which keep track of the loading progress 
		 *  		of all of the buffers. These methods are `onload`, `onprogress`,
		 *  		and `onerror`. 
		 *
		 *  @constructor 
		 *  @param {AudioBuffer|string} url the url to load, or the audio buffer to set
		 */
		Tone.Buffer = function(){

			var options = this.optionsObject(arguments, ["url", "onload"], Tone.Buffer.defaults);

			/**
			 *  stores the loaded AudioBuffer
			 *  @type {AudioBuffer}
			 *  @private
			 */
			this._buffer = null;

			/**
			 *  the url of the buffer. `undefined` if it was 
			 *  constructed with a buffer
			 *  @type {string}
			 *  @readOnly
			 */
			this.url = undefined;

			/**
			 *  indicates if the buffer is loaded or not
			 *  @type {boolean}
			 *  @readOnly
			 */
			this.loaded = false;

			/**
			 *  the callback to invoke when everything is loaded
			 *  @type {function}
			 */
			this.onload = options.onload.bind(this, this);

			if (options.url instanceof AudioBuffer){
				this._buffer.set(options.url);
				this.onload(this);
			} else if (typeof options.url === "string"){
				this.url = options.url;
				Tone.Buffer._addToQueue(options.url, this);
			}
		};

		Tone.extend(Tone.Buffer);

		/**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Buffer.defaults = {
			"url" : undefined,
			"onload" : function(){},
		};

		/**
		 *  set the buffer
		 *  @param {AudioBuffer|Tone.Buffer} buffer the buffer
		 *  @returns {Tone.Buffer} `this`
		 */
		Tone.Buffer.prototype.set = function(buffer){
			if (buffer instanceof Tone.Buffer){
				this._buffer = buffer.get();
			} else {
				this._buffer = buffer;
			}
			this.loaded = true;
			return this;
		};

		/**
		 *  @return {AudioBuffer} the audio buffer
		 */
		Tone.Buffer.prototype.get = function(){
			return this._buffer;
		};

		/**
		 *  @param {string} url the url to load
		 *  @param {function=} callback the callback to invoke on load. 
		 *                              don't need to set if `onload` is
		 *                              already set.
		 *  @returns {Tone.Buffer} `this`
		 */
		Tone.Buffer.prototype.load = function(url, callback){
			this.url = url;
			this.onload = this.defaultArg(callback, this.onload);
			Tone.Buffer._addToQueue(url, this);
			return this;
		};

		/**
		 *  dispose and disconnect
		 *  @returns {Tone.Buffer} `this`
		 */
		Tone.Buffer.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			Tone.Buffer._removeFromQueue(this);
			this._buffer = null;
			this.onload = null;
			return this;
		};

		/**
		 * the duration of the buffer
		 * @memberOf Tone.Buffer#
		 * @type {number}
		 * @name duration
		 * @readOnly
		 */
		Object.defineProperty(Tone.Buffer.prototype, "duration", {
			get : function(){
				if (this._buffer){
					return this._buffer.duration;
				} else {
					return 0;
				}
			},
		});

		///////////////////////////////////////////////////////////////////////////
		// STATIC METHODS
		///////////////////////////////////////////////////////////////////////////
		 
		/**
		 *  the static queue for all of the xhr requests
		 *  @type {Array}
		 *  @private
		 */
		Tone.Buffer._queue = [];

		/**
		 *  the array of current downloads
		 *  @type {Array}
		 *  @private
		 */
		Tone.Buffer._currentDownloads = [];

		/**
		 *  the total number of downloads
		 *  @type {number}
		 *  @private
		 */
		Tone.Buffer._totalDownloads = 0;

		/**
		 *  the maximum number of simultaneous downloads
		 *  @static
		 *  @type {number}
		 */
		Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS = 6;
		
		/**
		 *  Adds a file to be loaded to the loading queue
		 *  @param   {string}   url      the url to load
		 *  @param   {function} callback the callback to invoke once it's loaded
		 *  @private
		 */
		Tone.Buffer._addToQueue = function(url, buffer){
			Tone.Buffer._queue.push({
				url : url,
				Buffer : buffer,
				progress : 0,
				xhr : null
			});
			this._totalDownloads++;
			Tone.Buffer._next();
		};

		/**
		 *  Remove an object from the queue's (if it's still there)
		 *  Abort the XHR if it's in progress
		 *  @param {Tone.Buffer} buffer the buffer to remove
		 *  @private
		 */
		Tone.Buffer._removeFromQueue = function(buffer){
			var i;
			for (i = 0; i < Tone.Buffer._queue.length; i++){
				var q = Tone.Buffer._queue[i];
				if (q.Buffer === buffer){
					Tone.Buffer._queue.splice(i, 1);
				}
			}
			for (i = 0; i < Tone.Buffer._currentDownloads.length; i++){
				var dl = Tone.Buffer._currentDownloads[i];
				if (dl.Buffer === buffer){
					Tone.Buffer._currentDownloads.splice(i, 1);
					dl.xhr.abort();
					dl.xhr.onprogress = null;
					dl.xhr.onload = null;
					dl.xhr.onerror = null;
				}
			}
		};

		/**
		 *  load the next buffer in the queue
		 *  @private
		 */
		Tone.Buffer._next = function(){
			if (Tone.Buffer._queue.length > 0){
				if (Tone.Buffer._currentDownloads.length < Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS){
					var next = Tone.Buffer._queue.shift();
					Tone.Buffer._currentDownloads.push(next);
					next.xhr = Tone.Buffer.load(next.url, function(buffer){
						//remove this one from the queue
						var index = Tone.Buffer._currentDownloads.indexOf(next);
						Tone.Buffer._currentDownloads.splice(index, 1);
						next.Buffer.set(buffer);
						next.Buffer.onload(next.Buffer);
						Tone.Buffer._onprogress();
						Tone.Buffer._next();
					});
					next.xhr.onprogress = function(event){
						next.progress = event.loaded / event.total;
						Tone.Buffer._onprogress();
					};
					next.xhr.onerror = Tone.Buffer.onerror;
				} 
			} else if (Tone.Buffer._currentDownloads.length === 0){
				Tone.Buffer.onload();
				//reset the downloads
				Tone.Buffer._totalDownloads = 0;
			}
		};

		/**
		 *  internal progress event handler
		 *  @private
		 */
		Tone.Buffer._onprogress = function(){
			var curretDownloadsProgress = 0;
			var currentDLLen = Tone.Buffer._currentDownloads.length;
			var inprogress = 0;
			if (currentDLLen > 0){
				for (var i = 0; i < currentDLLen; i++){
					var dl = Tone.Buffer._currentDownloads[i];
					curretDownloadsProgress += dl.progress;
				}
				inprogress = curretDownloadsProgress;
			}
			var currentDownloadProgress = currentDLLen - inprogress;
			var completed = Tone.Buffer._totalDownloads - Tone.Buffer._queue.length - currentDownloadProgress;
			Tone.Buffer.onprogress(completed / Tone.Buffer._totalDownloads);
		};

		/**
		 *  makes an xhr reqest for the selected url
		 *  Load the audio file as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url the url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param {function} callback function
		 *  @returns {XMLHttpRequest} returns the XHR
		 */
		Tone.Buffer.load = function(url, callback){
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";
			// decode asynchronously
			request.onload = function() {
				Tone.context.decodeAudioData(request.response, function(buff) {
					if(!buff){
						throw new Error("could not decode audio data:" + url);
					}
					callback(buff);
				});
			};
			//send the request
			request.send();
			return request;
		};

		/**
		 *  callback when all of the buffers in the queue have loaded
		 *  @static
		 *  @type {function}
		 *  @example
		 * //invoked when all of the queued samples are done loading
		 * Tone.Buffer.onload = function(){
		 * 	console.log("everything is loaded");
		 * };
		 */
		Tone.Buffer.onload = function(){};

		/**
		 *  Callback function is invoked with the progress of all of the loads in the queue. 
		 *  The value passed to the callback is between 0-1.
		 *  @static
		 *  @type {function}
		 *  @example
		 * Tone.Buffer.onprogress = function(percent){
		 * 	console.log("progress:" + (percent * 100).toFixed(1) + "%");
		 * };
		 */
		Tone.Buffer.onprogress = function(){};

		/**
		 *  Callback if one of the buffers in the queue encounters an error. The error
		 *  is passed in as the argument. 
		 *  @static
		 *  @type {function}
		 *  @example
		 * Tone.Buffer.onerror = function(e){
		 * 	console.log("there was an error while loading the buffers: "+e);
		 * }
		 */
		Tone.Buffer.onerror = function(){};

		return Tone.Buffer;
	});
	ToneModule( function(Tone){

		

		/**
		 *  buses are another way of routing audio
		 *
		 *  augments Tone.prototype to include send and recieve
		 */

		 /**
		  *  All of the routes
		  *  
		  *  @type {Object}
		  *  @static
		  *  @private
		  */
		var Buses = {};

		/**
		 *  send signal to a channel name
		 *  defined in "Tone/core/Bus"
		 *
		 *  @param  {string} channelName 
		 *  @param  {number} amount      
		 *  @return {GainNode}             
		 */
		Tone.prototype.send = function(channelName, amount){
			if (!Buses.hasOwnProperty(channelName)){
				Buses[channelName] = this.context.createGain();
			}
			var sendKnob = this.context.createGain();
			sendKnob.gain.value = this.defaultArg(amount, 1);
			this.output.chain(sendKnob, Buses[channelName]);
			return sendKnob;		
		};

		/**
		 *  recieve the input from the desired channelName to the input
		 *  defined in "Tone/core/Bus"
		 *
		 *  @param  {string} channelName 
		 *  @param {AudioNode} [input=this.input] if no input is selected, the
		 *                                         input of the current node is
		 *                                         chosen. 
		 *  @returns {Tone} `this`
		 */
		Tone.prototype.receive = function(channelName, input){
			if (!Buses.hasOwnProperty(channelName)){
				Buses[channelName] = this.context.createGain();	
			}
			if (this.isUndef(input)){
				input = this.input;
			}
			Buses[channelName].connect(input);
			return this;
		};

		return Tone;
	});
	ToneModule( function(Tone){

		

		/**
		 *  Frequency can be described similar to time, except ultimately the
		 *  values are converted to frequency instead of seconds. A number
		 *  is taken literally as the value in hertz. Additionally any of the 
		 *  {@link Tone.Time} encodings can be used. Note names in the form
		 *  of NOTE OCTAVE (i.e. `C4`) are also accepted and converted to their
		 *  frequency value. 
		 *  
		 *  @typedef {number|string|Tone.Time} Tone.Frequency
		 */

		/**
		 *  @class  A timed note. Creating a note will register a callback 
		 *          which will be invoked on the channel at the time with
		 *          whatever value was specified. 
		 *
		 *  @constructor
		 *  @param {number|string} channel the channel name of the note
		 *  @param {Tone.Time} time the time when the note will occur
		 *  @param {string|number|Object|Array} value the value of the note
		 */
		Tone.Note = function(channel, time, value){

			/**
			 *  the value of the note. This value is returned
			 *  when the channel callback is invoked.
			 *  
			 *  @type {string|number|Object}
			 */
			this.value = value;

			/**
			 *  the channel name or number
			 *  
			 *  @type {string|number}
			 *  @private
			 */
			this._channel = channel;

			/**
			 *  an internal reference to the id of the timeline
			 *  callback which is set. 
			 *  
			 *  @type {number}
			 *  @private
			 */
			this._timelineID = Tone.Transport.setTimeline(this._trigger.bind(this), time);
		};

		/**
		 *  invoked by the timeline
		 *  @private
		 *  @param {number} time the time at which the note should play
		 */
		Tone.Note.prototype._trigger = function(time){
			//invoke the callback
			channelCallbacks(this._channel, time, this.value);
		};

		/**
		 *  clean up
		 *  @returns {Tone.Note} `this`
		 */
		Tone.Note.prototype.dispose = function(){ 
			Tone.Tranport.clearTimeline(this._timelineID);
			this.value = null;
			return this;
		};

		/**
		 *  @private
		 *  @static
		 *  @type {Object}
		 */
		var NoteChannels = {};

		/**
		 *  invoke all of the callbacks on a specific channel
		 *  @private
		 */
		function channelCallbacks(channel, time, value){
			if (NoteChannels.hasOwnProperty(channel)){
				var callbacks = NoteChannels[channel];
				for (var i = 0, len = callbacks.length; i < len; i++){
					var callback = callbacks[i];
					if (Array.isArray(value)){
						callback.apply(window, [time].concat(value));
					} else {
						callback(time, value);
					}
				}
			}
		}

		/**
		 *  listen to a specific channel, get all of the note callbacks
		 *  @static
		 *  @param {string|number} channel the channel to route note events from
		 *  @param {function(*)} callback callback to be invoked when a note will occur
		 *                                        on the specified channel
		 */
		Tone.Note.route = function(channel, callback){
			if (NoteChannels.hasOwnProperty(channel)){
				NoteChannels[channel].push(callback);
			} else {
				NoteChannels[channel] = [callback];
			}
		};

		/**
		 *  Remove a previously routed callback from a channel. 
		 *  @static
		 *  @param {string|number} channel The channel to unroute note events from
		 *  @param {function(*)} callback Callback which was registered to the channel.
		 */
		Tone.Note.unroute = function(channel, callback){
			if (NoteChannels.hasOwnProperty(channel)){
				var channelCallback = NoteChannels[channel];
				var index = channelCallback.indexOf(callback);
				if (index !== -1){
					NoteChannels[channel].splice(index, 1);
				}
			}
		};

		/**
		 *  Parses a score and registers all of the notes along the timeline. 
		 *
		 *  Scores are a JSON object with instruments at the top level
		 *  and an array of time and values. The value of a note can be 0 or more 
		 *  parameters. 
		 *
		 *  The only requirement for the score format is that the time is the first (or only)
		 *  value in the array. All other values are optional and will be passed into the callback
		 *  function registered using `Note.route(channelName, callback)`.
		 *
		 *  To convert MIDI files to score notation, take a look at utils/MidiToScore.js
		 *
		 *  @example
		 *  //an example JSON score which sets up events on channels
		 *  var score = { 
		 *  	"synth"  : [["0", "C3"], ["0:1", "D3"], ["0:2", "E3"], ... ],
		 *  	"bass"  : [["0", "C2"], ["1:0", "A2"], ["2:0", "C2"], ["3:0", "A2"], ... ],
		 *  	"kick"  : ["0", "0:2", "1:0", "1:2", "2:0", ... ],
		 *  	//...
		 *  };
		 *  //parse the score into Notes
		 *  Tone.Note.parseScore(score);
		 *  //route all notes on the "synth" channel
		 *  Tone.Note.route("synth", function(time, note){
		 *  	//trigger synth
		 *  });
		 *  @static
		 *  @param {Object} score
		 *  @return {Array<Tone.Note>} an array of all of the notes that were created
		 */
		Tone.Note.parseScore = function(score){
			var notes = [];
			for (var inst in score){
				var part = score[inst];
				if (inst === "tempo"){
					Tone.Transport.bpm.value = part;
				} else if (inst === "timeSignature"){
					Tone.Transport.timeSignature = part[0] / (part[1] / 4);
				} else if (Array.isArray(part)){
					for (var i = 0; i < part.length; i++){
						var noteDescription = part[i];
						var note;
						if (Array.isArray(noteDescription)){
							var time = noteDescription[0];
							var value = noteDescription.slice(1);
							note = new Tone.Note(inst, time, value);
						} else {
							note = new Tone.Note(inst, noteDescription);
						}
						notes.push(note);
					}
				} else {
					throw new TypeError("score parts must be Arrays");
				}
			}
			return notes;
		};

		///////////////////////////////////////////////////////////////////////////
		//	MUSIC NOTES
		//	
		//	Augments Tone.prototype to include note methods
		///////////////////////////////////////////////////////////////////////////

		var noteToIndex = { "c" : 0, "c#" : 1, "db" : 1, "d" : 2, "d#" : 3, "eb" : 3, 
			"e" : 4, "f" : 5, "f#" : 6, "gb" : 6, "g" : 7, "g#" : 8, "ab" : 8, 
			"a" : 9, "a#" : 10, "bb" : 10, "b" : 11
		};

		var noteIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

		var middleC = 261.6255653005986;

		/**
		 *  convert a note name to frequency (i.e. A4 to 440)
		 *  defined in "Tone/core/Note"
		 *  
		 *  @param  {string} note
		 *  @return {number}         
		 */
		Tone.prototype.noteToFrequency = function(note){
			//break apart the note by frequency and octave
			var parts = note.split(/(\d+)/);
			if (parts.length === 3){
				var index = noteToIndex[parts[0].toLowerCase()];
				var octave = parts[1];
				var noteNumber = index + parseInt(octave, 10) * 12;
				return Math.pow(2, (noteNumber - 48) / 12) * middleC;
			} else {
				return 0;
			}
		};

		/**
		 *  test if a string is in note format: i.e. "C4"
		 *  @param  {string|number}  note the note to test
		 *  @return {boolean}      true if it's in the form of a note
		 *  @method isNotation
		 *  @lends Tone.prototype.isNotation
		 */
		Tone.prototype.isNote = ( function(){
			var noteFormat = new RegExp(/[a-g]{1}([b#]{1}|[b#]{0})[0-9]+$/i);
			return function(note){
				if (typeof note === "string"){
					note = note.toLowerCase();
				} 
				return noteFormat.test(note);
			};
		})();

		/**
		 *  a pointer to the previous toFrequency method
		 *  @private
		 *  @function
		 */
		Tone.prototype._overwrittenToFrequency = Tone.prototype.toFrequency;

		/**
		 *  A method which accepts frequencies in the form
		 *  of notes (`"C#4"`), frequencies as strings ("49hz"), frequency numbers,
		 *  or Tone.Time and converts them to their frequency as a number in hertz.
		 *  @param  {Tone.Frequency} note the note name or notation
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number}      the frequency as a number
		 */
		Tone.prototype.toFrequency = function(note, now){
			if (this.isNote(note)){
				note = this.noteToFrequency(note);
			} 
			return this._overwrittenToFrequency(note, now);
		};

		/**
		 *  Convert a note name (i.e. A4, C#5, etc to a frequency).
		 *  Defined in "Tone/core/Note"
		 *  @param  {number} freq
		 *  @return {string}         
		 */
		Tone.prototype.frequencyToNote = function(freq){
			var log = Math.log(freq / middleC) / Math.LN2;
			var noteNumber = Math.round(12 * log) + 48;
			var octave = Math.floor(noteNumber/12);
			var noteName = noteIndexToNote[noteNumber % 12];
			return noteName + octave.toString();
		};

		/**
		 *  Convert an interval (in semitones) to a frequency ratio.
		 *
		 *  @param  {number} interval the number of semitones above the base note
		 *  @return {number}          the frequency ratio
		 *  @example
		 *  tone.intervalToFrequencyRatio(0); // returns 1
		 *  tone.intervalToFrequencyRatio(12); // returns 2
		 */
		Tone.prototype.intervalToFrequencyRatio = function(interval){
			return Math.pow(2,(interval/12));
		};

		/**
		 *  Convert a midi note number into a note name/
		 *
		 *  @param  {number} midiNumber the midi note number
		 *  @return {string}            the note's name and octave
		 *  @example
		 *  tone.midiToNote(60); // returns "C3"
		 */
		Tone.prototype.midiToNote = function(midiNumber){
			var octave = Math.floor(midiNumber / 12) - 2;
			var note = midiNumber % 12;
			return noteIndexToNote[note] + octave;
		};

		/**
		 *  convert a note to it's midi value
		 *  defined in "Tone/core/Note"
		 *
		 *  @param  {string} note the note name (i.e. "C3")
		 *  @return {number} the midi value of that note
		 *  @example
		 *  tone.noteToMidi("C3"); // returns 60
		 */
		Tone.prototype.noteToMidi = function(note){
			//break apart the note by frequency and octave
			var parts = note.split(/(\d+)/);
			if (parts.length === 3){
				var index = noteToIndex[parts[0].toLowerCase()];
				var octave = parts[1];
				return index + (parseInt(octave, 10) + 2) * 12;
			} else {
				return 0;
			}
		};

		return Tone.Note;
	});
	ToneModule( function(Tone){

		
		
		/**
		 * 	@class  Effect is the base class for effects. connect the effect between
		 * 	        the effectSend and effectReturn GainNodes. then control the amount of
		 * 	        effect which goes to the output using the dry/wet control.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} [initialWet=0] the starting wet value
		 *                                 defaults to 100% wet
		 */
		Tone.Effect = function(){

			Tone.call(this);

			//get all of the defaults
			var options = this.optionsObject(arguments, ["wet"], Tone.Effect.defaults);

			/**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */
			this._dryWet = new Tone.CrossFade(options.wet);

			/**
			 *  The wet control, i.e. how much of the effected
			 *  will pass through to the output. 
			 *  @type {Tone.Signal}
			 */
			this.wet = this._dryWet.fade;

			/**
			 *  connect the effectSend to the input of hte effect
			 *  
			 *  @type {GainNode}
			 *  @private
			 */
			this.effectSend = this.context.createGain();

			/**
			 *  connect the output of the effect to the effectReturn
			 *  
			 *  @type {GainNode}
			 *  @private
			 */
			this.effectReturn = this.context.createGain();

			//connections
			this.input.connect(this._dryWet.a);
			this.input.connect(this.effectSend);
			this.effectReturn.connect(this._dryWet.b);
			this._dryWet.connect(this.output);
		};

		Tone.extend(Tone.Effect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.Effect.defaults = {
			"wet" : 1
		};

		/**
		 *  bypass the effect
		 *  @returns {Tone.Effect} `this`
		 */
		Tone.Effect.prototype.bypass = function(){
			this.wet.value = 0;
			return this;
		};

		/**
		 *  chains the effect in between the effectSend and effectReturn
		 *  @param  {Tone} effect
		 *  @private
		 *  @returns {Tone.Effect} `this`
		 */
		Tone.Effect.prototype.connectEffect = function(effect){
			this.effectSend.chain(effect, this.effectReturn);
			return this;
		};

		/**
		 *  tear down
		 *  @returns {Tone.Effect} `this`
		 */
		Tone.Effect.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._dryWet.dispose();
			this._dryWet = null;
			this.effectSend.disconnect();
			this.effectSend = null;
			this.effectReturn.disconnect();
			this.effectReturn = null;
			this.wet = null;
			return this;
		};

		return Tone.Effect;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class AutoPanner is a Tone.Panner with an LFO connected to the pan amount
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {number} [frequency=1] (optional) rate in HZ of the left-right pan
		 *  @example
		 *  var autoPanner = new Tone.AutoPanner("4n");
		 */
		Tone.AutoPanner = function(){

			var options = this.optionsObject(arguments, ["frequency"], Tone.AutoPanner.defaults);
			Tone.Effect.call(this, options);

			/**
			 *  the lfo which drives the panning
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._lfo = new Tone.LFO(options.frequency, 0, 1);

			/**
			 * The amount of panning between left and right. 
			 * 0 = always center. 1 = full range between left and right. 
			 * @type {Tone.Signal}
			 */
			this.amount = this._lfo.amplitude;

			/**
			 *  the panner node which does the panning
			 *  @type {Tone.Panner}
			 *  @private
			 */
			this._panner = new Tone.Panner();

			/**
			 * How fast the panner modulates
			 * @type {Tone.Signal}
			 */
			this.frequency = this._lfo.frequency;

			//connections
			this.connectEffect(this._panner);
			this._lfo.connect(this._panner.pan);
			this.type = options.type;
		};

		//extend Effect
		Tone.extend(Tone.AutoPanner, Tone.Effect);

		/**
		 *  defaults
		 *  @static
		 *  @type {Object}
		 */
		Tone.AutoPanner.defaults = {
			"frequency" : 1,
			"type" : "sine",
			"amount" : 1
		};
		
		/**
		 * Start the panner.
		 * @param {Tone.Time} [time=now] the panner begins.
		 * @returns {Tone.AutoPanner} `this`
		 */
		Tone.AutoPanner.prototype.start = function(time){
			this._lfo.start(time);
			return this;
		};

		/**
		 * Stop the panner.
		 * @param {Tone.Time} [time=now] the panner stops.
		 * @returns {Tone.AutoPanner} `this`
		 */
		Tone.AutoPanner.prototype.stop = function(time){
			this._lfo.stop(time);
			return this;
		};

		/**
		 * Sync the panner to the transport.
		 * @returns {Tone.AutoPanner} `this`
		 */
		Tone.AutoPanner.prototype.sync = function(){
			this._lfo.sync();
			return this;
		};

		/**
		 * Unsync the panner from the transport
		 * @returns {Tone.AutoPanner} `this`
		 */
		Tone.AutoPanner.prototype.unsync = function(){
			this._lfo.unsync();
			return this;
		};

		/**
		 * Type of oscillator attached to the AutoPanner.
		 * @memberOf Tone.AutoPanner#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.AutoPanner.prototype, "type", {
			get : function(){
				return this._lfo.type;
			},
			set : function(type){
				this._lfo.type = type;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.AutoPanner} `this`
		 */
		Tone.AutoPanner.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this._lfo.dispose();
			this._lfo = null;
			this._panner.dispose();
			this._panner = null;
			this.frequency = null;
			this.amount = null;
			return this;
		};

		return Tone.AutoPanner;
	});

	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  AutoWah connects an envelope follower to a bandpass filter.
		 *          Some inspiration from Tuna.js https://github.com/Dinahmoe/tuna
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {number} [baseFrequency=100] the frequency the filter is set 
		 *                                       to at the low point of the wah
		 *  @param {number} [octaves=5] the number of octaves above the baseFrequency
		 *                               the filter will sweep to when fully open
		 *  @param {number} [sensitivity=0] the decibel threshold sensitivity for 
		 *                                   the incoming signal. Normal range of -40 to 0. 
		 *  @example
		 *  var autoWah = new Tone.AutoWah(100, 6, -20);
		 */
		Tone.AutoWah = function(){

			var options = this.optionsObject(arguments, ["baseFrequency", "octaves", "sensitivity"], Tone.AutoWah.defaults);
			Tone.Effect.call(this, options);

			/**
			 *  the envelope follower
			 *  @type {Tone.Follower}
			 *  @private
			 */
			this.follower = new Tone.Follower(options.follower);

			/**
			 *  scales the follower value to the frequency domain
			 *  @type {Tone}
			 *  @private
			 */
			this._sweepRange = new Tone.ScaleExp(0, 1, 0.5);

			/**
			 *  @type {number}
			 *  @private
			 */
			this._baseFrequency = options.baseFrequency;

			/**
			 *  @type {number}
			 *  @private
			 */
			this._octaves = options.octaves;

			/**
			 *  the input gain to adjust the senstivity
			 *  @type {GainNode}
			 *  @private
			 */
			this._inputBoost = this.context.createGain();

			/**
			 *  @type {BiquadFilterNode}
			 *  @private
			 */
			this._bandpass = new Tone.Filter({
				"rolloff" : -48,
				"frequency" : 0,
				"Q" : options.Q,
			});
		
			/**
			 *  @type {Tone.Filter}
			 *  @private
			 */
			this._peaking = new Tone.Filter(0, "peaking");
			this._peaking.gain.value = options.gain;

			/**
			 * the gain of the filter.
			 * @type {Tone.Signal}
			 */
			this.gain = this._peaking.gain;

			/**
			 * The quality of the filter.
			 * @type {Tone.Signal}
			 */
			this.Q = this._bandpass.Q;

			//the control signal path
			this.effectSend.chain(this._inputBoost, this.follower, this._sweepRange);
			this._sweepRange.connect(this._bandpass.frequency);
			this._sweepRange.connect(this._peaking.frequency);
			//the filtered path
			this.effectSend.chain(this._bandpass, this._peaking, this.effectReturn);
			//set the initial value
			this._setSweepRange();
			this.sensitivity = options.sensitivity;
		};

		Tone.extend(Tone.AutoWah, Tone.Effect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.AutoWah.defaults = {
			"baseFrequency" : 100,
			"octaves" : 6,
			"sensitivity" : 0,
			"Q" : 2,
			"gain" : 2,
			"follower" : {
				"attack" : 0.3,
				"release" : 0.5
			}
		};

		/**
		 * The number of octaves that the filter will sweep.
		 * @memberOf Tone.AutoWah#
		 * @type {number}
		 * @name octaves
		 */
		Object.defineProperty(Tone.AutoWah.prototype, "octaves", {
			get : function(){
				return this._octaves;
			}, 
			set : function(octaves){
				this._octaves = octaves;
				this._setSweepRange();
			}
		});

		/**
		 * The base frequency from which the sweep will start from.
		 * @memberOf Tone.AutoWah#
		 * @type {Tone.Frequency}
		 * @name baseFrequency
		 */
		Object.defineProperty(Tone.AutoWah.prototype, "baseFrequency", {
			get : function(){
				return this._baseFrequency;
			}, 
			set : function(baseFreq){
				this._baseFrequency = baseFreq;
				this._setSweepRange();
			}
		});

		/**
		 * The sensitivity to control how responsive to the input signal the filter is. 
		 * in Decibels. 
		 * @memberOf Tone.AutoWah#
		 * @type {number}
		 * @name sensitivity
		 */
		Object.defineProperty(Tone.AutoWah.prototype, "sensitivity", {
			get : function(){
				return this.gainToDb(1 / this._inputBoost.gain.value);
			}, 
			set : function(sensitivy){
				this._inputBoost.gain.value = 1 / this.dbToGain(sensitivy);
			}
		});

		/**
		 *  sets the sweep range of the scaler
		 *  @private
		 */
		Tone.AutoWah.prototype._setSweepRange = function(){
			this._sweepRange.min = this._baseFrequency;
			this._sweepRange.max = Math.min(this._baseFrequency * Math.pow(2, this._octaves), this.context.sampleRate / 2);
		};

		/**
		 *  clean up
		 *  @returns {Tone.AutoWah} `this`
		 */
		Tone.AutoWah.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this.follower.dispose();
			this.follower = null;
			this._sweepRange.dispose();
			this._sweepRange = null;
			this._bandpass.dispose();
			this._bandpass = null;
			this._peaking.dispose();
			this._peaking = null;
			this._inputBoost.disconnect();
			this._inputBoost = null;
			this.gain = null;
			this.Q = null;
			return this;
		};

		return Tone.AutoWah;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Downsample incoming signal to a different bitdepth. 
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {number} bits 1-8. 
		 *  @example
		 *  var crusher = new Tone.BitCrusher(4);
		 */
		Tone.BitCrusher = function(){

			var options = this.optionsObject(arguments, ["bits"], Tone.BitCrusher.defaults);
			Tone.Effect.call(this, options);

			var invStepSize = 1 / Math.pow(2, options.bits - 1);

			/**
			 *  Subtract the input signal and the modulus of the input signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */
			this._subtract = new Tone.Subtract();

			/**
			 *  The mod function
			 *  @type  {Tone.Modulo}
			 *  @private
			 */
			this._modulo = new Tone.Modulo(invStepSize);

			/**
			 *  keeps track of the bits
			 *  @type {number}
			 *  @private
			 */
			this._bits = options.bits;

			//connect it up
			this.effectSend.fan(this._subtract, this._modulo);
			this._modulo.connect(this._subtract, 0, 1);
			this._subtract.connect(this.effectReturn);
		};

		Tone.extend(Tone.BitCrusher, Tone.Effect);

		/**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */
		Tone.BitCrusher.defaults = {
			"bits" : 4
		};

		/**
		 * The bit depth of the BitCrusher
		 * @memberOf Tone.BitCrusher#
		 * @type {number}
		 * @name bits
		 */
		Object.defineProperty(Tone.BitCrusher.prototype, "bits", {
			get : function(){
				return this._bits;
			},
			set : function(bits){
				this._bits = bits;
				var invStepSize = 1 / Math.pow(2, bits - 1);
				this._modulo.value = invStepSize;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.BitCrusher} `this`
		 */
		Tone.BitCrusher.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this._subtract.dispose();
			this._subtract = null;
			this._modulo.dispose();
			this._modulo = null;
			return this;
		}; 

		return Tone.BitCrusher;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A Chebyshev waveshaper. Good for making different types of distortion sounds.
		 *         Note that odd orders sound very different from even ones. order = 1 is no change. 
		 *         http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {number} order The order of the chebyshev polynomial. Normal range between 1-100. 
		 *  @example
		 *  var cheby = new Tone.Chebyshev(50);
		 */
		Tone.Chebyshev = function(){

			var options = this.optionsObject(arguments, ["order"], Tone.Chebyshev.defaults);
			Tone.Effect.call(this);

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._shaper = new Tone.WaveShaper(4096);

			/**
			 * holds onto the order of the filter
			 * @type {number}
			 * @private
			 */
			this._order = options.order;

			this.connectEffect(this._shaper);
			this.order = options.order;
			this.oversample = options.oversample;
		};

		Tone.extend(Tone.Chebyshev, Tone.Effect);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Chebyshev.defaults = {
			"order" : 1,
			"oversample" : "none"
		};
		
		/**
		 *  get the coefficient for that degree
		 *  @param {number} x the x value
		 *  @param   {number} degree 
		 *  @param {Object} memo memoize the computed value. 
		 *                       this speeds up computation greatly. 
		 *  @return  {number}       the coefficient 
		 *  @private
		 */
		Tone.Chebyshev.prototype._getCoefficient = function(x, degree, memo){
			if (memo.hasOwnProperty(degree)){
				return memo[degree];
			} else if (degree === 0){
				memo[degree] = 0;
			} else if (degree === 1){
				memo[degree] = x;
			} else {
				memo[degree] = 2 * x * this._getCoefficient(x, degree - 1, memo) - this._getCoefficient(x, degree - 2, memo);
			}
			return memo[degree];
		};

		/**
		 * The order of the Chebyshev polynomial i.e.
		 * order = 2 -> 2x^2 + 1. order = 3 -> 4x^3 + 3x. 
		 * @memberOf Tone.Chebyshev#
		 * @type {number}
		 * @name order
		 */
		Object.defineProperty(Tone.Chebyshev.prototype, "order", {
			get : function(){
				return this._order;
			},
			set : function(order){
				this._order = order;
				var curve = new Array(4096);
				var len = curve.length;
				for (var i = 0; i < len; ++i) {
					var x = i * 2 / len - 1;
					if (x === 0){
						//should output 0 when input is 0
						curve[i] = 0;
					} else {
						curve[i] = this._getCoefficient(x, order, {});
					}
				}
				this._shaper.curve = curve;
			} 
		});

		/**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Chebyshev#
		 * @type {string}
		 * @name oversample
		 */
		Object.defineProperty(Tone.Chebyshev.prototype, "oversample", {
			get : function(){
				return this._shaper.oversample;
			},
			set : function(oversampling){
				this._shaper.oversample = oversampling;
			} 
		});


		/**
		 *  clean up
		 *  @returns {Tone.Chebyshev} `this`
		 */
		Tone.Chebyshev.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this._shaper.dispose();
			this._shaper = null;
			return this;
		};

		return Tone.Chebyshev;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Creates an effect with an effectSendL/R and effectReturnL/R
		 *
		 *	@constructor
		 *	@extends {Tone.Effect}
		 */
		Tone.StereoEffect = function(){

			Tone.call(this);
			//get the defaults
			var options = this.optionsObject(arguments, ["wet"], Tone.Effect.defaults);

			/**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */
			this._dryWet = new Tone.CrossFade(options.wet);

			/**
			 *  The wet control, i.e. how much of the effected
			 *  will pass through to the output. 
			 *  @type {Tone.Signal}
			 */
			this.wet = this._dryWet.fade;

			/**
			 *  then split it
			 *  @type {Tone.Split}
			 *  @private
			 */
			this._split = new Tone.Split();

			/**
			 *  the effects send LEFT
			 *  @type {GainNode}
			 *  @private
			 */
			this.effectSendL = this._split.left;

			/**
			 *  the effects send RIGHT
			 *  @type {GainNode}
			 *  @private
			 */
			this.effectSendR = this._split.right;

			/**
			 *  the stereo effect merger
			 *  @type {Tone.Merge}
			 *  @private
			 */
			this._merge = new Tone.Merge();

			/**
			 *  the effect return LEFT
			 *  @type {GainNode}
			 */
			this.effectReturnL = this._merge.left;

			/**
			 *  the effect return RIGHT
			 *  @type {GainNode}
			 */
			this.effectReturnR = this._merge.right;

			//connections
			this.input.connect(this._split);
			//dry wet connections
			this.input.connect(this._dryWet, 0, 0);
			this._merge.connect(this._dryWet, 0, 1);
			this._dryWet.connect(this.output);
		};

		Tone.extend(Tone.StereoEffect, Tone.Effect);

		/**
		 *  clean up
		 *  @returns {Tone.StereoEffect} `this`
		 */
		Tone.StereoEffect.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._dryWet.dispose();
			this._dryWet = null;
			this._split.dispose();
			this._split = null;
			this._merge.dispose();
			this._merge = null;
			this.effectSendL = null;
			this.effectSendR = null;
			this.effectReturnL = null;
			this.effectReturnR = null;
			this.wet = null;
			return this;
		};

		return Tone.StereoEffect;
	});
	ToneModule( function(Tone){

		
		
		/**
		 * 	@class  Feedback Effect (a sound loop between an audio source and its own output)
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {number|Object} [initialFeedback=0.125] the initial feedback value
		 */
		Tone.FeedbackEffect = function(){

			var options = this.optionsObject(arguments, ["feedback"]);
			options = this.defaultArg(options, Tone.FeedbackEffect.defaults);

			Tone.Effect.call(this, options);

			/**
			 *  controls the amount of feedback
			 *  @type {Tone.Signal}
			 */
			this.feedback = new Tone.Signal(options.feedback, Tone.Signal.Units.Normal);
			
			/**
			 *  the gain which controls the feedback
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedbackGain = this.context.createGain();

			//the feedback loop
			this.effectReturn.chain(this._feedbackGain, this.effectSend);
			this.feedback.connect(this._feedbackGain.gain);
		};

		Tone.extend(Tone.FeedbackEffect, Tone.Effect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.FeedbackEffect.defaults = {
			"feedback" : 0.125
		};

		/**
		 *  clean up
		 *  @returns {Tone.FeedbackEffect} `this`
		 */
		Tone.FeedbackEffect.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this.feedback.dispose();
			this.feedback = null;
			this._feedbackGain.disconnect();
			this._feedbackGain = null;
			return this;
		};

		return Tone.FeedbackEffect;
	});

	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Just like a stereo feedback effect, but the feedback is routed from left to right
		 *         and right to left instead of on the same channel.
		 *
		 *	@constructor
		 *	@extends {Tone.FeedbackEffect}
		 */
		Tone.StereoXFeedbackEffect = function(){

			var options = this.optionsObject(arguments, ["feedback"], Tone.FeedbackEffect.defaults);
			Tone.StereoEffect.call(this, options);

			/**
			 *  controls the amount of feedback
			 *  @type {Tone.Signal}
			 */
			this.feedback = new Tone.Signal(options.feedback);

			/**
			 *  the left side feeback
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedbackLR = this.context.createGain();

			/**
			 *  the right side feeback
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedbackRL = this.context.createGain();

			//connect it up
			this.effectReturnL.chain(this._feedbackLR, this.effectSendR);
			this.effectReturnR.chain(this._feedbackRL, this.effectSendL);
			this.feedback.fan(this._feedbackLR.gain, this._feedbackRL.gain);
		};

		Tone.extend(Tone.StereoXFeedbackEffect, Tone.FeedbackEffect);

		/**
		 *  clean up
		 *  @returns {Tone.StereoXFeedbackEffect} `this`
		 */
		Tone.StereoXFeedbackEffect.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			this.feedback.dispose();
			this.feedback = null;
			this._feedbackLR.disconnect();
			this._feedbackLR = null;
			this._feedbackRL.disconnect();
			this._feedbackRL = null;
			return this;
		};

		return Tone.StereoXFeedbackEffect;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class A Chorus effect with feedback. inspiration from https://github.com/Dinahmoe/tuna/blob/master/tuna.js
		 *
		 *	@constructor
		 *	@extends {Tone.StereoXFeedbackEffect}
		 *	@param {number|Object} [frequency=2] the frequency of the effect
		 *	@param {number} [delayTime=3.5] the delay of the chorus effect in ms
		 *	@param {number} [depth=0.7] the depth of the chorus
		 *	@example
		 * 	var chorus = new Tone.Chorus(4, 2.5, 0.5);
		 */
		Tone.Chorus = function(){

			var options = this.optionsObject(arguments, ["frequency", "delayTime", "depth"], Tone.Chorus.defaults);
			Tone.StereoXFeedbackEffect.call(this, options);

			/**
			 *  the depth of the chorus
			 *  @type {number}
			 *  @private
			 */
			this._depth = options.depth;

			/**
			 *  the delayTime
			 *  @type {number}
			 *  @private
			 */
			this._delayTime = options.delayTime / 1000;

			/**
			 *  the lfo which controls the delayTime
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._lfoL = new Tone.LFO(options.rate, 0, 1);

			/**
			 *  another LFO for the right side with a 180 degree phase diff
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._lfoR = new Tone.LFO(options.rate, 0, 1);
			this._lfoR.phase = 180;

			/**
			 *  delay for left
			 *  @type {DelayNode}
			 *  @private
			 */
			this._delayNodeL = this.context.createDelay();

			/**
			 *  delay for right
			 *  @type {DelayNode}
			 *  @private
			 */
			this._delayNodeR = this.context.createDelay();

			/**
			 * The frequency the chorus will modulate at. 
			 * @type {Tone.Signal}
			 */
			this.frequency = this._lfoL.frequency;

			//connections
			this.connectSeries(this.effectSendL, this._delayNodeL, this.effectReturnL);
			this.connectSeries(this.effectSendR, this._delayNodeR, this.effectReturnR);
			//and pass through
			this.effectSendL.connect(this.effectReturnL);
			this.effectSendR.connect(this.effectReturnR);
			//lfo setup
			this._lfoL.connect(this._delayNodeL.delayTime);
			this._lfoR.connect(this._delayNodeR.delayTime);
			//start the lfo
			this._lfoL.start();
			this._lfoR.start();
			//have one LFO frequency control the other
			this._lfoL.frequency.connect(this._lfoR.frequency);
			//set the initial values
			this.depth = this._depth;
			this.frequency.value = options.frequency;
			this.type = options.type;
		};

		Tone.extend(Tone.Chorus, Tone.StereoXFeedbackEffect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.Chorus.defaults = {
			"frequency" : 1.5, 
			"delayTime" : 3.5,
			"depth" : 0.7,
			"feedback" : 0.1,
			"type" : "sine"
		};

		/**
		 * The depth of the effect. 
		 * @memberOf Tone.Chorus#
		 * @type {number}
		 * @name depth
		 */
		Object.defineProperty(Tone.Chorus.prototype, "depth", {
			get : function(){
				return this._depth;
			},
			set : function(depth){
				this._depth = depth;
				var deviation = this._delayTime * depth;
				this._lfoL.min = this._delayTime - deviation;
				this._lfoL.max = this._delayTime + deviation;
				this._lfoR.min = this._delayTime - deviation;
				this._lfoR.max = this._delayTime + deviation;
			}
		});

		/**
		 * The delayTime in milliseconds
		 * @memberOf Tone.Chorus#
		 * @type {number}
		 * @name delayTime
		 */
		Object.defineProperty(Tone.Chorus.prototype, "delayTime", {
			get : function(){
				return this._delayTime * 1000;
			},
			set : function(delayTime){
				this._delayTime = delayTime / 1000;
				this.depth = this._depth;
			}
		});

		/**
		 * The lfo type for the chorus. 
		 * @memberOf Tone.Chorus#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.Chorus.prototype, "type", {
			get : function(){
				return this._lfoL.type;
			},
			set : function(type){
				this._lfoL.type = type;
				this._lfoR.type = type;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.Chorus} `this`
		 */
		Tone.Chorus.prototype.dispose = function(){
			Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
			this._lfoL.dispose();
			this._lfoL = null;
			this._lfoR.dispose();
			this._lfoR = null;
			this._delayNodeL.disconnect();
			this._delayNodeL = null;
			this._delayNodeR.disconnect();
			this._delayNodeR = null;
			this.frequency = null;
			return this;
		};

		return Tone.Chorus;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Convolver wrapper for reverb and emulation.
		 *  
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {string|AudioBuffer=} url
		 *  @example
		 *  var convolver = new Tone.Convolver("./path/to/ir.wav");
		 */
		Tone.Convolver = function(url){

			Tone.Effect.apply(this, arguments);

		  	/**
			 *  convolver node
			 *  @type {ConvolverNode}
			 *  @private
			 */
			this._convolver = this.context.createConvolver();

			/**
			 *  the convolution buffer
			 *  @type {Tone.Buffer}
			 *  @private
			 */
			this._buffer = new Tone.Buffer(url, function(buffer){
				this.buffer = buffer;
			}.bind(this));

			this.connectEffect(this._convolver);
		};

		Tone.extend(Tone.Convolver, Tone.Effect);

		/**
		 *  The convolver's buffer
		 *  @memberOf Tone.Convolver#
		 *  @type {AudioBuffer}
		 *  @name buffer
		 */
		Object.defineProperty(Tone.Convolver.prototype, "buffer", {
			get : function(){
				return this._buffer.get();
			},
			set : function(buffer){
				this._buffer.set(buffer);
				this._convolver.buffer = buffer;
			}
		});

		/**
		 *  Load an impulse response url as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url the url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param  {function=} callback
		 *  @returns {Tone.Convolver} `this`
		 */
		Tone.Convolver.prototype.load = function(url, callback){
			this._buffer.load(url, function(buff){
				this.buffer = buff;
				if (callback){
					callback();
				}
			}.bind(this));
			return this;
		};

		/**
		 *  dispose and disconnect
		 *  @returns {Tone.Convolver} `this`
		 */
		Tone.Convolver.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this._convolver.disconnect();
			this._convolver = null;
			this._buffer.dispose();
			this._buffer = null;
			return this;
		}; 

		return Tone.Convolver;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class A simple distortion effect using the waveshaper node
		 *         algorithm from http://stackoverflow.com/a/22313408
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {number} distortion the amount of distortion (nominal range of 0-1)
		 *  @example
		 *  var dist = new Tone.Distortion(0.8);
		 */
		Tone.Distortion = function(){

			var options = this.optionsObject(arguments, ["distortion"], Tone.Distortion.defaults);

			Tone.Effect.call(this);

			/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._shaper = new Tone.WaveShaper(4096);

			/**
			 * holds the distortion amount
			 * @type {number}
			 * @private
			 */
			this._distortion = options.distortion;

			this.connectEffect(this._shaper);
			this.distortion = options.distortion;
			this.oversample = options.oversample;
		};

		Tone.extend(Tone.Distortion, Tone.Effect);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Distortion.defaults = {
			"distortion" : 0.4,
			"oversample" : "none"
		};

		/**
		 * The amount of distortion. Range between 0-1. 
		 * @memberOf Tone.Distortion#
		 * @type {number}
		 * @name distortion
		 */
		Object.defineProperty(Tone.Distortion.prototype, "distortion", {
			get : function(){
				return this._distortion;
			},
			set : function(amount){
				this._distortion = amount;
				var k = amount * 100;
				var deg = Math.PI / 180;
				this._shaper.setMap(function(x){
					if (Math.abs(x) < 0.001){
						//should output 0 when input is 0
						return 0;
					} else {
						return ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
					}
				});
			} 
		});

		/**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Distortion#
		 * @type {string}
		 * @name oversample
		 */
		Object.defineProperty(Tone.Distortion.prototype, "oversample", {
			get : function(){
				return this._shaper.oversample;
			},
			set : function(oversampling){
				this._shaper.oversample = oversampling;
			} 
		});

		/**
		 *  clean up
		 *  @returns {Tone.Distortion} `this`
		 */
		Tone.Distortion.prototype.dispose = function(){
			Tone.Effect.prototype.dispose.call(this);
			this._shaper.dispose();
			this._shaper = null;
			return this;
		};

		return Tone.Distortion;
	});
	ToneModule( function(Tone){

		
		
		/**
		 *  @class  A feedback delay
		 *
		 *  @constructor
		 *  @extends {Tone.FeedbackEffect}
		 *  @param {Tone.Time} [delayTime=0.25] The delay time in seconds. 
		 *  @param {number=} feedback The amount of the effected signal which 
		 *                            is fed back through the delay.
		 *  @example
		 *  var feedbackDelay = new Tone.FeedbackDelay("8n", 0.25);
		 */
		Tone.FeedbackDelay = function(){
			
			var options = this.optionsObject(arguments, ["delayTime", "feedback"], Tone.FeedbackDelay.defaults);
			Tone.FeedbackEffect.call(this, options);

			/**
			 *  Tone.Signal to control the delay amount
			 *  @type {Tone.Signal}
			 */
			this.delayTime = new Tone.Signal(options.delayTime, Tone.Signal.Units.Time);

			/**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */
			this._delayNode = this.context.createDelay(4);

			// connect it up
			this.connectEffect(this._delayNode);
			this.delayTime.connect(this._delayNode.delayTime);
		};

		Tone.extend(Tone.FeedbackDelay, Tone.FeedbackEffect);

		/**
		 *  The default values. 
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.FeedbackDelay.defaults = {
			"delayTime" : 0.25,
		};
		
		/**
		 *  clean up
		 *  @returns {Tone.FeedbackDelay} `this`
		 */
		Tone.FeedbackDelay.prototype.dispose = function(){
			Tone.FeedbackEffect.prototype.dispose.call(this);
			this.delayTime.dispose();
			this._delayNode.disconnect();
			this._delayNode = null;
			this.delayTime = null;
			return this;
		};

		return Tone.FeedbackDelay;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  an array of comb filter delay values from Freeverb implementation
		 *  @static
		 *  @private
		 *  @type {Array}
		 */
		var combFilterTunings = [1557 / 44100, 1617 / 44100, 1491 / 44100, 1422 / 44100, 1277 / 44100, 1356 / 44100, 1188 / 44100, 1116 / 44100];

		/**
		 *  an array of allpass filter frequency values from Freeverb implementation
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
		var allpassFilterFrequencies = [225, 556, 441, 341];

		/**
		 *  @class Reverb based on the Freeverb
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {number} [roomSize=0.7] correlated to the decay time. 
		 *                                 value between (0,1)
		 *  @param {number} [dampening=0.5] filtering which is applied to the reverb. 
		 *                                  value between [0,1]
		 *  @example
		 *  var freeverb = new Tone.Freeverb(0.4, 0.2);
		 */
		Tone.Freeverb = function(){

			var options = this.optionsObject(arguments, ["roomSize", "dampening"], Tone.Freeverb.defaults);
			Tone.StereoEffect.call(this, options);

			/**
			 *  the roomSize value between (0,1)
			 *  @type {Tone.Signal}
			 */
			this.roomSize = new Tone.Signal(options.roomSize);

			/**
			 *  the amount of dampening
			 *  value between [0,1]
			 *  @type {Tone.Signal}
			 */
			this.dampening = new Tone.Signal(options.dampening);

			/**
			 *  scale the dampening
			 *  @type {Tone.ScaleExp}
			 *  @private
			 */
			this._dampeningScale = new Tone.ScaleExp(100, 8000, 0.5);

			/**
			 *  the comb filters
			 *  @type {Array.<Tone.LowpassCombFilter>}
			 *  @private
			 */
			this._combFilters = [];

			/**
			 *  the allpass filters on the left
			 *  @type {Array.<BiqaudFilterNode>}
			 *  @private
			 */
			this._allpassFiltersL = [];

			/**
			 *  the allpass filters on the right
			 *  @type {Array.<BiqaudFilterNode>}
			 *  @private
			 */
			this._allpassFiltersR = [];

			//make the allpass filters on teh right
			for (var l = 0; l < allpassFilterFrequencies.length; l++){
				var allpassL = this.context.createBiquadFilter();
				allpassL.type = "allpass";
				allpassL.frequency.value = allpassFilterFrequencies[l];
				this._allpassFiltersL.push(allpassL);
			}

			//make the allpass filters on the left
			for (var r = 0; r < allpassFilterFrequencies.length; r++){
				var allpassR = this.context.createBiquadFilter();
				allpassR.type = "allpass";
				allpassR.frequency.value = allpassFilterFrequencies[r];
				this._allpassFiltersR.push(allpassR);
			}

			//make the comb filters
			for (var c = 0; c < combFilterTunings.length; c++){
				var lfpf = new Tone.LowpassCombFilter(combFilterTunings[c]);
				if (c < combFilterTunings.length / 2){
					this.effectSendL.chain(lfpf, this._allpassFiltersL[0]);
				} else {
					this.effectSendR.chain(lfpf, this._allpassFiltersR[0]);
				}
				this.roomSize.connect(lfpf.resonance);
				this._dampeningScale.connect(lfpf.dampening);
				this._combFilters.push(lfpf);
			}

			//chain the allpass filters togetehr
			this.connectSeries.apply(this, this._allpassFiltersL);
			this.connectSeries.apply(this, this._allpassFiltersR);
			this._allpassFiltersL[this._allpassFiltersL.length - 1].connect(this.effectReturnL);
			this._allpassFiltersR[this._allpassFiltersR.length - 1].connect(this.effectReturnR);
			this.dampening.connect(this._dampeningScale);
		};

		Tone.extend(Tone.Freeverb, Tone.StereoEffect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.Freeverb.defaults = {
			"roomSize" : 0.7, 
			"dampening" : 0.5
		};

		/**
		 *  clean up
		 *  @returns {Tone.Freeverb} `this`
		 */
		Tone.Freeverb.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			for (var al = 0; al < this._allpassFiltersL.length; al++) {
				this._allpassFiltersL[al].disconnect();
				this._allpassFiltersL[al] = null;
			}
			this._allpassFiltersL = null;
			for (var ar = 0; ar < this._allpassFiltersR.length; ar++) {
				this._allpassFiltersR[ar].disconnect();
				this._allpassFiltersR[ar] = null;
			}
			this._allpassFiltersR = null;
			for (var cf = 0; cf < this._combFilters.length; cf++) {
				this._combFilters[cf].dispose();
				this._combFilters[cf] = null;
			}
			this._combFilters = null;
			this.roomSize.dispose();
			this.dampening.dispose();
			this._dampeningScale.dispose();
			this.roomSize = null;
			this.dampening = null;
			this._dampeningScale = null;
			return this;
		};

		return Tone.Freeverb;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  an array of the comb filter delay time values
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
		var combFilterDelayTimes = [1687 / 25000, 1601 / 25000, 2053 / 25000, 2251 / 25000];

		/**
		 *  the resonances of each of the comb filters
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
		var combFilterResonances = [0.773, 0.802, 0.753, 0.733];

		/**
		 *  the allpass filter frequencies
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
		var allpassFilterFreqs = [347, 113, 37];

		/**
		 *  @class a simple Schroeder Reverberators tuned by John Chowning in 1970
		 *         made up of 3 allpass filters and 4 feedback comb filters. 
		 *         https://ccrma.stanford.edu/~jos/pasp/Schroeder_Reverberators.html
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {number} roomSize Coorelates to the decay time. Value between 0,1
		 *  @example
		 *  var freeverb = new Tone.Freeverb(0.4);
		 */
		Tone.JCReverb = function(){

			var options = this.optionsObject(arguments, ["roomSize"], Tone.JCReverb.defaults);
			Tone.StereoEffect.call(this, options);

			/**
			 *  room size control values between [0,1]
			 *  @type {Tone.Signal}
			 */
			this.roomSize = new Tone.Signal(options.roomSize, Tone.Signal.Units.Normal);

			/**
			 *  scale the room size
			 *  @type {Tone.Scale}
			 *  @private
			 */
			this._scaleRoomSize = new Tone.Scale(-0.733, 0.197);

			/**
			 *  a series of allpass filters
			 *  @type {Array.<BiquadFilterNode>}
			 *  @private
			 */
			this._allpassFilters = [];

			/**
			 *  parallel feedback comb filters
			 *  @type {Array.<Tone.FeedbackCombFilter>}
			 *  @private
			 */
			this._feedbackCombFilters = [];

			//make the allpass filters
			for (var af = 0; af < allpassFilterFreqs.length; af++) {
				var allpass = this.context.createBiquadFilter();
				allpass.type = "allpass";
				allpass.frequency.value = allpassFilterFreqs[af];
				this._allpassFilters.push(allpass);
			}

			//and the comb filters
			for (var cf = 0; cf < combFilterDelayTimes.length; cf++) {
				var fbcf = new Tone.FeedbackCombFilter(combFilterDelayTimes[cf], 0.1);
				this._scaleRoomSize.connect(fbcf.resonance);
				fbcf.resonance.value = combFilterResonances[cf];
				this._allpassFilters[this._allpassFilters.length - 1].connect(fbcf);
				if (cf < combFilterDelayTimes.length / 2){
					fbcf.connect(this.effectReturnL);
				} else {
					fbcf.connect(this.effectReturnR);
				}
				this._feedbackCombFilters.push(fbcf);
			}

			//chain the allpass filters together
			this.roomSize.connect(this._scaleRoomSize);
			this.connectSeries.apply(this, this._allpassFilters);
			this.effectSendL.connect(this._allpassFilters[0]);
			this.effectSendR.connect(this._allpassFilters[0]);
		};

		Tone.extend(Tone.JCReverb, Tone.StereoEffect);

		/**
		 *  the default values
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.JCReverb.defaults = {
			"roomSize" : 0.5
		};

		/**
		 *  clean up
		 *  @returns {Tone.JCReverb} `this`
		 */
		Tone.JCReverb.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			for (var apf = 0; apf < this._allpassFilters.length; apf++) {
				this._allpassFilters[apf].disconnect();
				this._allpassFilters[apf] = null;
			}
			this._allpassFilters = null;
			for (var fbcf = 0; fbcf < this._feedbackCombFilters.length; fbcf++) {
				this._feedbackCombFilters[fbcf].dispose();
				this._feedbackCombFilters[fbcf] = null;
			}
			this._feedbackCombFilters = null;
			this.roomSize.dispose();
			this.roomSize = null;
			this._scaleRoomSize.dispose();
			this._scaleRoomSize = null;
			return this;
		};

		return Tone.JCReverb;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Applies a Mid/Side seperation and recombination
		 *         http://musicdsp.org/showArchiveComment.php?ArchiveID=173
		 *         http://www.kvraudio.com/forum/viewtopic.php?t=212587
		 *         M = (L+R)/sqrt(2);   // obtain mid-signal from left and right
		 *         S = (L-R)/sqrt(2);   // obtain side-signal from left and righ
		 *         // amplify mid and side signal seperately:
		 *         M/S send/return
		 *         L = (M+S)/sqrt(2);   // obtain left signal from mid and side
		 *         R = (M-S)/sqrt(2);   // obtain right signal from mid and side
		 *
		 *  @extends {Tone.StereoEffect}
		 *  @constructor
		 */
		Tone.MidSideEffect = function(){
			Tone.StereoEffect.call(this);

			/**
			 *  a constant signal equal to 1 / sqrt(2)
			 *  @type {Tone.Signal}
			 *  @private
			 */
			this._sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));

			/**
			 *  the mid send.
			 *  connect to mid processing
			 *  @type {Tone.Expr}
			 */
			this.midSend = new Tone.Expr("($0 + $1) * $2");

			/**
			 *  the side send.
			 *  connect to side processing
			 *  @type {Tone.Expr}
			 */
			this.sideSend = new Tone.Expr("($0 - $1) * $2");

			/**
			 *  recombine the mid/side into Left
			 *  @type {Tone.Expr}
			 *  @private
			 */
			this._left = new Tone.Expr("($0 + $1) * $2");

			/**
			 *  recombine the mid/side into Right
			 *  @type {Tone.Expr}
			 *  @private
			 */
			this._right = new Tone.Expr("($0 - $1) * $2");

			/**
			 *  the mid return connection
			 *  @type {GainNode}
			 */
			this.midReturn = this.context.createGain();

			/**
			 *  the side return connection
			 *  @type {GainNode}
			 */
			this.sideReturn = this.context.createGain();

			//connections
			this.effectSendL.connect(this.midSend, 0, 0);
			this.effectSendR.connect(this.midSend, 0, 1);
			this.effectSendL.connect(this.sideSend, 0, 0);
			this.effectSendR.connect(this.sideSend, 0, 1);
			this._left.connect(this.effectReturnL);
			this._right.connect(this.effectReturnR);
			this.midReturn.connect(this._left, 0, 0);
			this.sideReturn.connect(this._left, 0, 1);
			this.midReturn.connect(this._right, 0, 0);
			this.sideReturn.connect(this._right, 0, 1);
			this._sqrtTwo.connect(this.midSend, 0, 2);
			this._sqrtTwo.connect(this.sideSend, 0, 2);
			this._sqrtTwo.connect(this._left, 0, 2);
			this._sqrtTwo.connect(this._right, 0, 2);
		};

		Tone.extend(Tone.MidSideEffect, Tone.StereoEffect);

		/**
		 *  clean up
		 *  @returns {Tone.MidSideEffect} `this`
		 */
		Tone.MidSideEffect.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			this._sqrtTwo.dispose();
			this._sqrtTwo = null;
			this.midSend.dispose();
			this.midSend = null;
			this.sideSend.dispose();
			this.sideSend = null;
			this._left.dispose();
			this._left = null;
			this._right.dispose();
			this._right = null;
			this.midReturn.disconnect();
			this.midReturn = null;
			this.sideReturn.disconnect();
			this.sideReturn = null;
			return this;
		};

		return Tone.MidSideEffect;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class A Phaser effect. inspiration from https://github.com/Dinahmoe/tuna/
		 *
		 *	@extends {Tone.StereoEffect}
		 *	@constructor
		 *	@param {number|Object} [frequency=0.5] the speed of the phasing
		 *	@param {number} [depth=10] the depth of the effect
		 *	@param {number} [baseFrequency=400] the base frequency of the filters
		 *	@example
		 * 	var phaser = new Tone.Phaser(0.4, 12, 550);
		 */
		Tone.Phaser = function(){

			//set the defaults
			var options = this.optionsObject(arguments, ["frequency", "depth", "baseFrequency"], Tone.Phaser.defaults);
			Tone.StereoEffect.call(this, options);

			/**
			 *  the lfo which controls the frequency on the left side
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._lfoL = new Tone.LFO(options.frequency, 0, 1);

			/**
			 *  the lfo which controls the frequency on the right side
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._lfoR = new Tone.LFO(options.frequency, 0, 1);
			this._lfoR.phase = 180;

			/**
			 *  the base modulation frequency
			 *  @type {number}
			 *  @private
			 */
			this._baseFrequency = options.baseFrequency;

			/**
			 *  the depth of the phasing
			 *  @type {number}
			 *  @private
			 */
			this._depth = options.depth;
			
			/**
			 *  the array of filters for the left side
			 *  @type {Array.<Tone.Filter>}
			 *  @private
			 */
			this._filtersL = this._makeFilters(options.stages, this._lfoL, options.Q);

			/**
			 *  the array of filters for the left side
			 *  @type {Array.<Tone.Filter>}
			 *  @private
			 */
			this._filtersR = this._makeFilters(options.stages, this._lfoR, options.Q);

			/**
			 * the frequency of the effect
			 * @type {Tone.Signal}
			 */
			this.frequency = this._lfoL.frequency;
			this.frequency.value = options.frequency;
			
			//connect them up
			this.effectSendL.connect(this._filtersL[0]);
			this.effectSendR.connect(this._filtersR[0]);
			this._filtersL[options.stages - 1].connect(this.effectReturnL);
			this._filtersR[options.stages - 1].connect(this.effectReturnR);
			this.effectSendL.connect(this.effectReturnL);
			this.effectSendR.connect(this.effectReturnR);
			//control the frequency with one LFO
			this._lfoL.frequency.connect(this._lfoR.frequency);
			//set the options
			this.baseFrequency = options.baseFrequency;
			this.depth = options.depth;
			//start the lfo
			this._lfoL.start();
			this._lfoR.start();
		};

		Tone.extend(Tone.Phaser, Tone.StereoEffect);

		/**
		 *  defaults
		 *  @static
		 *  @type {object}
		 */
		Tone.Phaser.defaults = {
			"frequency" : 0.5,
			"depth" : 10,
			"stages" : 4,
			"Q" : 100,
			"baseFrequency" : 400,
		};

		/**
		 *  @param {number} stages
		 *  @returns {Array} the number of filters all connected together
		 *  @private
		 */
		Tone.Phaser.prototype._makeFilters = function(stages, connectToFreq, Q){
			var filters = new Array(stages);
			//make all the filters
			for (var i = 0; i < stages; i++){
				var filter = this.context.createBiquadFilter();
				filter.type = "allpass";
				filter.Q.value = Q;
				connectToFreq.connect(filter.frequency);
				filters[i] = filter;
			}
			this.connectSeries.apply(this, filters);
			return filters;
		};

		/**
		 * The depth of the effect. 
		 * @memberOf Tone.Phaser#
		 * @type {number}
		 * @name depth
		 */
		Object.defineProperty(Tone.Phaser.prototype, "depth", {
			get : function(){
				return this._depth;
			},
			set : function(depth){
				this._depth = depth;
				var max = this._baseFrequency + this._baseFrequency * depth;
				this._lfoL.max = max;
				this._lfoR.max = max;
			}
		});

		/**
		 * The the base frequency of the filters. 
		 * @memberOf Tone.Phaser#
		 * @type {string}
		 * @name baseFrequency
		 */
		Object.defineProperty(Tone.Phaser.prototype, "baseFrequency", {
			get : function(){
				return this._baseFrequency;
			},
			set : function(freq){
				this._baseFrequency = freq;	
				this._lfoL.min = freq;
				this._lfoR.min = freq;
				this.depth = this._depth;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.Phaser} `this`
		 */
		Tone.Phaser.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			this._lfoL.dispose();
			this._lfoL = null;
			this._lfoR.dispose();
			this._lfoR = null;
			for (var i = 0; i < this._filtersL.length; i++){
				this._filtersL[i].disconnect();
				this._filtersL[i] = null;
			}
			this._filtersL = null;
			for (var j = 0; j < this._filtersR.length; j++){
				this._filtersR[j].disconnect();
				this._filtersR[j] = null;
			}
			this._filtersR = null;
			this.frequency = null;
			return this;
		};

		return Tone.Phaser;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  PingPongDelay is a dual delay effect where the echo is heard
		 *          first in one channel and next in the opposite channel
		 *
		 * 	@constructor
		 * 	@extends {Tone.StereoXFeedbackEffect}
		 *  @param {Tone.Time|Object} [delayTime=0.25] is the interval between consecutive echos
		 *  @param {number=} feedback The amount of the effected signal which 
		 *                            is fed back through the delay.
		 *  @example
		 *  var pingPong = new Tone.PingPongDelay("4n", 0.2);
		 */
		Tone.PingPongDelay = function(){
			
			var options = this.optionsObject(arguments, ["delayTime", "feedback"], Tone.PingPongDelay.defaults);
			Tone.StereoXFeedbackEffect.call(this, options);

			/**
			 *  the delay node on the left side
			 *  @type {DelayNode}
			 *  @private
			 */
			this._leftDelay = this.context.createDelay(options.maxDelayTime);

			/**
			 *  the delay node on the right side
			 *  @type {DelayNode}
			 *  @private
			 */
			this._rightDelay = this.context.createDelay(options.maxDelayTime);

			/**
			 *  the predelay on the right side
			 *  @type {DelayNode}
			 *  @private
			 */
			this._rightPreDelay = this.context.createDelay(options.maxDelayTime);

			/**
			 *  the delay time signal
			 *  @type {Tone.Signal}
			 */
			this.delayTime = new Tone.Signal(options.delayTime, Tone.Signal.Units.Time);

			//connect it up
			this.effectSendL.chain(this._leftDelay, this.effectReturnL);
			this.effectSendR.chain(this._rightPreDelay, this._rightDelay, this.effectReturnR);
			this.delayTime.fan(this._leftDelay.delayTime, this._rightDelay.delayTime, this._rightPreDelay.delayTime);
			//rearranged the feedback to be after the rightPreDelay
			this._feedbackLR.disconnect();
			this._feedbackLR.connect(this._rightDelay);
		};

		Tone.extend(Tone.PingPongDelay, Tone.StereoXFeedbackEffect);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.PingPongDelay.defaults = {
			"delayTime" : 0.25,
			"maxDelayTime" : 1
		};

		/**
		 *  clean up
		 *  @returns {Tone.PingPongDelay} `this`
		 */
		Tone.PingPongDelay.prototype.dispose = function(){
			Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
			this._leftDelay.disconnect();
			this._leftDelay = null;
			this._rightDelay.disconnect();
			this._rightDelay = null;
			this._rightPreDelay.disconnect();
			this._rightPreDelay = null;
			this.delayTime.dispose();
			this.delayTime = null;
			return this;
		};

		return Tone.PingPongDelay;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class A stereo feedback effect where the feedback is on the same channel
		 *
		 *	@constructor
		 *	@extends {Tone.FeedbackEffect}
		 */
		Tone.StereoFeedbackEffect = function(){

			var options = this.optionsObject(arguments, ["feedback"], Tone.FeedbackEffect.defaults);
			Tone.StereoEffect.call(this, options);

			/**
			 *  controls the amount of feedback
			 *  @type {Tone.Signal}
			 */
			this.feedback = new Tone.Signal(options.feedback);

			/**
			 *  the left side feeback
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedbackL = this.context.createGain();

			/**
			 *  the right side feeback
			 *  @type {GainNode}
			 *  @private
			 */
			this._feedbackR = this.context.createGain();

			//connect it up
			this.effectReturnL.chain(this._feedbackL, this.effectSendL);
			this.effectReturnR.chain(this._feedbackR, this.effectSendR);
			this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain);
		};

		Tone.extend(Tone.StereoFeedbackEffect, Tone.FeedbackEffect);

		/**
		 *  clean up
		 *  @returns {Tone.StereoFeedbackEffect} `this`
		 */
		Tone.StereoFeedbackEffect.prototype.dispose = function(){
			Tone.StereoEffect.prototype.dispose.call(this);
			this.feedback.dispose();
			this.feedback = null;
			this._feedbackL.disconnect();
			this._feedbackL = null;
			this._feedbackR.disconnect();
			this._feedbackR = null;
			return this;
		};

		return Tone.StereoFeedbackEffect;
	});
	ToneModule( 
		function(Tone){

		

		/**
		 *  @class Applies a width factor (0-1) to the mid/side seperation. 
		 *         0 is all mid and 1 is all side. <br><br>
		 *         http://musicdsp.org/showArchiveComment.php?ArchiveID=173<br><br>
		 *         http://www.kvraudio.com/forum/viewtopic.php?t=212587<br><br>
		 *         M *= 2*(1-width)<br><br>
		 *         S *= 2*width<br><br>
		 *
		 *  @extends {Tone.MidSideEffect}
		 *  @constructor
		 *  @param {number|Object} [width=0.5] the stereo width. A width of 0 is mono and 1 is stereo. 0.5 is no change.
		 */
		Tone.StereoWidener = function(){

			var options = this.optionsObject(arguments, ["width"], Tone.StereoWidener.defaults);
			Tone.MidSideEffect.call(this, options);

			/**
			 *  The width control. 0 = 100% mid. 1 = 100% side. 
			 *  @type {Tone.Signal}
			 */
			this.width = new Tone.Signal(0.5, Tone.Signal.Units.Normal);

			/**
			 *  Mid multiplier
			 *  @type {Tone.Expr}
			 *  @private
			 */
			this._midMult = new Tone.Expr("$0 * ($1 * (1 - $2))");

			/**
			 *  Side multiplier
			 *  @type {Tone.Expr}
			 *  @private
			 */
			this._sideMult = new Tone.Expr("$0 * ($1 * $2)");

			/**
			 *  constant output of 2
			 *  @type {Tone}
			 *  @private
			 */
			this._two = new Tone.Signal(2);

			//the mid chain
			this._two.connect(this._midMult, 0, 1);
			this.width.connect(this._midMult, 0, 2);
			//the side chain
			this._two.connect(this._sideMult, 0, 1);
			this.width.connect(this._sideMult, 0, 2);
			//connect it to the effect send/return
			this.midSend.chain(this._midMult, this.midReturn);
			this.sideSend.chain(this._sideMult, this.sideReturn);
		};

		Tone.extend(Tone.StereoWidener, Tone.MidSideEffect);

		/**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */
		Tone.StereoWidener.defaults = {
			"width" : 0.5
		};

		/**
		 *  clean up
		 *  @returns {Tone.StereoWidener} `this`
		 */
		Tone.StereoWidener.prototype.dispose = function(){
			Tone.MidSideEffect.prototype.dispose.call(this);
			this.width.dispose();
			this.width = null;
			this._midMult.dispose();
			this._midMult = null;
			this._sideMult.dispose();
			this._sideMult = null;
			this._two.dispose();
			this._two = null;
			return this;
		};

		return Tone.StereoWidener;
	});
	ToneModule(
	function(Tone){

		

		/**
		 *  @class Pulse Oscillator with control over width
		 *
		 *  @constructor
		 *  @extends {Tone.Oscillator}
		 *  @param {number} [frequency=440] the frequency of the oscillator
		 *  @param {number} [width = 0.2] the width of the pulse
		 *  @example
		 *  var pulse = new Tone.PulseOscillator("E5", 0.4);
		 */
		Tone.PulseOscillator = function(){

			var options = this.optionsObject(arguments, ["frequency", "width"], Tone.Oscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the width of the pulse
			 *  @type {Tone.Signal}
			 */
			this.width = new Tone.Signal(options.width, Tone.Signal.Units.Normal);

			/**
			 *  gate the width amount
			 *  @type {GainNode}
			 *  @private
			 */
			this._widthGate = this.context.createGain();

			/**
			 *  the sawtooth oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._sawtooth = new Tone.Oscillator({
				frequency : options.frequency,
				detune : options.detune,
				type : "sawtooth",
				phase : options.phase
			});

			/**
			 *  The frequency in hertz
			 *  @type {Tone.Signal}
			 */
			this.frequency = this._sawtooth.frequency;

			/**
			 *  The detune in cents. 
			 *  @type {Tone.Signal}
			 */
			this.detune = this._sawtooth.detune;

			/**
			 *  Threshold the signal to turn it into a square
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._thresh = new Tone.WaveShaper(function(val){
				if (val < 0){
					return -1;
				} else {
					return 1;
				}
			});

			//connections
			this._sawtooth.chain(this._thresh, this.output);
			this.width.chain(this._widthGate, this._thresh);
		};

		Tone.extend(Tone.PulseOscillator, Tone.Oscillator);

		/**
		 *  The default parameters.
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.PulseOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"width" : 0.2,
		};

		/**
		 *  start the oscillator
		 *  @param  {Tone.Time} time 
		 *  @private
		 */
		Tone.PulseOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._sawtooth.start(time);
			this._widthGate.gain.setValueAtTime(1, time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Tone.Time} time 
		 *  @private
		 */
		Tone.PulseOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._sawtooth.stop(time);
			//the width is still connected to the output. 
			//that needs to be stopped also
			this._widthGate.gain.setValueAtTime(0, time);
		};

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PulseOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.PulseOscillator.prototype, "phase", {
			get : function(){
				return this._sawtooth.phase;
			}, 
			set : function(phase){
				this._sawtooth.phase = phase;
			}
		});

		/**
		 * The type of the oscillator. Always returns "pulse".
		 * @readOnly
		 * @memberOf Tone.PulseOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.PulseOscillator.prototype, "type", {
			get : function(){
				return "pulse";
			}
		});

		/**
		 *  Clean up method
		 *  @return {Tone.PulseOscillator} `this`
		 */
		Tone.PulseOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._sawtooth.dispose();
			this._sawtooth = null;
			this.width.dispose();
			this.width = null;
			this._widthGate.disconnect();
			this._widthGate = null;
			this._thresh.disconnect();
			this._thresh = null;
			this.frequency = null;
			this.detune = null;
			return this;
		};

		return Tone.PulseOscillator;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class takes an array of Oscillator descriptions and mixes them together
		 *         with the same detune and frequency controls. 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {frequency} frequency frequency of the oscillator (meaningless for noise types)
		 *  @param {number} modulationFrequency the modulation frequency of the oscillator
		 *  @example
		 *  var pwm = new Tone.PWMOscillator("Ab3", 0.3);
		 */
		Tone.PWMOscillator = function(){
			var options = this.optionsObject(arguments, ["frequency", "modulationFrequency"], Tone.PWMOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the pulse oscillator
			 */
			this._pulse = new Tone.PulseOscillator(options.modulationFrequency);
			//change the pulse oscillator type
			this._pulse._sawtooth.type = "sine";

			/**
			 *  the modulator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._modulator = new Tone.Oscillator({
				"frequency" : options.frequency,
				"detune" : options.detune
			});

			/**
			 *  Scale the oscillator so it doesn't go silent 
			 *  at the extreme values.
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = new Tone.Multiply(1.01);

			/**
			 *  the frequency control
			 *  @type {Tone.Signal}
			 */
			this.frequency = this._modulator.frequency;

			/**
			 *  the detune control
			 *  @type {Tone.Signal}
			 */
			this.detune = this._modulator.detune;

			/**
			 *  the modulation rate of the oscillator
			 *  @type {Tone.Signal}
			 */
			this.modulationFrequency = this._pulse.frequency;	

			//connections
			this._modulator.chain(this._scale, this._pulse.width);
			this._pulse.connect(this.output);
		};

		Tone.extend(Tone.PWMOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.PWMOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"modulationFrequency" : 0.4,
		};

		/**
		 *  start the oscillator
		 *  @param  {Tone.Time} [time=now]
		 *  @private
		 */
		Tone.PWMOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._modulator.start(time);
			this._pulse.start(time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Tone.Time} time (optional) timing parameter
		 *  @private
		 */
		Tone.PWMOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._modulator.stop(time);
			this._pulse.stop(time);
		};

		/**
		 * The type of the oscillator. Always returns "pwm".
		 * @readOnly
		 * @memberOf Tone.PWMOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.PWMOscillator.prototype, "type", {
			get : function(){
				return "pwm";
			}
		});

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PWMOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.PWMOscillator.prototype, "phase", {
			get : function(){
				return this._modulator.phase;
			}, 
			set : function(phase){
				this._modulator.phase = phase;
			}
		});

		/**
		 *  clean up
		 *  @return {Tone.PWMOscillator} `this`
		 */
		Tone.PWMOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._pulse.dispose();
			this._pulse = null;
			this._scale.dispose();
			this._scale = null;
			this._modulator.dispose();
			this._modulator = null;
			this.frequency = null;
			this.detune = null;
			this.modulationFrequency = null;
			return this;
		};

		return Tone.PWMOscillator;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator,
		 *         and Tone.PWMOscillator which allows it to have the types: 
		 *         sine, square, triangle, sawtooth, pulse or pwm. 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {frequency} frequency frequency of the oscillator (meaningless for noise types)
		 *  @param {string} type the type of the oscillator
		 *  @example
		 *  var omniOsc = new Tone.OmniOscillator("C#4", "pwm");
		 */
		Tone.OmniOscillator = function(){
			var options = this.optionsObject(arguments, ["frequency", "type"], Tone.OmniOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the frequency control
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Signal.Units.Frequency);

			/**
			 *  the detune control
			 *  @type {Tone.Signal}
			 */
			this.detune = new Tone.Signal(options.detune);

			/**
			 *  the type of the oscillator source
			 *  @type {string}
			 *  @private
			 */
			this._sourceType = undefined;

			/**
			 *  the oscillator
			 *  @type {Tone.Oscillator|Tone.PWMOscillator|Tone.PulseOscillator}
			 *  @private
			 */
			this._oscillator = null;

			//set the oscillator
			this.type = options.type;
		};

		Tone.extend(Tone.OmniOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.OmniOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"type" : "sine",
			"width" : 0.4, //only applies if the oscillator is set to "pulse",
			"modulationFrequency" : 0.4, //only applies if the oscillator is set to "pwm",
		};

		/**
		 *  @enum {string}
		 *  @private
		 */
		var OmniOscType = {
			PulseOscillator : "PulseOscillator",
			PWMOscillator : "PWMOscillator",
			Oscillator : "Oscillator"
		};

		/**
		 *  start the oscillator
		 *  @param {Tone.Time} [time=now] the time to start the oscillator
		 *  @private
		 */
		Tone.OmniOscillator.prototype._start = function(time){
			this._oscillator.start(time);
		};

		/**
		 *  start the oscillator
		 *  @param {Tone.Time} [time=now] the time to start the oscillator
		 *  @private
		 */
		Tone.OmniOscillator.prototype._stop = function(time){
			this._oscillator.stop(time);
		};

		/**
		 * The type of the oscillator. sine, square, triangle, sawtooth, pwm, or pulse. 
		 *  
		 * @memberOf Tone.OmniOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "type", {
			get : function(){
				return this._oscillator.type;
			}, 
			set : function(type){
				if (type === "sine" || type === "square" || type === "triangle" || type === "sawtooth"){
					if (this._sourceType !== OmniOscType.Oscillator){
						this._sourceType = OmniOscType.Oscillator;
						this._createNewOscillator(Tone.Oscillator);
					}
					this._oscillator.type = type;
				} else if (type === "pwm"){
					if (this._sourceType !== OmniOscType.PWMOscillator){
						this._sourceType = OmniOscType.PWMOscillator;
						this._createNewOscillator(Tone.PWMOscillator);
					}
				} else if (type === "pulse"){
					if (this._sourceType !== OmniOscType.PulseOscillator){
						this._sourceType = OmniOscType.PulseOscillator;
						this._createNewOscillator(Tone.PulseOscillator);
					}
				} else {
					throw new TypeError("Tone.OmniOscillator does not support type "+type);
				}
			}
		});

		/**
		 *  connect the oscillator to the frequency and detune signals
		 *  @private
		 */
		Tone.OmniOscillator.prototype._createNewOscillator = function(OscillatorConstructor){
			//short delay to avoid clicks on the change
			var now = this.now() + this.bufferTime;
			if (this._oscillator !== null){
				var oldOsc = this._oscillator;
				oldOsc.stop(now);
				oldOsc.onended = function(){
					oldOsc.dispose();
					oldOsc = null;
				};
			}
			this._oscillator = new OscillatorConstructor();
			this.frequency.connect(this._oscillator.frequency);
			this.detune.connect(this._oscillator.detune);
			this._oscillator.connect(this.output);
			if (this.state === Tone.Source.State.STARTED){
				this._oscillator.start(now);
			}
		};

		/**
		 * The phase of the oscillator in degrees
		 * @memberOf Tone.OmniOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "phase", {
			get : function(){
				return this._oscillator.phase;
			}, 
			set : function(phase){
				this._oscillator.phase = phase;
			}
		});

		/**
		 * The width of the oscillator (only if the oscillator is set to pulse)
		 * @memberOf Tone.OmniOscillator#
		 * @type {Tone.Signal}
		 * @name width
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pulse");
		 * //can access the width attribute only if type === "pulse"
		 * omniOsc.width.value = 0.2; 
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "width", {
			get : function(){
				if (this._sourceType === OmniOscType.PulseOscillator){
					return this._oscillator.width;
				} 
			}
		});

		/**
		 * The modulationFrequency Signal of the oscillator 
		 * (only if the oscillator type is set to pwm).
		 * @memberOf Tone.OmniOscillator#
		 * @type {Tone.Signal}
		 * @name modulationFrequency
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pwm");
		 * //can access the modulationFrequency attribute only if type === "pwm"
		 * omniOsc.modulationFrequency.value = 0.2; 
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "modulationFrequency", {
			get : function(){
				if (this._sourceType === OmniOscType.PWMOscillator){
					return this._oscillator.modulationFrequency;
				} 
			}
		});

		/**
		 *  clean up
		 *  @return {Tone.OmniOscillator} `this`
		 */
		Tone.OmniOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this.detune.dispose();
			this.detune = null;
			this.frequency.dispose();
			this.frequency = null;
			this._oscillator.dispose();
			this._oscillator = null;
			this._sourceType = null;
			return this;
		};

		return Tone.OmniOscillator;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  Base-class for all instruments
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 */
		Tone.Instrument = function(){

			/**
			 *  the output
			 *  @type {GainNode}
			 *  @private
			 */
			this.output = this.context.createGain();

			/**
			 * the volume of the output in decibels
			 * @type {Tone.Signal}
			 */
			this.volume = new Tone.Signal(this.output.gain, Tone.Signal.Units.Decibels);
		};

		Tone.extend(Tone.Instrument);

		/**
		 *  @abstract
		 *  @param {string|number} note the note to trigger
		 *  @param {Tone.Time} [time=now] the time to trigger the ntoe
		 *  @param {number} [velocity=1] the velocity to trigger the note
		 */
		Tone.Instrument.prototype.triggerAttack = function(){};

		/**
		 *  @abstract
		 *  @param {Tone.Time} [time=now] when to trigger the release
		 */
		Tone.Instrument.prototype.triggerRelease = function(){};

		/**
		 *  trigger the attack and then the release
		 *  @param  {string|number} note     the note to trigger
		 *  @param  {Tone.Time} duration the duration of the note
		 *  @param {Tone.Time} [time=now]     the time of the attack
		 *  @param  {number} velocity the velocity
		 *  @returns {Tone.Instrument} `this`
		 */
		Tone.Instrument.prototype.triggerAttackRelease = function(note, duration, time, velocity){
			time = this.toSeconds(time);
			duration = this.toSeconds(duration);
			this.triggerAttack(note, time, velocity);
			this.triggerRelease(time + duration);
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Instrument} `this`
		 */
		Tone.Instrument.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.volume.dispose();
			this.volume = null;
			return this;
		};

		return Tone.Instrument;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  this is a base class for monophonic instruments. 
		 *          it defines their interfaces
		 *
		 *  @constructor
		 *  @abstract
		 *  @extends {Tone.Instrument}
		 */
		Tone.Monophonic = function(options){

			Tone.Instrument.call(this);

			//get the defaults
			options = this.defaultArg(options, Tone.Monophonic.defaults);

			/**
			 *  The glide time between notes. 
			 *  @type {Tone.Time}
			 */
			this.portamento = options.portamento;
		};

		Tone.extend(Tone.Monophonic, Tone.Instrument);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Monophonic.defaults = {
			"portamento" : 0
		};

		/**
		 *  trigger the attack. start the note, at the time with the velocity
		 *  
		 *  @param  {string|string} note     the note
		 *  @param  {Tone.Time} [time=now]     the time, if not given is now
		 *  @param  {number} [velocity=1] velocity defaults to 1
		 *  @returns {Tone.Monophonic} `this`
		 */
		Tone.Monophonic.prototype.triggerAttack = function(note, time, velocity) {
			time = this.toSeconds(time);
			this.triggerEnvelopeAttack(time, velocity);
			this.setNote(note, time);
			return this;
		};

		/**
		 *  trigger the release portion of the envelope
		 *  @param  {Tone.Time} [time=now] if no time is given, the release happens immediatly
		 *  @returns {Tone.Monophonic} `this`
		 */
		Tone.Monophonic.prototype.triggerRelease = function(time){
			this.triggerEnvelopeRelease(time);
			return this;
		};

		/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @param {Tone.Time} [time=now] the time the attack should happen
		 *  @param {number} [velocity=1] the velocity of the envelope
		 *  @returns {Tone.Monophonic} `this`
		 */	
		Tone.Monophonic.prototype.triggerEnvelopeAttack = function() {};

		/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @param {Tone.Time} [time=now] the time the attack should happen
		 *  @param {number} [velocity=1] the velocity of the envelope
		 *  @returns {Tone.Monophonic} `this`
		 */	
		Tone.Monophonic.prototype.triggerEnvelopeRelease = function() {};

		/**
		 *  set the note to happen at a specific time
		 *  @param {number|string} note if the note is a string, it will be 
		 *                              parsed as (NoteName)(Octave) i.e. A4, C#3, etc
		 *                              otherwise it will be considered as the frequency
		 *  @returns {Tone.Monophonic} `this`
		 */
		Tone.Monophonic.prototype.setNote = function(note, time){
			time = this.toSeconds(time);
			if (this.portamento > 0){
				var currentNote = this.frequency.value;
				this.frequency.setValueAtTime(currentNote, time);
				var portTime = this.toSeconds(this.portamento);
				this.frequency.exponentialRampToValueAtTime(note, time + portTime);
			} else {
				this.frequency.setValueAtTime(note, time);
			}
			return this;
		};

		return Tone.Monophonic;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  the MonoSynth is a single oscillator, monophonic synthesizer
		 *          with a filter, and two envelopes (on the filter and the amplitude). 
		 *
		 * Flow: 
		 * 
		 * <pre>
		 * OmniOscillator+-->AmplitudeEnvelope+-->Filter 
		 *                                          ^    
		 *                                          |    
		 *                         ScaledEnvelope+--+
		 * </pre>
		 *  
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} options the options available for the synth 
		 *                          see defaults below
		 */
		Tone.MonoSynth = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.MonoSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  the first oscillator
			 *  @type {Tone.OmniOscillator}
			 */
			this.oscillator = new Tone.OmniOscillator(options.oscillator);

			/**
			 *  the frequency control signal
			 *  @type {Tone.Signal}
			 */
			this.frequency = this.oscillator.frequency;

			/**
			 *  the detune control signal
			 *  @type {Tone.Signal}
			 */
			this.detune = this.oscillator.detune;

			/**
			 *  the filter
			 *  @type {Tone.Filter}
			 */
			this.filter = new Tone.Filter(options.filter);

			/**
			 *  the filter envelope
			 *  @type {Tone.Envelope}
			 */
			this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);

			/**
			 *  the amplitude envelope
			 *  @type {Tone.Envelope}
			 */
			this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

			//connect the oscillators to the output
			this.oscillator.chain(this.filter, this.envelope, this.output);
			//start the oscillators
			this.oscillator.start();
			//connect the filter envelope
			this.filterEnvelope.connect(this.filter.frequency);
		};

		Tone.extend(Tone.MonoSynth, Tone.Monophonic);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.MonoSynth.defaults = {
			"oscillator" : {
				"type" : "square"
			},
			"filter" : {
				"Q" : 6,
				"type" : "lowpass",
				"rolloff" : -24
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.1,
				"sustain" : 0.9,
				"release" : 1
			},
			"filterEnvelope" : {
				"attack" : 0.06,
				"decay" : 0.2,
				"sustain" : 0.5,
				"release" : 2,
				"min" : 20,
				"max" : 4000,
				"exponent" : 2
			}
		};

		/**
		 *  start the attack portion of the envelope
		 *  @param {Tone.Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.MonoSynth} `this`
		 */
		Tone.MonoSynth.prototype.triggerEnvelopeAttack = function(time, velocity){
			//the envelopes
			this.envelope.triggerAttack(time, velocity);
			this.filterEnvelope.triggerAttack(time);	
			return this;	
		};

		/**
		 *  start the release portion of the envelope
		 *  @param {Tone.Time} [time=now] the time the release should start
		 *  @returns {Tone.MonoSynth} `this`
		 */
		Tone.MonoSynth.prototype.triggerEnvelopeRelease = function(time){
			this.envelope.triggerRelease(time);
			this.filterEnvelope.triggerRelease(time);
			return this;
		};


		/**
		 *  clean up
		 *  @returns {Tone.MonoSynth} `this`
		 */
		Tone.MonoSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this.oscillator.dispose();
			this.oscillator = null;
			this.envelope.dispose();
			this.envelope = null;
			this.filterEnvelope.dispose();
			this.filterEnvelope = null;
			this.filter.dispose();
			this.filter = null;
			this.frequency = null;
			this.detune = null;
			return this;
		};

		return Tone.MonoSynth;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  the AMSynth is an amplitude modulation synthesizer
		 *          composed of two MonoSynths where one MonoSynth is the 
		 *          carrier and the second is the modulator.
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} options the options available for the synth 
		 *                          see defaults below
		 *  @example
		 *  var synth = new Tone.AMSynth();
		 */
		Tone.AMSynth = function(options){

			options = this.defaultArg(options, Tone.AMSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  the first voice
			 *  @type {Tone.MonoSynth}
			 */
			this.carrier = new Tone.MonoSynth(options.carrier);
			this.carrier.volume.value = -10;

			/**
			 *  the second voice
			 *  @type {Tone.MonoSynth}
			 */
			this.modulator = new Tone.MonoSynth(options.modulator);
			this.modulator.volume.value = -10;

			/**
			 *  the frequency control
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(440, Tone.Signal.Units.Frequency);

			/**
			 *  the ratio between the two voices
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._harmonicity = new Tone.Multiply(options.harmonicity);

			/**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */
			this._modulationScale = new Tone.AudioToGain();

			/**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
			this._modulationNode = this.context.createGain();

			//control the two voices frequency
			this.frequency.connect(this.carrier.frequency);
			this.frequency.chain(this._harmonicity, this.modulator.frequency);
			this.modulator.chain(this._modulationScale, this._modulationNode.gain);
			this.carrier.chain(this._modulationNode, this.output);
		};

		Tone.extend(Tone.AMSynth, Tone.Monophonic);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.AMSynth.defaults = {
			"harmonicity" : 3,
			"carrier" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "sine"
				},
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.01,
					"sustain" : 1,
					"release" : 0.5
				},
				"filterEnvelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5,
					"min" : 20000,
					"max" : 20000
				}
			},
			"modulator" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "square"
				},
				"envelope" : {
					"attack" : 2,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				},
				"filterEnvelope" : {
					"attack" : 4,
					"decay" : 0.2,
					"sustain" : 0.5,
					"release" : 0.5,
					"min" : 20,
					"max" : 1500
				}
			}
		};

		/**
		 *  trigger the attack portion of the note
		 *  
		 *  @param  {Tone.Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.AMSynth} `this`
		 */
		Tone.AMSynth.prototype.triggerEnvelopeAttack = function(time, velocity){
			//the port glide
			time = this.toSeconds(time);
			//the envelopes
			this.carrier.envelope.triggerAttack(time, velocity);
			this.modulator.envelope.triggerAttack(time);
			this.carrier.filterEnvelope.triggerAttack(time);
			this.modulator.filterEnvelope.triggerAttack(time);
			return this;
		};

		/**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Tone.Time} [time=now] the time the note will release
		 *  @returns {Tone.AMSynth} `this`
		 */
		Tone.AMSynth.prototype.triggerEnvelopeRelease = function(time){
			this.carrier.triggerRelease(time);
			this.modulator.triggerRelease(time);
			return this;
		};

		/**
		 * The ratio between the two carrier and the modulator. 
		 * @memberOf Tone.AMSynth#
		 * @type {number}
		 * @name harmonicity
		 */
		Object.defineProperty(Tone.AMSynth.prototype, "harmonicity", {
			get : function(){
				return this._harmonicity.value;
			},
			set : function(harm){
				this._harmonicity.value = harm;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.AMSynth} `this`
		 */
		Tone.AMSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this.carrier.dispose();
			this.carrier = null;
			this.modulator.dispose();
			this.modulator = null;
			this.frequency.dispose();
			this.frequency = null;
			this._harmonicity.dispose();
			this._harmonicity = null;
			this._modulationScale.dispose();
			this._modulationScale = null;
			this._modulationNode.disconnect();
			this._modulationNode = null;
			return this;
		};

		return Tone.AMSynth;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  the DuoSynth is a monophonic synth composed of two 
		 *          MonoSynths run in parallel with control over the 
		 *          frequency ratio between the two voices and vibrato effect.
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} options the options available for the synth 
		 *                          see defaults below
		 *  @example
		 *  var duoSynth = new Tone.DuoSynth();
		 */
		Tone.DuoSynth = function(options){

			options = this.defaultArg(options, Tone.DuoSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  the first voice
			 *  @type {Tone.MonoSynth}
			 */
			this.voice0 = new Tone.MonoSynth(options.voice0);
			this.voice0.volume.value = -10;

			/**
			 *  the second voice
			 *  @type {Tone.MonoSynth}
			 */
			this.voice1 = new Tone.MonoSynth(options.voice1);
			this.voice1.volume.value = -10;

			/**
			 *  The vibrato LFO. 
			 *  @type {Tone.LFO}
			 *  @private
			 */
			this._vibrato = new Tone.LFO(options.vibratoRate, -50, 50);
			this._vibrato.start();

			/**
			 * the vibrato frequency
			 * @type {Tone.Signal}
			 */
			this.vibratoRate = this._vibrato.frequency;

			/**
			 *  the vibrato gain
			 *  @type {GainNode}
			 *  @private
			 */
			this._vibratoGain = this.context.createGain();

			/**
			 * The amount of vibrato
			 * @type {Tone.Signal}
			 */
			this.vibratoAmount = new Tone.Signal(this._vibratoGain.gain, Tone.Signal.Units.Gain);
			this.vibratoAmount.value = options.vibratoAmount;

			/**
			 *  the delay before the vibrato starts
			 *  @type {number}
			 *  @private
			 */
			this._vibratoDelay = this.toSeconds(options.vibratoDelay);

			/**
			 *  the frequency control
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(440, Tone.Signal.Units.Frequency);

			/**
			 *  the ratio between the two voices
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._harmonicity = new Tone.Multiply(options.harmonicity);

			//control the two voices frequency
			this.frequency.connect(this.voice0.frequency);
			this.frequency.chain(this._harmonicity, this.voice1.frequency);
			this._vibrato.connect(this._vibratoGain);
			this._vibratoGain.fan(this.voice0.detune, this.voice1.detune);
			this.voice0.connect(this.output);
			this.voice1.connect(this.output);
		};

		Tone.extend(Tone.DuoSynth, Tone.Monophonic);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.DuoSynth.defaults = {
			"vibratoAmount" : 0.5,
			"vibratoRate" : 5,
			"vibratoDelay" : 1,
			"harmonicity" : 1.5,
			"voice0" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "sine"
				},
				"filterEnvelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				},
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				}
			},
			"voice1" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "sine"
				},
				"filterEnvelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				},
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				}
			}
		};

		/**
		 *  start the attack portion of the envelopes
		 *  
		 *  @param {Tone.Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.DuoSynth} `this`
		 */
		Tone.DuoSynth.prototype.triggerEnvelopeAttack = function(time, velocity){
			time = this.toSeconds(time);
			this.voice0.envelope.triggerAttack(time, velocity);
			this.voice1.envelope.triggerAttack(time, velocity);
			this.voice0.filterEnvelope.triggerAttack(time);
			this.voice1.filterEnvelope.triggerAttack(time);
			return this;
		};

		/**
		 *  start the release portion of the envelopes
		 *  
		 *  @param {Tone.Time} [time=now] the time the release should start
		 *  @returns {Tone.DuoSynth} `this`
		 */
		Tone.DuoSynth.prototype.triggerEnvelopeRelease = function(time){
			this.voice0.triggerRelease(time);
			this.voice1.triggerRelease(time);
			return this;
		};

		/**
		 * The ratio between the two carrier and the modulator. 
		 * @memberOf Tone.DuoSynth#
		 * @type {number}
		 * @name harmonicity
		 */
		Object.defineProperty(Tone.DuoSynth.prototype, "harmonicity", {
			get : function(){
				return this._harmonicity.value;
			},
			set : function(harm){
				this._harmonicity.value = harm;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.DuoSynth} `this`
		 */
		Tone.DuoSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this.voice0.dispose();
			this.voice0 = null;
			this.voice1.dispose();
			this.voice1 = null;
			this.frequency.dispose();
			this.frequency = null;
			this._vibrato.dispose();
			this._vibrato = null;
			this._vibratoGain.disconnect();
			this._vibratoGain = null;
			this._harmonicity.dispose();
			this._harmonicity = null;
			this.vibratoAmount.dispose();
			this.vibratoAmount = null;
			this.vibratoRate = null;
			return this;
		};

		return Tone.DuoSynth;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  the FMSynth is composed of two MonoSynths where one MonoSynth is the 
		 *          carrier and the second is the modulator.
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} options the options available for the synth 
		 *                          see defaults below
		 *  @example
		 *  var fmSynth = new Tone.FMSynth();
		 */
		Tone.FMSynth = function(options){

			options = this.defaultArg(options, Tone.FMSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  the first voice
			 *  @type {Tone.MonoSynth}
			 */
			this.carrier = new Tone.MonoSynth(options.carrier);
			this.carrier.volume.value = -10;

			/**
			 *  the second voice
			 *  @type {Tone.MonoSynth}
			 */
			this.modulator = new Tone.MonoSynth(options.modulator);
			this.modulator.volume.value = -10;

			/**
			 *  the frequency control
			 *  @type {Tone.Signal}
			 */
			this.frequency = new Tone.Signal(440, Tone.Signal.Units.Frequency);

			/**
			 *  the ratio between the two voices
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._harmonicity = new Tone.Multiply(options.harmonicity);

			/**
			 *  
			 *
			 *	@type {Tone.Multiply}
			 *	@private
			 */
			this._modulationIndex = new Tone.Multiply(options.modulationIndex);

			/**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
			this._modulationNode = this.context.createGain();

			//control the two voices frequency
			this.frequency.connect(this.carrier.frequency);
			this.frequency.chain(this._harmonicity, this.modulator.frequency);
			this.frequency.chain(this._modulationIndex, this._modulationNode);
			this.modulator.connect(this._modulationNode.gain);
			this._modulationNode.gain.value = 0;
			this._modulationNode.connect(this.carrier.frequency);
			this.carrier.connect(this.output);
		};

		Tone.extend(Tone.FMSynth, Tone.Monophonic);

		/**
		 *  @static
		 *  @type {Object}
		 */
		Tone.FMSynth.defaults = {
			"harmonicity" : 3,
			"modulationIndex" : 10,
			"carrier" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "sine"
				},
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				},
				"filterEnvelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5,
					"min" : 20000,
					"max" : 20000
				}
			},
			"modulator" : {
				"volume" : -10,
				"portamento" : 0,
				"oscillator" : {
					"type" : "triangle"
				},
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5
				},
				"filterEnvelope" : {
					"attack" : 0.01,
					"decay" : 0.0,
					"sustain" : 1,
					"release" : 0.5,
					"min" : 20000,
					"max" : 20000
				}
			}
		};

		/**
		 *  trigger the attack portion of the note
		 *  
		 *  @param  {Tone.Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.FMSynth} `this`
		 */
		Tone.FMSynth.prototype.triggerEnvelopeAttack = function(time, velocity){
			//the port glide
			time = this.toSeconds(time);
			//the envelopes
			this.carrier.envelope.triggerAttack(time, velocity);
			this.modulator.envelope.triggerAttack(time);
			this.carrier.filterEnvelope.triggerAttack(time);
			this.modulator.filterEnvelope.triggerAttack(time);
			return this;
		};

		/**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Tone.Time} [time=now] the time the note will release
		 *  @returns {Tone.FMSynth} `this`
		 */
		Tone.FMSynth.prototype.triggerEnvelopeRelease = function(time){
			this.carrier.triggerRelease(time);
			this.modulator.triggerRelease(time);
			return this;
		};

		/**
		 * The ratio between the two carrier and the modulator. 
		 * @memberOf Tone.FMSynth#
		 * @type {number}
		 * @name harmonicity
		 */
		Object.defineProperty(Tone.FMSynth.prototype, "harmonicity", {
			get : function(){
				return this._harmonicity.value;
			},
			set : function(harm){
				this._harmonicity.value = harm;
			}
		});

		/**
		 * The modulation index which is in essence the depth or amount of the modulation. In other terms it is the 
		 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
		 *  modulating signal (ma) -- as in ma/mf. 
		 * @memberOf Tone.FMSynth#
		 * @type {number}
		 * @name modulationIndex
		 */
		Object.defineProperty(Tone.FMSynth.prototype, "modulationIndex", {
			get : function(){
				return this._modulationIndex.value;
			},
			set : function(mod){
				this._modulationIndex.value = mod;
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.FMSynth} `this`
		 */
		Tone.FMSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this.carrier.dispose();
			this.carrier = null;
			this.modulator.dispose();
			this.modulator = null;
			this.frequency.dispose();
			this.frequency = null;
			this._modulationIndex.dispose();
			this._modulationIndex = null;
			this._harmonicity.dispose();
			this._harmonicity = null;
			this._modulationNode.disconnect();
			this._modulationNode = null;
			return this;
		};

		return Tone.FMSynth;
	});
	ToneModule( function(Tone){

		
		
		/**
		 *  @class  Audio file player with start, loop, stop.
		 *  
		 *  @constructor
		 *  @extends {Tone.Source} 
		 *  @param {string|AudioBuffer} url Either the AudioBuffer or the url from
		 *                                  which to load the AudioBuffer
		 *  @param {function=} onload The function to invoke when the buffer is loaded. 
		 *                            Recommended to use {@link Tone.Buffer#onload} instead.
		 *  @example
		 *  var player = new Tone.Player("./path/to/sample.mp3");
		 */
		Tone.Player = function(){
			
			var options = this.optionsObject(arguments, ["url", "onload"], Tone.Player.defaults);
			Tone.Source.call(this, options);

			/**
			 *  @private
			 *  @type {AudioBufferSourceNode}
			 */
			this._source = null;
			
			/**
			 *  the buffer
			 *  @private
			 *  @type {Tone.Buffer}
			 */
			this._buffer = new Tone.Buffer(options.url, options.onload.bind(null, this));

			/**
			 *  if the buffer should loop once it's over
			 *  @type {boolean}
			 *  @private
			 */
			this._loop = options.loop;

			/**
			 *  if 'loop' is true, the loop will start at this position
			 *  @type {Tone.Time}
			 *  @private
			 */
			this._loopStart = options.loopStart;

			/**
			 *  if 'loop' is true, the loop will end at this position
			 *  @type {Tone.Time}
			 *  @private
			 */
			this._loopEnd = options.loopEnd;

			/**
			 *  the playback rate
			 *  @private
			 *  @type {number}
			 */
			this._playbackRate = options.playbackRate;

			/**
			 *  Enabling retrigger will allow a player to be restarted
			 *  before the the previous 'start' is done playing.
			 *  @type {boolean}
			 */
			this.retrigger = options.retrigger;
		};

		Tone.extend(Tone.Player, Tone.Source);
		
		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Player.defaults = {
			"onload" : function(){},
			"playbackRate" : 1,
			"loop" : false,
			"loopStart" : 0,
			"loopEnd" : 0,
			"retrigger" : false,
		};

		/**
		 *  Load the audio file as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads. 
		 *  Note: this does not need to be called, if a url
		 *  was passed in to the constructor. Only use this
		 *  if you want to manually load a new url. 
		 * @param {string} url The url of the buffer to load.
		 *                     filetype support depends on the
		 *                     browser.
		 *  @param  {function(Tone.Player)=} callback
		 *  @returns {Tone.Player} `this`
		 */
		Tone.Player.prototype.load = function(url, callback){
			this._buffer.load(url, callback.bind(this, this));
			return this;
		};

		/**
		 *  play the buffer between the desired positions
		 *  
		 *  @private
		 *  @param  {Tone.Time} [startTime=now] when the player should start.
		 *  @param  {Tone.Time} [offset=0] the offset from the beginning of the sample
		 *                                 to start at. 
		 *  @param  {Tone.Time=} duration how long the sample should play. If no duration
		 *                                is given, it will default to the full length 
		 *                                of the sample (minus any offset)
		 *  @returns {Tone.Player} `this`
		 */
		Tone.Player.prototype._start = function(startTime, offset, duration){
			if (this._buffer.loaded){
				//if it's a loop the default offset is the loopstart point
				if (this._loop){
					offset = this.defaultArg(offset, this._loopStart);
					offset = this.toSeconds(offset);
				} else {
					//otherwise the default offset is 0
					offset = this.defaultArg(offset, 0);
				}
				duration = this.defaultArg(duration, this._buffer.duration - offset);
				//the values in seconds
				startTime = this.toSeconds(startTime);
				duration = this.toSeconds(duration);
				//make the source
				this._source = this.context.createBufferSource();
				this._source.buffer = this._buffer.get();
				//set the looping properties
				if (this._loop){
					this._source.loop = this._loop;
					this._source.loopStart = this.toSeconds(this._loopStart);
					this._source.loopEnd = this.toSeconds(this._loopEnd);
				} else {
					this._nextStop = startTime + duration;
				}
				//and other properties
				this._source.playbackRate.value = this._playbackRate;
				this._source.onended = this.onended;
				this._source.connect(this.output);
				//start it
				this._source.start(startTime, offset, duration);
			} else {
				throw Error("tried to start Player before the buffer was loaded");
			}
			return this;
		};

		/**
		 *  Stop playback.
		 *  @private
		 *  @param  {Tone.Time} [time=now]
		 *  @returns {Tone.Player} `this`
		 */
		Tone.Player.prototype._stop = function(time){
			if (this._source){
				this._source.stop(this.toSeconds(time));
				this._source = null;
			}
			return this;
		};

		/**
		 *  Set the loop start and end. Will only loop if `loop` is 
		 *  set to `true`. 
		 *  @param {Tone.Time} loopStart The loop end time
		 *  @param {Tone.Time} loopEnd The loop end time
		 *  @returns {Tone.Player} `this`
		 *  @example
		 *  player.setLoopPoints(0.2, 0.3);
		 *  player.loop = true;
		 */
		Tone.Player.prototype.setLoopPoints = function(loopStart, loopEnd){
			this.loopStart = loopStart;
			this.loopEnd = loopEnd;
			return this;
		};

		/**
		 * If `loop` is true, the loop will start at this position. 
		 * @memberOf Tone.Player#
		 * @type {Tone.Time}
		 * @name loopStart
		 */
		Object.defineProperty(Tone.Player.prototype, "loopStart", {
			get : function(){
				return this._loopStart;
			}, 
			set : function(loopStart){
				this._loopStart = loopStart;
				if (this._source){
					this._source.loopStart = this.toSeconds(loopStart);
				}
			}
		});

		/**
		 * If `loop` is true, the loop will end at this position.
		 * @memberOf Tone.Player#
		 * @type {Tone.Time}
		 * @name loopEnd
		 */
		Object.defineProperty(Tone.Player.prototype, "loopEnd", {
			get : function(){
				return this._loopEnd;
			}, 
			set : function(loopEnd){
				this._loopEnd = loopEnd;
				if (this._source){
					this._source.loopEnd = this.toSeconds(loopEnd);
				}
			}
		});

		/**
		 * The audio buffer belonging to the player. 
		 * @memberOf Tone.Player#
		 * @type {AudioBuffer}
		 * @name buffer
		 */
		Object.defineProperty(Tone.Player.prototype, "buffer", {
			get : function(){
				return this._buffer;
			}, 
			set : function(buffer){
				this._buffer.set(buffer);
			}
		});

		/**
		 * If the buffer should loop once it's over. 
		 * @memberOf Tone.Player#
		 * @type {boolean}
		 * @name loop
		 */
		Object.defineProperty(Tone.Player.prototype, "loop", {
			get : function(){
				return this._loop;
			}, 
			set : function(loop){
				this._loop = loop;
				if (this._source){
					this._source.loop = loop;
				}
			}
		});

		/**
		 * The playback speed. 1 is normal speed. 
		 * Note that this is not a Tone.Signal because of a bug in Blink. 
		 * Please star this issue if this an important thing to you: 
		 * https://code.google.com/p/chromium/issues/detail?id=311284
		 * 
		 * @memberOf Tone.Player#
		 * @type {number}
		 * @name playbackRate
		 */
		Object.defineProperty(Tone.Player.prototype, "playbackRate", {
			get : function(){
				return this._playbackRate;
			}, 
			set : function(rate){
				this._playbackRate = rate;
				if (this._source) {
					this._source.playbackRate.value = rate;
				}
			}
		});

		/**
		 *  dispose and disconnect
		 *  @return {Tone.Player} `this`
		 */
		Tone.Player.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			if (this._source !== null){
				this._source.disconnect();
				this._source = null;
			}
			this._buffer.dispose();
			this._buffer = null;
			return this;
		};

		return Tone.Player;
	});

	ToneModule( 
	function(Tone){

		

		/**
		 *  @class A simple sampler instrument which plays an audio buffer 
		 *         through an amplitude envelope and a filter envelope. Nested
		 *         lists will be flattened.
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object|string} urls the urls of the audio file
		 *  @param {Object} options the options object for the synth
		 *  @example
		 *  var sampler = new Sampler({
		 *  	A : {
		 *  		1 : {"./audio/casio/A1.mp3",
		 *  		2 : "./audio/casio/A2.mp3",
		 *  	},
		 *  	"B.1" : "./audio/casio/B1.mp3",
		 *  });
		 *  //...once samples have loaded
		 *  sampler.triggerAttack("A.1", time, velocity);
		 */
		Tone.Sampler = function(urls, options){

			Tone.Instrument.call(this);
			options = this.defaultArg(options, Tone.Sampler.defaults);

			/**
			 *  the sample player
			 *  @type {Tone.Player}
			 */
			this.player = new Tone.Player(options.player);
			this.player.retrigger = true;

			/**
			 *  the buffers
			 *  @type {Object<Tone.Buffer>}
			 *  @private
			 */
			this._buffers = {};

			/**
			 *  The amplitude envelope. 
			 *  @type {Tone.Envelope}
			 */
			this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

			/**
			 *  The filter envelope. 
			 *  @type {Tone.Envelope}
			 */
			this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);

			/**
			 *  The name of the current sample. 
			 *  @type {string}
			 */
			this._sample = options.sample;

			/**
			 * the private reference to the pitch
			 * @type {number}
			 * @private
			 */
			this._pitch = options.pitch;

			/**
			 *  The filter.
			 *  @type {BiquadFilterNode}
			 */
			this.filter = new Tone.Filter(options.filter);

			//connections / setup
			this._loadBuffers(urls);
			this.pitch = options.pitch;
			this.player.chain(this.filter, this.envelope, this.output);
			this.filterEnvelope.connect(this.filter.frequency);
		};

		Tone.extend(Tone.Sampler, Tone.Instrument);

		/**
		 *  the default parameters
		 *  @static
		 */
		Tone.Sampler.defaults = {
			"sample" : 0,
			"pitch" : 0,
			"player" : {
				"loop" : false,
			},
			"envelope" : {
				"attack" : 0.001,
				"decay" : 0,
				"sustain" : 1,
				"release" : 0.1
			},
			"filterEnvelope" : {
				"attack" : 0.001,
				"decay" : 0.001,
				"sustain" : 1,
				"release" : 0.5,
				"min" : 20,
				"max" : 20000,
				"exponent" : 2,
			},
			"filter" : {
				"type" : "lowpass"
			}
		};

		/**
		 *  load the buffers
		 *  @param   {Object} urls   the urls
		 *  @private
		 */
		Tone.Sampler.prototype._loadBuffers = function(urls){
			if (typeof urls === "string"){
				this._buffers["0"] = new Tone.Buffer(urls, function(){
					this.sample = "0";
				}.bind(this));
			} else {
				urls = this._flattenUrls(urls);
				for (var buffName in urls){
					this._sample = buffName;
					var urlString = urls[buffName];
					this._buffers[buffName] = new Tone.Buffer(urlString);
				}
			}
		};

		/**
		 *  flatten an object into a single depth object
		 *  https://gist.github.com/penguinboy/762197
		 *  @param   {Object} ob 	
		 *  @return  {Object}    
		 *  @private
		 */
		Tone.Sampler.prototype._flattenUrls = function(ob) {
			var toReturn = {};
			for (var i in ob) {
				if (!ob.hasOwnProperty(i)) continue;
				if ((typeof ob[i]) == "object") {
					var flatObject = this._flattenUrls(ob[i]);
					for (var x in flatObject) {
						if (!flatObject.hasOwnProperty(x)) continue;
						toReturn[i + "." + x] = flatObject[x];
					}
				} else {
					toReturn[i] = ob[i];
				}
			}
			return toReturn;
		};

		/**
		 *  start the sample.
		 *  @param {string=} sample the name of the samle to trigger, defaults to
		 *                          the last sample used
		 *  @param {Tone.Time} [time=now] the time when the note should start
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.Sampler} `this`
		 */
		Tone.Sampler.prototype.triggerAttack = function(name, time, velocity){
			time = this.toSeconds(time);
			if (name){
				this.sample = name;
			}
			this.player.start(time, 0);
			this.envelope.triggerAttack(time, velocity);
			this.filterEnvelope.triggerAttack(time);
			return this;
		};

		/**
		 *  start the release portion of the sample
		 *  
		 *  @param {Tone.Time} [time=now] the time when the note should release
		 *  @returns {Tone.Sampler} `this`
		 */
		Tone.Sampler.prototype.triggerRelease = function(time){
			time = this.toSeconds(time);
			this.filterEnvelope.triggerRelease(time);
			this.envelope.triggerRelease(time);
			this.player.stop(this.toSeconds(this.envelope.release) + time);
			return this;
		};

		/**
		 * The name of the sample to trigger.
		 * @memberOf Tone.Sampler#
		 * @type {number|string}
		 * @name sample
		 */
		Object.defineProperty(Tone.Sampler.prototype, "sample", {
			get : function(){
				return this._sample;
			},
			set : function(name){
				if (this._buffers.hasOwnProperty(name)){
					this._sample = name;
					this.player.buffer = this._buffers[name];
				} else {
					throw new Error("Sampler does not have a sample named "+name);
				}
			}
		});

		/**
		 * Repitch the sampled note by some interval (measured
		 * in semi-tones). 
		 * @memberOf Tone.Sampler#
		 * @type {number}
		 * @name pitch
		 * @example
		 * sampler.pitch = -12; //down one octave
		 * sampler.pitch = 7; //up a fifth
		 */
		Object.defineProperty(Tone.Sampler.prototype, "pitch", {
			get : function(){
				return this._pitch;
			},
			set : function(interval){
				this._pitch = interval;
				this.player.playbackRate = this.intervalToFrequencyRatio(interval);
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.Sampler} `this`
		 */
		Tone.Sampler.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			this.player.dispose();
			this.filterEnvelope.dispose();
			this.envelope.dispose();
			this.filter.dispose();
			this.player = null;
			this.filterEnvelope = null;
			this.envelope = null;
			this.filter = null;
			for (var sample in this._buffers){
				this._buffers[sample].dispose();
				this._buffers[sample] = null;
			}
			this._buffers = null;
			return this;
		};

		return Tone.Sampler;
	});

	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Deprecated.
		 *
		 *  @constructor
		 *  @deprecated Use Tone.PolySynth with Tone.Sampler as the voice.
		 *  @extends {Tone.Instrument}
		 *  @param {Object} samples the samples used in this
		 *  @param {function} onload the callback to invoke when all 
		 *                           of the samples have been loaded
		 */
		Tone.MultiSampler = function(samples, onload){

			console.warn("Tone.MultiSampler is deprecated - use Tone.PolySynth with Tone.Sampler as the voice");
		 	Tone.Instrument.call(this);

		 	/**
		 	 *  the array of voices
		 	 *  @type {Tone.Sampler}
		 	 */
			this.samples = {};

			//make the samples
			this._createSamples(samples, onload);
		};

		Tone.extend(Tone.MultiSampler, Tone.Instrument);

		/**
		 *  creates all of the samples and tracks their loading
		 *  
		 *  @param   {Object} samples the samples
		 *  @param   {function} onload  the onload callback
		 *  @private
		 */
		Tone.MultiSampler.prototype._createSamples = function(samples, onload){
			//object which tracks the number of loaded samples
			var loadCounter = {
				total : 0,
				loaded : 0
			};
			//get the count
			for (var s in samples){ //jshint ignore:line
				loadCounter.total++;
			}
			//the function to invoke when a sample is loaded
			var onSampleLoad = function(){
				loadCounter.loaded++;
				if (loadCounter.loaded === loadCounter.total){
					if (onload){
						onload();
					}
				}
			};
			for (var samp in samples){
				var url = samples[samp];
				var sampler = new Tone.Sampler(url, onSampleLoad);
				sampler.connect(this.output);
				this.samples[samp] = sampler;
			}
		};

		/**
		 *  start a sample
		 *  
		 *  @param  {string} sample the note name to start
		 *  @param {Tone.Time} [time=now] the time when the note should start
		 *  @param {number} [velocity=1] the velocity of the note
		 */
		Tone.MultiSampler.prototype.triggerAttack = function(sample, time, velocity){
			if (this.samples.hasOwnProperty(sample)){
				this.samples[sample].triggerAttack(0, time, velocity);
			}
		};

		/**
		 *  start the release portion of the note
		 *  
		 *  @param  {string} sample the note name to release
		 *  @param {Tone.Time} [time=now] the time when the note should release
		 */
		Tone.MultiSampler.prototype.triggerRelease = function(sample, time){
			if (this.samples.hasOwnProperty(sample)){
				this.samples[sample].triggerRelease(time);
			}
		};

		/**
		  *  start the release portion of the note
		  *  
		  *  @param  {string} sample the note name to release
		  *  @param {Tone.Time} duration the duration of the note
		  *  @param {Tone.Time} [time=now] the time when the note should start
		  *  @param {number} [velocity=1] the velocity of the note
		  */
		Tone.MultiSampler.prototype.triggerAttackRelease = function(sample, duration, time, velocity){
			if (this.samples.hasOwnProperty(sample)){
				time = this.toSeconds(time);
				duration = this.toSeconds(duration);
				var samp = this.samples[sample];
				samp.triggerAttack(0, time, velocity);
				samp.triggerRelease(time + duration);
			}
		};

		/**
		 *  sets all the samplers with these settings
		 *  @param {object} params the parameters to be applied 
		 *                         to all internal samplers
		 */
		Tone.MultiSampler.prototype.set = function(params){
			for (var samp in this.samples){
				this.samples[samp].set(params);
			}
		};

		/**
		 *  clean up
		 */
		Tone.MultiSampler.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			for (var samp in this.samples){
				this.samples[samp].dispose();
				this.samples[samp] = null;
			}
			this.samples = null;
		};

		return Tone.MultiSampler;
	});

	ToneModule( function(Tone){

		

		/**
		 *  @class  Noise generator. 
		 *          Uses looped noise buffers to save on performance. 
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {string} type the noise type (white|pink|brown)
		 *  @example
		 *  var noise = new Tone.Noise("pink");
		 */
		Tone.Noise = function(){

			var options = this.optionsObject(arguments, ["type"], Tone.Noise.defaults);
			Tone.Source.call(this, options);

			/**
			 *  @private
			 *  @type {AudioBufferSourceNode}
			 */
			this._source = null;
			
			/**
			 *  the buffer
			 *  @private
			 *  @type {AudioBuffer}
			 */
			this._buffer = null;

			this.type = options.type;
		};

		Tone.extend(Tone.Noise, Tone.Source);

		/**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Noise.defaults = {
			"type" : "white",
		};

		/**
		 * The type of the noise. Can be "white", "brown", or "pink". 
		 * @memberOf Tone.Noise#
		 * @type {string}
		 * @name type
		 * @example
		 * noise.type = "white";
		 */
		Object.defineProperty(Tone.Noise.prototype, "type", {
			get : function(){
				if (this._buffer === _whiteNoise){
					return "white";
				} else if (this._buffer === _brownNoise){
					return "brown";
				} else if (this._buffer === _pinkNoise){
					return "pink";
				}
			}, 
			set : function(type){
				if (this.type !== type){
					switch (type){
						case "white" : 
							this._buffer = _whiteNoise;
							break;
						case "pink" : 
							this._buffer = _pinkNoise;
							break;
						case "brown" : 
							this._buffer = _brownNoise;
							break;
						default : 
							this._buffer = _whiteNoise;
					}
					//if it's playing, stop and restart it
					if (this.state === Tone.Source.State.STARTED){
						var now = this.now() + this.bufferTime;
						//remove the listener
						this._source.onended = undefined;
						this._stop(now);
						this._start(now);
					}
				}
			}
		});

		/**
		 *  internal start method
		 *  
		 *  @param {Tone.Time} time
		 *  @private
		 */
		Tone.Noise.prototype._start = function(time){		
			this._source = this.context.createBufferSource();
			this._source.buffer = this._buffer;
			this._source.loop = true;
			this.connectSeries(this._source, this.output);
			this._source.start(this.toSeconds(time));
			this._source.onended = this.onended;
		};

		/**
		 *  internal stop method
		 *  
		 *  @param {Tone.Time} time
		 *  @private
		 */
		Tone.Noise.prototype._stop = function(time){
			if (this._source){
				this._source.stop(this.toSeconds(time));
			}
		};

		/**
		 *  dispose all the components
		 *  @returns {Tone.Noise} `this`
		 */
		Tone.Noise.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			if (this._source !== null){
				this._source.disconnect();
				this._source = null;
			}
			this._buffer = null;
			return this;
		};


		///////////////////////////////////////////////////////////////////////////
		// THE BUFFERS
		// borred heavily from http://noisehack.com/generate-noise-web-audio-api/
		///////////////////////////////////////////////////////////////////////////

		/**
		 *	static noise buffers
		 *  
		 *  @static
		 *  @private
		 *  @type {AudioBuffer}
		 */
		var _pinkNoise = null, _brownNoise = null, _whiteNoise = null;

		Tone._initAudioContext(function(audioContext){

			var sampleRate = audioContext.sampleRate;
			
			//four seconds per buffer
			var bufferLength = sampleRate * 4;

			//fill the buffers
			_pinkNoise = (function() {
				var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
				for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++){
					var channel = buffer.getChannelData(channelNum);
					var b0, b1, b2, b3, b4, b5, b6;
					b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
					for (var i = 0; i < bufferLength; i++) {
						var white = Math.random() * 2 - 1;
						b0 = 0.99886 * b0 + white * 0.0555179;
						b1 = 0.99332 * b1 + white * 0.0750759;
						b2 = 0.96900 * b2 + white * 0.1538520;
						b3 = 0.86650 * b3 + white * 0.3104856;
						b4 = 0.55000 * b4 + white * 0.5329522;
						b5 = -0.7616 * b5 - white * 0.0168980;
						channel[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
						channel[i] *= 0.11; // (roughly) compensate for gain
						b6 = white * 0.115926;
					}
				}
				return buffer;
			}());

			_brownNoise = (function() {
				var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
				for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++){
					var channel = buffer.getChannelData(channelNum);
					var lastOut = 0.0;
					for (var i = 0; i < bufferLength; i++) {
						var white = Math.random() * 2 - 1;
						channel[i] = (lastOut + (0.02 * white)) / 1.02;
						lastOut = channel[i];
						channel[i] *= 3.5; // (roughly) compensate for gain
					}
				}
				return buffer;
			})();

			_whiteNoise = (function(){
				var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
				for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++){
					var channel = buffer.getChannelData(channelNum);
					for (var i = 0; i < bufferLength; i++){
						channel[i] =  Math.random() * 2 - 1;
					}
				}
				return buffer;
			}());
		});

		return Tone.Noise;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  the NoiseSynth is a single oscillator, monophonic synthesizer
		 *          with a filter, and two envelopes (on the filter and the amplitude)
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} options the options available for the synth 
		 *                          see defaults below
		 * @example
		 * var noiseSynth = new Tone.NoiseSynth();
		 */
		Tone.NoiseSynth = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.NoiseSynth.defaults);
			Tone.Instrument.call(this);

			/**
			 *  The noise source. Set the type by setting
			 *  `noiseSynth.noise.type`. 
			 *  @type {Tone.Noise}
			 */
			this.noise = new Tone.Noise();

			/**
			 *  The filter .
			 *  @type {Tone.Filter}
			 */
			this.filter = new Tone.Filter(options.filter);

			/**
			 *  The filter envelope. 
			 *  @type {Tone.Envelope}
			 */
			this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);

			/**
			 *  The amplitude envelope. 
			 *  @type {Tone.Envelope}
			 */
			this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

			//connect the noise to the output
			this.noise.chain(this.filter, this.envelope, this.output);
			//start the noise
			this.noise.start();
			//connect the filter envelope
			this.filterEnvelope.connect(this.filter.frequency);
		};

		Tone.extend(Tone.NoiseSynth, Tone.Instrument);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.NoiseSynth.defaults = {
			"noise" : {
				"type" : "white"
			},
			"filter" : {
				"Q" : 6,
				"type" : "highpass",
				"rolloff" : -24
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.1,
				"sustain" : 0.0,
			},
			"filterEnvelope" : {
				"attack" : 0.06,
				"decay" : 0.2,
				"sustain" : 0,
				"release" : 2,
				"min" : 20,
				"max" : 4000,
				"exponent" : 2
			}
		};

		/**
		 *  start the attack portion of the envelope
		 *  @param {Tone.Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.NoiseSynth} `this`
		 */
		Tone.NoiseSynth.prototype.triggerAttack = function(time, velocity){
			//the envelopes
			this.envelope.triggerAttack(time, velocity);
			this.filterEnvelope.triggerAttack(time);	
			return this;	
		};

		/**
		 *  start the release portion of the envelope
		 *  @param {Tone.Time} [time=now] the time the release should start
		 *  @returns {Tone.NoiseSynth} `this`
		 */
		Tone.NoiseSynth.prototype.triggerRelease = function(time){
			this.envelope.triggerRelease(time);
			this.filterEnvelope.triggerRelease(time);
			return this;
		};

		/**
		 *  trigger the attack and then the release
		 *  @param  {Tone.Time} duration the duration of the note
		 *  @param  {Tone.Time} [time=now]     the time of the attack
		 *  @param  {number} [velocity=1] the velocity
		 *  @returns {Tone.NoiseSynth} `this`
		 */
		Tone.NoiseSynth.prototype.triggerAttackRelease = function(duration, time, velocity){
			time = this.toSeconds(time);
			duration = this.toSeconds(duration);
			this.triggerAttack(time, velocity);
			console.log(time + duration);
			this.triggerRelease(time + duration);
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.NoiseSynth} `this`
		 */
		Tone.NoiseSynth.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			this.noise.dispose();
			this.noise = null;
			this.envelope.dispose();
			this.envelope = null;
			this.filterEnvelope.dispose();
			this.filterEnvelope = null;
			this.filter.dispose();
			this.filter = null;
			return this;
		};

		return Tone.NoiseSynth;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Karplus-String string synthesis. 
		 *  
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} options see the defaults
		 *  @example
		 *  var plucky = new Tone.PluckSynth();
		 */
		Tone.PluckSynth = function(options){

			options = this.defaultArg(options, Tone.PluckSynth.defaults);
			Tone.Instrument.call(this);

			/**
			 *  @type {Tone.Noise}
			 *  @private
			 */
			this._noise = new Tone.Noise("pink");

			/**
			 *  The amount of noise at the attack. 
			 *  Nominal range of [0.1, 20]
			 *  @type {number}
			 */
			this.attackNoise = 1;

			/**
			 *  the LFCF
			 *  @type {Tone.LowpassCombFilter}
			 *  @private
			 */
			this._lfcf = new Tone.LowpassCombFilter(1 / 440);

			/**
			 *  the resonance control
			 *  @type {Tone.Signal}
			 */
			this.resonance = this._lfcf.resonance;

			/**
			 *  the dampening control. i.e. the lowpass filter frequency of the comb filter
			 *  @type {Tone.Signal}
			 */
			this.dampening = this._lfcf.dampening;

			//connections
			this._noise.connect(this._lfcf);
			this._lfcf.connect(this.output);
		};

		Tone.extend(Tone.PluckSynth, Tone.Instrument);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.PluckSynth.defaults = {
			"attackNoise" : 1,
			"dampening" : 4000,
			"resonance" : 0.5
		};

		/**
		 *  trigger the attack portion
		 *  @param {string|number} note the note name or frequency
		 *  @param {Tone.Time} [time=now] the time of the note
		 *  @returns {Tone.PluckSynth} `this`
		 */
		Tone.PluckSynth.prototype.triggerAttack = function(note, time) {
			note = this.toFrequency(note);
			time = this.toSeconds(time);
			var delayAmount = 1 / note;
			this._lfcf.setDelayTimeAtTime(delayAmount, time);		
			this._noise.start(time);
			this._noise.stop(time + delayAmount * this.attackNoise);
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.PluckSynth} `this`
		 */
		Tone.PluckSynth.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			this._noise.dispose();
			this._lfcf.dispose();
			this._noise = null;
			this._lfcf = null;
			this.dampening = null;
			this.resonance = null;
			return this;
		};

		return Tone.PluckSynth;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class  Creates a polyphonic synthesizer out of 
		 *          the monophonic voice which is passed in. 
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {number|Object} [polyphony=4] the number of voices to create
		 *  @param {function} [voice=Tone.MonoSynth] the constructor of the voices
		 *                                            uses Tone.MonoSynth by default
		 *  @example
		 *  //a polysynth composed of 6 Voices of MonoSynth
		 *  var synth = new Tone.PolySynth(6, Tone.MonoSynth);
		 *  //set a MonoSynth preset
		 *  synth.setPreset("Pianoetta");
		 */
		Tone.PolySynth = function(){

			Tone.Instrument.call(this);

			var options = this.optionsObject(arguments, ["polyphony", "voice"], Tone.PolySynth.defaults);

			/**
			 *  the array of voices
			 *  @type {Array}
			 */
			this.voices = new Array(options.polyphony);

			/**
			 *  the queue of free voices
			 *  @private
			 *  @type {Array}
			 */
			this._freeVoices = [];

			/**
			 *  keeps track of which notes are down
			 *  @private
			 *  @type {Object}
			 */
			this._activeVoices = {};

			//create the voices
			for (var i = 0; i < options.polyphony; i++){
				var v = new options.voice(arguments[2], arguments[3]);
				this.voices[i] = v;
				v.connect(this.output);
			}

			//make a copy of the voices
			this._freeVoices = this.voices.slice(0);
			//get the prototypes and properties
		};

		Tone.extend(Tone.PolySynth, Tone.Instrument);

		/**
		 *  the defaults
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.PolySynth.defaults = {
			"polyphony" : 4,
			"voice" : Tone.MonoSynth
		};

		/**
		 * Pull properties from the 
		 */

		/**
		 *  trigger the attack
		 *  @param  {string|number|Object|Array} value the value of the note(s) to start.
		 *                                             if the value is an array, it will iterate
		 *                                             over the array to play each of the notes
		 *  @param  {Tone.Time} [time=now]  the start time of the note
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.triggerAttack = function(value, time, velocity){
			if (!Array.isArray(value)){
				value = [value];
			}
			for (var i = 0; i < value.length; i++){
				var val = value[i];
				var stringified = JSON.stringify(val);
				if (this._activeVoices[stringified]){
					this._activeVoices[stringified].triggerAttack(val, time, velocity);
				} else if (this._freeVoices.length > 0){
					var voice = this._freeVoices.shift();
					voice.triggerAttack(val, time, velocity);
					this._activeVoices[stringified] = voice;
				}
			}
			return this;
		};

		/**
		 *  trigger the attack and release after the specified duration
		 *  
		 *  @param  {string|number|Object|Array} value the note(s).
		 *                                             if the value is an array, it will iterate
		 *                                             over the array to play each of the notes
		 *  @param  {Tone.Time} duration the duration of the note
		 *  @param  {Tone.Time} [time=now]     if no time is given, defaults to now
		 *  @param  {number} [velocity=1] the velocity of the attack (0-1)
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.triggerAttackRelease = function(value, duration, time, velocity){
			time = this.toSeconds(time);
			this.triggerAttack(value, time, velocity);
			this.triggerRelease(value, time + this.toSeconds(duration));
			return this;
		};

		/**
		 *  trigger the release of a note
		 *  @param  {string|number|Object|Array} value the value of the note(s) to release.
		 *                                             if the value is an array, it will iterate
		 *                                             over the array to play each of the notes
		 *  @param  {Tone.Time} [time=now]  the release time of the note
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.triggerRelease = function(value, time){
			if (!Array.isArray(value)){
				value = [value];
			}
			for (var i = 0; i < value.length; i++){
				//get the voice
				var stringified = JSON.stringify(value[i]);
				var voice = this._activeVoices[stringified];
				if (voice){
					voice.triggerRelease(time);
					this._freeVoices.push(voice);
					this._activeVoices[stringified] = null;
				}
			}
			return this;
		};

		/**
		 *  set the options on all of the voices
		 *  @param {Object} params 
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.set = function(params){
			for (var i = 0; i < this.voices.length; i++){
				this.voices[i].set(params);
			}
			return this;
		};

		/**
		 *  get a group of parameters
		 *  @param {Array=} params the parameters to get, otherwise will return 
		 *  					   all available.
		 */
		Tone.PolySynth.prototype.get = function(params){
			return this.voices[0].get(params);
		};

		/**
		 *  @param {string} presetName the preset name
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.setPreset = function(presetName){
			for (var i = 0; i < this.voices.length; i++){
				this.voices[i].setPreset(presetName);
			}
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.PolySynth} `this`
		 */
		Tone.PolySynth.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			for (var i = 0; i < this.voices.length; i++){
				this.voices[i].dispose();
				this.voices[i] = null;
			}
			this.voices = null;
			this._activeVoices = null;
			this._freeVoices = null;
			return this;
		};

		return Tone.PolySynth;
	});
	ToneModule( function(Tone){

		

		/**
		 * 	@class  Clip the incoming signal so that the output is always between min and max
		 * 	
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} min the minimum value of the outgoing signal
		 *  @param {number} max the maximum value of the outgoing signal
		 *  @example
		 *  var clip = new Tone.Clip(0.5, 1);
		 *  var osc = new Tone.Oscillator().connect(clip);
		 *  //clips the output of the oscillator to between 0.5 and 1.
		 */
		Tone.Clip = function(min, max){
			//make sure the args are in the right order
			if (min > max){
				var tmp = min;
				min = max;
				max = tmp;
			}
			
			/**
			 *  The min clip value
			 *  @type {Tone.Signal}
			 */
			this.min = this.input = new Tone.Min(max);

			/**
			 *  The max clip value
			 *  @type {Tone.Signal}
			 */
			this.max = this.output = new Tone.Max(min);

			this.min.connect(this.max);
		};

		Tone.extend(Tone.Clip, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.Clip} `this`
		 */
		Tone.Clip.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.min.dispose();
			this.min = null;
			this.max.dispose();
			this.max = null;
			return this;
		};

		return Tone.Clip;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  this is the maximum value that the divide can handle	
		 *  @type {number}
		 *  @const
		 */
		var MAX_VALUE = Math.pow(2, 13);

		/**
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
		var guessCurve = new Array(MAX_VALUE);
		//set the value
		for (var i = 0; i < guessCurve.length; i++){
			var normalized = (i / (guessCurve.length - 1)) * 2 - 1;
			if (normalized === 0){
				guessCurve[i] = 0;
			} else {
				guessCurve[i] = 1 / (normalized * MAX_VALUE);
			}
		}

		/**
		 *  @class Compute the inverse of the input.
		 *         Uses this approximation algorithm: 
		 *         http://en.wikipedia.org/wiki/Multiplicative_inverse#Algorithms
		 *
		 *  @deprecated
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} [precision=3] the precision of the calculation
		 */
		Tone.Inverse = function(precision){

			console.warn("Tone.Inverse has been deprecated. Multiply is always more efficient than dividing.");

			Tone.call(this);

			precision = this.defaultArg(precision, 3);

			/**
			 *  a constant generator of the value 2
			 *  @private
			 *  @type {Tone.Signal}
			 */
			this._two = new Tone.Signal(2);

			/**
			 *  starting guess is 0.1 times the input
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._guessMult = new Tone.Multiply(1/MAX_VALUE);

			/**
			 *  produces a starting guess based on the input
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._guess = new Tone.WaveShaper(guessCurve);
			this.input.chain(this._guessMult, this._guess);

			/**
			 *  the array of inverse helpers
			 *  @type {Array}
			 *  @private
			 */
			this._inverses = new Array(precision);

			//create the helpers
			for (var i = 0; i < precision; i++){
				var guess;
				if (i === 0){
					guess = this._guess;
				} else {
					guess = this._inverses[i-1];
				}
				var inv = new InverseHelper(guess, this._two);
				this.input.connect(inv);
				this._inverses[i] = inv;
			}
			this._inverses[precision-1].connect(this.output);
		};

		Tone.extend(Tone.Inverse, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.Inverse} `this`
		 */
		Tone.Inverse.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			for (var i = 0; i < this._inverses.length; i++){
				this._inverses[i].dispose();
				this._inverses[i] = null;
			}
			this._inverses = null;
			this._two.dispose();
			this._two = null;
			this._guessMult.dispose();
			this._guessMult = null;
			this._guess.disconnect();
			this._guess = null;
			return this;
		};

		// BEGIN INVERSE HELPER ///////////////////////////////////////////////////

		/**
		 *  internal helper function for computing the inverse of a signal
		 *  @extends {Tone}
		 *  @constructor
		 *  @private
		 */
		var InverseHelper = function(guess, two){
			this._outerMultiply = new Tone.Multiply();
			this._innerMultiply = new Tone.Multiply();
			this._subtract = new Tone.Subtract();
			//connections
			guess.connect(this._innerMultiply, 0, 1);
			two.connect(this._subtract, 0, 0);
			this._innerMultiply.connect(this._subtract, 0, 1);
			this._subtract.connect(this._outerMultiply, 0, 1);
			guess.connect(this._outerMultiply, 0, 0);
			this.output = this._outerMultiply;
			this.input = this._innerMultiply;
		};

		Tone.extend(InverseHelper);

		InverseHelper.prototype.dispose = function(){
			this._outerMultiply.dispose();
			this._outerMultiply = null;
			this._innerMultiply.dispose();
			this._innerMultiply = null;
			this._subtract.dispose();
			this._subtract = null;
		};
		
		// END INVERSE HELPER /////////////////////////////////////////////////////

		return Tone.Inverse;
	});
	ToneModule( 
	function(Tone){

		

		/**
		 *  @class Divide by a value or signal. 
		 *         input 0: numerator. input 1: divisor. 
		 *
		 *  @deprecated
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number=} divisor if no value is provided, Tone.Divide will divide the first
		 *                         and second inputs. 
		 *  @param {number} [precision=3] the precision of the calculation
		 */
		Tone.Divide = function(divisor, precision){

			console.warn("Tone.Divide has been deprecated. If possible, it's much more efficient to multiply by the inverse value.");

			Tone.call(this, 2, 0);

			/**
			 *  the denominator value
			 *  @type {Tone.Signal}
			 *  @private
			 */
			this._denominator = null;

			/**
			 *  the inverse
			 *  @type {Tone}
			 *  @private
			 */
			this._inverse = new Tone.Inverse(precision);

			/**
			 *  multiply input 0 by the inverse
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._mult = new Tone.Multiply();

			if (isFinite(divisor)){
				this._denominator = new Tone.Signal(divisor);
				this._denominator.connect(this._inverse);
			}
			this.input[1] = this._inverse;
			this._inverse.connect(this._mult, 0, 1);
			this.input[0] = this.output = this._mult.input[0];
		};

		Tone.extend(Tone.Divide, Tone.SignalBase);

		/**
		 * The value being divided from the incoming signal. Note, that
		 * if Divide was constructed without a divisor, it expects
		 * that the signals to numberator will be connected to input 0 and 
		 * the denominator to input 1 and therefore will throw an error when 
		 * trying to set/get the value. 
		 * 
		 * @memberOf Tone.Divide#
		 * @type {number}
		 * @name value
		 */
		Object.defineProperty(Tone.Divide.prototype, "value", {
			get : function(){
				if (this._denominator !== null){
					return this._denominator.value;
				} else {
					throw new Error("cannot switch from signal to number");
				}
			},
			set : function(value){
				if (this._denominator !== null){
					this._denominator.value = value;
				} else {
					throw new Error("cannot switch from signal to number");
				}
			}
		});

		/**
		 *  clean up
		 *  @returns {Tone.Divide} `this`
		 */
		Tone.Divide.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			if (this._denominator){
				this._denominator.dispose();
				this._denominator = null;
			}
			this._inverse.dispose();
			this._inverse = null;
			this._mult.dispose();
			this._mult = null;
			return this;
		};

		return Tone.Divide;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Normalize takes an input min and max and maps it linearly to [0,1]
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var norm = new Tone.Normalize(2, 4);
		 *  var sig = new Tone.Signal(3).connect(norm);
		 *  //output of norm is 0.5. 
		 */
		Tone.Normalize = function(inputMin, inputMax){

			/**
			 *  the min input value
			 *  @type {number}
			 *  @private
			 */
			this._inputMin = this.defaultArg(inputMin, 0);

			/**
			 *  the max input value
			 *  @type {number}
			 *  @private
			 */
			this._inputMax = this.defaultArg(inputMax, 1);

			/**
			 *  subtract the min from the input
			 *  @type {Tone.Add}
			 *  @private
			 */
			this._sub = this.input = new Tone.Add(0);

			/**
			 *  divide by the difference between the input and output
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._div = this.output = new Tone.Multiply(1);

			this._sub.connect(this._div);
			this._setRange();
		};

		Tone.extend(Tone.Normalize, Tone.SignalBase);

		/**
		 * The minimum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.Normalize.prototype, "min", {
			get : function(){
				return this._inputMin;
			},
			set : function(min){
				this._inputMin = min;
				this._setRange();
			}
		});

		/**
		 * The maximum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.Normalize.prototype, "max", {
			get : function(){
				return this._inputMax;
			},
			set : function(max){
				this._inputMax = max;
				this._setRange();
			}
		});

		/**
		 *  set the values
		 *  @private
		 */
		Tone.Normalize.prototype._setRange = function() {
			this._sub.value = -this._inputMin;
			this._div.value = 1 / (this._inputMax - this._inputMin);
		};

		/**
		 *  clean up
		 *  @returns {Tone.Normalize} `this`
		 */
		Tone.Normalize.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._sub.dispose();
			this._sub = null;
			this._div.dispose();
			this._div = null;
			return this;
		};

		return Tone.Normalize;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class Route a single input to the specified output
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputCount=2] the number of inputs the switch accepts
		 *  @example
		 *  var route = new Tone.Route(4);
		 *  var signal = new Tone.Signal(3).connect(route);
		 *  route.gate.value = 0;
		 *  //signal is routed through output 0
		 *  route.gate.value = 3;
		 *  //signal is now routed through output 3
		 */
		Tone.Route = function(outputCount){

			outputCount = this.defaultArg(outputCount, 2);
			Tone.call(this, 1, outputCount);

			/**
			 *  the control signal
			 *  @type {Tone.Signal}
			 */
			this.gate = new Tone.Signal(0);

			//make all the inputs and connect them
			for (var i = 0; i < outputCount; i++){
				var routeGate = new RouteGate(i);
				this.output[i] = routeGate;
				this.gate.connect(routeGate.selecter);
				this.input.connect(routeGate);
			}
		};

		Tone.extend(Tone.Route, Tone.SignalBase);

		/**
		 *  routes the signal to one of the outputs and close the others
		 *  @param {number} [which=0] open one of the gates (closes the other)
		 *  @param {Tone.Time} time the time when the switch will open
		 *  @returns {Tone.Route} `this`
		 */
		Tone.Route.prototype.select = function(which, time){
			//make sure it's an integer
			which = Math.floor(which);
			this.gate.setValueAtTime(which, this.toSeconds(time));
			return this;
		};

		/**
		 *  dispose method
		 *  @returns {Tone.Route} `this`
		 */
		Tone.Route.prototype.dispose = function(){
			this.gate.dispose();
			for (var i = 0; i < this.output.length; i++){
				this.output[i].dispose();
				this.output[i] = null;
			}
			Tone.prototype.dispose.call(this);
			this.gate = null;
			return this;
		}; 

		////////////START HELPER////////////

		/**
		 *  helper class for Tone.Route representing a single gate
		 *  @constructor
		 *  @extends {Tone}
		 *  @private
		 */
		var RouteGate = function(num){

			/**
			 *  the selector
			 *  @type {Tone.Equal}
			 */
			this.selecter = new Tone.Equal(num);

			/**
			 *  the gate
			 *  @type {GainNode}
			 */
			this.gate = this.input = this.output = this.context.createGain();

			//connect the selecter to the gate gain
			this.selecter.connect(this.gate.gain);
		};

		Tone.extend(RouteGate);

		/**
		 *  clean up
		 *  @private
		 */
		RouteGate.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.selecter.dispose();
			this.gate.disconnect();
			this.selecter = null;
			this.gate = null;
		};

		////////////END HELPER////////////

		//return Tone.Route
		return Tone.Route;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  When the gate is set to 0, the input signal does not pass through to the output. 
		 *          If the gate is set to 1, the input signal passes through.
		 *          the gate is initially closed.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 *  var sigSwitch = new Tone.Switch();
		 *  var signal = new Tone.Signal(2).connect(sigSwitch);
		 *  //initially no output from sigSwitch
		 *  sigSwitch.gate.value = 1;
		 *  //open the switch and allow the signal through
		 *  //the output of sigSwitch is now 2. 
		 */
		Tone.Switch = function(){
			Tone.call(this);

			/**
			 *  the control signal for the switch
			 *  when this value is 0, the input signal will not pass through,
			 *  when it is high (1), the input signal will pass through.
			 *  
			 *  @type {Tone.Signal}
			 */
			this.gate = new Tone.Signal(0);

			/**
			 *  thresh the control signal to either 0 or 1
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
			this._thresh = new Tone.GreaterThan(0.5);

			this.input.connect(this.output);
			this.gate.chain(this._thresh, this.output.gain);
		};

		Tone.extend(Tone.Switch, Tone.SignalBase);

		/**
		 *  open the switch at a specific time
		 *
		 *  @param {Tone.Time=} time the time when the switch will be open
		 *  @returns {Tone.Switch} `this`
		 *  @example
		 *  //open the switch to let the signal through
		 *  sigSwitch.open();
		 */
		Tone.Switch.prototype.open = function(time){
			this.gate.setValueAtTime(1, this.toSeconds(time));
			return this;
		}; 

		/**
		 *  close the switch at a specific time
		 *
		 *  @param {Tone.Time} time the time when the switch will be open
		 *  @returns {Tone.Switch} `this`
		 *  @example
		 *  //close the switch a half second from now
		 *  sigSwitch.close("+0.5");
		 */
		Tone.Switch.prototype.close = function(time){
			this.gate.setValueAtTime(0, this.toSeconds(time));
			return this;
		}; 

		/**
		 *  clean up
		 *  @returns {Tone.Switch} `this`
		 */
		Tone.Switch.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this.gate.dispose();
			this._thresh.dispose();
			this.gate = null;
			this._thresh = null;
			return this;
		}; 

		return Tone.Switch;
	});
	ToneModule( function(Tone){

		

		/**
		 *  @class  WebRTC Microphone. 
		 *          CHROME ONLY (for now) because of the 
		 *          use of the MediaStreamAudioSourceNode
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {number=} inputNum 
		 */
		Tone.Microphone = function(inputNum){
			Tone.Source.call(this);

			/**
			 *  @type {MediaStreamAudioSourceNode}
			 *  @private
			 */
			this._mediaStream = null;
			
			/**
			 *  @type {LocalMediaStream}
			 *  @private
			 */
			this._stream = null;
			
			/**
			 *  @type {Object}
			 *  @private
			 */
			this._constraints = {"audio" : true};

			//get the option
			var self = this;
			MediaStreamTrack.getSources(function (media_sources) {
				if (inputNum < media_sources.length){
					self.constraints.audio = {
						optional : [{ sourceId: media_sources[inputNum].id}]
					};
				}
			});		
		};

		Tone.extend(Tone.Microphone, Tone.Source);

		/**
		 *  start the stream. 
		 *  @private
		 */
		Tone.Microphone.prototype._start = function(){
			navigator.getUserMedia(this._constraints, 
				this._onStream.bind(this), this._onStreamError.bind(this));
		};

		/**
		 *  stop the stream. 
		 *  @private
		 */
		Tone.Microphone.prototype._stop = function(){
			this._stream.stop();
			return this;
		};

		/**
		 *  called when the stream is successfully setup
		 *  @param   {LocalMediaStream} stream 
		 *  @private
		 */
		Tone.Microphone.prototype._onStream = function(stream) {
			this._stream = stream;
			// Wrap a MediaStreamSourceNode around the live input stream.
			this._mediaStream = this.context.createMediaStreamSource(stream);
			this._mediaStream.connect(this.output);
		};

		/**
		 *  called on error
		 *  @param   {Error} e 
		 *  @private
		 */
		Tone.Microphone.prototype._onStreamError = function(e) {
			console.error(e);
		};

		/**
		 *  clean up
		 *  @return {Tone.Microphone} `this`
		 */
		Tone.Microphone.prototype.dispose = function() {
			Tone.Source.prototype.dispose.call(this);
			if (this._mediaStream){
				this._mediaStream.disconnect();
				this._mediaStream = null;
			}
			this._stream = null;
			this._constraints = null;
			return this;
		};

		//polyfill
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
			navigator.mozGetUserMedia || navigator.msGetUserMedia;

		return Tone.Microphone;
	});

	//requirejs compatibility
	if ( typeof define === "function" && define.amd ) {
		define( "Tone", [], function() {
			return Tone;
		});
	} else {
		root.Tone = Tone;
	}
} (this));
},{}],112:[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1]);
