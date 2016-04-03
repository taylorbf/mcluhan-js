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

/** 
 * .
 */
Window.prototype.show = function(params) {

	this.element.close();
	this.element = window.open("space.html","win"+this.index,"height="+this.defaultSize.h+",width="+this.defaultSize.w+",left:"+this.defaultSize.x+",top:"+this.defaultSize.y+",menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	
	params = params ? params : new Object()
	params.w = params.w ? params.w : this.defaultSize.w
	params.h = params.h ? params.h : this.defaultSize.h
	params.x = params.x ? params.x : this.defaultSize.x
	params.y = params.y ? params.y : this.defaultSize.y

//	with (this.element) {
		this.size(params.w,params.h)
		this.move(params.x,params.y)
//	}

	this.visible = true
	this.element.focus()

	// spaces can access us
	spaces.push(this)

	// the new window can access us
	this.element.space = this;
	//this.element.defineCanvas();

	// this.canvas and this.context
	// are then created by the new window when loading
	// 
	
	/* testing sine waves */
	// this.sine = m.context.createOscillator()
	// so will this osc be in the window, separate from all other fx?
	// 		have own context here
	// 		own panning
	// 		auto destroyed
	// 		not linked to other fx (verb, delay)
	// 			ie have no control over sound then
	// 		should these become a super quiet chord?
	// 			OR CAN THEY! conect it to the fx... this is grea
	// 			NOPE, different audio context, that's the prob.
	// or be on the normal context, 
	//		how will it be deleted? custom destroy?
	//		Tone.polysynth? no panning
	//		gotta do this one
	//		create an array off of m or something
	//		create a panning node
	//		
	// 
	// 
	// need it panned differently
	// or will 
	// 

}

/** 
 * .
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
 * .
 */
Window.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

/**
 *  
 * .
 */
Window.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
}

/** 
 * .
 */
Window.prototype.kill = function() {
	this.element.close()
}

/** 
 * .
 */
Window.prototype.empty = function() {
	this.element.document.body.innerHTML = "";
}

Window.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

/** 
 * .
 */
Window.prototype.scroll = function(x,y,time) {
	if (!time) {
		this.element.scrollTo(x,y)
	} else {
		$([this.element.document.body]).stop().clearQueue().animate({ scrollTop: y, scrollLeft: x }, time);
	}
}

/** 
 * .
 */
Window.prototype.xray = function(time) {
	this.scroll(this.element.screenX-m.stage.x,this.element.screenY-m.stage.y,time)
}

/** 
 * .
 */
Window.prototype.scramble = function(time) {
	var w = this.element.document.body.clientWidth
	var h = this.element.document.body.clientHeight
	this.scroll(random(w),random(h),time)
}

/** 
 * .
 */
Window.prototype.refresh = function() {
}

/** 
 * .
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
	/*$({newx: this.element.screenX}).animate({newx: x}, {
	    duration: 8000,
	    easing: "linear",
	    step: function(cur) {
	    	this.element.moveTo(cur)
	    }.bind(this)
	})*/
/*	ramp(this.element.screenX, x, time, function(cur) {  
		this.element.moveTo(cur,this.element.screenY)
	}.bind(this))
	ramp(this.element.screenY, y, time, function(cur) {  
		this.element.moveTo(this.element.screenX,cur)
	}.bind(this))
*/

	console.log(this.index)

	/* WINDOW SINES

	if (this.index || this.index ===0) {
	
		m.windowSineIndex++ 

		console.log("INDEX", m.windowSineIndex)

		var windownum = spaces.indexOf(this)

		m.windowSines[m.windowSineIndex] = Tone.context.createOscillator()
		m.windowSines[m.windowSineIndex].connect(this.pan)

		//m.windowSines[m.windowSineIndex].frequency.value = Math.floor(y/100)*100 + Math.floor(x/100)*25
		m.windowSines[m.windowSineIndex].frequency.value = (octave(Math.floor(y/100)-2)) * major[Math.floor(x/100) % major.length] * m.tonic
		
		console.log((octave(Math.floor(y/100)-2)))
		console.log(major[Math.floor(x/100) % major.length])
		console.log(m.tonic)

		this.pan.pan.value = (x / (m.stage.w-m.stage.x)) * 2 - 1

		var now = Tone.context.currentTime

		m.windowSines[m.windowSineIndex].start(now + this.index/8)
		this.vol.gain.linearRampToValueAtTime(0.05,now + 0.1)
		this.vol.gain.linearRampToValueAtTime(0,now+.5)
		m.windowSines[m.windowSineIndex].stop(Tone.context.currentTime + this.index/8 + .6)

		if (m.windowSineIndex>100) {
			m.windowSineIndex = 0
		}

	}
	*/

}
/** 
 * .
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
/*	ramp(this.element.outerWidth, w, time, function(cur) {  
		this.element.resizeTo(cur,this.element.outerHeight)
	}.bind(this))
	ramp(this.element.outerHeight, h, time, function(cur) {  
		this.element.resizeTo(this.element.outerWidth,cur)
	}.bind(this))
*/

}


Window.prototype.moveseq = function(x,y,time,callback) {

	//create a function that moves one window linearly, then calls this function again,
	// which will move the next window, etc.

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
		    }.bind(this),
		    complete: callback
		})	
	} else {
		this.element.moveTo(x,y)
	}

}




