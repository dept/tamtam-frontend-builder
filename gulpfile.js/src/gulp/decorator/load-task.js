const config = require('../../../config');
const log = require('../../debug/log');
const path = require('path');

const overrideTaskExists = require('../override-task-exists');

const _loadedTasks = {};

/**
 * Check if the task has been loaded, if not try to load it.
 * @param taskName
 */
function loadTask(taskName) {

    if (!config.gulp.lazy) return log.error({
        message: 'Trying to lazy load a task, but gulp is not set in lazy mode?!',
        sender: 'gulpDecorator'
    });

    if (_loadedTasks[taskName] === undefined) {

        const taskPath = overrideTaskExists(taskName) ? path.normalize(`${config.projectDirectory}/build-config/task-overrides/${taskName}`) : path.resolve((process.env.OLDPWD || process.env.INIT_CWD), `node_modules/tamtam-frontend-builder/gulpfile.js/tasks/${taskName}`);

        try {

            if (config.gulp.debug) log.debug({
                sender: 'gulpDecorator',
                message: 'lazy loading:\t\'' + log.colors.cyan(taskName) + '\' ( ' + taskPath + ' )'
            });

            _loadedTasks[taskName] = require(taskPath);

        } catch (error) {

            _loadedTasks[taskName] = false;

            // Some tasks won't be able to load if they are not in a separate file.
            // So if it fails it is not necessarily an error.
            if (config.gulp.debug)
                log.warn({
                    sender: 'gulpDecorator',
                    message: 'warning: Failed to lazy load task: ' + taskPath + '.js',
                    data: error
                });

        }

    }
}

module.exports = loadTask;
