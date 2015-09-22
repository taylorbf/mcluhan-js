var Manager = require('./lib/core/manager');
//var math = require('./lib/utils/math');
var extend = require('extend');
require('nexusui');
window._ = require("underscore")
window.glitch = require("./bower_components/glitch-canvas/dist/glitch-canvas")
window.Nightmare = require ("nightmare")
window.Tone = require('tone').Tone
require('./lib/utils/bt')
//window.googleit = require('google-image-search')
window.googleimage = require('google-images')
//console.log(googleimage)

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

window.feedbackDelay = new Tone.PingPongDelay({
    "delayTime" : 0.07,
    "feedback" : 0.94,
    "wet" : 0.5
}).toMaster();
window.siri = new voice()

window.onload = function() {

	// no longer fired -- overwritten by nexus's onload

	/*console.log("onload happens")
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
	siri = new voice() */
};


//currently implemented in WALL object instead
window.alt = function() {




}



window.Tonify = function(el) {

}
/*
window.say = function(text,speed,pitch) {
	siri.say({
		"text": text,
		"speed": speed,
		"pitch": pitch
	})
} */


//GLOBAL BT LIBARY

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

window.cycle = function(input,min,max) {
	input++;
	if (input >= max) {
		input = min;
	}
	return input;
}

window.loadScript = function (url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}


window.SmartMatrix = function(cols,rows) {

	this.rows = rows;
	this.cols = cols;

	this.row = 0;
	this.col = 0;

	this.index = 0;
	this.max = this.rows * this.cols;

	this.advance = function() {
	
		this.index++;

		if (this.index >= this.max ) {
			this.index = 0;
		}

		this.getCoordinate(this.index);

	}

	this.getCoordinate = function(index) {
		this.index = index;
		this.row = Math.floor(index/this.cols)
		this.col = index - (this.row * this.cols)
		this.ping();
	}

	this.ping = function() {
		return {
			row: this.row,
			col: this.col
		}
	}

	this.advanceRow = function() {
		this.row++
		if (this.row >= this.rows) {
			this.row = 0
		}
		this.setIndex()
		this.ping()
	}

	this.advanceCol = function() {
		this.col++
		if (this.col >= this.cols) {
			this.col = 0
		}
		this.setIndex()
		this.ping()
	}

	this.setIndex = function() {
		this.index = this.col + (this.row * this.cols)
	}

	//have a 'translate index to row' func, same for col
	//have a 'step through' function that returns an object with next row/col
	//have a 'step row' that goes to next in row, then cycles around
	//have a 'steo col' that goes through col and cycles around

}

