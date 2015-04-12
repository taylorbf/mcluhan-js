var util = require('util');

/**
 * @class Presence
 * @constructor
 * @description  Pixilated live video feed of performer
 * @param  {object} Params (see Params)
 * @return {Presence}
 */
var Presence = module.exports = function(params) {

	this.defaultSize = { w: 400, h: 300 }

	this.fps = 10

	this.video = document.createElement("video")
	this.video.style.height = this.defaultSize.h;
	this.video.style.width = this.defaultSize.w;
	this.video.height = this.defaultSize.h;
	this.video.width = this.defaultSize.w;
	this.video.play()

	this.pic = document.createElement('canvas');
	this.pic.style.height = this.defaultSize.h;
	this.pic.style.width = this.defaultSize.w;
	this.pic.width = this.defaultSize.w;
	this.pic.height = this.defaultSize.h;
	this.picctx = this.pic.getContext('2d');

	/* this gets the "presence" canvas in coding.html ...
		if want to send presence through network or add to a Wall,
		will need to generate this second canvas programatically
	*/
	this.canvas = document.getElementById("presence")
	this.canvas.style.height = this.defaultSize.h;
	this.canvas.style.width = this.defaultSize.w;
	this.canvas.width = this.defaultSize.w;
	this.canvas.height = this.defaultSize.h;
	this.context = this.canvas.getContext('2d');


	document.getElementById("main").appendChild(this.canvas)
	
	
	this.localMediaStream = null;
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	if (navigator.getUserMedia) {
	  navigator.getUserMedia({audio: false, video: true}, function(stream) {
	        this.video.src = window.URL.createObjectURL(stream);
			this.localMediaStream = stream;
			this.start();
	  }.bind(this),function(e) { console.log(e)}.bind(this));
	}

}

Presence.prototype.snapshot = function(src) {
	this.context.fillStyle = "#eee";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
  if (this.localMediaStream) {
    this.picctx.drawImage(this.video, 0, 0, this.pic.width, this.pic.height);
    this.data = this.picctx.getImageData(0,0,this.pic.width,this.pic.height);
    console.log(this.data);
    var dim = 10
    var w = this.pic.width
    var h = this.pic.height
  /*  for (var i=0;i<this.data;i=i+4) {

  		this.context.fillStyle = "#000";
  		this.context.fillRect(0,0,10,10);
    } */
	for (var i=0;i<30;i++) {
        for (var j=0;j<40;j++) {
          // i means which row
          // j means which column
          //get data, avg, draw shape at right place
          var red = j*4*dim + i*320*4*dim;
          var green = j*4*dim + i*320*4*dim + 1;
          var blue = j*4*dim + i*320*4*dim + 2;
          var placex = j*dim;
          var placey = i*dim; 
          var darkness = this.data.data[red]+this.data.data[green]+this.data.data[blue];
          if (darkness < 300) {
          	//this.context.fillStyle = "rgb("+this.data.data[red]+","+this.data.data[green]+","+this.data.data[blue]+")";
          	this.context.fillStyle = "#04a";
          } else {
			this.context.fillStyle = "#fff";
          }
          this.context.fillRect(placex,placey,dim,dim)
        }
    }
  }
}

Presence.prototype.start = function(src) {
	this.boundSnapshot = this.snapshot.bind(this)
	this.interval = setInterval(this.boundSnapshot,1000/this.fps)
	return this;
}

Presence.prototype.stop = function(rate) {
	clearInterval(this.interval)
}
