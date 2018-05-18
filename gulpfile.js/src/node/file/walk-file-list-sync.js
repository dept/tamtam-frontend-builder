const requireCached = require('../../../src/gulp/require-cached');
const path = requireCached('path');
const fs = requireCached('fs');

const walkFileListSync = function (dir, folderToFind, filelist = []) {

    let files = [];

    try {
        files = fs.readdirSync(dir);
    } catch(e) {}
    filelist = filelist || [];

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            if (file === folderToFind) {
                filelist.push(path.join(dir, file));
            } else {
                filelist = walkFileListSync(path.join(dir, file), folderToFind, filelist);
            }
        }
    });

    return filelist;

}

module.exports = walkFileListSync;
