'use strict';

var browserSync = require('browser-sync');
var config = require('./config');

module.exports = {
    dev: dev,
    prod: prod
};

// 参照先はsrc下
function dev() {
    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.src
        }
    });
}

// 参照先はdist下
function prod() {
    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.dist
        }
    });
}