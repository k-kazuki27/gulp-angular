'use strict';

var gulp = require('gulp'),
        plumber = require('gulp-plumber'),
        inject = require('gulp-inject'),
        naturalSort = require('gulp-natural-sort'),
        angularFilesort = require('gulp-angular-filesort'),
        bowerFiles = require('main-bower-files');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    app: app,
    css: css,
    vendor: vendor,
    test: test
}

function app() {
    var source = gulp.src(config.paths.scripts)
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(naturalSort('desc'))
            .pipe(angularFilesort());

    return gulp.src(config.paths.index)
            .pipe(inject(source, {relative: true}))
            .pipe(gulp.dest(config.src));
}

function css() {
    return gulp.src(config.paths.index)
            .pipe(inject(gulp.src(config.paths.styles), {relative: true}))
            .pipe(gulp.dest(config.src));
}

function vendor() {
    var source = gulp.src(bowerFiles(), {read: false});
    return gulp.src(config.paths.index)
            .pipe(inject(source, {
                name: 'bower',
                relative: true
            }))
            .pipe(gulp.dest(config.src));
}

function test() {
    var source = gulp.src(bowerFiles({includeDev: true, filter: ['**/*.js']}), {read: false});
    return gulp.src(config.paths.karma)
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(inject(source, {
                starttag: '// bower:js',
                endtag: '// endbower',
                transform: function (filepath) {
                    return '\'' + filepath.substring(1, filepath.length) + '\',';
                }
            }))
            .pipe(gulp.dest(config.test));
}