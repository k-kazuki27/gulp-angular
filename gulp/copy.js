'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    es = require('event-stream'),
    rev = require('gulp-rev'),
    flatten = require('gulp-flatten');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    common: common,
    font: font
};

function common() {
    return gulp.src([config.src + '/robots.txt', config.src + '/favicon.ico', config.src + '/404.html'], { dot: true })
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
}

function font() {
    return es.merge(gulp.src([config.bower + '/bootstrap/fonts/*.*', config.bower + '/font-awesome/fonts/*.*'])
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe(changed(config.app + '/fonts/'))
        .pipe(rev())
        .pipe(gulp.dest(config.paths.distFonts))
        .pipe(rev.manifest(config.paths.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist)),
        gulp.src(config.app + '/**/*.{woff,woff2,svg,ttf,eot,otf}')
            .pipe(plumber({ errorHandler: handleErrors }))
            .pipe(changed(config.paths.distFonts))
            .pipe(flatten())
            .pipe(rev())
            .pipe(gulp.dest(config.paths.distFonts))
            .pipe(rev.manifest(config.paths.revManifest, {
                base: config.dist,
                merge: true
            }))
            .pipe(gulp.dest(config.dist))
    );
}