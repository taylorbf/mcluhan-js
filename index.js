var Manager = require('./lib/core/manager')
window.glitch = require("./bower_components/glitch-canvas/dist/glitch-canvas")
window.Tone = require('tone').Tone
require('./lib/utils/bt')
window.googleimage = require('google-images')

/************************************************
*      MAKE GLOBAL COMPONENTS + INSTANCES
************************************************/

window.m = new Manager(); 
window.spaces = new Array();
window._spaces = new Array();
window.windex = 0;
window.walls = new Array();

window.components = require("./lib/media")

for (var key in window.components) {
	window[key] = window.components[key]
}

/* audio setup */ 

window.bp = m.bp;
window.echo = m.echo;
window.hall = m.hall;
window.vol = m.vol;
window.pan = m.pan;
window.fx = m.fx;
window.sine = m.sine;
window.noise = m.noise;

// all fx start at 0
m.nofx()

window.siri = new voice()

window.journal = { 
	"hello": "Hello Digital World",
	"dreampoem": "dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains. dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains.--WAKEFIELD.] dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his dream afterwards to one of the boarders. dream do I dare to delight dream had been, while men lay sleeping. He was shaken with dream have we waked you from, you pretty boy? dream he _saw_. dream near morning, strong dream of festive harmonies! dream of him most every night. dream of pain and disease.[297:2] dream of the Great New Zealand Dictionary, dream or a reality. Am I really free? dream she had before mentioned. dream to the intellectual cynicism of Italian politics. dream\'d of in old days. dream, Cheek of the fellow! Pup! Gr-r-r-up! dream, and in anger denounced him: dream, and to whom he is united in passionate love. But his dream, men making the best of it, dream-- dream--a good dream, you know.' dream-father_! dream-wives wise and old, dream. dream. dream.] dream? dreame bedaeled deaeth-wic seon, dreamed daily to the tune of the bubbling stream. dreamed of disobeying. dreamed of it by night. dreamed of or hoped. dreamed--as we dream--for an hour! dreamed. dreamed: dreamed; dreamer may be, dreamers? We already know Boca was stymied at the title dreamily at the fire. dreamily. Go on, Pyecroft. dreaming dreaming fancy, made the following Address. dreaming in her tiny cradle, under the pale pink rose leaf. dreaming meadows dreaming of a little girl with yellow hair! dreaming of spring. dreaming, dreaming, but he assumed a respectful attitude and waited. dreaming, for endless reveries of eternal beauty. dreaming-- dreaming. dreamless sleep.dreamless slumber of exhaustion; while, a dreams dreams a devilish exultation and all the old mad joy in the dreams about himself which makes doubt permissible. dreams and of deeds. dreams are fickle, dreams are we: dreams break and form. In me is thy own defeat of self. dreams by sleeping on the poetic mountains.--WAKEFIELD.] dreams come true, dreams lure the unoceaned explorer. dreams of Time. dreams of fish-heaven. Bad William dreams of life and pleasure, into a watery grave. dreams of rapture or of anguish. dreams of their awakening imaginations. dreams of towns vermillion-gated dreams or dots. dreams pass through the gate of ivory) dreams that range dreams to cats cradles in whose dreams, dreams, O little cosset lambs! dreams, and fear lest evil should befall you. dreams, than you without me are capable of imparting. dreams. dreams. dreamum bedaeled. Duru sona onarn dreamy prose is often compared to that of Hoffmann and his" 
}

