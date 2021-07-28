const walkFileListSync = require('../utils/file/walk-file-list-sync')
const path = require('path')
const resolveApp = require('../utils/resolve-app')

const getReferences = (folder) => {
  const projectFolderPath = path.resolve(resolveApp('source'), folder)
  const components = walkFileListSync(projectFolderPath, 'javascript')
  const stripPath = path.join(projectFolderPath, '/')

  return [].reduce.call(
    components,
    (data, component) => {
      const moduleName = component.replace(stripPath, '').replace('\\', '/').split('/')[0]

      data[`@${folder}/${moduleName}`] = resolveApp(path.resolve(component, moduleName))

      return data
    },
    {},
  )
}

const createAliasObject = () => {
  const components = getReferences('components')
  const utilities = getReferences('utilities')

  utilities['@utilities'] = path.resolve(resolveApp(path.join('source', 'utilities', '/')))

  const sourcePath = resolveApp('source/')

  return { ...components, ...utilities, '@': sourcePath }
}

module.exports = createAliasObject
