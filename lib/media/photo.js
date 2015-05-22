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

	this.defaultSize = { w: 800 }
	this.type = "canvas";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.context = []

	for (var i = 0; i<this.spaces.length; i++) {
		this.context.push(this.element[i].getContext("2d"))
	}

	this.width = 0;
	this.height = 0;

	this.zoomstate = {
		x: 0,
		y: 0,
		level: 1
	}

	/* create hidden canvas */

	this.master = document.createElement("canvas")
	this.master.style.display = "none"
	document.body.appendChild(this.master)
	this.mastercontext = this.master.getContext("2d")


}

util.inherits(Photo, Medium);

/*
THE PLAN
as it is now -- new Image(), one canvas
the glitch is controlled (has stable seed, only glitches original image)
	except, does not glitch an image, glitches a canvas.
in end, glitch result must be copied using drawImage()
and, don't want to glitch each step of resize process...

or
hidden canvas with original image, glitches, 
can glitch that one
always copy it over, use putimagedata
can *sort of* zoome with putimagedata

or

can drawImage(canvas)
never use drawimage (except the first time)
always use get image data and putimagedata
always transform the current thing
still have original data in background if wish to reset
<<<
because transforming existing transformations is interesting, apparently


 */

Photo.prototype.load = function(src) {

	this.master.width = this.master.width;

	this.image = new Image()
	this.image.onload = function() {
		this.width = this.image.width;
		this.height = this.image.height

		this.master.width = this.width;
		this.master.height = this.height;
		this.master.style.width = this.width;
		this.master.style.height = this.height;
		this.mastercontext.drawImage(this.image,0,0)

		for (var i=0;i<this.context.length;i++) {
			this.element[i].width = this.width;
			this.element[i].height = this.height;
			this.element[i].style.width = this.width;
			this.element[i].style.height = this.height;
		}
		this.propogateMaster();

		//this.data = this.context[0].getImageData( 0, 0, this.width, this.height );
		// dealing with image data
		/*this.data = {
			original: this.context[0].getImageData( 0, 0, this.width, this.height ),
			current: 0
		}*/

	}.bind(this)

	if (src.indexOf("http")==0) {
		this.image.src = src
		this.image.crossOrigin = "Anonymous";
	} else {
		this.image.src = "images/"+src+".jpg"
	}
	
	return this;
}


Photo.prototype.propogateMaster = function() {
	for (var i=0;i<this.context.length;i++) {
		this.context[i].drawImage(this.master, this.zoomstate.x, this.zoomstate.y,this.zoomstate.level*this.width,this.zoomstate.level*this.height,0,0,this.width,this.height );
	}
}

Photo.prototype.glitch = function(file,callback) {
	this.data = this.mastercontext.getImageData( 0, 0, this.width, this.height );

	// glitch the image data (passing drawImageDataInCanvasTwo as a callback function)
	var parameters = { amount: 10, seed: 1, iterations: 10, quality: 30 };
	
	//console.log(parameters)
	//console.log(glitch)
	
	glitch( this.data, parameters, function(data) {
		this.mastercontext.putImageData( data, 0, 0 );
		this.propogateMaster();
	}.bind(this));
		
}

Photo.prototype.zoom = function(params) {
	if (params.level) {
		this.zoomstate.level = params.level
	}
	if (params.x) {
		this.zoomstate.x = params.x * this.width
	}
	if (params.y) {
		this.zoomstate.y = params.y * this.height
	}

	this.propogateMaster();

	/*for (var i = 0; i<this.element.length; i++) {
		this.context[i].drawImage(this.image, this.zoomstate.x, this.zoomstate.y,this.zoomstate.level*this.width,this.zoomstate.level*this.height,0,0,this.width,this.height );
	} */

}