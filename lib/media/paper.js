var util = require('util');
var Medium = require('../core/medium')


var Paper = module.exports = function(params) {

	this.defaultSize = { w: 300 }
	this.type = "div"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	for (var i=0;i<this.element.length;i++) {
		this.element[i].className = "normal"
	}


}

util.inherits(Paper, Medium);

Paper.prototype.write = function(msg) {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = msg
	}
	return this;
}

Paper.prototype.and = function(rate) {
	for (var i=0;i<this.element.length;i++) {
		this.element[i].innerHTML = this.elements[i].innerHTML + msg
	}
}

Paper.prototype.read = function(file) {
	file = file ? file : "hello"
	$.get("text/"+file+'.txt', function(data) {
	   this.write(data);
	}.bind(this), 'text');
}

Paper.prototype.flutter = function(file) {
	file = file ? file : "hello"
	$.get("text/"+file+'.txt', function(data) {
		this.words = data.split(" ");
		for (var i=0;i<this.element.length;i++) {
			this.element[i].className = "fullScreen"
			console.log(this.spaces[i].element.innerWidth)
			this.element[i].style.width = this.spaces[i].element.innerWidth+"px"
			this.element[i].style.height = this.spaces[i].element.innerHeight+"px"
			this.element[i].style.lineHeight = this.spaces[i].element.innerHeight+"px"
			if (i<this.words.length) {	
				this.element[i].innerHTML = this.words[i]
			}
		}
	}.bind(this), 'text');
}

