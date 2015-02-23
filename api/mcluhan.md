McLuhan JS API
==============
*&copy; 2015*

**Author:** Ben Taylor

mc
----
####Methods####
###mc.add(  )###
###mc.toPolar( x, y )###
Receives cartesian coordinates and returns polar coordinates as an object with 'radius' and 'angle' properties.
```js
var ImOnACircle = nx.toPolar({ x: 20, y: 50 }})
```


**x** &nbsp;  *float* &nbsp;  


**y** &nbsp;  *float* &nbsp;  


###mc.toCartesian( radius, angle )###
Receives polar coordinates and returns cartesian coordinates as an object with 'x' and 'y' properties.


**radius** &nbsp;  *float* &nbsp;  


**angle** &nbsp;  *float* &nbsp;  


###mc.clip( input, low, high )###
Limits a number to within low and high values.
```js
nx.clip(5,0,10) // returns 5
nx.clip(15,0,10) // returns 10
nx.clip(-1,0,10) // returns 0
```


**input** &nbsp;  *float* &nbsp;  value]

**low** &nbsp;  *float* &nbsp;  limit]

**high** &nbsp;  *float* &nbsp;  limit]

###mc.prune( input, max )###
Limits a float to within a certain number of decimal places
```js
nx.prine(1.2345, 3) // returns 1.234
nx.prune(1.2345, 1) // returns 1.2
```


**input** &nbsp;  *float* &nbsp;  value]

**max** &nbsp;  *integer* &nbsp;  decimal places]

###mc.scale( input, low1, high1, low2, high2 )###
Scales an input number to a new range of numbers
```js
nx.scale(5,0,10,0,100) // returns 50
nx.scale(5,0,10,1,2) // returns 1.5
```


**input** &nbsp;  *float* &nbsp;  value]

**low1** &nbsp;  *float* &nbsp;  input range (low)

**high1** &nbsp;  *float* &nbsp;  input range (high)

**low2** &nbsp;  *float* &nbsp;  output range (low)

**high2** &nbsp;  *float* &nbsp;  output range (high)

###mc.invert( input )###
Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number.
```js
nx.invert(0.25) // returns 0.75
nx.invert(0) // returns 1
```


**input** &nbsp;  *float* &nbsp;  value]

###mc.mtof( MIDI )###
MIDI to frequency conversion. Returns frequency in Hz.
```js
nx.mtof(69) // returns 440
```


**MIDI** &nbsp;  *float* &nbsp;  MIDI value to convert

###mc.random( scale )###
Returns a random integer between 0 a given scale parameter.
```js
nx.random(10) // returns a random number from 0 to 9.
```


**scale** &nbsp;  *float* &nbsp;  Upper limit of random range.

