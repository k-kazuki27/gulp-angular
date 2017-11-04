'use strict';

var src = 'app';
var dist = 'dist';
var bower = require('./../bower.json');
var app = bower.appPath || 'app',
        test = 'test';

var paths = {
    index: src + '/index.html',
    scripts: app + '/scripts/**/*.js',
    styles: app + '/styles/**/*.css',
    compiledCss: app + '/styles',
    less: app + '/styles/less/**/*.less',
    images: app + '/images/**/*.png',
    views: app + '/views/**/*.html',
    test: test + '/spec/**/*.js',
    karma: test + '/karma.conf.js',
    distTemp: dist + '/tmp',
    distImages: dist + '/app/images',
    distFonts: dist + '/app/fonts',
    revManifest: dist + '/tmp/rev-manifest.json'
};

module.exports = {
    src: src,
    app: app,
    test: test,
    dist: dist,
    port: 3000,
    liveReloadPort: 35729,
    paths: paths,
    moduleName: 'angularApp',
    bower: 'bower_components'
};