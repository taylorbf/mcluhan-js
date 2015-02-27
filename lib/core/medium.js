
// Template for all DOM-based items (video, audio, divs, embeds)

var Medium = module.exports = function(params) {

	// handle parameters
	this.params = params ? params : new Object()

	// define space
	this.spaces = this.params.spaces ? this.params.spaces : 0;

	// make element
	this.element = [];
	for (var i = 0; i<this.spaces.length; i++) {
		this.element.push(document.createElement(this.type))
		spaces[this.spaces[i]].element.document.body.appendChild(this.element[i])
	}

	this.size(params)
}

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
	this.params.w ? this.element.style.width = this.params.w+"px" : false;
	this.params.width ? this.element.style.width = this.params.width+"px" : false;
	this.params.h ? this.element.style.width = this.params.h+"px" : false;
	this.params.height ? this.element.style.width = this.params.height+"px" : false;
}

Medium.prototype.move = function(params) {
	this.element.style.position = "absolute";
	params.x ? this.element.style.left = params.x+"px" : false;
	params.y ? this.element.style.top = params.y+"px" : false;
}