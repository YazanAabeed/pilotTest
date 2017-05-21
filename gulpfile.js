var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var imagemin = require('gulp-imagemin');
var iife = require("gulp-iife");
var cleanCSS = require('gulp-clean-css');
var gulpExpressServer = require('gulp-live-server');
var babel = require('gulp-babel');
var run = require('run-sequence');

gulp.task('default', ['serve']);

gulp.task('serve', ['sass', 'index'], function() {
    var server = gulpExpressServer('./server/app.js', {env: {NODE_ENV: 'dev'}});
    server.start();
});

gulp.task('index', function() {
    var target = gulp.src('./app/index.html');
    var sources = gulp.src([
        './bower_components/**/*.js',
        './app/**/*.js',
        './bower_components/**/*.css',
        './app/main/*.css'
    ], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./app'))
});

gulp.task('sass', function() {
    return gulp.src('./app/main/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./app/main'));
});

gulp.task('uglify-js', function() {
    return gulp.src(['./bower_components/**/*.min.js', './app/**/*.js', './app/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-css', function() {

    return gulp.src(['./bower_components/**/*.min.css', './app/main/**/*.css'])
                .pipe(concat('app.min.css'))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest('./dist/css'));
});

gulp.task('html:dist', function() {
    gulp.src(['./app/**/*.html', '!./app/index.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('serve:dist', function (callback) {
  run(['sass', 'uglify-js', 'minify-css', 'html:dist'], function(){
    callback();
  });
});