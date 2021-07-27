const path = require('path');
const fs = require('fs');

const projectDirectory = process.env.projectDirectory;
const appDirectory = fs.realpathSync(projectDirectory);

const resolveApp = (relativePath = '') => path.resolve(appDirectory, relativePath);

module.exports = resolveApp;
