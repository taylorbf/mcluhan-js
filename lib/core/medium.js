var Medium = module.exports = function(params) {
	this.test = true;

	this.element = document.createElement(this.type)
	document.body.appendChild(this.element);

	this.size(params)
}

Medium.prototype.size = function(params) {
	console.log(params)
	params.w ? this.element.style.width = params.w+"px" : false;
	params.width ? this.element.style.width = params.width+"px" : false;
	params.h ? this.element.style.width = params.h+"px" : false;
	params.height ? this.element.style.width = params.height+"px" : false;
}

Medium.prototype.move = function(params) {
	this.element.style.position = "absolute";
	params.x ? this.element.style.left = params.x+"px" : false;
	params.y ? this.element.style.top = params.y+"px" : false;
}