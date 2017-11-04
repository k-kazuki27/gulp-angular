'use strict';

var fs = require('fs'),
        gulp = require('gulp'),
        lazypipe = require('lazypipe'),
        footer = require('gulp-footer'),
        sourcemaps = require('gulp-sourcemaps'),
        rev = require('gulp-rev'),
        htmlmin = require('gulp-htmlmin'),
        ngAnnotate = require('gulp-ng-annotate'),
        prefix = require('gulp-autoprefixer'),
        cssnano = require('gulp-cssnano'),
        uglify = require('gulp-uglify'),
        useref = require("gulp-useref"),
        revReplace = require("gulp-rev-replace"),
        plumber = require('gulp-plumber'),
        gulpIf = require('gulp-if'),
        templateCache = require('gulp-angular-templatecache'),
        changed = require('gulp-changed'),
        imagemin = require('gulp-imagemin'),
        less = require('gulp-less');

var config = require('./config'),
        handleErrors = require('./handle-errors');

var initTask = lazypipe()
        .pipe(sourcemaps.init);
var jsTask = lazypipe()
        .pipe(ngAnnotate)
        .pipe(uglify);
var cssTask = lazypipe()
        .pipe(prefix)
        .pipe(cssnano);

module.exports = {
    index: index,
    html: html,
    images: images,
    lessToCss: lessToCss
};

function index() {
    var templates = fs.readFileSync(config.paths.distTemp + '/templates.js');
    var manifest = gulp.src(config.paths.revManifest);

    return gulp.src(config.paths.index)
            .pipe(plumber({errorHandler: handleErrors}))
            // build tag
            .pipe(useref({}, initTask))
            // append html templates
            .pipe(gulpIf('**/app.js', footer(templates)))
            .pipe(gulpIf('*.js', jsTask()))
            .pipe(gulpIf('*.css', cssTask()))
            .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
            .pipe(gulpIf('**/*.!(html)', rev()))
            .pipe(revReplace({manifest: manifest}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.dist));
}

function html() {

    return gulp.src(config.paths.views)
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(templateCache({
                module: 'billSysManagerApp',
                root: 'app/views',
                moduleSystem: 'IIFE'
            }))
            .pipe(gulp.dest(config.paths.distTemp));
}

function images() {
    return gulp.src(config.paths.images)
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.paths.distImages))
            .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
            .pipe(rev())
            .pipe(gulp.dest(config.paths.distImages))
            .pipe(rev.manifest(config.paths.revManifest, {
                base: config.dist,
                merge: true
            }))
            .pipe(gulp.dest(config.dist));
}

function lessToCss() {
    return gulp.src(config.paths.less)
            .pipe(less())
            .pipe(gulp.dest(config.paths.compiledCss));
}