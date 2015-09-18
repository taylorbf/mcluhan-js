var gulp = require('gulp')
  , rename = require('gulp-rename')

  , gutil = require('gulp-util')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')

  , runSequence = require('run-sequence')
var path = require('path');
var jsdoc = require("gulp-jsdoc");
var shell = require("gulp-shell");
 

var watcher = gulp.watch(['index.js','./lib/**/*.js', './lib/*.js'], ['default'])
watcher.on('change', function(event) {
  console.log('File '+event.path+' was '+event.type+', running tasks...')
})

gulp.task('browserify', function() {
  return browserify({ entries: './index.js' })
    .bundle()
    .on('error', gutil.log)
    .pipe(source('mcluhan.js'))
    .pipe(gulp.dest('./dist/'))
})

//gulp.task('jsdoc', function() {
  //gulp.src("./lib/**/*.js")
 /*   .pipe(jsdoc('./api/',{
    path: 'ink-docstrap',
    systemName      : "McLuhan.js",
    footer          : "McLuhan.js",
    copyright       : "Ben Taylor &copy; 2015",
    navType         : "vertical",
    theme           : "benly",
    linenums        : true,
    collapseSymbols : false,
    inverseNav      : false
  })) 
    
}) */

//gulp.task('jsdoc', function() {
//  gulp.src("./lib/**/*.js")
/*    .pipe(jsdoc.parser())
    .pipe(gulp.dest('./somewhere'))
}) */

//jsdoc **/*.js -t templates/haruki -d console -q format=json > ../cheatsheet/all.json
gulp.task('jsdoc', shell.task([
  'jsdoc lib/**/*.js -t templates/haruki -d console -q format=json > cheatsheet/all.json'
]))

gulp.task('default', function(done) {
  //,'jsdoc'
  runSequence('browserify','jsdoc',done)
})


