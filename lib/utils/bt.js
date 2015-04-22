

/** @method toPolar 
    Receives cartesian coordinates and returns polar coordinates as an object with 'radius' and 'angle' properties.
    @param {float} [x] 
    @param {float} [y] 
    ```js
    var ImOnACircle = nx.toPolar({ x: 20, y: 50 }})
    ```
*/
var toPolar = function(x,y) {
  var r = Math.sqrt(x*x + y*y);

  var theta = Math.atan2(y,x);
  if (theta < 0.) {
    theta = theta + (2 * Math.PI);
  }
  return {radius: r, angle: theta};
}

/** @method toCartesian 
    Receives polar coordinates and returns cartesian coordinates as an object with 'x' and 'y' properties.
    @param {float} [radius] 
    @param {float} [angle] 
*/
var toCartesian = function(radius, angle){
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return {x: radius*cos, y: radius*sin*-1};
}


/** @method clip 
    Limits a number to within low and high values.
    @param {float} [input value] 
    @param {float} [low limit] 
    @param {float} [high limit] 
    ```js
    nx.clip(5,0,10) // returns 5
    nx.clip(15,0,10) // returns 10
    nx.clip(-1,0,10) // returns 0
    ```
*/
var clip = function(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

/** @method prune 
    Limits a float to within a certain number of decimal places
    @param {float} [input value] 
    @param {integer} [max decimal places] 
    ```js
    nx.prine(1.2345, 3) // returns 1.234
    nx.prune(1.2345, 1) // returns 1.2
    ```
*/

var prune = function(data, scale) {
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
    Scales an input number to a new range of numbers
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
var scale = function(inNum, inMin, inMax, outMin, outMax) {
  return (((inNum - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;  
}

/** @method invert 
    Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number. 
    @param {float} [input value]  
    ```js
    nx.invert(0.25) // returns 0.75
    nx.invert(0) // returns 1
    ```
*/
var invert = function (inNum) {
  return scale(inNum, 1, 0, 0, 1);
}

var bounce = function(posIn, borderMin, borderMax, delta) {
  if (posIn > borderMin && posIn < borderMax) {
    return delta;
  } else if (posIn <= borderMin) {
    return Math.abs(delta); 
  } else if (posIn >= borderMax) {
    return Math.abs(delta) * (-1);
  }
}


/** @method mtof 
    MIDI to frequency conversion. Returns frequency in Hz.
    @param {float} [MIDI] MIDI value to convert
    ```js
    nx.mtof(69) // returns 440
    ```
*/
var mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}


/** @method random 
    Returns a random integer between 0 and a given scale parameter.
    @param {float} [scale] Upper limit of random range.
    ```js
    nx.random(10) // returns a random number from 0 to 9.
    nx.random(10,20) // returns a random number from 10 to 19.
    ```
*/
var random = function(scale,max) {
	if (max) {
		return Math.floor(Math.random() * (max-scale) + scale);
	} else {
  		return Math.floor(Math.random() * scale);
	}
}


var interp = function(loc,min,max) {
  return loc * (max - min) + min;  
}

var randomColor = function() {
  return "rgb(" + random(255) + "," + random(255) + "," + random(255) + ")";
}


var isInside = function(clickedNode,currObject) {
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

var VariableSpeedInterval = function(bpm, func) {
	this.rate = bpm
	this.on = true;
	this.event = func ? func : function() { };
	this.again = function() {
		if (this.on) {
			this.event();
			setTimeout(this.again.bind(this),this.rate)
		}
	}
	this.stop = function() {
		this.on = false;
	}
	this.start = function() {
		this.on = true;
		this.again();
	}
	this.start();
}

var interval = function(bpm) {
	var _int = new VariableSpeedInterval(bpm)
	return _int;
}

/* use like this:
    // func is optional
	var x = interval(50, function() {   bla ... })
	x.rate = 100;
	x.stop()
	// later
	x.start

*/



/*
random function that executes (returns new num) each time
	this should probably be global
*/


function rand(scale) {
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