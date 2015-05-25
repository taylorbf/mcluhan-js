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

	this.defaultSize = { w: 1100,h: 1000 }
	this.type = "div";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.map = []

	/* create map */
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(0, 0),
		disableDefaultUI: true
	};
	for (var i=0;i<this.element.length;i++) {
		this.map.push(new google.maps.Map(this.element[i],
	  		mapOptions));
	}

	/* helps find new locations */
	this.geocoder = new google.maps.Geocoder();
	

/*	var marker = new google.maps.Marker({
	  position: new google.maps.LatLng(-34.397, 150.644),
	  map: map,
	  animation: google.maps.Animation.DROP,
	  title: 'Hello World!'
	}); */

	/* directions stuff */
	// this.directionsDisplay = new google.maps.DirectionsRenderer();
	// this.directionsService = new google.maps.DirectionsService();
	// this.directionsDisplay.setMap(this.map);

	// this.calcRoute()

	//google.maps.event.addDomListener(window, 'load', this.initialize.bind(this));

}

util.inherits(Map, Medium);

Map.prototype.search = function() {

  this.geocoder.geocode( { 'address': 'Chicago'}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	tester = results[0].geometry.location
        this.goto(results[0].geometry.location)
     /*   var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        }); */
    }
  }.bind(this));

}

Map.prototype.goto = function(loc) {
	if (loc) {
		this.location = loc
	}
    for (var i=0;i<this.map.length;i++) {
        this.map[i].setCenter(this.location);
    }
}

Map.prototype.stray = function(x,y) {
	var relloc = {
		A: this.location.A + x,
		F: this.location.F + y
	}
    for (var i=0;i<this.map.length;i++) {
        this.map[i].setCenter(relloc);
    }
}

/* directions stuff */
Map.prototype.calcRoute = function() {
  var start = "Charlottesville, VA"
  var end = "Missoula, MT"
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}



Map.prototype.zoom = function(level) {
    for (var i=0;i<this.map.length;i++) {
		this.map[i].setZoom(level);
	}
}


