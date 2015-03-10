var util = require('util');


var Window = module.exports = function(params) {

	this.defaultSize = { w: 300, h: 200, x: window.screen.width/2 - 150, y: window.screen.height/2 - 100 }
	this.element = window.open("space.html","win"+windex,"height=100,width=100,left:0,top:0,menubar=0,status=0,location=0,titlebar=0,toolbar=0")
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	this.index = windex;
	windex++;
	this.visible = false;
	
}

Window.prototype.show = function(params) {

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

	this.visible = true;
	this.element.focus()

	// spaces can access us
	spaces.push(this)

	// the new window can access us
	this.element.space = this;
	//this.element.defineCanvas();

	// this.canvas and this.context
	// are then created by the new window when loading

}

Window.prototype.hide = function() {
	with (this.element) {
		resizeTo(100,100)
		moveTo(0,0)
	}
	spaces.splice(spaces.indexOf(this),1)
	this.element.close();
	this.visible = false;
}

Window.prototype.load = function(src) {
	src ? this.element.src = src : false;
}

Window.prototype.scroll = function(x,y) {
	this.element.scroll.x = x
	this.element.scroll.x = y
}

Window.prototype.move = function(x,y) {
	this.element.moveTo(x,y)
}

Window.prototype.size = function() {
}

Window.prototype.kill = function() {
}

Window.prototype.empty = function() {
}

Window.prototype.testDraw = function() {
	this.context.fillStyle = "#0af"
	this.context.fillRect(0,0,100,100)
}

Window.prototype.scroll = function(x,y) {
	this.element.scrollTo(x,y)
}

Window.prototype.scrollSight = function() {
	this.scroll(this.element.screenX,this.element.screenY)
}


Window.prototype.refresh = function() {
}




