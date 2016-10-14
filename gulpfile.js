'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var Server = require('karma').Server;

var src = [
	'./src/utils.js',
	'./src/locale/*.js',
	'./src/HijrahDateFormatter.js',
	'./src/HijrahDate.js'
];
var dest = '.'
var file = './hijrah-date.js';
var minFile = './hijrah-date.min.js';

var wrapTemplate = "(function (global, factory) {"+
						"typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :"+
						"typeof define === 'function' && define.amd ? define(factory) :"+
						"global.HijrahDate = factory()"+
					"}(this, function(){ 'use strict';<%= contents %>; return HijrahDate;}));"

gulp.task('concat', function() {
	return gulp.src(src)
		.pipe(concat(file))
		.pipe(gulp.dest(dest))
		.pipe(wrap(wrapTemplate, {}, {parse: false}))
		.pipe(gulp.dest(dest))
});

gulp.task('test', ['concat'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('build', ['concat'], function() {
	return gulp.src(file)
		.pipe(sourcemaps.init())
		.pipe(rename(minFile))
		.pipe(uglify({strict:true}))
		.pipe(sourcemaps.write(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('default', ['test', 'build']);
