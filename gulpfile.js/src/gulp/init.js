var log = require('../debug/log')
var config = require('../../config')

var startTime = process.hrtime()
var gulp = require('gulp')

function init(callback) {
  require('./load-tasks')

  log.time({
    sender: 'gulp/init',
    message: 'init - ',
    time: process.hrtime(startTime),
  })

  callback(gulp)
}

module.exports = init
