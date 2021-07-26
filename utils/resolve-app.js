const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.env.projectDirectory);
const resolveApp = (relativePath = '') => path.resolve(appDirectory, relativePath);

module.exports = resolveApp;
