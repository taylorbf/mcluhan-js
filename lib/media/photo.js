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

	this.defaultSize = { w: 900, h: 700 }
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

	/* create image in background */
	this.image = new Image()

	this.image.onload = function() {
		if (this.image.naturalHeight / m.stage.h >= this.image.naturalWidth / m.stage.w) {
			this._sizeAll(this.defaultSize.w)
		} else {
			var w = this.defaultSize.h*this.image.naturalWidth/this.image.naturalHeight
			//example:
			//if image is 2x1 pixels
			//and default height of this media is 700
			//then will resize to
			//var w = 2/1*700
			//width will be 1400
			//height will be 700
			this._sizeAll(w)
		}
		
		this.mastercontext.drawImage(this.image,0,0)

		if (this.pixelated) {
			this._pixelate()
		}

		this.size(this.width,this.height)
		this.propogateMaster()

	}.bind(this)

	this.pixelated = false
	this.pixelation = 30

}

util.inherits(Photo, Medium);


/** 
 * Load an image
 */
Photo.prototype.load = function(src) {

	this.master.width = this.master.width;

	this.image.onerror = function () {
   console.error("Cannot load image");
   //do something else...
	}

	if (src.indexOf("http")==0) {
		this.image.src = src
		this.image.crossOrigin = "Anonymous";
	} else {
		
		if (src.indexOf("png")>=0 || src.indexOf("gif")>=0 || src.indexOf("jpg")>=0) {
			this.image.src = "media/images/"+src
		} else {
			this.image.src = "media/images/"+src+".jpg"
		}

		if (this.image.complete) {
			console.log("complete so onload happening again")
	    this.image.onload()
	  }
		
		
	}
	
	return this;
}

/*
 * .
 */
Photo.prototype.propogateMaster = function() {
	for (var i=0;i<this.context.length;i++) {
		this.context[i].drawImage(this.master, this.zoomstate.x, this.zoomstate.y,this.zoomstate.level*this.width,this.zoomstate.level*this.height,0,0,this.width,this.height );
	}
	return this
}

/** 
 * Glitch the image using glitch.js
 */
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

	return this
		
}

/*
 * .
 */
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

	return this

}

/** 
 * Pixelate
 */
Photo.prototype.pixelate = function(degree) {

	this.pixelated = true

	if (degree) {
		this.pixelation = degree
	}

	this._pixelate()
	this.propogateMaster()

	return this

}

Photo.prototype._pixelate = function() {

	if (this.pixelation < 10) {
		this.pixelation = 10
	}

  var sourceWidth = this.image.width
  var sourceHeight = this.image.height
  var destX = this.master.width / 2 - sourceWidth / 2
  var destY = this.master.height / 2 - sourceHeight / 2

	var sourceX = destX
  var sourceY = destY

  var imageData = this.mastercontext.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
  var data = imageData.data;

  for(var y = 0; y < sourceHeight; y += this.pixelation) {
    for(var x = 0; x < sourceWidth; x += this.pixelation) {
      var red = data[((sourceWidth * y) + x) * 4];
      var green = data[((sourceWidth * y) + x) * 4 + 1];
      var blue = data[((sourceWidth * y) + x) * 4 + 2];

      for(var n = 0; n < this.pixelation; n++) {
        for(var m = 0; m < this.pixelation; m++) {
          if(x + m < sourceWidth) {
            data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
          }
        }
      }
    }
  }

  // overwrite original image
  this.mastercontext.putImageData(imageData, destX, destY)
	return this

}


/** 
 * Resize
 */
Photo.prototype.size = function(params,h) {

	if (this.image) {
		console.log("sizing video")
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		console.log(params)
		this._sizeAll(params.w,params.h)

		this.draw()
	} else {
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		for (var i = 0; i<this.element.length; i++) {
			this.element[i].style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
			this.element[i].style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
		}
	}
	return this
}


Photo.prototype._destroy = function() {
	//remove image element.. 
	//remove master canvas.. 
}

Photo.prototype.draw = function() {
	this.mastercontext.drawImage(this.image,0,0,this.image.width,this.image.height)
	if (this.pixelated) {
		this._pixelate()
	}
	this.propogateMaster()
}

Photo.prototype._sizeAll = function(w,h) {
	if (!h) {
		h = w*this.image.naturalHeight/this.image.naturalWidth	
	}
	this.master.width = this.image.width = this.width = Math.round(w)
	this.master.height = this.image.height = this.height = Math.round(h)

	console.log(w,h)

	for (var i = 0; i<this.element.length; i++) {
		this.element[i].width = Math.round(w)
		this.element[i].height = Math.round(h)
		this.element[i].style.width = Math.round(w)+"px"
		this.element[i].style.height = Math.round(h)+"px"
	}
}

