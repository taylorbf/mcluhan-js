# McLuhan.js

**Author:** Ben Taylor

**Overview:** A platform for live web art performance in remote browsers.

**Project Site:** http://www.whitechord.org

**License:** McLuhan.js is licensed as open source software under the terms of the "New BSD License", http://creativecommons.org/licenses/BSD/


## About

McLuhan.js is under heavy development and will be released later in 2015.

# How to Use

This is a place to convey basic use patterns. This documentation is of currently-working methods, though some may be in flux.

## Wall Object

Wall is the central commanding object of the library, because it creates a space for other materials to be added.

Create a wall (collection of browser windows).

`var a = new Wall()`

With no argument, it creates one new browser window. 

A few predefined window configurations are available. This creates four new browser windows in a line:

`var a = new Wall("line")`

Move the wall by an x/y amount

`a.move(100,50)`

Resize all windows to a specific w/h

`a.size(100,100)`

Scroll each window to an x/y coordinate

`a.scroll(50,50)`

Scroll each window equal to its x/y coordinate on the desktop. This can create an interesting illusion of 'seeing through' the wall to a website behind it.

`a.scrollSight()`

Hide and show the collection of browser windows:

`a.hide()`

`a.show()`

Refresh all windows in the wall:

`a.refresh()`

Empty all content from a Wall:

`a.empty()`

Destroy the wall and return all windows to the window stack

`a.kill()`

## Media

### URLs

Send all windows in the wall to a URL

`a.goto("www.google.com")`

Send the first and third window in the wall to a URL

`a.goto("www.google.com",[0,2])`

### Video

Create a new video element in all browser windows of a Wall. This will load the file *media/waves.mp4*

`a.a = a.see("waves")`

Make the video loop from 1 sec to 2 sec

`a.a.skip(1,2)`

### Audio

Create a new audio element in all browser windows of a Wall. This will load the file *media/piano.mp3*

`a.a = a.hear("piano")`

Make the video loop from 1 sec to 2 sec

`a.a.skip(1,2)`

### Text

Create a new text element in all browser windows of a Wall.

`a.a = a.read("Hello world")`

### Just Intonation Pitch Lattice

Create a new 3-dimensional just intonation pitch lattice with algorithmic automation methods.

`a.a = a.partch()`

Wander through the lattice.

`a.a.wander()`

## Global (non-Wall) Media

### Text-To-Speech

We offer a built-in text-to-speech system.

`say("Bonjour")`

Our TTS is connected to Tone.JS, meaning any Tone effects can be applied to it. Currently the voice is run through a ping pong delay; a more complete API for connecting effects is planned.

This is not a property of a Wall; it is only one voice and is envoked by a global `say` method.

### Pixelated Video Stream

Start a pixelated, black-and-white, low-frame rate video stream from the performer. Data is sent as a binary list (011100etc...) where each digit denotes if a pixel in the video is black or white.

`var me = new presence()`

