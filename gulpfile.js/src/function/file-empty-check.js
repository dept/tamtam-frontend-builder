var through = require('through2');

/**
 * Checks if the current file is empty
 * @returns { file object }
 */

module.exports = function fileEmptyCheck() {
    return through.obj((file, enc, cb) => {
        return (file.stat && file.stat.size) ? cb(null, file) : cb(null, null);
    });
}