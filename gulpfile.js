var gulp = require('gulp')
  , rename = require('gulp-rename')

  , gutil = require('gulp-util')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')

  , runSequence = require('run-sequence')
var path = require('path');

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

var logdox = function(err) { err ? console.log(err) : null }

gulp.task('default', function(done) {
  runSequence('browserify', done)
})


