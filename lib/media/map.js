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

}

util.inherits(Map, Medium);


/**
 * Set the map to a new location, by keyword
 * @param  {String} location  New location keyword (i.e. "Boston")
 */
Map.prototype.goto = function(loc) {

  this.geocoder.geocode( { 'address': loc}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	this.location = results[0].geometry.location
        this.loadByGeocode(this.location)
    }
  }.bind(this));
	return this

}

/*
 * Used internally to set the map by geocode
 */
Map.prototype.loadByGeocode = function(loc) {
	if (loc) {
		this.location = loc
	}
  for (var i=0;i<this.map.length;i++) {
      this.map[i].setCenter(this.location);
  }
	return this
}


/**
 * Move the map by a small amount
 * @param  {number} x   How much to stray on the x axis
 * @param  {number} y   How much to stray on the y axis
 */
Map.prototype.stray = function(x,y) {
	if (x && y) {
		var scale = Math.floor(Math.pow(19/this.map[0].zoom,3))/2
		var relloc = {
			lat: this.location.A + y * scale,
			lng: this.location.F + x * scale
		}
	}

//	this.relloc = new google.maps.Geocoder();
//	this.location.A += x;
//	this.location.F += y;
  for (var i=0;i<this.map.length;i++) {
      this.map[i].setCenter(relloc);
  }
	return this
}


/** 
 * Get directions based on a series of keywords
 * @param {string} location1 First location in the directions
 * @param {string} location2 Second location in the directions
 * @param {string} location3 Third location in the directions ... etc
 */
Map.prototype.route = function() {

	var routes = {
		"youth": ["charlottesville, va","gambier, oh","missoula, mt","portland, or", "oakland, ca", "somerville, ma", "state college, pa", "baton rouge, la", "nashville, tn"]
	}
	var start, end;
	if (arguments.length > 0) {
		if (routes[arguments[0]]) {
			arguments = routes[arguments[0]]
		}

		start = arguments[0]
		end = arguments[arguments.length-1]

	  var request = {
	      origin:start,
	      destination:end,
	      travelMode: google.maps.TravelMode.DRIVING
	  };

		if (arguments.length > 2) {
			var waypoints = []
			for (var i=1;i<arguments.length-1;i++) {
				waypoints.push({
	      	location: arguments[i],
	      	stopover: true
				})
			}
	  	request.waypoints = waypoints
		}

	  this.directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
			for (var i=0;i<this.directionsDisplay.length;i++) {
				this.directionsDisplay[i].setDirections(response);
			}
	    }
	  }.bind(this));
	}
	return this
}

/** 
 * Zoom in on the map
 * @param {number} level Zoom level 1-10
 */
Map.prototype.zoom = function(level) {
	level +=3 ;
	//console.log ("zoom to "+level)
    for (var i=0;i<this.map.length;i++) {
		this.map[i].setZoom(level);
	}
	return this
}

/** 
 * Add a marker to the current location
 */
Map.prototype.marker = function() {

  // if no argument, goes to this.location
  // otherwise, jumps to new place and places marker w/ bounce
  // markers is an array of arrays, with infowin attached to each
  // a text field to define where each new one will go...
  // no way to remove old ones, unless i create a new button in the rack.
  
  for (var i=0;i<this.map.length;i++) {
      this.markers[i] = new google.maps.Marker({
          map: this.map[i],
          position: this.location
      })
  }

	return this

}


/** 
 * Add info text to the current marker
 */
Map.prototype.info = function(content) {

  var contentString = content ? content : '<div style="color:black;width:100px;height:100px;background-color:black;display:block">888</div>';

  for (var i=0;i<this.map.length;i++) {
  	
  	this.popups[i] = new google.maps.InfoWindow({
      content: contentString
  	});

  	this.popups[i].open(this.map[i],this.markers[i]);

  }
	return this

}


