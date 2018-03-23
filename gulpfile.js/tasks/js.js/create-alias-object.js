const walkFileListSync        = require('../../src/node/file/walk-file-list-sync');
const config                  = require('../../config');
const path                    = require('path');

const getReferences = (folder) => {

    const components = walkFileListSync(config.source.getPath(folder), 'javascript');
    const stripPath = path.join(config.source.getPath(folder), '/');
    return [].reduce.call(components, (data, component) => {

        const moduleName = component.replace(stripPath, '').split('/')[0];
        data[`${folder}/${moduleName}`] = path.resolve(__dirname, '../../', component, moduleName);

        return data;

    }, {});

}


module.exports = createAliasObject = () => {

    const components = getReferences('components');
    const utilities = getReferences('utilities');

    utilities['utilities'] = path.resolve(__dirname, '../../', path.join(config.source.getPath('utilities'), '/'));

    return { ...components, ...utilities };

}
