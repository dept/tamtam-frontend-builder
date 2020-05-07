#!/usr/bin/env node
const error = require('../utils/error')
const { runGulpTask } = require('../utils/run-gulp-task')
const task = process.argv[2]

if (!task) {
  error('No task specified.')
  return
}

try {
  runGulpTask(task)
} catch (e) {
  error(`Task name '${task}' not recognized.`)
}
