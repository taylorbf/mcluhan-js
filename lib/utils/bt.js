

/** @method  toPolar
    @description Receives cartesian coordinates and returns polar coordinates as an object with 'radius' and 'angle' properties.
    @param {float} [x] 
    @param {float} [y] 
*/
window.toPolar = function(x,y) {
  var r = Math.sqrt(x*x + y*y);

  var theta = Math.atan2(y,x);
  if (theta < 0.) {
    theta = theta + (2 * Math.PI);
  }
  return {radius: r, angle: theta};
}

/** @method  toCartesian
    @description Receives polar coordinates and returns cartesian coordinates as an object with 'x' and 'y' properties.
    @param {float} [radius] 
    @param {float} [angle] 
*/
window.toCartesian = function(radius, angle){
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return {x: radius*cos, y: radius*sin*-1};
}


/** @method  clip
    @description Limits a number to within low and high values.
    @param {float} [input value] 
    @param {float} [low limit] 
    @param {float} [high limit]
*/
window.clip = function(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

/** @method prune
    @description Limits a float to within a certain number of decimal places
    @param {float} [input value] 
    @param {integer} [max decimal places] 
*/

window.prune = function(data, scale) {
  if (typeof data === "number") {
    data = parseFloat(data.toFixed(scale));
  } else if (data instanceof Array) {
    for (var i=0;i<data.length;i++) {
      if (typeof data[i]=="number") {
        data[i] = parseFloat(data[i].toFixed(scale));
      }
    }
  }
  return data;
}


/** @method scale 
    @description Scales an input number to a new range of numbers
    @param {float} [input value] 
    @param {float} [low1]  input range (low)
    @param {float} [high1] input range (high)
    @param {float} [low2] output range (low)
    @param {float} [high2] output range (high)
    ```js
    nx.scale(5,0,10,0,100) // returns 50
    nx.scale(5,0,10,1,2) // returns 1.5
    ```
*/
window.scale = function(inNum, inMin, inMax, outMin, outMax) {
  return (((inNum - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;  
}

/** @method invert 
    @description Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number. 
    @param {float} [input value]  
    
*/
window.invert = function (inNum) {
  return scale(inNum, 1, 0, 0, 1);
}

window.bounce = function(posIn, borderMin, borderMax, delta) {
  if (posIn > borderMin && posIn < borderMax) {
    return delta;
  } else if (posIn <= borderMin) {
    return Math.abs(delta); 
  } else if (posIn >= borderMax) {
    return Math.abs(delta) * (-1);
  }
}


/** @method mtof 
    @description MIDI to frequency conversion. Returns frequency in Hz.
    @param {float} [MIDI] MIDI value to convert
    
*/
window.mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}


/** @method random 
    @description Returns a random integer between 0 and a given scale parameter.
    @param {float} [scale] Upper limit of random range.
    
*/
window.random = function(scale,max) {
	if (max) {
		return Math.floor(Math.random() * (max-scale) + scale);
	} else {
  		return Math.floor(Math.random() * scale);
	}
}


window.interp = function(loc,min,max) {
  return loc * (max - min) + min;  
}

window.randomColor = function() {
  return "rgb(" + random(255) + "," + random(255) + "," + random(255) + ")";
}


window.isInside = function(clickedNode,currObject) {
  if (clickedNode.x > currObject.x && clickedNode.x < (currObject.x+currObject.w) && clickedNode.y > currObject.y && clickedNode.y < (currObject.y+currObject.h)) {
    return true;
  } else {
    return false; 
  }
}



/*
 interval with controllable speed / interval time
	bt.interval()
*/

window.VariableSpeedInterval = function(rate,func) {
	this.rate = rate
	this.on = true;
	this.event = func ? func : function() { };
	this.pulse = function() {
		if (this.on) {
			this.time.last = new Date().getTime()
			this.event();
			//var delay = force ? force : this.rate
			this.timeout = setTimeout(this.pulse.bind(this),this.rate)
		}
	}
	this.stop = function() {
		this.on = false;
	}
	this.start = function() {
		this.on = true;
		this.pulse();
	}
	this.time = {
		last: false,
		cur: false
	}
	this.ms = function(newrate) {
		var oldrate = this.rate;
		this.rate = newrate;

		this.time.cur = new Date().getTime()
		if (this.time.cur - this.time.last > newrate) {
			clearTimeout(this.timeout)
			this.pulse();
		} else if (newrate < oldrate) {
			clearTimeout(this.timeout)
			var delay = this.rate - (this.time.cur - this.time.last);
			if (delay < 0 ) { delay = 0 }
			this.timeout = setTimeout(this.pulse.bind(this),delay)
		}
	}
	this.start();
}

window.interval = function(rate,func) {
	var _int = new VariableSpeedInterval(rate,func)
	return _int;
}

/* use like this:
    // func is optional
	var x = interval(50, function() {   bla ... })
	x.ms(100);
	x.stop()
	// later
	x.start()
	//can change function midway
	x.event = function() { ... }

*/



/*
random function that executes (returns new num) each time
	this should probably be global
*/


window.rand = function(scale) {
	return random.bind(null,scale)
}
/* use like this:

a = new Wall()
a.moveTo(rand(WIDTH),rand(HEIGHT))

... how often would this happen?
.. and in an interval, wouldn't random() just be evaluated anyway?


*/

/*
? ramp a variable, with jquery, maybe...
array forEach

*/