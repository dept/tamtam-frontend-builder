const webpack     = require('webpack');
const fs          = require('fs');
const config      = require('../../config');
const error       = require('../../../utils/error');
const hasLintfile = fs.existsSync(`${config.projectDirectory}/.eslintrc`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.json`);

const logStats = stats => console.log(`\n ${stats.toString({ colors: true })} \n`);

const createCompiler = (config) => {
    const compiler = webpack(config);
    return () => {
        return new Promise((resolve, reject) => {
            compiler.run((error, stats) => {

                onWebpackCallback(error, stats);
                resolve();

            });
        });
    };
};

const onWebpackCallback = (error, stats, opt_prevStats) => {

    if (stats.stats) {
        stats.stats.forEach(stat => {
            logStats(stat);
        });
    } else {

        logStats(stats);
    }

    if (error) log.error({
        sender: 'js',
        data: [error]
    });

    if ( !hasLintfile ) {
        if ( shownMissingLintWarning < warningLimit ) errorMsg('You don\'t use Javascript Linting yet. Please upgrade ASAP.', true);
        shownMissingLintWarning++;
    }

}

const createCompilerPromise = (compilerConfigs) => {

    const promises = [];

    Object.keys(compilerConfigs).forEach(configName => {
        promises.push(createCompiler(compilerConfigs[configName])());
    });

    return promises;

}

module.exports = {
	create: createCompilerPromise,
	onWebpackCallback: onWebpackCallback
}
