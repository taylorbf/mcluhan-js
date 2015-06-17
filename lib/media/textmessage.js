var util = require('util');
var Medium = require('../core/medium')

/**
 * @class TextMessage
 * @constructor
 * @description  Performative TEXT MESSAGE media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {TextMessage}
 */
var TextMessage = module.exports = function(params) {

	this.defaultSize = { w: 300, h: 700 }
	this.type = "div";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "textcontainer"
		this.element[i].inner = document.createElement("div")
		this.element[i].inner.className = "textmessage"
		this.element[i].appendChild(this.element[i].inner)

	}

	this.me = true;
	this.history = []
	this.histIndex = 0;

}

util.inherits(TextMessage, Medium);

TextMessage.prototype.text = function(msg,skiplog) {

	for (var i=0;i<this.element.length;i++) {

		var node1 = document.createElement('div')
		node1.className = this.me ? 'from-me' : 'from-them'
		node1.innerHTML = msg

		var node2 = document.createElement('div')
		node2.className = 'clear';

		this.element[i].inner.appendChild(node1)
		this.element[i].inner.appendChild(node2)

		$(node1).fadeIn(300)
		this.me = !this.me

	}

	if (!skiplog) {
		this.history.push(msg)
	}

}

TextMessage.prototype.scroll = function(msg) {

	this.scrolling = true;
	this.oneScroll()
	
}

TextMessage.prototype.oneScroll = function() {

	console.log(this.histIndex)

	this.histIndex = cycle(this.histIndex,0,this.history.length)

	this.text(this.history[this.histIndex],true)

	if (this.scrolling) {
		setTimeout(this.oneScroll.bind(this),200)
	}

}








/* Leftover from TEXT widget, may be useful if adapted.... */

TextMessage.prototype.read = function(text) {
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
TextMessage.prototype.readFile = function(file,callback) {
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

TextMessage.prototype.write = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.text
	}
	return this;
}

TextMessage.prototype.and = function() {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.elements[i].innerHTML + this.text
	}
}

TextMessage.prototype.writeAcross = function() {
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


