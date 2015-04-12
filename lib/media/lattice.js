var util = require('util');
var Medium = require('../core/medium')

/**
 * @class Lattice
 * @constructor
 * @description  Interactive PITCH LATTICE
 * @extends Medium
 * @param  {object} Params (see Params)
 * @return {Lattice}
 */
var Lattice = module.exports = function(params) {

	this.defaultSize = { w: 600, h: 600 }
	this.type = "canvas";

	//separate item constructor "Medium" with properties for placement, animation, remove, make dom element, styling element based on json
	Medium.call(this, params);

	this.context = []
	this.instrument = []
	//create 3d matrix
	this.dimension = {
		x: 5,
		y: 8,
		z: 3
	}
	this.place = {
		x: Math.floor(this.dimension.x/2),
		y: Math.floor(this.dimension.y/2),
		z: Math.floor(this.dimension.z/2)
	}

	for (var i = 0; i<this.spaces.length; i++) {
		this.element[i].width = this.defaultSize.w
		this.element[i].height = this.defaultSize.h
		this.instrument[i] = new Object();
		this.instrument[i].context = this.element[i].getContext("2d")	
		this.instrument[i].notes = new Array();
		for (var j = 0; j < this.dimension.z; j++) {
			this.instrument[i].notes[j] = new Array();
			for (var k = 0; k < this.dimension.x; k++) {
				this.instrument[i].notes[j][k] = new Array();
				for (var l = 0; l < this.dimension.y; l++) {
					this.instrument[i].notes[j][k][l] = new this.note(j,k,l,this.instrument[i].context,this.instrument[i],this);
				}
			}
		}
	}

	this.draw();

	return this;

}


/*
	looking at : 5 * 3 * 10
	x: * 3/2
	y: + fundamental of this column, making overtone series
	z: * 5/4
				25/16
				5/4		15/8	45/32
		2/3		1/1		3/2		9/8
				8/5




		2/3 * <=	=> * 3/2
 */


util.inherits(Lattice, Medium);

Lattice.prototype.draw = function(src) {

	for (var i = 0; i<this.instrument.length; i++) {
		var context = this.instrument[i].context
		context.fillStyle="black"
		context.fillRect(0,0,this.defaultSize.w,this.defaultSize.h)
		var notes = this.instrument[i].notes
		for (var j = 0; j < notes.length; j++) {
			for (var k = 0; k < notes[j].length; k++) {
				for (var l = 0; l < notes[j][k].length; l++) {
					notes[j][k][l].draw();
				}
			}
		}
	}


	return this;

}

Lattice.prototype.play = function() {
	this.instrument[0].notes[this.place.z][this.place.x][this.place.y].play()
}
Lattice.prototype.wander = function(speed) {
	this.int = setInterval(this.nextxyz.bind(this),speed)
}
Lattice.prototype.stop = function() {
	clearInterval(this.int)
}
Lattice.prototype.nextxyz = function() {
	var dir = random(3)
	if (dir==0) {
		this.place.x += random(3)-1
	} else if (dir==1) {
		this.place.y += random(3)-1
	} else {
		this.place.z += random(3)-1
	}
	this.place.x = this.place.x>=this.dimension.x ? this.dimension.x-2 : this.place.x;
	this.place.y = this.place.y>=this.dimension.y ? this.dimension.y-2 : this.place.y;
	this.place.z = this.place.z>=this.dimension.z ? this.dimension.z-2 : this.place.z;
	this.place.x = this.place.x<0 ? 1 : this.place.x;
	this.place.y = this.place.y<0 ? 1 : this.place.y;
	this.place.z = this.place.z<0 ? 1 : this.place.z;
	this.play()
}
Lattice.prototype.nextx = function() {
	this.place.x++
	this.place.x = this.place.x>=this.dimension.x ? 0 : this.place.x;
	this.place.x = this.place.x<0 ? this.dimension.x : this.place.x;
	this.play()
}
Lattice.prototype.nexty = function() {
	this.place.y++
	this.place.y = this.place.y>=this.dimension.y ? 0 : this.place.y;
	this.place.y = this.place.y<0 ? this.dimension.y : this.place.y;
	this.play()
}
Lattice.prototype.nextz = function() {
	this.place.z++
	this.place.z = this.place.z>=this.dimension.z ? 0 : this.place.z;
	this.place.z = this.place.z<0 ? this.dimension.z : this.place.z;
	this.play()
}


Lattice.prototype.note = function(z,x,y,context,instrument,lattice) {

	this.note = 0.1 * ((x+1)*5/4) * (y+1) * ((z+1)*3/2)
	//this.note = 0.01 * (x*3/2) * y * (z*5/4)
	this.on = false

	this.context = context
	this.instrument = instrument
	this.lattice = lattice

	this.player = new Tone.Player("./media/pnoc3.mp3")
	this.player.retrigger = true
	this.player.playbackRate = this.note
	this.player.toMaster()

	this.x = x
	this.y = y
	this.z = z

	this.place = {
		x: (this.x * 60 + 50) * (1+this.z/12),
		y: (this.y * 50 + 50) * (1+this.z/12)
	}
	this.grd = this.context.createRadialGradient(this.place.x-3,this.place.y-3,3,this.place.x+3,this.place.y+3,20);
	this.grd.addColorStop(0,"rgb("+(180+this.z*40)+","+(180+this.z*40)+","+(180+this.z*40)+")")
	this.grd.addColorStop(1,"#333")

	this.grd2 = this.context.createRadialGradient(this.place.x-3,this.place.y-3,3,this.place.x+3,this.place.y+3,20);
	this.grd2.addColorStop(0,"rgb("+(0+this.z*40)+","+(0+this.z*40)+","+(180+this.z*40)+")")
	this.grd2.addColorStop(1,"#0af")

	this.draw = function() {

		//j is z
		//k is x
		//l is y
		if (this.on) {
			this.context.fillStyle = this.grd2
		} else {
			this.context.fillStyle = this.grd
		}
		this.context.beginPath()
		this.context.arc(this.place.x,this.place.y,8+this.z*2,0,Math.PI*2,false)
		this.context.fill()
		this.context.closePath()

	}

	this.play = function() {
		this.on = true;
		this.player.onended = function() {
			this.on = false
			this.lattice.draw();
		}.bind(this)
		this.player.start();
		//currently redraws *all* lattices in all windows. should only draw its own instrument.
		this.lattice.draw();
	}

	this.stop = function() {
		this.on = false;
		this.player.stop();
		this.lattice.draw();

	}


}

