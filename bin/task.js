#!/usr/bin/env node
const gulp 	= require('gulp');
const error = require('../utils/error');
const loadTask = require('../gulpfile.js/src/gulp/decorator/load-task');
const task 	= process.argv[2];

require('../gulpfile.js');

if ( !task ) {
    error('No task specified.');
    return;
}

try {
    loadTask(task);
} catch (e) {
    error(`Task name '${task}' not recognized.`);
}
