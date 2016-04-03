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
	this.washWord = 0
	this.mode = "default"

	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "normal"
		this.element[i].style.backgroundColor = "#000"
		this.element[i].style.fontFamily = "Open Sans"
		this.element[i].style.opacity = 0.6
		this.element[i].style.color = "#fff"
		this.element[i].style.padding = "15px"
		this.element[i].style.fontSize = "30px"
		this.element[i].style.width = "auto"
		this.element[i].style.maxWidth = m.stage.w+"px"
		this.element[i].style.boxSizing = "border-box"
		this.element[i].style.top = "25px"
		this.element[i].style.left = "25px"
		this.element[i].style.margin = "20px"
		this.element[i].style.display = "inline-block"
		this.element[i].style.zIndex = "100"

	}


}

util.inherits(Paper, Medium);

/** 
 * .
 */
Paper.prototype.read = function(text) {
	if (journal[text]) {
		this.text = journal[text];
	} else {
		this.text = text ? text : "null"
	}
	this.words = this.text.split(" ");
	this.letters = this.text.split("");
	this.edit(this.text)
	return this;
}

/* eventually move this to happen at start up for all files in
/media/text folder, and to make them stored in journals object
with filname as object key */
/** 
 * .
 */
Paper.prototype.readFile = function(file,callback) {
	file = file ? file : "hello"
	this.text
	$.get("text/"+file+'.txt', function(text) {
		this.text = text ? text : "null"
		this.words = this.text.split(" ");
		this.letters = this.text.split("");
		var bc = callback.bind(this)
	    bc(data);
	}.bind(this), 'text')
	return this
}
/** 
 * .
 */
Paper.prototype.edit = function(text) {
	this.text = text
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.text
		this.element[i].style.margin = "25px"
		this.element[i].style.display = "inline-block"
	}
	this.words = this.text.split(" ");
	this.letters = this.text.split("");
	return this;
}
/** 
 * .
 */
Paper.prototype.and = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.elements[i].innerHTML + this.text
	}
	return this
}
/** 
 * .
 */
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
	return this
}
/** 
 * .
 */
Paper.prototype.flip = function(time) {
	time ? this.time = time : null;
	this.flipint = setInterval(this.flipOne.bind(this), time)
	return this
}
/** 
 * .
 */
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
	return this
}
/** 
 * .
 */
Paper.prototype.unflip = function(file) {
	clearInterval(this.flipint);
	return this
}

/** 
 * .
 */
Paper.prototype.flash = function() {
	if (this.mode != "flash") {
		this.mode = "flash"
	  for (var i=0;i<this.element.length;i++) {
			this.element[i].className = "fullScreen"
			this.element[i].style.width = this.spaces[i].element.innerWidth+"px"
			this.element[i].style.height = this.spaces[i].element.innerHeight+"px"
			this.element[i].style.lineHeight = this.spaces[i].element.innerHeight+"px"
			this.element[i].style.margin = "0px"
			this.element[i].style.display = "block"
			this.element[i].style.backgroundColor = "black"
			this.element[i].style.color = "white"
		}
	}
	
	this.flashOne()
	return this
	//this.washint = setInterval(this.washOne.bind(this), time)
}
/** 
 * .
 */
Paper.prototype.flashOne = function() {
	for (var i=0;i<this.element.length;i++) {
		if (!this.strobe) {
			this.element[i].style.backgroundColor = "black"
			this.element[i].style.color = "white"
		} else {
			this.element[i].style.backgroundColor = "white"
			this.element[i].style.color = "black"
		}
		this.element[i].innerHTML = this.words[this.washWord];
	}
	if (!this.strobe) {
		this.strobe = true;
	} else {
		this.strobe = false;
	}
	/*for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.words[this.washWord];
	} */
	this.washWord++;
	if (this.washWord>=this.words.length) {
		this.washWord = 0;
	}
}
/** 
 * .
 */
Paper.prototype.washOne = function() {
	for (var i=0;i<this.element.length;i++) {
		if (!this.strobe) {
		//	this.element[i].style.backgroundColor = "black"
		//	this.element[i].style.color = "white"
		} else {
		//	this.element[i].style.backgroundColor = "white"
		//	this.element[i].style.backgroundColor = "white"
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
	}
}
/** 
 * .
 */
Paper.prototype.unwash = function() {
	clearInterval(this.washint);
	return this
}



