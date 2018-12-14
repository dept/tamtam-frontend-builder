const _ = require('lodash');
const pathUtil = require('path');
const log = require('../debug/log');
const getFileList = require('../node/file/get-list');


// A RegExp to test whether a string contains a lodash template.
// @see https://lodash.com/docs#template
const _loDashTemplateRegExp = /<%=\s*\w+\s*%>/


/**
 * Simple object containing a function to parse lodash path constiables on itself.
 * @param root {string} automatically sets the root property for the config.
 * @constructor
 */
function PathConfig(root) {

    const _this = this;
    let _context;

    _this.root = { path: root };


    /**
     * @public
     * @function getPath
     * @param name {string}                     name of the path required.
     * @param opt_pathExtension {=string}       optional path extension to be appended to the path.
     * @return {string}                         fully rendered (file) path.
     */
    _this.getPath = function (name, opt_pathExtension) {

        if (!_context) createContext();

        if (!_this.hasOwnProperty(name)) {
            log.error({
                sender: 'PathConfig',
                message: `Path config with name: '${name}' was not found!`
            });
            return '';
        }

        let path = _this[name]['path'];

        let loopNum = 0;
        const maxRecursion = 10;
        while (_loDashTemplateRegExp.test(path) && loopNum <= maxRecursion) {
            path = _.template(path);
            path = path(_context);

            if (loopNum++ > maxRecursion) {
                log.error({
                    sender: 'PathConfig',
                    message: `Maximum recursion (${maxRecursion}) reached or failed to compile path template for name: '${name}'. Compiled path: '${path}'`
                });
            }
        }

        path = opt_pathExtension ? path + '/' + opt_pathExtension : path;

        return pathUtil.normalize(path);

    }

    /**
     * Returns the file path globs that was defined in the named data
     * @param name
     * @returns {string|Array}
     */
    _this.getFileGlobs = function (name) {

        if (!_context) createContext();

        if (!_this.hasOwnProperty(name)) {
            log.error({
                sender: 'PathConfig',
                message: `Error: Path config with name: '${name}' was not found!`
            });
            return '';
        }

        const pathData = _this[name];
        let filesGlob = pathData['files'];
        let filePathsGlob;

        if (filesGlob === undefined) return log.error({
            sender: 'PathConfig',
            message: `attempting getFilesGlob on a config that does not contain a files configuration: '${name}'`
        });


        if (Array.isArray(filesGlob)) {

            filePathsGlob = [];

            for (let i = 0, leni = filesGlob.length; i < leni; i++) {

                filePathsGlob.push(_this.getPath(name, filesGlob[i]));

            }

        } else {

            filePathsGlob = _this.getPath(name, filesGlob);

        }

        return filePathsGlob;

    }

	/**
	 * Returns the file paths found in the fileGlobs
 	 * @param name
	 */
    _this.getFilePaths = function (name, resolve) {

        const globs = _this.getFileGlobs(name);
        const files = getFileList(globs);

        if (resolve) {

            const root = _this.getPath('root');

            for (let i = 0, leni = files.length; i < leni; i++) {
                const filePath = files[i];
                files[i] = pathUtil.resolve(root, '../', filePath);
            }

        }

        return files;

    }

    /**
     * Generates the context in which paths are parsed.
     */
    function createContext() {

        _context = {};

        for (const pathName in _this) {

            if (!_this.hasOwnProperty(pathName)) continue;

            const pathData = _this[pathName];
            _context[pathName] = pathData.path;

        }

    }

    /**
     * A function to log all the path constiables.
     * Useful for checking if they're all set correctly
     * @public
     * @function dump
     */
    _this.dump = function () {
        console.info('Path config dump:');
        for (const property in _this) {
            if (!_this.hasOwnProperty(property) || typeof _this[property] !== 'object') continue;
            console.info('\t' + property + (property.length >= 7 ? ':\t\'' : ':\t\t\'') + _this.getPath(property) + '\'');
        }
    }
}

module.exports = PathConfig;
