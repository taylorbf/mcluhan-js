var util = require('util');


var Wall = module.exports = function(setting,limit) {

	this.elements = []
	this.setting = setting ? setting : "default"
	console.log(this.patterns[this.setting].length)
	this.limit = limit ? limit : this.patterns[this.setting].length
	this.patt = this.patterns[this.setting];
	for (var i=0;i<this.limit;i++) {
		this.elements.push(m.peer(this.patt[i].x, this.patt[i].y, this.patt[i].w, this.patt[i].h))
	}
	//console.log(this.elements)
	//this.show();


//	this.element = window.open("space.html","win"+windex,"height=100,width=100,left:0,top:0,menubar=0,status=0,location=0,titlebar=0,toolbar=0")
//	with (this.element) {
//		resizeTo(100,100)
//		moveTo(0,0)
//	}
	this.index = windex;
//	windex++;
	this.visible = false;
	
}

Wall.prototype.show = function(params) {

	for (var i=0;i<this.limit;i++) {
		this.elements[i].show()
	}

	this.visible = true;
/*
	this.element.close();
	this.element = window.open("space.html","win"+this.index,"height=100,width=100,left:0,top:0,menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	
	params = params ? params : new Object()
	params.w = params.w ? params.w : this.defaultSize.w
	params.h = params.h ? params.h : this.defaultSize.h
	params.x = params.x ? params.x : this.defaultSize.x
	params.y = params.y ? params.y : this.defaultSize.y

	with (this.element) {
		resizeTo(params.w,params.h)
		moveTo(params.x,params.y)
	}

	this.element.focus()

	// spaces can access us
	spaces.push(this)

	// the new window can access us
	this.element.space = this;
	this.element.defineCanvas();

	// this.canvas and this.context
	// are then created by the new window when loading

	*/

}

Wall.prototype.hide = function() {
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	spaces.splice(spaces.indexOf(this),1)
	this.element.close();
	this.visible = false;
}

Wall.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

Wall.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
}

Wall.prototype.move = function() {
}

Wall.prototype.size = function() {
}

Wall.prototype.kill = function() {
}

Wall.prototype.empty = function() {
}

Wall.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

Wall.prototype.scroll = function(x,y) {
	this.element.scrollTo(x,y)
}

Wall.prototype.scrollSight = function() {
	this.scroll(this.element.screenX,this.element.screenY)
}


Wall.prototype.refresh = function() {
}

Wall.prototype.patterns = {
	"default": [
		{
			x: ~~(Math.random()*1000),
			y: ~~(Math.random()*600),
			w: 200,
			h: 100
		}
	],
	"line": [
		{
			x: 100,
			y: 100,
			w: 100,
			h: 100
		},
		{
			x: 200,
			y: 100,
			w: 100,
			h: 100
		},
		{
			x: 300,
			y: 100,
			w: 100,
			h: 100
		},
		{
			x: 400,
			y: 100,
			w: 100,
			h: 100
		}
	]
}




