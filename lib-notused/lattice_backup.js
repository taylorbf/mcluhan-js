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

	for (var i = 0; i<this.spaces.length; i++) {
		this.element[i].width = this.defaultSize.w
		this.element[i].height = this.defaultSize.h
		this.instrument[i] = new Object();
		this.instrument[i].context = this.element[i].getContext("2d")
		this.instrument[i].player = new Tone.Player("./media/pno.mp3")
		this.instrument[i].player.retrigger = true
		this.instrument[i].player.toMaster()	
		this.instrument[i].notes = new Array();
		for (var j = 0; j < this.dimension.z; j++) {
			this.instrument[i].notes[j] = new Array();
			for (var k = 0; k < this.dimension.x; k++) {
				this.instrument[i].notes[j][k] = new Array();
				for (var l = 0; l < this.dimension.y; l++) {
					this.instrument[i].notes[j][k][l] = 1;
				}
			}
		}
	}

	this.draw();

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
					//j is z
					//k is x
					//l is y
					var x = (k * 60 + 50) * (1+j/12)
					var y = (l * 50 + 50) * (1+j/12)

					context.fillStyle = "rgb("+(180+j*40)+","+(180+j*40)+","+(180+j*40)+")"

					var grd=context.createRadialGradient(x-3,y-3,3,x+3,y+3,20);
					grd.addColorStop(0,"rgb("+(180+j*40)+","+(180+j*40)+","+(180+j*40)+")")
					grd.addColorStop(1,"#333")
					context.fillStyle = grd

					context.beginPath()
					context.arc(x,y,8+j*2,0,Math.PI*2,false)
					context.fill()
					context.closePath()
					//context.fillRect(,10-k,10-k)
					//this.instrument[i].notes[j][k][l] = 1;
				}
			}
		}
	}


	return this;

}

Lattice.prototype.node = function() {

	this.note = 0

	this.play = function() {

	}

	this.stop = function() {

	}


}

