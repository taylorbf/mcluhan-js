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

	//this.src = false;
	this.type = "canvas"

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);


	this.boundJump = this.jumpTo.bind(this,0)

	this.interval = false;
	this.rate = 1;


	// prime canvases

	this.context = []

	for (var i = 0; i<this.spaces.length; i++) {
		this.context.push(this.element[i].getContext("2d"))
	}


	this.zoomstate = {
		x: 0,
		y: 0,
		level: 1
	}

	// create master video element
	this.video = this.spaces[0].element.document.createElement("video")

	this.video.addEventListener('play', this.draw.bind(this),false)



	/* create hidden canvas */

	this.master = this.spaces[0].element.document.createElement("canvas")
	this.master.style.display = "none"
	this.spaces[0].element.document.body.appendChild(this.master)
	this.mastercontext = this.master.getContext("2d")



	this.video.width = this.master.width = this.width = this.defaultSize.w
	this.video.height = this.master.height = this.height = this.defaultSize.h
	this.video.style.width = this.master.style.width = this.width+"px"
	this.video.style.height = this.master.style.height = this.height+"800px"


	for (var i=0;i<this.context.length;i++) {
			this.element[i].width = this.width
			this.element[i].height = this.height
			this.element[i].style.width = this.width
			this.element[i].style.height = this.height
	}

	this.video.volume = 0
	this.loop()

	this.zoe = new SmartMatrix(10,10)

	this.pixelation = 30
	this.pixelated = false


}

util.inherits(Film, Medium);


/** Load a video via source string. 
*	@param {String} src name of .mp4 file in /media folder. For example, .load("waves") will load "/media/waves.mp4"
*/
Film.prototype.load = function(src) {
	src ? this.video.src = "media/video/"+src+".mp4" : false;
	this.play()
}

/**
 * Play video
 * @param  {float} rate Playback rate of video (0.25 - 4)
 */
Film.prototype.play = function(rate) {
	this.rate = rate ? rate : this.rate
	this.video.play()
	this.speed(this.rate)
}

/**
 * Pause video
 */
Film.prototype.stop = function() {
	this.video.pause()
}

/** 
 * .
 */
Film.prototype.propogateMaster = function() {
	for (var i=0;i<this.context.length;i++) {
		//this.context[i].drawImage(this.master, this.zoomstate.x, this.zoomstate.y,this.zoomstate.level*this.width,this.zoomstate.level*this.height,0,0,this.width,this.height );
		this.context[i].drawImage(this.master, 0, 0, this.master.width,this.master.height );
	}
}

Film.prototype.draw = function() {
  if (this.video.paused || this.video.ended) return false;
  if (!this.video) return false;
  //this.mastercontext.drawImage(this.video,0,0,this.master.width,this.master.height);
 	this.mastercontext.drawImage(this.video,0,0,this.width,this.width * this.video.videoHeight/this.video.videoWidth);
 	console.log("----", this.width, "-----")
 	if (this.grayscale) {

 	}
 	if (this.pixelated) {
 		this.pixelate()
 	}
 	this.propogateMaster()
  setTimeout(this.draw.bind(this),20)
}

Film.prototype.pixelate = function(degree) {

	this.pixelated = true;

	if (degree && degree > 0) {
		this.pixelation = degree
	}

	if (this.pixelation < 10) {
		this.pixelation = 10
	}

  var sourceWidth = this.video.width
  var sourceHeight = this.video.height
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

}

/**
 * Loop video
 */
Film.prototype.loop = function(on) {
	this.video.loop = true;
	//this.start = 0.0001
	//this.element[0].addEventListener('ended',this.boundJump)
}


/**
 * Unloop video
 */
Film.prototype.unloop = function(on) {
	//this.element[0].removeEventListener('ended',this.boundJump);
	this.video.loop = false
}

/**
 * Scrub to specific point
 * @param  {integer} start New start time of video, in seconds
 */
Film.prototype.jumpTo = function(start) {
	start = start ? start : this.start
	this.video.currentTime = start
	this.video.play()
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
	this.boundJump = this.jumpTo.bind(this)
	this.interval = setInterval(this.boundJump,(this.stop-this.start)*1000)
	this.skipping = true;
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
}

/**
 * Zoom in
 * @param  {float} level Zoom level
 */
Film.prototype.zoom = function(level,x,y) {
	if (level) {
		this.zoomstate.level = level
	}
	if (x) {
		this.zoomstate.x = x
	}
	if (y) {
		this.zoomstate.y = y
	}
}

/**
 * Turn on film-strip frame visualization
 */
Film.prototype.ticker = function() {
	this.ticking = true;
	this.tick()
}

/**
 * Turn off film-strip ticker visualization
 */
Film.prototype.unticker = function() {
	this.ticking = false;
	this.spaces[i].element.context.clearRect(0,0,1000,1000)
		
}

Film.prototype.tick = function() {

	if (this.ticking) {
		var w = 120
		var h = 70
		var x = this.zoe.col * w
		var y = this.zoe.row * h
		for (var i=0;i<this.spaces.length;i++) {
			this.spaces[i].element.context.drawImage(this.element[i],x,y,w,h)
		}
		this.zoe.advance();
		setTimeout(this.tick.bind(this),20)
	}
}

Film.prototype.size = function(params,h) {

	console.log(this.video)
	if (this.video) {
		console.log("sizing video")
		if (typeof params == "number") {
			params = {
				w: params,
				h: h
			}
		}
		console.log(h)
		if (!h) {
			params.h = params.w*this.video.videoHeight/this.video.videoWidth
			console.log(params.h)
		}
		this.video.width = this.width = params.w
		this.video.height = this.height = params.h

		this.video.style.width = params.w ? params.w+"px" : this.defaultSize.w+"px";
		this.video.style.height = params.h ? params.h+"px" : this.defaultSize.h+"px";
	} else {
		console.log("sizin the second way")
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


Film.prototype._destroy = function() {
	this.stop()
	//remove video element.. ? 
	//remove master canvas.. ? 
}


