var gulp = require('gulp')
  , rename = require('gulp-rename')

  , gutil = require('gulp-util')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')

  , runSequence = require('run-sequence')
var path = require('path');
//var jsdox = require("jsdox");
var jsdoc = require("gulp-jsdoc");
 

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

/*var logdox = function(err) { err ? console.log(err) : null }
gulp.task('jsdox', function() {
  jsdox.generateForDir("./dist/mcluhan.js", "./api/", logdox); 
//  jsdox.generateForDir("./lib/core/", "./api/", logdox); 
//  jsdox.generateForDir("./lib/media/wall.js", "./api/", logdox); 
})*/

gulp.task('jsdoc', function() {
  gulp.src("./lib/**/*.js")
    .pipe(jsdoc('./api/',{
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
    
})

gulp.task('default', function(done) {
  //,'jsdoc'
  runSequence('browserify', done)
})


