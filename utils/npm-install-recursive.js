const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const root = process.env.OLDPWD || path.normalize(process.env.INIT_CWD);

const dirsToScan = argv.dirs ? argv.dirs.split(',') : [];
const dirsToIgnore = argv.ignore ? argv.ignore.split(',') : [];

const FILE_TO_FIND = 'package.json';

console.log('===================================================================');
console.log(`Checking for subpackages`);

const packageFolders = [].concat(...dirsToScan.map(dir => findPackageJsonRecursive(path.resolve(root, dir))))

if (!packageFolders.length) {
    console.log(`Found no additional modules.`);
    return;
}

console.log(`Found ${packageFolders.length} modules.`);
console.log('===================================================================');

packageFolders.forEach(folder => {
    npm_install(folder);
});

// Performs `npm install`
function npm_install(target) {
    console.log('===================================================================');
    console.log(`Performing "npm install" inside ${target} folder`);
    console.log('===================================================================');
    child_process.execSync('npm install', { cwd: target, env: process.env, stdio: 'inherit' });
}


// Lists subfolders in a folder
function findPackageJsonRecursive(dir, fileToFind = FILE_TO_FIND, filelist = []) {

    let files = [];
    try {
        files = fs.readdirSync(dir);
    } catch (e) { }
    filelist = filelist || [];

    files.forEach(file => {
        if (file === FILE_TO_FIND && dirsToIgnore.every(ignoreDir => dir.indexOf(ignoreDir) === -1)) {
            filelist.push(path.join(dir));
        } else {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = findPackageJsonRecursive(path.join(dir, file), fileToFind, filelist);
            }
        }
    });

    return filelist;

}
