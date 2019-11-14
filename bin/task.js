#!/usr/bin/env node
const gulp = require('gulp');
const error = require('../utils/error');
const task = process.argv[2];

require('../gulpfile.js');


if (!task) {
    error('No task specified.');
    return;
}

try {
    gulp.task(task);
} catch (e) {
    error(`Task name '${task}' not recognized.`);
}
