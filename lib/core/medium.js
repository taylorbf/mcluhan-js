var Medium = module.exports = function(params) {
	this.test = true;

	this.element = document.createElement(this.type)
	document.body.appendChild(this.element);
}