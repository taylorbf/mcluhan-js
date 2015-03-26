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

