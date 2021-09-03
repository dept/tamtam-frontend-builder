const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const path = require('path')
const { prompt } = require('enquirer')
const logging = require('./logging')
const { camelCase, startCase } = require('lodash')
const config = require('./get-config')

function generateHTML(name) {
  return `{% macro ${camelCase(name)}(data) %}

{% endmacro %}
`
}

function generateJS(name, type) {
  if (type === 'component')
    return `class ${startCase(camelCase(name))} {
  element: HTMLElement
  constructor(element: HTMLElement) {
    this.element = element
  }
}

export default ${startCase(camelCase(name))}`

  return `export const ${camelCase(name)} = () => null`
}

function generateIndex(name, type) {
  if (type === 'component')
    return `import ${startCase(camelCase(name))} from './javascript/${name}'

export default ${startCase(camelCase(name))}`

  return `export * from './javascript/${name}'`
}

function generateCSS(name) {
  return `.c-${name} {

}
`
}

function generateJSON(name) {
  return {
    name,
    license: 'MIT',
    version: '1.0.0',
  }
}

function generateFiles({ rootPath, type, name, json, jsExt, html, css, js, index }) {
  const rootDir = `${rootPath}/${name}`
  const stylePrefix = type === 'component' ? '_components.' : ''
  const filesObj = [
    {
      path: `${rootDir}/`,
      file: `package.json`,
      content: JSON.stringify(json, null, 4),
    },
    {
      path: `${rootDir}/template/`,
      file: `${name}.html`,
      content: html,
    },
    {
      path: `${rootDir}/stylesheet/`,
      file: `${stylePrefix}${name}.scss`,
      content: css,
    },
    {
      path: `${rootDir}/javascript/`,
      file: `${name}.${jsExt}`,
      content: js,
    },
    {
      path: `${rootDir}`,
      file: `index.${jsExt}`,
      content: index,
    },
  ]

  const files = filesObj.filter(fileObj => fileObj.content || fileObj.content === '')

  if (!files) {
    logging.warning({
      message: `Failed to create ${type}: ${name}.`,
    })
    return
  }

  const filesToCreate = files.map(dir => mkdirp.sync(dir.path))

  Promise.all(filesToCreate)
    .then(results => {
      if (!results.filter(result => result).length) {
        logging.error({
          message: `The ${type} called ${name} already exists.`,
        })
        return
      }

      files.forEach(file => {
        fs.writeFileSync(path.resolve(file.path, file.file), file.content)
      })

      logging.success({
        message: `Succesfully created ${type}: ${name}.`,
      })
    })
    .catch(() => null)
}

const question = [
  {
    type: 'select',
    name: 'type',
    message: 'Please specify the type.',
    initial: 'component',
    choices: ['component', 'utility'],
  },
  {
    type: 'input',
    name: 'name',
    message: 'Please specify a name.',
    result: result => {
      return result
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.|,]/g, '')
        .replace(/[^a-z0-9-]/gi, '-')
    },
    validate: result => result !== '',
  },
  {
    type: 'select',
    name: 'jsExt',
    message: 'Should this use TypeScript?',
    initial: false,
    choices: [
      {
        message: 'No',
        value: 'js',
      },
      {
        message: 'Yes',
        value: 'ts',
      },
    ],
  },
]

prompt(question)
  .then(async result => {
    if (!result.type || !result.name) {
      logging.warning({
        message: `Aborted creation of component/utility!`,
      })
      return
    }

    logging.warning({
      message: `The ${result.type} with the name ${result.name} will be generated now!`,
    })

    let rootPath = config.components

    if (result.type === 'utility') {
      rootPath = config.utilities
    }

    let html = false
    let css = false
    let js = false
    let json = false

    if (result.type === 'component') {
      html = generateHTML(result.name)
      css = generateCSS(result.name)
    }
    index = generateIndex(result.name, result.type)
    js = generateJS(result.name, result.type)
    json = generateJSON(result.name)

    generateFiles({
      rootPath,
      type: result.type,
      name: result.name,
      json,
      jsExt: result.jsExt,
      html,
      css,
      js,
      index,
    })

    setTimeout(() => process.exit(0))
  })
  .catch(() => {
    logging.error({
      message: `Aborted creation of component/utility!`,
    })
    process.exit(1)
  })
