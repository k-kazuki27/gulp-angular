// Generated on 2017-04-11 using generator-angular 0.16.0
'use strict';

var gulp = require('gulp'),
        runSequence = require('run-sequence'),
        browserSync = require('browser-sync'),
        karmaServer = require('karma').Server,
        del = require('del'),
        bower = require('gulp-bower'),
        ngConstant = require('gulp-ng-constant'),
        minimist = require('minimist');

var config = require('./gulp/config'),
        inject = require('./gulp/inject'),
        serve = require('./gulp/serve'),
        copy = require('./gulp/copy'),
        build = require('./gulp/build');

var argv = minimist(process.argv.slice(2));

//
// bower install task
//
gulp.task('bower', function () {
    return bower();
});

//
// clean task
//
gulp.task('clean', function () {
    return del([config.dist], {dot: true});
});

//
// inject task
//
gulp.task('inject', function (cb) {
    runSequence('inject:app', 'inject:css', 'inject:vendor', cb);
});

gulp.task('inject:app', inject.app);

gulp.task('inject:css', inject.css);

gulp.task('inject:vendor', inject.vendor);

gulp.task('inject:test', inject.test);

//
// serve task
//
gulp.task('serve', function (cb) {
    runSequence('bower', 'inject', 'serve:dev', 'watchLess', 'watch', cb);
});

gulp.task('prod', function (cb) {
    runSequence('build', 'serve:prod', cb);
});

gulp.task('mock', function (cb) {
    runSequence('bower', 'inject', 'serve:mock', 'watchLess', 'watch', cb);
});


gulp.task('serve:dev', serve.dev);

gulp.task('serve:prod', serve.prod);

gulp.task('serve:mock', serve.mock);

//
// test task
//
gulp.task('test', ['inject:test'], function (cb) {
    new karmaServer({
        configFile: __dirname + '/' + config.test + '/karma.conf.js',
        singleRun: true
    }, cb).start();
});

//
// watch task
//
gulp.task('watch', function () {
    gulp.watch([config.paths.index, config.paths.views, config.paths.styles, config.paths.scripts])
            .on('change', browserSync.reload);
});

gulp.task('watchLess', function () {
    gulp.watch([config.paths.less], ['build:lessToCss', 'inject:css']);
});


//
// copy task
//
gulp.task('copy', ['copy:common', 'copy:font']);

gulp.task('copy:common', copy.common);

gulp.task('copy:font', copy.font);

//
// build task
//
gulp.task('build', ['clean'], function (cb) {
    runSequence('bower', 'config', 'build:lessToCss', 'copy', 'inject', 'test', 'build:index', cb);
});

gulp.task('build:index', ['build:html', 'build:images'], build.index);

gulp.task('build:html', build.html);

gulp.task('build:images', build.images);

gulp.task('build:lessToCss', build.lessToCss);

gulp.task('config', function () {
    var url = 'http://localhost:8080';
    var target = argv.f;
    if (target !== "undefiend" && target === 'live') {
        url = 'https://prod';
    }
    ngConstant({
        name: 'config',
        wrap: false,
        stream: true,
        constants: {
            API_URL: url
        }
    })
            .pipe(gulp.dest(config.app + '/scripts'));
});