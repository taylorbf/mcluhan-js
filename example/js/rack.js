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
		container.setAttribute("class", "wall")
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
				console.log(data)
				if (data.add) {
					var w = ~~((data.add.w/this.width)*m.stage.w)
					var h = ~~((data.add.h/this.height)*m.stage.h)
					var x = ~~((data.add.x/this.width)*m.stage.w+m.stage.x) - w/2
					var y = ~~((data.add.y/this.height)*m.stage.h+m.stage.y) - h/2
					if (data.items.length>this.wall.elements.length) {
						this.wall.elements.push(m.peer(x,y,w,h));
					}
					
				}
				if (data.remove!=undefined) { 
					console.log(data.remove)
					this.wall.killWindow(data.remove)
					//this.wall.elements[data.remove].kill()
				}
				if (data.items) {
					for (var i=0;i<data.items.length;i++) {
						if (i<this.wall.elements.length) {
							var w = ~~((data.items[i].w/this.width)*m.stage.w)
							var h = ~~((data.items[i].h/this.height)*m.stage.h)
							var x = ~~((data.items[i].x/this.width)*m.stage.w+m.stage.x) - w/2
							var y = ~~((data.items[i].y/this.height)*m.stage.h+m.stage.y) - h/2
							this.wall.elements[i].size(w,h)
							this.wall.elements[i].move(x,y)
						}
					}
				}
			},
			init: function() {
				for (var i=0;i<this.wall.elements.length;i++) {
					var w = m.scale(this.wall.elements[i].w,0,m.stage.w,0,this.width)
					var h = m.scale(this.wall.elements[i].h,0,m.stage.h,0,this.height)
					var x = m.scale(this.wall.elements[i].x,m.stage.x,m.stage.w+m.stage.x,0,this.width) + w/2
					var y = m.scale(this.wall.elements[i].y,m.stage.y,m.stage.h+m.stage.y,0,this.height) + h/2
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
				this.choices = ["waves","waves"]
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
				this.choices = ["mcluhan","mcluhan"]
				this.init();
			} 
		}
	]},
	"film": { 
		type: "film",
		widgets: [
		{
			type: "range",
			label: "loop",
			action: function(data) {
				this.media.skip(data.start*10,data.stop*10)
			}
		}
	]},
	"cassette": { 
		type: "cassette",
		widgets: [
		{
			type: "range",
			label: "loop",
			action: function(data) {
				this.media.skip(data.start*10,data.stop*10)
			}
		}
	]},
	"photo": { 
		type: "photo",
		widgets: [
		{
			type: "button",
			label: "glitch",
			action: function(data) {
				this.media.glitch()
			}
		}
	]}
}