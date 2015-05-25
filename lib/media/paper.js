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

