var colindex = 0;
var rackindex = 0;
var items = new Array();
var media = new Array();
var shelves = new Array();

var shelf = function(type) {
	var self = this;
	this.index = shelves.length;
	this.hasUGen = false;
	this.widgets = []
	this.wall = new wall(type)
	this.wall.shelf = this;
	this.make = function() {
		var htmlstr = '<div class="dropzone" id="dropzone'+this.index+'">'
				//	+ '<div class="emptyrack emptywall">WALL</div>'
					+ '<div class="racks"></div>'
					+ '<div class="emptyrack emptymedia"></div>'
					+ '</div>';
		$("#shelves").append(htmlstr)
		//this.droppable();

		this.container = $("#dropzone"+this.index)[0]
		this.rackcontainer = $(this.container).find(".racks")[0]

	//	this.mediatypes = ["hear","see","watch"]
		this.emptyrack = $(this.container).find(".emptyrack")[0]
	/*	for (var i=0;i<this.mediatypes.length;i++) {
			var butt = document.createElement("button")
			butt.innerHTML = this.mediatypes[i]
			console.log(this.wall)
			console.log(this.wall[this.mediatypes[i]])
			butt.addEventListener("click", this.wall[this.mediatypes[i]].bind(this.wall,"waves"))
			this.emptyrack.appendChild(butt)
			//$(this.container).find(".emptyrack").append("<button onclick=''>"+this.mediatypes[i]+"</button>")
		} */
	}
	this.units = new Array();
	this.make()
	this.remove = function() {
		$('#dropzone'+this.index).remove()
	}
	/*this.droppable = function() {
		$("#dropzone"+self.index).droppable({
			drop: function( event, ui ) {
				addRack(ui.draggable[0].innerHTML,$(this).find(".racks")[0],$(this).attr("id"),ugen)
	        }
		})
	} */
}

//shelf 'type' is type of wall (i.e. grid4, big1, etc)
function addShelf(type) {
	var newshelf = new shelf(type)
	shelves.push(newshelf)
	return newshelf;
}

function addRack(type,shelf,media) {
	shelfNum = shelf.index
	// create media here?
	// var unit = new Tone[Parts[type].type]()
	rack(type,shelf,media)
}

var rack = function (type,shelf,media) {

	var rackid = "rack"+rackindex
	rackindex++

	var parent = shelf.rackcontainer

	var rackinfo = Parts[type]
	var parts = rackinfo.widgets;

	var container = document.createElement("div")
	container.setAttribute("class", "rackunit")
	container.id = rackid
	if (type=="wall") {
		container.setAttribute("class", "rackunit wall")
	}

	parent.appendChild(container)

	var title = document.createElement("div")
	title.setAttribute("class", "racktitle")
	title.innerHTML = rackinfo.type
	container.appendChild(title)


	for (var i=0;i<parts.length;i++) {

		var col = document.createElement("div")
		col.setAttribute("class", "rackcol")
		col.id = "col"+colindex
		colindex++
		container.appendChild(col)

		var widget = nx.add(parts[i].type,{
			parent: col.id,
			w: parts[i].size ? parts[i].size.w : false,
			h: parts[i].size ? parts[i].size.h : false
		});

		widget.wall = shelf.wall;
		widget.media = media ? media : false;

		var action = parts[i].action
		widget.actionstring = action.toString();
		action = action.bind(widget)
		widget.on('*', action)
		if (parts[i].initial) {
			widget.set(parts[i].initial, true)
		}

		var label = document.createElement("div")
		label.setAttribute("class", "racklabel")
		label.innerHTML = parts[i].label
		col.appendChild(label)

		if (parts[i].init) {
			parts[i].init.bind(widget)();
		}

		shelf.widgets.push(widget)


	}

	var closer = document.createElement("div")
	closer.setAttribute("class", "closer")
	closer.innerHTML = "x"
	container.appendChild(closer)
	closer.onclick = function() {
		if (container.className.indexOf("wall")>=0) {
			shelf.wall.kill()
			//destroys widget when wall is killed, not when indiv media are killed.
			for (var i=0;i<shelf.widgets.length;i++) {
				shelf.widgets[i].destroy();
			}
			shelf.remove()
		} else {
			widget.media.kill()
			parent.removeChild(container)
		}
		
	}

}

var Parts = {
	"wall": {
		type: "wall",
		ugen: false,
		widgets: [
		{
			label: "windows",
			type: "windows",
			action: function(data) {
				if (data.add) {
					var w = ~~((data.add.w)*m.stage.w)
					var h = ~~((data.add.h)*m.stage.h)
					var x = ~~((data.add.x)*m.stage.w+m.stage.x) - w/2
					var y = ~~((data.add.y)*m.stage.h+m.stage.y) - h/2
					if (data.items.length>this.wall.elements.length) {
						this.wall.elements.push(m.peer(x,y,w,h));
					}
					
				}
				if (data.remove || data.remove===0) {
					this.wall.killWindow(data.remove)
				}
				if (data.items) {
					for (var i=0;i<data.items.length;i++) {
						if (i<this.wall.elements.length) {
							var w = ~~((data.items[i].w)*m.stage.w)
							var h = ~~((data.items[i].h)*m.stage.h)
							var x = ~~((data.items[i].x)*m.stage.w+m.stage.x) - w/2
							var y = ~~((data.items[i].y)*m.stage.h+m.stage.y) - h/2
							this.wall.elements[i].size(w,h)
						//	this.wall.elements[i].move(x,y)
						}
					}
				}
			},
			init: function() {
				for (var i=0;i<this.wall.elements.length;i++) {
					var w = m.scale(this.wall.elements[i].w,0,m.stage.w,0,1)
					var h = m.scale(this.wall.elements[i].h,0,m.stage.h,0,1)
					var x = m.scale(this.wall.elements[i].x,m.stage.x,m.stage.w+m.stage.x,0,1) + w/2
					var y = m.scale(this.wall.elements[i].y,m.stage.y,m.stage.h+m.stage.y,0,1) + h/2
					this.add(x,y,w,h)
				}
			},
			size: {
				w: 200,
				h: 150
			}
		},
		{
			label: "hide",
			type: "toggle",
			action: function(data) {
				if (data.value) {
					this.wall.hide()
				} else {
					this.wall.show()
				}
			},
			initial: {
				value: 0
			},
			size: {
				w: 50,
				h: 50
			}
		},
		{
			label: "scroll",
			type: "position",
			action: function(data) {
				this.wall.scroll(data.x*2000,m.scale(data.y,1,0,0,2000))
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			label: "autoscroll",
			type: "toggle",
			action: function(data) {
				this.wall.autoscroll(data.value)
			},
			size: {
				w: 50,
				h: 50
			}
		},
		{
			label: "xray",
			type: "button",
			action: function(data) {
				if (data.press) {
					this.wall.xray()
				}
			},
			initial: {
				value: 0
			},
			size: {
				w: 25,
				h: 25
			}
		},
		{
			label: "empty",
			type: "button",
			action: function(data) {
				if (data.press) {
					this.wall.empty()
				}
			},
			initial: {
				value: 0
			},
			size: {
				w: 25,
				h: 25
			}
		},
		{
			label: "scramble",
			type: "button",
			action: function(data) {
				if (data.press) {
					this.wall.scramble()
				}
			},
			initial: {
				value: 0
			},
			size: {
				w: 25,
				h: 25
			}
		},
		{
			label: "refresh",
			type: "button",
			action: function(data) {
				if (data.press) {
					this.wall.refresh()
				}
			},
			initial: {
				value: 0
			},
			size: {
				w: 25,
				h: 25
			}
		},
		{
			type: "select",
			label: "pattern",
			action: function(data) {
				this.wall.shapeshift(data.text,0)
				var patt = this.wall.patterns[data.text]
				for (var i=0;i<patt.length;i++) {
					this.wall.shelf.widgets[0].setWindow(i,patt[i])
				}
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["default","line","big1","grid4","fauve"]
				this.init();
			} 
		},
		{
			type: "select",
			label: "watch",
			action: function(data) {
				var newmedia = this.wall.watch(data.text)
				addRack("film",this.wall.shelf,newmedia)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["waves","kremlin","Demo2"]
				this.init();
			} 
		},
		{
			type: "select",
			label: "hear",
			action: function(data) {
				var newmedia = this.wall.hear(data.text)
				addRack("cassette",this.wall.shelf,newmedia)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["pno","pno"]
				this.init();
			} 
		},
		{
			type: "select",
			label: "see",
			action: function(data) {
				var newmedia = this.wall.see(data.text)
				addRack("photo",this.wall.shelf,newmedia)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["mcluhan","mcluhan","screen1.png","screen2.png","screen3.png","ios7icon-01.png"]
				this.init();
			} 
		},
		{
			type: "select",
			label: "hack",
			action: function(data) {
				var newmedia = this.wall.hack(data.text)
				addRack("hack",this.wall.shelf,newmedia)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["en.wikipedia.org/wiki/art","en.wikipedia.org/wiki/life","google.com","foxnews.com"]
				this.init();
			} 
		},
		//hack,voice,lattice,paper,presence, color overlay
		{
			type: "colors",
			label: "overlay",
			action: function(data) {
			//	console.log(data)
				this.wall.color("rgba("+data.r+","+data.g+","+data.b+","+this.wall.coloralpha+")")
			//	addRack("voice",this.wall.shelf,newmedia)
			},
			size: {
				w: 60,
				h: 60
			}
		},
		{
			type: "text",
			label: "write",
			action: function(data) {
				var newmedia = this.wall.write(data.text)
				addRack("paper",this.wall.shelf,newmedia)
			},
			size: {
				w: 150,
				h: 60
			}
		},
		{
			type: "text",
			label: "map",
			action: function(data) {
				var newmedia = this.wall.explore(data.text)
				addRack("map",this.wall.shelf,newmedia)
			},
			size: {
				w: 120,
				h: 30
			}
		},
		{
			type: "text",
			label: "sms",
			action: function(data) {
				var newmedia = this.wall.sms(data.text)
				addRack("sms",this.wall.shelf,newmedia)
			},
			size: {
				w: 120,
				h: 30
			}
		},
		{
			type: "text",
			label: "log",
			action: function(data) {
				var newmedia = this.wall.log(data.text)
				addRack("log",this.wall.shelf,newmedia)
			},
			size: {
				w: 120,
				h: 30
			}
		}
	]},




	/* 
	      FILM 
	*/

	"film": { 
		type: "film",
		widgets: [
		{
			type: "select",
			label: "load",
			action: function(data) {
				this.media.load(data.text)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["waves","kremlin"]
				this.init();
			} 
		},
		{
			type: "dial",
			label: "speed",
			action: function(data) {
				this.media.speed(data.value*4)
			},
			size: {
				w: 40,
				h: 40
			},
			initial: {
				value: 0.25
			} 
		},
		{
			type: "range",
			label: "loop",
			action: function(data) {
				this.media.skip(data.start*10,data.stop*10)
			},
			size: {
				w: 70,
				h: 20
			} 
		},
		{
			type: "toggle",
			label: "pause",
			action: function(data) {
				if (data.value) {
					this.media.stop()
				} else {
					this.media.play()
				}
				
			},
			size: {
				w: 30,
				h: 30
			}
		},
		{
			type: "slider",
			label: "scrub",
			action: function(data) {
				this.media.jumpTo(data.value*10)
			},
			size: {
				w: 70,
				h: 20
			} 
		},
		{
			type: "dial",
			label: "opacity",
			action: function(data) {
				this.media.fade(data.value)
			},
			size: {
				w: 40,
				h: 40
			},
			initial: {
				value: 1
			}
		},
		{
			type: "windows",
			label: "shape",
			action: function(data) {
				this.media.move({x:(data.items[0].x-data.items[0].w)*1000, y:(data.items[0].y-data.items[0].h)*1000})
				this.media.size({w:data.items[0].w*1000, h:data.items[0].h*1000})
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			type: "toggle",
			label: "hide",
			action: function(data) {
				if (data.value) {
					this.media.hide()
				} else {
					this.media.show()
				}
			},
			size: {
				w: 40,
				h: 40
			}
		}
		// left undone: glitch settings dropdown, glitch button, effects settings dropdown
	]},
	"cassette": { 
		type: "cassette",
		widgets: [
		{
			type: "select",
			label: "load",
			action: function(data) {
				this.media.load(data.text)
			},
			size: {
				w: 50,
				h: 20
			},
			init: function() {
				this.choices = ["pno","pnoc3"]
				this.init();
			} 
		},
		{
			type: "dial",
			label: "speed",
			action: function(data) {
				this.media.speed(data.value*4)
			},
			size: {
				w: 40,
				h: 40
			},
			initial: {
				value: 0.25
			} 
		},
		{
			type: "range",
			label: "loop",
			action: function(data) {
				this.media.skip(data.start*10,data.stop*10)
			},
			size: {
				w: 70,
				h: 20
			} 
		},
		{
			type: "toggle",
			label: "pause",
			action: function(data) {
				if (data.value) {
					this.media.stop()
				} else {
					this.media.play()
				}
				
			},
			size: {
				w: 30,
				h: 30
			}
		},
		{
			type: "slider",
			label: "scrub",
			action: function(data) {
				this.media.jumpTo(data.value*10)
			},
			size: {
				w: 70,
				h: 20
			} 
		},
		{
			type: "dial",
			label: "opacity",
			action: function(data) {
				this.media.fade(data.value)
			},
			size: {
				w: 40,
				h: 40
			},
			initial: {
				value: 1
			}
		},
		{
			type: "windows",
			label: "shape",
			action: function(data) {
				this.media.move({x:(data.items[0].x-data.items[0].w)*1000, y:(data.items[0].y-data.items[0].h)*1000})
				this.media.size({w:data.items[0].w*1000, h:data.items[0].h*1000})
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			type: "toggle",
			label: "hide",
			action: function(data) {
				if (data.value) {
					this.media.hide()
				} else {
					this.media.show()
				}
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "button",
			label: "impulse",
			action: function(data) {
				if (data.press) {
					this.media.jumpTo(0.01)
					this.media.play()
				}
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "position",
			label: "bandpass",
			action: function(data) {
				// this.media.bp(data.x*2000,data.y*20)
				// arguments are center freq and Q
			},
			size: {
				w: 100,
				h: 60
			}
		},
		{
			type: "dial",
			label: "delay",
			action: function(data) {
				// this.media.delay(data.value)
				// argument is the volume of the delay source
				// or, the amount of this particular sound sent to delay
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "dial",
			label: "reverb",
			action: function(data) {
				// this.media.reverb(data.value)
				// argument is the volume of the effect
				// or, the amount of this particular sound sent to effect
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "dial",
			label: "distortion",
			action: function(data) {
				// this.media.overdrive(data.value)
				// argument is the volume of the effect
				// or, the amount of this particular sound sent to effect
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "crossfade",
			label: "pan",
			action: function(data) {
				// this.media.pan(data.value)
			},
			size: {
				w: 70,
				h: 20
			},
			initial: {
				value: 0
			}
		}
		// left undone: glitch settings dropdown, glitch button, effects settings dropdown
	]},
	"photo": { 
		type: "photo",
		widgets: [
		{
			type: "button",
			label: "glitch",
			action: function(data) {
				if (data.press) {
					this.media.glitch()
				}
			}
		},
		{
			type: "dial",
			label: "opacity",
			action: function(data) {
				this.media.fade(data.value)
			},
			size: {
				w: 40,
				h: 40
			},
			initial: {
				value: 1
			}
		},
		{
			type: "windows",
			label: "shape",
			action: function(data) {
				this.media.move({x:(data.items[0].x-data.items[0].w)*1000, y:(data.items[0].y-data.items[0].h)*1000})
				this.media.size({w:data.items[0].w*1000, h:data.items[0].h*1000})
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			type: "dial",
			label: "zoom level",
			action: function(data) {
				this.media.zoom({ level: data.value })
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "position",
			label: "zoom",
			action: function(data) {
				this.media.zoom({ x: data.x, y: data.y })
			},
			size: {
				w: 100,
				h: 60
			}
		},
		{
			type: "text",
			label: "google image",
			action: function(data) {
				m.googleimage(data.text,function(links) {
					console.log(links)
					this.media.load(links[0])
				}.bind(this))
			},
			size: {
				w: 100,
				h: 30
			}
		}
		//left undone: glitch for URL images. more glitch settings (tile repeat, color overlay)
	]},
	//left to do: hack, paper, voice, lattice
	"hack": { 
		type: "hack",
		widgets: [
		{
			type: "windows",
			label: "shape",
			action: function(data) {
				this.media.move({x:(data.items[0].x-data.items[0].w)*1000, y:(data.items[0].y-data.items[0].h)*1000})
				this.media.size({w:data.items[0].w*1000, h:data.items[0].h*1000})
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			label: "scroll",
			type: "position",
			action: function(data) {
			//	this.media.scroll(data.x*2000,m.scale(data.y,1,0,0,2000))
			},
			size: {
				w: 100,
				h: 100
			}
		},
		{
			type: "select",
			label: "load",
			action: function(data) {
				this.media.load(data.text)
			},
			size: {
				w: 100,
				h: 30
			},
			init: function() {
				this.choices = ["en.wikipedia.org/wiki/art","en.wikipedia.org/wiki/life","google.com","foxnews.com"]
				this.init()
			} 
		},
		{
			type: "text",
			label: "load",
			action: function(data) {
				this.media.load(data.text)
			},
			size: {
				w: 150,
				h: 30
			}
		},
		{
			type: "dial",
			label: "zoom",
			action: function(data) {
				this.media.zoom(data.value*4)
			},
			size: {
				w: 40,
				h: 40
			}
		}
	]},
/*	"voice": { 
		type: "voice",
		widgets: [
		{
			type: "text",
			label: "say",
			action: function(data) {
				if (data.text) {
					this.media.say(data.text)
				}
			}
		}
	]}, */
	"paper": { 
		type: "hack",
		widgets: [
		{
			type: "text",
			label: "text",
			action: function(data) {
				this.media.read(data.text)
			}
		},
		{
			type: "select",
			label: "style",
			action: function(data) {
				this.media.changeStyle(data.text)
			},
			size: {
				w: 100,
				h: 30
			},
			init: function() {
				this.choices = ["normal","flip","wash"]
				this.init()
			} 
		},
		{
			type: "button",
			label: "empty",
			action: function(data) {
				if (data.press) {
					//	this.media.empty()
				}
			},
			size: {
				w: 40,
				h: 40
			}
		},
		{
			type: "button",
			label: "restart",
			action: function(data) {
				if (data.press) {
					//	this.media.restart()
				}
			},
			size: {
				w: 40,
				h: 40
			}
		}
	]},
	"lattice": { 
		type: "hack",
		widgets: [
		{
			type: "button",
			label: "glitch",
			action: function(data) {
				if (data.press) {
					this.media.glitch()
				}
			}
		}
	]},
	"map": { 
		type: "map",
		widgets: [
		{
			type: "dial",
			label: "zoom",
			action: function(data) {
				this.media.zoom(Math.floor(data.value*16))
			}
		},
		{
			type: "position",
			label: "stray",
			action: function(data) {
				var adjustedx = data.x - 0.5
				var adjustedy = data.y - 0.5
				this.media.stray(adjustedx, adjustedy)
			}
		},
		{
			type: "text",
			label: "directions",
			action: function(data) {
				var locs = data.text
				locs = locs.split (" to ")
				this.media.route(locs[0], locs[1])
			}
		},
		{
			type: "button",
			label: "marker",
			action: function(data) {
				if (data.press) {
					this.media.marker()
				}
			}
		},
		{
			type: "button",
			label: "info",
			action: function(data) {
				if (data.press) {
					this.media.info()
				}
			}
		}
	]},
	"sms": { 
		type: "sms",
		widgets: [
		{
			type: "text",
			label: "me",
			action: function(data) {
				this.media.text(data.text)
			}
		},
		{
			type: "toggle",
			label: "rapid",
			action: function(data) {
				if (data.value) {
					this.media.scroll()
				} else {
					this.media.scrolling = false
				}
				
			}
		}
	]},
	"log": { 
		type: "log",
		widgets: [
		{
			type: "text",
			label: "me",
			action: function(data) {
				this.media.write(data.text)
			}
		}
	]}
}