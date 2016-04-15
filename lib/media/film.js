var util = require('util');
var Medium = require('../core/medium')

/**
 * @constructor
 * @description  Performative VIDEO media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Cassette}
 */

var Film = module.exports = function(params) {

	this.defaultSize = { w: 900, h: 900 }

	this.type = "canvas"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	/* used in the skip() interval */
	this.boundJump = this.jump.bind(this,0)

	this.interval = false;

	/* playback rate */
	this.rate = 1;

	/* prime canvases */
	this.context = []
	for (var i = 0; i<this.spaces.length; i++) {
		this.context.push(this.element[i].getContext("2d"))
	}


	/* create the master video element */
	this.video = this.spaces[0].element.document.createElement("video")

	this.video.addEventListener('play', this.draw.bind(this),false)

	this.video.onload = function() {
		if (this.width == this.defaultSize.w) {
			this.size(this.width*this.video.videoHeight/this.video.videoWidth)
		}
	}.bind(this)


	/* create hidden canvas for image processing*/

	this.master = this.spaces[0].element.document.createElement("canvas")
	this.master.style.display = "none"
	this.spaces[0].element.document.body.appendChild(this.master)
	this.mastercontext = this.master.getContext("2d")



	this.video.width = this.master.width = this.width = this.defaultSize.w
	this.video.height = this.master.height = this.height = this.defaultSize.h
	this.video.style.width = this.master.style.width = this.width+"px"
	this.video.style.height = this.master.style.height = this.height+"800px"


	/* size the video elements in each window */
	for (var i=0;i<this.context.length;i++) {
			this.element[i].width = this.width
			this.element[i].height = this.height
			this.element[i].style.width = this.width
			this.element[i].style.height = this.height
	}

	this.video.volume = 0

	/* default: loop on */
	this.loop()

	this.zoe = new SmartMatrix(10,10)

	//default pixelation is 30, pixelation is off
	this.pixelation = 30
	this.pixelated = false


}

util.inherits(Film, Medium);


/** Load a video 
*	@param {String} src name of .mp4 file in /media folder. For example, .load("waves") will load "/media/waves.mp4"
*/
Film.prototype.load = function(src) {
	src ? this.video.src = "media/video/"+src+".mp4" : false;
	if (this.video.complete) {
		console.log("complete so onload happening again")
	  this.video.onload()
	}
	this.play()
	return this
}

/**
 * Play video
 * @param  {float} rate Playback rate of video (0.25 - 4)
 */
Film.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate
	this.video.play()
	this.speed(this.rate)
	return this
}

/**
 * Pause video
 */
Film.prototype.stop = function() {
	this.video.pause()
	return this
}

/* 
 * Used internally for image processing and syncing videos from master video canvas
 */
Film.prototype.propogateMaster = function() {
	for (var i=0;i<this.context.length;i++) {
		this.context[i].clearRect(0,0,1000,1000)
		this.context[i].drawImage(this.master, 0, 0, this.master.width,this.master.height );
	}
}

/* 
 * Main draw function
 */
Film.prototype.draw = function() {
  if (this.video.paused || this.video.ended) return false;
  if (!this.video) return false;
  if (this.width == this.defaultSize.w && this.video.videoWidth) {
		if (m.stage.w/m.stage.h <= this.video.videoWidth / this.video.videoHeight) {
			this.size(this.video.videoWidth * (m.stage.h/this.video.videoHeight)  )
		} else {
			this.size(this.defaultSize.w + 1)
		}	
	
	}
  this.mastercontext.drawImage(this.video,0,0,this.width,this.width * this.video.videoHeight/this.video.videoWidth);
 	if (this.pixelated) {
 		this.pixelate()
 	}
 	this.propogateMaster()
  setTimeout(this.draw.bind(this),20)
}

Film.prototype.pixelate = function(degree) {

	this.pixelated = true

	if (degree && degree > 0) {
		this.pixelation = degree
	}

	if (this.pixelation < 10) {
		this.pixelation = 10
	}

	var sourceWidth = this.master.width
	var sourceHeight = this.master.height

  var imageData = this.mastercontext.getImageData(0, 0, sourceWidth, sourceHeight);
  
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
  this.mastercontext.putImageData(imageData, 0, 0)
	return this

}

/**
 * Loop video
 */
Film.prototype.loop = function() {
	this.video.loop = true;
	return this
}


/**
 * Unloop video
 */
Film.prototype.unloop = function() {
	this.video.loop = false
	return this
}

/**
 * Scrub to specific point
 * @param  {integer} start New start time of video, in seconds
 */
Film.prototype.jump = function(start) {
	start = start ? start : this.start
	this.video.currentTime = start
	this.video.play()
	return this
}


/**
 * Loop video between two points
 * @param  {float} start starting loop position
 * @param  {float} stop  ending loop position
 */
Film.prototype.skip = function(start,stop) {
	this.start = start ? start : 1;
	this.stop = stop ? stop : 1.2;
	if (this.interval) {
		clearInterval(this.interval);
	}
	this.boundJump = this.jump.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
	return this
}

/**
 * Stop skipping the video
 */
Film.prototype.unskip = function() {
	this.skipping = false
	this.start = false
	this.stop = false
	clearInterval(this.interval)
	this.interval = false
	return this
}

/**
 * Change the video's playback rate
 * @param  {float} rate Playback rate (0.25 - 4)
 */
Film.prototype.speed = function(rate) {
	if (rate) {
		this.video.playbackRate = rate;
		this.rate = rate;
	}
	return this
}

/**
 * Resize the video
 */
Film.prototype.size = function(params,h) {

	if (this.video) {
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		if (!h) {
			params.h = params.w*this.video.videoHeight/this.video.videoWidth
		}
		this.video.width = this.width = params.w
		this.video.height = this.height = params.h

		this.video.style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.video.style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
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

/* custom destroy */
Film.prototype._destroy = function() {
	this.stop()
}


