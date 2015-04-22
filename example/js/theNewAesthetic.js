  /*
    At its best, this could be a useful movement. At its worst, another meme. 
    - Aimee Knight
    
    [http://aimeeknight.com/2012/04/10/the-new-aestheticperhaps/]
  */

  /*****************************
   *												*
   *   the											*
   *  	 \  |                    \                 |    |            |   _)          _)       	*
   *	  \ |   _ \ \ \  \   /  _ \     _ \   __|  __|  __ \    _ \  __|  |   __|     |   __| 	*
   *    |\  |   __/  \ \  \ /  ___ \    __/ \__ \  |    | | |   __/  |    |  (        | \__ \ 	*
   *   _| \_| \___|   \_/\_/ _/    _\ \___| ____/ \__| _| |_| \___| \__| _| \___| _)  | ____/ 	*
   *	 									  ___/		*
   *	 							 ../n!ck.br!z			*
   *	 							 copy<it>right			*
   *	 							     2012			*
   *												*
   *												*
								      ***************************/
  
  /*
   
  If Postmodernism rejects the functionally-driven design of Modernism, the New Aesthetic is a
  "Semimodernism": it embraces the formal results of functional design but ignores the motivation.
  - Kyle Mcdonald
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#6]
  */

  //Set up CSS for <html> + <body> to work w/Google Maps API
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = 'html{ height: 100% }body{ height: 100%; margin: 0; padding: 0 }';
  document.getElementsByTagName('head')[0].appendChild(style);

  //Create a canvas element [this one is used by .bg() & .glitchGif() ]
  //var canvas = document.createElement('canvas');
  //document.body.appendChild(canvas);
  try {

    WIDTH = canvas.width;
    HEIGHT = canvas.height;
  
  //canvas.height = HEIGHT;
  //canvas.width = WIDTH;
  var ctx = canvas.getContext('2d');
  //canvas.style.position = 'absolute';
  //canvas.style.left = '0px';
  //canvas.style.top = '0px';
  //canvas.style.zIndex = '0';
  //
  
  } catch (e) {
    
  }
  
  var ud = 'undefined',  
  rnbw = ['#ff0000','#ff00ff','#0000ff','#00ffff','#00ff00','#ffff00'];  
      
    //CHANGED    
  //window.onresize = function(){ //Reload window [i.e. canvases] on resize
  //  setTimeout(window.location.reload(), 1000);
 // }


 // reset canvas
/*
 function resetNA() {
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  canvas.height = HEIGHT;
  canvas.width = WIDTH;
 } */
  
  /*
  
  I believe that Sterling is wrong. I believe that the New Aesthetic is actually striving towards a fundamentally new way of
  imagining the relations between things in the world. To convince you of this, I'll make a case that the New Aesthetic
  strongly resonates with a recent movement in philosophy called Object-Oriented Ontology
  - Greg Borenstein
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#4]
  */
             
  // THE NEW AESTHETIC OBJECT 	/__/\   __ /__/\   __  /__/\     /__/\
  //	>>>> ------ >>>>        \__\/ /__/\\__\/ /__/\ \__\/     \__\/ ------ >>>> ------ >>>> ------
  //				      \__\/ \__\/\__\/
  function theNewAesthetic(){
    this.color = '#ccc';
    this.bitsize = 8;
    this.res = 8;
    this.loop = function() { //loop for drawing out PSD transparency bg
        ctx.fillStyle = this.color;
        ctx.fillRect(xi*(this.bitsize*2),yi*(this.bitsize*2),this.bitsize,this.bitsize);
        ctx.fillRect(xi*(this.bitsize*2)-this.bitsize,yi*(this.bitsize*2)-this.bitsize,this.bitsize,this.bitsize);
        ctx.fillStyle = "#fff";
        ctx.fillRect(xi*(this.bitsize*2)-this.bitsize,yi*(this.bitsize*2),this.bitsize,this.bitsize);
        ctx.fillRect(xi*(this.bitsize*2),yi*(this.bitsize*2)-this.bitsize,this.bitsize,this.bitsize);      
    }
    this.apiKey = ""; //GET API + GENERATE GOOGLE MAPS SCRIPT
    document.write('<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='+this.apiKey+'&sensor=false"></script>'); 
  }
  //  	/__/\   __ /__/\   __  /__/\     /__/\
  //	\__\/ /__/\\__\/ /__/\ \__\/     \__\/ 
  //	      \__\/ \__\/\__\/
  
  
  /*
   
  [NA] exists wherever there is satellite surveillance, locative mapping, smartphone photos, wifi coverage and Photoshop.
  - Bruce Sterling
  
  [http://www.wired.com/beyond_the_beyond/2012/04/an-essay-on-the-new-aesthetic/]
  */
  
  //-------------  _______________	  __________________      ________________
  // BACKGROUNDS /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //-------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/
  //
  // [required parameters]: none
  // [optional parameters]: hex color value (string) or 'rainbow' 
  
  theNewAesthetic.prototype.bg = function(col) {	
    if(typeof col != ud && col != 'rainbow') { //check for color
      this.color = col;
      for(xi=0; xi<=(WIDTH/this.bitsize*2); xi++) {
	for(yi=0;yi<=(HEIGHT/this.bitsize*2);yi++) {
	  this.loop(); //loop + draw PSD "transparency-layer" grid w/specified color
	}
      }
    }
    else if (col == 'rainbow') { //check for 'rainbow' 
      cnt = 1; str = 0;
      for(xi=0; xi<=(WIDTH/this.bitsize*2); xi++) {
	for(yi=0;yi<=(HEIGHT/this.bitsize*2);yi++) {
	  str += cnt;
	  if(str > 6) {str = 0;}
	  this.color = rnbw[str];
	  this.loop(); //loop + draw PSD "transparency-layer" grid w/rainbow
	}
      }
    }
    else {
      for(xi=0; xi<=(WIDTH/this.bitsize*2); xi++) {
	for(yi=0;yi<=(HEIGHT/this.bitsize*2);yi++) {
	  this.loop();	//else make a default PSD "transparency-layer"
	}
      }
    }
  }
  
  /*
  
  The New Aesthetic, as it exists in drone technology and Google Maps imagery and data surveillance, represents a ground-level
  change in our existence. Instead of shocking society, New Aesthetic art must respond to a shocked society and turn the changes
  we're confronting into critical artistic creation.
  - Kyle Chayka
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#1]
  */
  
  //---------------  _______________	    __________________    ________________
  // GOOGL MAPS BG /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //---------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/
  //
  // [required parameters]: type (string), latitude (integer), longitute (integer)
  // [optional parameters]: zoom (integer 0 - 20), map-position-x (integer), map-position-y (integer), map width% (integer), map height% (integer), 
  
  theNewAesthetic.prototype.googleMaps = function(TYPE,LAT,LNG,ZOOM,gmX,gmY,gmW, gmH) {
    if(this.apiKey != "" && typeof LAT != ud && typeof LNG != ud) {
      if(!gmH) {gmH = 100;} if(!gmW) {gmW = 100;}
      if(!gmX) {gmX = 0;} if(!gmW) {gmY = 0;}
      if(!ZOOM) {ZOOM = 8;}

      var gmDiv = document.createElement('div');
      document.body.appendChild(gmDiv);    
      gmDiv.style.position = 'absolute'; gmDiv.style.zIndex = '-1';   
      gmDiv.style.left = gmX+'px'; gmDiv.style.top = gmY+'px';
      gmDiv.style.height = gmH+"%"; gmDiv.style.width = gmW+"%";
      gmDiv.id = 'map_canvas';
      
      if(TYPE == 'roadmap') {
        var myOptions = {
          center: new google.maps.LatLng(LAT,LNG),
          zoom: ZOOM,  
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }
      if(TYPE == 'satellite') {
        var myOptions = {
          center: new google.maps.LatLng(LAT,LNG),
          zoom: ZOOM,  
          mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }
      if(TYPE == 'hybrid') {
        var myOptions = {
          center: new google.maps.LatLng(LAT,LNG),
          zoom: ZOOM,  
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }
      if(TYPE == 'terrain') {
        var myOptions = {
          center: new google.maps.LatLng(LAT,LNG),
          zoom: ZOOM,  
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }
      
    }
    else if(this.apiKey == ""){console.error('ERROR: warez ur GOOGLE API KEY?');}
    else if(typeof LAT == ud){console.error('ERROR: what latitude u lookin at?');}
    else if(typeof LNG == ud){console.error('ERROR: what longitutde u lookin at?');}
  }  
  
  
  
  
  //---------------------- _______________	  __________________      ________________
  // DRAW SELECTION ANTS /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //---------------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: start x (integer), start y (integer), end x (integer), end y (integer) or...
  // [optional parameters]: start x (intger), start y (integer), null, null, length of line (integer), angle for direction (integer)
  
  theNewAesthetic.prototype.drawAnts = function(sX,sY,fX,fY,sL,angle) {
    if(typeof sX != ud && typeof sY != ud && typeof fX != ud && typeof fY != ud)  {     
      if(fX != null && fY != null) { //check for 4 coordinate arguments/points
        			
	if(fX>=sX && fY>=sY){	
	  opp = (fY-sY);
	  adj = (fX-sX);	
	  angadj=0;		
	};  //quadrant IV (bottom right )
	if(fX<=sX && fY<=sY){	
	  opp = (fY-sY);
	  adj = (fX-sX);
	  angadj=180;		
	};  //quadrant II (top left)
	if(fX<=sX && fY>=sY){	
	  adj = (sY-fY);
	  opp = (fX-sX);
	  angadj=90;
	};  //quadrant III (bottom left)
	if(fX>=sX && fY<=sY){
	  adj = (sY-fY);
	  opp = (fX-sX);		
	  angadj=270;		
	};  //quadrant I (top right)
	      
	angle = Math.atan(opp/adj);
	angle = angadj+angle*180/Math.PI;
	sL = Math.sqrt(square(opp)+square(adj));
	//thnx paul.x.briz for this bit:)
      }
	   
      //create canvas
      var aCanvas = document.createElement('canvas');
      document.body.appendChild(aCanvas);
      aCanvas.style.position = 'absolute'; aCanvas.style.zIndex = '0';
      aCanvas.style.left='0px'; aCanvas.style.top='0px';
      aCanvas.width = window.innerWidth; aCanvas.height = window.innerHeight;
      var actx = aCanvas.getContext('2d');      
     
      setInterval(draw, 100);   		//animate the ants
      var sl = Math.round(sL/12); 		//translate pixels into right size    
      function square(x) { return x*x; }
	  
      //draw a rectangle, 6 x 1 :: repeat how ever many times
      function ants2(l,itr) {
	s=0; m=12;
	for(i=0;i<l;i++) {
	  actx.fillRect((itr+s),0,6,1);
	  s+=m;
	}	
      }
      
      //rotate canvas + draw out the ants2();  
      function sels(x,y,l,ang,cnt) {
	actx.save();
        actx.translate(x,y); 		  //reposition the canvas (for rotation)
        actx.rotate(ang * Math.PI / 180); //rotate by specified angle
	 
	reps=12;
	if(sl < 12) {  reps = sl+1; }     //fix bug for when length is less than a particular amount
		
	for(i=0;i<reps;i++) {
	  if (cnt == i) {
	    ants2(l,i);
	  }
	}		
        actx.restore();
      }     
      
      //Draw Function (animates the ants back and fourth)
      cnt = 0; inc = 2;
      function draw() {		
	cnt += inc;
      	if(cnt >= 12 ) {cnt = 0;}		
	  actx.clearRect(0,0,window.innerWidth,window.innerHeight);
	  sels(sX,sY,sl,angle,cnt);
      }
    }
    else {console.error('ERROR: looks like ur missing sum coordinates...');}
  }
  

  /*
  
  Appropriating + remixing graphic markers/standards from marginalised or "other-fied" disciplines/decades does not a new
  genre/paradigm make, especially when begging to be [or deliberately engineered to be] monetised by a system and/or individuals
  determined to emergent-capture [yes, this includes institutionally sanctioned galleries + alternative galleries + oldschool
  curators + newskool aggregators + conference-merry-go-rounders + theorists + panels + karma-seeking discourse boffins]. Codify,
  hipsterise + aggrandise at your leisure, but be prepared for watered-down, digestible, bastardised versions of worthwhile
  social + expressive currencies.
  - Mez Breeze
  
  [comment on http://www.furtherfield.org/features/reviews/banality-new-aesthetic]
  */
  
  //----------------- _______________	     __________________           ________________
  // ICONS LIBRARY  /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //----------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: specific name of icon (string)
  // [optional parameters]: positon x (intger), position y (integer), pixel size (integer), hex color value (string), xtra color for fillBucket paint (string)
  
  theNewAesthetic.prototype.icons = function(ICON,X,Y,SIZE,COLOR,PAINT) {
    if(!X && !Y){X = 0; Y = 0;}
    if(!SIZE) {SIZE = 1;}
    if(!COLOR) {COLOR = '#000000';} if(!PAINT) {PAINT = "#000000";}
    if(typeof ICON != ud) {
      
      ctx.fillStyle = COLOR;
      function draw(){ ctx.fillRect((o[i][0]*SIZE)+X,(o[i][1]*SIZE)+Y,o[i][2]*SIZE,o[i][3]*SIZE); } //draw icon
      
      if(ICON == "file") {
	  //Xerox Star "File" (circa 1981)
	  for(i=0;i<8;i++) { 
	      o = [[0,0,10,1],[0,1,1,14],[0,15,12,1],[8,1,1,4],[8,4,4,1],[10,1,1,1],[11,2,1,1],[12,3,1,13]];
	      draw();
	  }
      }
      
      if(ICON == "spaceInvader") {
	  //"Space Invader" by Tomohiro Nishikado (circa 1978)
	  for(i=0;i<16;i++) { 
	      o = [[2,0,1,1],[8,0,1,1],[3,1,1,1],[7,1,1,1],[2,2,7,1],[1,3,2,2],[4,3,3,3],[8,3,2,2],[0,4,1,3],[3,4,1,2],[7,4,1,2],[10,4,1,3],[2,5,1,2],[8,5,1,2],[3,7,2,1],[6,7,2,1]];
	      draw();
	  }
      }
      
      if(ICON == "watch") {
	  //Apple "Watch" by Susan Kare (circa 1980's)
	  for(i=0;i<11;i++) { 
	      o = [[2,0,6,4],[1,4,1,1],[8,4,1,1],[0,5,1,6],[9,5,1,6],[3,8,3,1],[5,5,1,3],[10,7,1,2],[1,11,1,1],[8,11,1,1],[2,12,6,4]];
	      draw();
	  }
      }    
  
      if(ICON == "fillBucket") {
	  //Apple "Fill Bucket" by Susan Kare (circa 1980's)
	  for(i=0;i<24;i++) { 															  
	      o = [[5,0,3,1],[4,1,1,5],[8,1,1,6],[7,7,1,1],[9,7,1,1],[8,8,1,1],[7,2,1,1],[6,3,1,1],[5,4,1,1],[3,6,1,1],[2,7,1,1],[1,8,1,1],[0,9,1,2],[1,11,1,1],[2,12,1,1],[3,13,1,1],[4,14,1,1],[5,15,2,1],[7,14,1,1],[8,13,1,1],[9,12,1,1],[10,11,1,1],[11,10,1,1],[12,9,1,1]];
	      draw();	//draw bucket
	  }
	  for(i=0;i<7;i++) {	
	      o = [[9,3,1,1],[10,4,2,1],[11,5,3,1],[12,6,3,1],[13,7,3,7],[13,14,2,1],[13,15,1,1]];
	      ctx.fillStyle = PAINT; draw(); ctx.fillSTyle = COLOR; //draw paint
	  }
      }
      
      if(ICON == "arrow") {
	  //Cursor "Arrow"
	  for(i=0;i<23;i++) { 																									
	      o = [[0,0,1,17],[1,1,1,1],[2,2,1,1],[3,3,1,1],[4,4,1,1],[5,5,1,1],[6,6,1,1],[7,7,1,1],[8,8,1,1],[9,9,1,1],[10,10,1,1],[11,11,1,2],[7,12,4,1],[1,16,1,1],[2,15,1,1],[3,14,1,1],[4,13,1,1],[5,14,1,2],[6,16,1,2],[7,18,2,1],[9,16,1,2],[8,14,1,2],[7,13,1,1]];
	      draw();
	  }
      }  
      
      if(ICON == "pointer") {
	  //Cusor "Pointer"
	  for(i=0;i<21;i++) { 																								
	      o = [[0,9,3,1],[0,10,1,2],[3,10,1,1],[1,12,1,1],[2,13,1,2],[3,15,1,2],[4,17,1,2],[5,19,1,2],[5,21,10,1],[14,19,1,2],[15,16,1,3],[16,9,1,7],[15,8,1,1],[13,7,2,1],[13,8,1,3],[10,6,3,1],[10,7,1,3],[8,5,2,1],[7,1,1,9],[5,0,2,1],[4,1,1,11]];
	      draw();
	  }
      }     
	
    }
    else if(!ICON){console.log("ERROR: warez teh icon name?");}
    else if(typeof ICON != 'string') {console.log("ERROR: icon's gotta be a string, wrap sum quotes around that sucka!");}
  }




  //----------------- _______________	     __________________           ________________
  // HOURGLASS ICON /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //----------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: none
  // [optional parameters]: positon x (intger), position y (integer), pixel size (integer), hex color value (string or 'rainbow')
  
  theNewAesthetic.prototype.hourglass = function(X,Y,SIZE,COLOR) {
    if(!X && !Y){X = 0; Y = 0;}		//set default x,y position to 0
    if(!SIZE) {SIZE = 1;}		//set default pixel size to 1px
    if(!COLOR) {COLOR = '#000000';}	//set default color to black

    //prep sizes for proper scaling 
    XSIZE = 17*SIZE; YSIZE = 27*SIZE;
    WIDTH = XSIZE*2.5; HEIGHT = XSIZE*2.5;
    
    //create canvas + position accordingly
    var Canvas = document.createElement('canvas');
    document.body.appendChild(Canvas);
    Canvas.style.position = 'absolute'; Canvas.style.zIndex = '0';
    Canvas.style.left= X-(YSIZE/2) +'px'; Canvas.style.top= Y-(XSIZE/2) +'px';
    Canvas.width = WIDTH; Canvas.height = HEIGHT;
    var ctx = Canvas.getContext('2d');
    
    ctx.fillStyle = COLOR;
    setInterval(draw, 100);
    
    //draw hourglass
    function hourglass(x,y,ang) {
      ctx.save();
      ctx.translate(WIDTH/2,HEIGHT/2);
      ctx.rotate(ang * Math.PI / 180);
      for(i=0;i<30;i++) {
	o = [[0,0,17,2],[0,2,2,2],[15,2,2,2],[1,3,15,1],[1,4,2,4],[14,4,2,4],[2,8,2,1],[13,8,2,1],[3,9,2,1],[12,9,2,1],[4,10,2,1],[11,10,2,1],[5,11,2,1],[10,11,2,1],[6,12,2,3],[9,12,2,3],[5,15,2,1],[10,15,2,1],[4,16,2,1],[11,16,2,1],[3,17,2,1],[12,17,2,1],[2,18,2,1],[13,18,2,1],[1,19,2,5],[14,19,2,5],[1,23,15,1],[0,24,2,3],[15,24,2,3],[2,25,13,2]];
	ctx.fillRect(((0+o[i][0])*SIZE)+x-XSIZE/2,((0+o[i][1])*SIZE)+y-YSIZE/2,(0+o[i][2])*SIZE,(0+o[i][3])*SIZE);
      }
      ctx.restore();
    }
	
    //draw sand inside hourglass	
    function sand(pxl,ang) {
      ctx.save();
      ctx.translate(WIDTH/2,HEIGHT/2);
      ctx.rotate(ang * Math.PI / 180);
      p = [[4,6,1,1],[7,21,1,1],[6,6,1,1],[8,22,1,1],[8,6,1,1],[8,16,1,1],[8,15,1,1],[8,18,1,1],[10,6,1,1],[8,18,1,1],[8,17,1,1],[9,19,1,1],[12,6,1,1],[9,21,1,1],[5,7,1,1],[4,22,1,1],[7,7,1,1],[6,22,1,1],[9,7,1,1],[10,22,1,1],[11,7,1,1],[8,20,1,1],[6,8,1,1],[5,21,1,1],[8,8,1,1],[11,21,1,1],[10,8,1,1],[12,22,1,1],[7,9,1,1],[6,20,1,1],[9,9,1,1],[10,20,1,1],[8,10,1,1],[7,19,1,1]];
      snd = ctx.fillRect(((p[pxl][0])*SIZE)-XSIZE/2,((p[pxl][1])*SIZE)-YSIZE/2,(p[pxl][2])*SIZE,(p[pxl][3])*SIZE);
      ctx.restore();
      return snd;
    }

    //animate hourglass
    cnt = 0; inc = 1;
    function draw() {
      ctx.clearRect(0,0,WIDTH,HEIGHT);
      if(COLOR == "rainbow") {ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16); }
	
      if(cnt >= 21) {cnt = 0;}
      cnt+=inc; 				//make 21 frame cycle
	
      //change angle of the hourglass towards end of cycle (i.e. spin it around)	
      ang = 0; 					
      if(cnt == 19) {ang = 45;}
      if(cnt == 20) {ang = 90;}
      if(cnt == 21) {ang = 135;}
	
      hourglass(0,0,ang); 			//draw hourglass
	
      if(cnt <= 7) { sand(0,ang); }		//properly position grains of sand		
      if(cnt >= 8) { sand(1,ang); }
      
      if(cnt <= 3) { sand(2,ang); }
      if(cnt >= 4) { sand(3,ang); }
	
      if(cnt <= 1) {sand(4,ang);}
      if(cnt >= 2 && cnt <= 15) {sand(5,ang);}
      if(cnt >= 16 && cnt <= 17) {sand(6,ang);}
      if(cnt >= 18 && cnt != 20) {sand(7);} 	//fix dead-pixel bug, with cnt != 20
	
      if(cnt <= 2) { sand(8,ang); }
      if(cnt >= 3 && cnt <= 15,ang) { sand(9,ang); }
      if(cnt >= 16 && cnt <= 16,ang) { sand(10,ang); }
      if(cnt >= 17) { sand(11,ang); }
	
      if(cnt <= 6) { sand(12,ang); }
      if(cnt >= 7) { sand(13,ang); }
	
      if(cnt <= 9) { sand(14,ang); }
      if(cnt >= 10) { sand(15,ang); }
      
      if(cnt <= 5) { sand(16,ang); }
      if(cnt >= 6) { sand(17,ang); }
	
      if(cnt <= 4) { sand(18,ang); }
      if(cnt >= 5) { sand(19,ang); }
	
      if(cnt <= 8) { sand(20,ang); }
      if(cnt >= 9) { sand(21,ang); }
	
      if(cnt <= 11) { sand(22,ang); }
      if(cnt >= 12) { sand(23,ang); }
	
      if(cnt <= 12) { sand(24,ang); }
      if(cnt >= 13) { sand(25,ang); }
	
      if(cnt <= 10) { sand(26,ang); }
      if(cnt >= 11) { sand(27,ang); }
	
      if(cnt <= 13) { sand(28,ang); }
      if(cnt >= 14) { sand(29,ang); }
	
      if(cnt <= 14) { sand(30,ang); }
      if(cnt >= 15) { sand(31,ang); }
	
      if(cnt <= 15) { sand(32,ang); }
      if(cnt >= 16) { sand(33,ang); }	
    }
  }  


  /*
  
  James Bridle is a Walter Benjamin critic in an "age of digital accumulation". Bridle carries out a valiant cut-and-paste
  campaign that looks sorta like traditional criticism, but is actually blogging and tumblring. His New Aesthetic Tumblr
  bears the resemblance to thoughtful critique that mass production once did to handmade artifacts.
  - Bruce Sterling
  
  [http://www.wired.com/beyond_the_beyond/2012/04/an-essay-on-the-new-aesthetic/]
  */

  //----------------- _______________	     __________________           ________________
  // FACEBOOK SHARE /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //----------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: none
  // [optional parameters]: positon x (intger), position y (integer), pixel size (integer), outline color (string), sleeve color (string), hand color (string), 
  
  theNewAesthetic.prototype.fb = function(X,Y,SIZE,COLOR,COLOR2,COLOR3) {
    if(!X){X = 0;} if(!Y){Y = 0;}
    if(!SIZE) {SIZE = 1;}
    if(!COLOR) {COLOR = '#445791';} if(!COLOR2) {COLOR2 = "#7d8ab2";} if(!COLOR3) {COLOR3 = "#ffffff";} 

    var lnx =[];
    function getLnx() {
        lnx = [window.location.host,window.location.pathname,document.title]  				// Get the URL + title of the page
    } getLnx();
    
    var shareURL = "http://www.facebook.com/sharer.php?u=http%3A%2F%2F"+lnx[0]+""+lnx[1]+"&t="+lnx[2];  // link to share this page on facebook 
    var click = document.createElement('div');								// create invisible div on like icon
    document.body.appendChild(click);
    click.style.position = 'absolute'; click.style.zIndex = '10';
    click.style.left = X+"px"; click.style.top = Y+"px";
    click.style.width = (13*SIZE) + "px"; click.style.height = (11*SIZE) + "px";
    click.onclick = share; click.style.cursor = "pointer";
    
    function share() { window.location = shareURL; }							// jump over to facebook share link

    ctx.fillStyle = COLOR;
    function draw(){ ctx.fillRect((o[i][0]*SIZE)+X,(o[i][1]*SIZE)+Y,o[i][2]*SIZE,o[i][3]*SIZE); }	//draw function

    for(i=0;i<12;i++) { 										//draw fb icon outline
	o = [[0,5,1,6],[0,5,6,1],[3,5,1,6],[0,10,4,1],[4,9,3,1],[7,10,5,1],[6,3,1,2],[7,1,1,2],[8,0,1,1],[9,0,1,5],[10,4,2,1],[12,5,1,5]];
	draw();
    }
    for(i=0;i<5;i++) {											//draw fb icon hand
	ctx.fillStyle = COLOR3;
	o = [[7,9,5,1],[4,6,8,3],[6,5,6,1],[7,3,2,2],[8,1,1,2]];
	draw();
    }
    ctx.fillStyle = COLOR2; ctx.fillRect((1*SIZE)+X,(6*SIZE)+Y,2*SIZE,4*SIZE); ctx.fillStyle = "#000";	// draw fb icon sleeve
    
    if(typeof CHECKPHP != ud) {										// if shares.php is set above create the number bubble
    	for(i=0;i<8;i++) {
            var ble;
            if(SHARES.length<=1) {ble=10;} else if(SHARES.length==2) {ble=15;} else if(SHARES.length==3) {ble=22;} else if(SHARES.length>=4) {ble=28;}
	    o = [[14,7,1,1],[15,6,1,1],[15,8,1,1],[16,1,1,5],[16,9,1,5],[17,0,ble,1],[17,14,ble,1],[ble+17,1,1,13]];
	    draw();
        }
        var shareNum = SHARES;
        if(SHARES == '') {shareNum = '0';}
        ctx.font = 10*SIZE+"px Arial";
        ctx.fillText(shareNum, (19*SIZE)+X,(11*SIZE)+Y);  
    }

    else if(typeof COLOR != 'string' || typeof COLOR2 != 'string' || typeof COLOR3 != 'string' ) {console.log("ERROR: hex-color values hav to be a string, wrap sum quotes around that sucka!");}
  }



  
  /*
   
  The tools we make shape culture. The culture of technology is a human culture and a human experience. Reconciling with our inventions,
  we embrace the stylized pixel-goo as a reflection of ourselves.
  - Jonathan Minard
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#2]
  
  The New Aesthetics, or at least the aspect I'm looking at, is inspired by computer vision. And computer vision is at the point now that
  computer graphics was at 30 years ago. The New Aesthetics isn't concerned with retro 8bit graphics of the past, but the 8bit graphics
  designed for machines of the now.
  - Dan Catt
  
  [http://revdancatt.com/2012/04/07/why-the-new-aesthetic-isnt-about-8bit-retro-the-robot-readable-world-computer-vision-and-pirates/]
  */


  //---------------  _______________	    __________________    ________________
  // PIXELIZE IMGS /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //---------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: source image path (string)
  // [optional parameters]: x position (integer), y position (integer), size of the pixel (integer)
  
  theNewAesthetic.prototype.pixelizeImg = function(image,pX,pY,size) {
    if(typeof image != ud) {
      if(!pX) {pX = 0} 		    //default x,y position = 0
      if(!pY) {pY = 0;}
      if(!size) {size = this.res;} //default pixel size = 8
      
      //create canvas, place it in specified x,y coordinates
      var pCanvas = document.createElement('canvas');
      document.body.appendChild(pCanvas);
      pCanvas.style.position = 'absolute'; pCanvas.style.zIndex = '0';
      pCanvas.style.left = pX+'px'; pCanvas.style.top = pY+'px'; 
      var pctx = pCanvas.getContext('2d');
      
      //create image object
      var img = new Image();
      var RES = size;
      img.onload = function(){
	pCanvas.width = img.width;
	pCanvas.height = img.height;
	doImage(this,RES); 
      }; img.src = image;
      
      //pull image data + draw pixels
      function doImage(img,RES) { 
	pctx.drawImage(img, 0, 0); 
	var imageData = pctx.getImageData(0,0, img.width, img.height);
	var data = imageData.data;
	var res = RES;
	for (x=0; x<img.height; x++ ) {
	 
	  Y = ( x - 0.5 ) * res;
	  pxlY = Math.max( Math.min( Y, img.height), 0);
	  
	  for (y=0; y<img.width ; y++ ) {
	    
	    X = ( y - 0.5 ) * res;
	    pxlX = Math.max( Math.min( X, img.width), 0);
	    pixelIndex = ( pxlX + pxlY * img.width ) * 4;
	    red   = data[ pixelIndex + 0 ];
	    green = data[ pixelIndex + 1 ];
	    blue  = data[ pixelIndex + 2 ];
	    
	    pctx.fillStyle = 'rgb(' + red +','+ green +','+ blue+')';
	    pctx.fillRect( X, Y, res, res );
	  }
	}
       }
    } else {console.error('ERROR: warez teh image u want to pixelate?');}
  }
  
  
  
  
  
  //-----------------  _______________	      __________________          ________________
  // PIXELIZE SPRITE /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //-----------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: source image path (string), how many frames in sprite sheet (integer)
  // [optional parameters]: positon x (intger), position y (integer), pixel size (integer), pixel size (integer), speed of gif (integer)
  
  theNewAesthetic.prototype.pixelizeGif = function(SOURCE,FRAMES,pX,pY,SIZE,SPEED) {
    if(typeof SOURCE != ud && typeof FRAMES != ud) {
	if(!pX) {pX = 0}
	if(!pY) {pY = 0;}
	if(!SIZE) {SIZE=8;} 
	if(!SPEED) {SPEED=100;}
	
	//create canvas + position accordingly
	var pCanvas = document.createElement('canvas');
	document.body.appendChild(pCanvas);
	pCanvas.style.position = 'absolute'; pCanvas.style.zIndex = '0';
	pCanvas.style.left = pX+'px'; pCanvas.style.top = pY+'px'; 
	var pctx = pCanvas.getContext('2d');
	
	var sprite = { 'curFr': 0, 'totFr': FRAMES, 'w': null, 'h': null }; 	//sprite object
	
	var img = new Image();
	img.onload = function () {		 				//when img is loaded set sh!z in motino
	    sprite.w = this.width/sprite.totFr;
	    sprite.h = this.height;
	    pCanvas.width = sprite.w;
	    pCanvas.height = sprite.h;
	    fill_and_animate(); 
	}
	img.src = SOURCE;	
			
	dataURLA = []; 								//array for storing pixelized images 
	      
	function animGIF() { 							//create pixelized img + push to array
	    pctx.drawImage(img, sprite.curFr * sprite.w, 0, sprite.w, sprite.h, 0, 0, sprite.w, sprite.h);
       
	    var imageData = pctx.getImageData(0,0, img.width, img.height);
	    var data = imageData.data;
	    var res = SIZE;
	    for (x=0; x<img.height; x++ ) {
	      Y = ( x - 0.5 ) * res;
	      pxlY = Math.max( Math.min( Y, img.height), 0);
	      for (y=0; y<img.width ; y++ ) {
		X = ( y - 0.5 ) * res;
		pxlX = Math.max( Math.min( X, img.width), 0);
		pixelIndex = ( pxlX + pxlY * img.width ) * 4;
		red   = data[ pixelIndex + 0 ];
		green = data[ pixelIndex + 1 ];
		blue  = data[ pixelIndex + 2 ];
		pctx.fillStyle = 'rgb(' + red +','+ green +','+ blue+')';
		pctx.fillRect( X, Y, res, res );
	      }
	    }
	    var dataURL = pCanvas.toDataURL();
	    dataURLA.push(dataURL);
	    sprite.curFr = (sprite.curFr + 1) % sprite.totFr;
	}
	
	cr = 0;
	function drawGIF() { 							//draw + loop throught pixelized array
	    var gif = new Image();		
		gif.onload = function () { 
		    pctx.drawImage(gif,0,0);
		}
		gif.src = dataURLA[cr];    
	    cr = (cr + 1) % sprite.totFr;
	}
	
	function fill_and_animate() {
	    for(i=0;i<sprite.totFr;i++) {
		animGIF();							//run animGIF as many times as their are frames
	    }
	    setInterval(drawGIF, SPEED);					//then cycle through the pixelized versions
	}
    }
    else if(!SOURCE) { console.error('ERROR: warez teh image at?'); }
    else if(typeof SOURCE != 'string'){ console.error('ERROR: ur source has to be a string, wrap that sucka in quotes!'); }
    else if(typeof SOURCE != ud && !FRAMES){ console.error('ERROR: forgot ur frame count'); }
  }
  


  /*
  
  Yes, digital glitch is as much of a cultural artifact as the graininess of film or the bad colors of Polaroids.
  - Marius Watz
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#3]
  
  A glitch isn't inherently "New Aesthetic," but it certainly becomes that when appropriated. Just like the voxel
  sculptures, glitch revels in the visual result of a functional system purely for its aesthetic merit.
  - Kyle Mcdonald
  
  [http://www.thecreatorsproject.com/blog/in-response-to-bruce-sterlings-essay-on-the-new-aesthetic#6]
  */

  //-----------------  _______________	      __________________          ________________
  // GLITCH SPRITE   /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //-----------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: source image path (string), how many frames in sprite sheet (integer)
  // [optional parameters]: positon x (intger), position y (integer), glitch-x (integer), glitch-y (integer), speed of gif (integer)
  
 theNewAesthetic.prototype.glitchGif = function(SOURCE,FRAMES,X,Y,GX,GY,SPEED) {
    if(typeof SOURCE != ud && typeof FRAMES != ud) {
	if(!X) {X=0;} if(!Y) {Y=0;}
	if(!GX) {GX=125;} if(!GY) {GY=135;}	
	if(!SPEED) {SPEED=100;}	
	var sprite = { 'curFr': 0, 'totFr': FRAMES, 'w': null, 'h': null }; 	//create sprite
	var img = new Image();							//when image loads set sh!z in motion
	img.onload = function () { 
	    sprite.w = this.width/sprite.totFr;
	    sprite.h = this.height;
	    fill_and_animate();
	}
	img.src = SOURCE;
	
	dataURLA = [];								//array for storing glitched images
		
	function animGIF() { 
	    ctx.drawImage(img, sprite.curFr * sprite.w, 0, sprite.w, sprite.h, X, Y, sprite.w, sprite.h);
       
	    var imageData = ctx.getImageData(0,0, img.width+GX, img.height+GY);
	    var data = imageData.data;
	    for (y=0; y<img.height; y++) { 					//loop through image data + glitch it
	      for (x=0; x<img.width; x++) { 
		var red = data[((img.width * y) + x) * 4]; 
		var green = data[((img.width * y) + x) * 4 + 1]; 
		var blue = data[((img.width * y) + x) * 4 + 2];
		data[((img.width * y) + x) * 4 ] = red  
		data[((img.width * y) + x) * 4 + GX] = green  
		data[((img.width * y) + x) * 4 + GY] = blue 
	      }
	    }         
	    ctx.putImageData(imageData, 0, 0); 	    
	    var dataURL = canvas.toDataURL();
	    dataURLA.push(dataURL);						//push new frame to array
	    sprite.curFr = (sprite.curFr + 1) % sprite.totFr;
	}
	
	cr = 0;
	function drawGIF() {							//draw + loop glitched images from array
	    var gif = new Image();
		gif.onload = function () {
		    ctx.clearRect(X,Y,sprite.w,sprite.h);
		    ctx.drawImage(gif,0,0);
		}
		gif.src = dataURLA[cr];    
	    cr = (cr + 1) % sprite.totFr;
	}
	
	function fill_and_animate() {
	    for(i=0;i<sprite.totFr;i++) {
		animGIF();							//run animGIF as many times as there are frames
	    }
	    setInterval(drawGIF, SPEED);					//after glitched images are stored, cycle through 'em
	}									
    }
    else if(!SOURCE) { console.error('ERROR: warez teh image at?'); }
    else if(typeof SOURCE != 'string'){ console.error('ERROR: ur source has to be a string, wrap that sucka in quotes!'); }
    else if(typeof SOURCE != ud && !FRAMES){ console.error('ERROR: forgot ur frame count'); }
  }
  
  
  //-------------  _______________	  __________________      ________________
  // GLITCH IMGS /_______/_______/\     /____/__/__________/\	/_/______/_______/\   ~[] ~[] ~[]
  //-------------\_______\_______\/     \____\__\__________\/	\_\______\_______\/   
  //
  // [required parameters]: source image path (string)
  // [optional parameters]: x position (integer), y position (integer), glitch-x (integer), glitch-y (integer)
  
  theNewAesthetic.prototype.glitchImg = function(image,pX,pY,gX,gY) {
    if(typeof image != ud) {
      if(!pX && !pY) {pX = 0; pY = 0;} 	    //set default x,y position to 0
      if(!gX && !gY) {gX = 125; gY = 135;} //set default glitch values
      
      //create canvas, place it in specified x,y coordinates
      var gCanvas = document.createElement('canvas'); 
      document.body.appendChild(gCanvas);
      gCanvas.style.position = 'absolute'; gCanvas.style.zIndex = '0';
      gCanvas.style.left = pX+'px'; gCanvas.style.top = pY+'px'; 
      var gctx = gCanvas.getContext('2d');
      
      //create image object
      var img = new Image();
      img.onload = function(){
	gCanvas.width = img.width + gX*2;
	gCanvas.height = img.height + gY;
	for (i=0;i<4;i++) {
	  doImage(this,gX*i,gY*i); 
	}
      }; img.src = image;
      
      //loop through image + pull all data + glitch via 'mx' && 'my' 
      function doImage(img, mx, my) { //glitch here...
	gctx.drawImage(img, 0, 0); 
	var imageData = gctx.getImageData(0,0, img.width+mx, img.height+my); //...bit more here...
	var data = imageData.data;
	for (y=0; y<img.height; y++) { 
	  for (x=0; x<img.width; x++) { 
	    var red = data[((img.width * y) + x) * 4]; 
	    var green = data[((img.width * y) + x) * 4 + 1]; 
	    var blue = data[((img.width * y) + x) * 4 + 2];
	    data[((img.width * y) + x) * 4] = red  
	    data[((img.width * y) + x) * 4 + mx] = green //...a tad here... 
	    data[((img.width * y) + x) * 4 + my] = blue  //...and here
	  }
	}         
	gctx.putImageData(imageData, 0, 0); 
       }
    }
    else if(typeof image != 'string'){ console.error('ERROR: that\'s no string, wrap that sucka in quotes!'); }
    else if(!image){ console.error('ERROR: warez teh image path u want to glitch?'); }
  }
  
  

  //	   //									\\
  //	 //	_|\   _/_|	_|_|_|_|	_|_|_|_|_|	    _|		 \\
  //   //	_| \ _/ _|	_|		   _|		   _|_|		  \\
  //   \\	_|  \/  _|	_|_|_|		   _|		  _|  _|          //
  //	\\	_|	_|	_|		   _|		 _|_|_|_|       //
  //	 \\	_|	_|	_|_|_|_|	   _|		_|      _|    //
  
  /*
  
  The "New Aesthetic" is a native product of modern network culture. It's from London, but it was born digital,
  on the Internet. The New Aesthetic is a "theory object" and a "shareable concept."
  - Bruce Sterling
  
  [http://www.wired.com/beyond_the_beyond/2012/04/an-essay-on-the-new-aesthetic/]
  */
  
  //  ____// THEORY OBJECT \\____	
  // [required parameters]: theory (string)
  // -------------------------------------
    theNewAesthetic.prototype.theory = function(input) {
    var words = input; console.log(words);
  }
  
  //  ____// MOUSE COORDINATES \\____	
  // [required parameters]: none
  //---------------------------------
  theNewAesthetic.prototype.whereMyMouseAt = function() {
    var interval, l, t, f1, f2, c = 0;
    setInterval(runit, 50); document.onmousemove=getMouseCoordinates;       
    function getMouseCoordinates(event) { ev = event || window.event; l = ev.pageX; t = ev.pageY; }  
    function flowers() {
      var flw1 = ['------',' -----','  ----','   ---','    --','     -'];
      var flw2 = ['------','----- ','----  ','---   ','--    ','-     '];
      f1 = flw1[c]; f2 = flw2[c];
      c = (c + 1) % flw1.length;
    }
    function runit() { flowers(); console.log(f1+" "+l+", "+t+" "+f2); }    
  }  
  
  
  /*
  
  In an effort to keep this manageable [lump me into one of your keeerazzzy glitch/net.art/web-point-infinity/relational & new aesthetically-defined
  "artistic" categories if you will] here's some [non-random + IMO relevant but not necessarily cohesive] points:
  1. I've only skimmed the Bruce Sterling essays [both of them] and don't have an in-depth overview of the term "New Aesthetic" [henceforth now to be
  known as "Phrase That Will Not Be Named" in an effort to reduce the ridiculous amount of verification we are bubble-developing around it]. So there.
  - Mez Breeze
  
  [comment on http://www.furtherfield.org/features/reviews/banality-new-aesthetic]
  */
  
  var NA = new theNewAesthetic();	//BAM!``~..~``~..~``~..~``~..~``~..~``~..~``~..~``~..~``~..~... 
  
  



        