var util = require('util');

/**
 * @constructor
 * @description  Window object managed by a Wall
 * @param  {object} Params (see Params)
 * @return {Window}
 */
var Window = module.exports = function(params) {

	this.defaultSize = { w: 100, h: 100, x: window.screen.width/2 - 50, y: window.screen.height/2 - 50 }
	this.element = window.open("space.html","win"+windex,"height="+this.defaultSize.h+",width="+this.defaultSize.w+",left:"+this.defaultSize.x+",top:"+this.defaultSize.y+",menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	this.size(this.defaultSize.w,this.defaultSize.h)
	this.move(this.defaultSize.x,this.defaultSize.y)
	/*with (this.element) {
		resizeTo(this.defaultSize.w,this.defaultSize.h)
		moveTo(this.defaultSize.x,this.defaultSize.y)
	} */
	this.index = windex;
	windex++;
	this.visible = false;
	this.autoscroll = false;
	this.empty()

	this.vol = Tone.context.createGain()
	this.pan = Tone.context.createStereoPanner()

	this.pan.connect(this.vol)
	this.vol.connect(m.fx)

	
}

/*
 * Show the window
 */
Window.prototype.show = function(params) {

	this.element.close();
	this.element = window.open("space.html","win"+this.index,"height="+this.defaultSize.h+",width="+this.defaultSize.w+",left:"+this.defaultSize.x+",top:"+this.defaultSize.y+",menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	
	params = params ? params : new Object()
	params.w = params.w ? params.w : this.defaultSize.w
	params.h = params.h ? params.h : this.defaultSize.h
	params.x = params.x ? params.x : this.defaultSize.x
	params.y = params.y ? params.y : this.defaultSize.y

	this.size(params.w,params.h)
	this.move(params.x,params.y)

	this.visible = true
	this.element.focus()

	// spaces can access us
	spaces.push(this)

	// the new window can access us
	this.element.space = this;
	

}

/** 
 * Hide the window
 */
Window.prototype.hide = function() {
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	spaces.splice(spaces.indexOf(this),1)
	this.element.close();
	this.visible = false;
}

/** 
 * Load a new page 
 */
Window.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

/*
 * Scroll to a new x and y
Window.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
} 
*/

/** 
 * Close the window 
 */
Window.prototype.kill = function() {
	this.element.close()
}

/**
 * Empty the window's body of all HTML
 */
Window.prototype.empty = function() {
	this.element.document.body.innerHTML = "";
}

Window.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

/** 
 * Scroll to a new x and y over a time period
 */
Window.prototype.scroll = function(x,y,time) {
	if (!time) {
		this.element.scrollTo(x,y)
	} else {
		$([this.element.document.body]).stop().clearQueue().animate({ scrollTop: y, scrollLeft: x }, time);
	}
}

/*
 * Scroll the window according to its place on the screen
 */
Window.prototype.xray = function(time) {
	this.scroll(this.element.screenX-m.stage.x,this.element.screenY-m.stage.y,time)
}

/**
 * Scroll the window to a random location
 */
Window.prototype.scramble = function(time) {
	var w = this.element.document.body.clientWidth
	var h = this.element.document.body.clientHeight
	this.scroll(random(w),random(h),time)
}

/** 
 * Move the window
 */
Window.prototype.move = function(x,y,time,callback) {
	if (time && time > 99) {
		callback = callback ? callback : function() { }
		var obj = {
			x: this.element.screenX,
			y: this.element.screenY,
		}
		$(obj).animate({x: x, y: y}, {
		    duration: time,
		    easing: "linear",
		    step: function() {
		    	this.element.moveTo(obj.x,obj.y)
		    }.bind(this)
		 //   complete: callback
		})	
	} else {
		this.element.moveTo(x,y)
	}
	this.x = x;
	this.y = y;
	if (this.autoscroll) {
		this.xray();
	}

}

/**
 * Resize the window
 */
Window.prototype.size = function(w,h,time) {
	if (time && time > 99) {
		callback = callback ? callback : function() { }
		var obj = {
			w: this.element.outerWidth,
			h: this.element.outerHeight,
		}
		$(obj).animate({w: w, h: h}, {
		    duration: time,
		    easing: "linear",
		    step: function() {
		    	this.element.resizeTo(obj.w,obj.h)
		    }.bind(this),
		    complete: callback
		})
	} else {
		this.element.resizeTo(w,h)
	}
	this.w = w;
	this.h = h;

}
