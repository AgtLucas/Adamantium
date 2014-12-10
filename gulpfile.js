'use strict';

/**
 * Dependencies
 */
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var browserify = require("browserify");
var concat = require("gulp-concat");
var sass = require("gulp-ruby-sass");
var minifyCSS = require('gulp-minify-css');
var react = require("gulp-react");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var envify = require("envify");
var shim = require("browserify-shim");

// Config
var config = require("./config/gulp");
var paths = config.paths;

// Hack around nodemon, that doesn"t wait for tasks to finish on change
var nodemon_instance;

function handleStreamError (err) {
  console.log(err.toString());
  this.emit("end");
}

/**
 * Sub-Tasks
 */
gulp.task("jsx-compile", function () {
  return gulp.src(paths.in.jsx)
  .pipe(react())
  .on("error", handleStreamError)
  .pipe(gulp.dest(paths.out.build_js));
});

gulp.task("copy-js", function () {
  return gulp.src(paths.in.js)
  .pipe(gulp.dest(paths.out.build_js));
});

gulp.task("app-compile", ["jsx-compile", "copy-js"], function() {
  return browserify({
      entries: paths.in.app,
      debug: true,
    })
    .require("react")
    .transform(shim)
    .transform(envify)
    .bundle()
    .pipe(source("app.js"))
    .pipe(gulp.dest(paths.out.public));
});

gulp.task("sass-compile", function () {
  return gulp.src(paths.in.sass)
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(concat("app.css"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.out.public));
});

gulp.task("install", ["app-compile", "sass-compile"]);

gulp.task("watch", function () {
  gulp.watch(paths.in.jsx, ["app-compile"]);
  gulp.watch(paths.in.sass, ["sass-compile"]);
  gulp.watch(paths.toWatch, ["nodemon"]);
});

gulp.task("nodemon", function () {
  if(!nodemon_instance)
    nodemon_instance = nodemon({ script:"app.js", nodeArgs: ["--harmony", "--debug"],
    env: { "NODE_ENV": "development" }, watch: "__manual_watch__",  ext: "__manual_watch__"  });
  else {
    nodemon_instance.emit("restart");
  }
});

/**
 * Global tasks
 */
gulp.task("dev", ["install", "watch", "nodemon"]);

gulp.task("default", ["install"]);
