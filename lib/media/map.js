var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Map
 * @constructor
 * @description  Performative GOOGLE MAP media element
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Paper}
 */
var Map = module.exports = function(params) {

	this.defaultSize = { w: m.stage.w, h: m.stage.h }
	this.type = "div";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.map = []
	this.directionsDisplay = [] 

	/* create map */
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(0, 0),
		disableDefaultUI: true
	};
	for (var i=0;i<this.element.length;i++) {
		this.map.push(new google.maps.Map(this.element[i],
	  		mapOptions));
	 	this.directionsDisplay.push(new google.maps.DirectionsRenderer())
		this.directionsDisplay[i].setMap(this.map[i])
	}

	/* helps find new locations */
	this.geocoder = new google.maps.Geocoder();

	
	this.directionsService = new google.maps.DirectionsService();

	this.location;

	this.markers = []
	this.popups = []

/*	var marker = new google.maps.Marker({
	  position: new google.maps.LatLng(-34.397, 150.644),
	  map: map,
	  animation: google.maps.Animation.DROP,
	  title: 'Hello World!'
	}); */

	/* directions stuff
	 this.directionsDisplay = new google.maps.DirectionsRenderer();
	 this.directionsService = new google.maps.DirectionsService();
	 console.log(this.map[0])
	 this.directionsDisplay.setMap();
	*/

	// this.route()

	//google.maps.event.addDomListener(window, 'load', this.initialize.bind(this));

}

util.inherits(Map, Medium);


/** 
 * .
 */
Map.prototype.search = function(loc) {

  this.geocoder.geocode( { 'address': loc}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	this.location = results[0].geometry.location
        this.goto(this.location)
    }
  }.bind(this));

}

/** 
 * .
 */
Map.prototype.goto = function(loc) {
	if (loc) {
		this.location = loc
	}
    for (var i=0;i<this.map.length;i++) {
        this.map[i].setCenter(this.location);
    }
}


/** 
 * .
 */
Map.prototype.stray = function(x,y) {
	//console.log(this.map[0].zoom)
	//console.log(this.widget)
	var scale = Math.floor(Math.pow(19/this.map[0].zoom,3))/2
	var relloc = {
		lat: this.location.A + y * scale,
		lng: this.location.F + x * scale
	}

//	this.relloc = new google.maps.Geocoder();
//	this.location.A += x;
//	this.location.F += y;
    for (var i=0;i<this.map.length;i++) {
        this.map[i].setCenter(relloc);
    }
}


/* directions stuff */
/** 
 * .
 */
Map.prototype.route = function(start, end) {
  start = start ? start : "Charlottesville, VA"
  end = end ? end : "Missoula, MT"
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  this.directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
		for (var i=0;i<this.directionsDisplay.length;i++) {
			this.directionsDisplay[i].setDirections(response);
		}
    }
  }.bind(this));
}

/** 
 * .
 */
Map.prototype.zoom = function(level) {
	level +=3 ;
	//console.log ("zoom to "+level)
    for (var i=0;i<this.map.length;i++) {
		this.map[i].setZoom(level);
	}
}

/** 
 * .
 */
Map.prototype.marker = function() {

  // if no argument, goes to this.location
  // otherwise, jumps to new place and places marker w/ bounce
  // markers is an array of arrays, with infowin attached to each
  // a text field to define where each new one will go...
  // no way to remove old ones, unless i create a new button in the rack.
  // 
  // 
  // 
  // how to remove them?
  // 

  //this.geocoder.geocode( { 'address': loc}, function(results, status) {
  //  if (status == google.maps.GeocoderStatus.OK) {
	    for (var i=0;i<this.map.length;i++) {
	        this.markers[i] = new google.maps.Marker({
	            map: this.map[i],
	            position: this.location
	        })
	    }
  //  }
  //}.bind(this));

}


/** 
 * .
 */
Map.prototype.info = function(content) {

  var contentString = content ? content : '<div style="color:black;width:100px;height:100px;background-color:black;display:block">888</div>';

  for (var i=0;i<this.map.length;i++) {
  	
  	this.popups[i] = new google.maps.InfoWindow({
      content: contentString
  	});

  	this.popups[i].open(this.map[i],this.markers[i]);

  }

}


