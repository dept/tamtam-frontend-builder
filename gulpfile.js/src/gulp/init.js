var loadPlugins = require('./load-plugins');
var log = require('../debug/log');
var config = require('../../config');

var startTime = process.hrtime();
var gulp = require('gulp');
var gulpDecorate = require('./decorator/decorate');

function init(callback) {
  gulpInit(callback);
  // Load / Index all the plugins for faster task loading.
  // loadPlugins(
  //   function() {
  //     gulpInit(callback);
  //   },
  //   true,
  //   global
  // );
}

function gulpInit(callback) {
  require('./load-tasks');
  // gulpDecorate(gulp); // Decorate gulp with extra functionality for better debugging and error handling.

  log.time({
    sender: 'gulp/init',
    message: 'init - ',
    time: process.hrtime(startTime)
  });

  callback(gulp);
}

module.exports = init;
