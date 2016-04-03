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

window.components = require("./lib/media")

for (var key in window.components) {
	window[key] = window.components[key]
}


/* audio setup */ 

window.player = m.player;
//window.pitch = m.pitch;
window.bp = m.bp;
window.echo = m.echo;
window.hall = m.hall;
window.vol = m.vol;
window.pan = m.pan;
window.fx = m.fx;
window.sine = m.sine;
window.noise = m.noise;


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

window.random = function(bound1,bound2) {
	if (!bound2) {
		bound2 = bound1
		bound1 = 0
	}
	var low = Math.min(bound1,bound2)
	var high = Math.max(bound1,bound2)
	return Math.floor(Math.random()*(high-low)+low)
}
window.r = function(bound1,bound2) {
	if (!bound2) {
		bound2 = bound1
		bound1 = 0
	}
	var low = Math.min(bound1,bound2)
	var high = Math.max(bound1,bound2)
	return Math.floor(Math.random()*(high-low)+low)
}
window.rf = function(bound1,bound2) {
	if (!bound2) {
		bound2 = bound1
		bound1 = 0
	}
	var low = Math.min(bound1,bound2)
	var high = Math.max(bound1,bound2)
	return Math.random()*(high-low)+low
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


window.journal = { 
	"hello": "Hello Digital World",
	"dreampoem": "dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains.--WAKEFIELD.] dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains.--WAKEFIELD.] dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains.--WAKEFIELD.] dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his" 
}

