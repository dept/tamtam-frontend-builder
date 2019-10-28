const config = require('../gulpfile.js/config')
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const chalk = require('chalk')
const path = require('path')
const { prompt } = require('enquirer')

function generateHTML(name) {
  return ``
}

function generateJS(name) {
  return ``
}

function generateCSS(name) {
  return `.c-${name} {

}
`
}

function generateJSON(name) {
  return {
    name,
  }
}

function generateFiles(rootPath, type, name, json, jsExt, html = false, css = false, js = false) {
  const rootDir = `${rootPath}/${name}`
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
      file: `${name}.scss`,
      content: css,
    },
    {
      path: `${rootDir}/javascript/`,
      file: `${name}.${jsExt}`,
      content: js,
    },
  ]

  const files = filesObj.filter(fileObj => fileObj.content || fileObj.content === '')

  if (!files) {
    console.log(chalk.yellow(`Failed to create ${type}: ${name}.`))
    return
  }

  const filesToCreate = files.map(dir => mkdirp.sync(dir.path))

  Promise.all(filesToCreate)
    .then(results => {
      if (!results.filter(result => result).length) {
        console.log(chalk.red(`The ${type} called ${name} already exists.`))
        return
      }

      files.forEach(file => {
        fs.writeFileSync(path.resolve(file.path, file.file), file.content)
      })

      console.log(chalk.yellow(`Succesfully created ${type}: ${name}.`))
    })
    .catch(() => {})
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
  .then(result => {
    if (!result.type || !result.name) {
      console.log(chalk.red(`Aborted creation of component/utility!`))
      return
    }

    console.log(
      chalk.magenta(`The ${result.type} with the name ${result.name} will be generated now!`),
    )

    let rootPath = config.source.getPath('components')

    if (result.type === 'utility') {
      rootPath = config.source.getPath('utilities')
    }

    let html = false
    let css = false
    let js = false
    let json = false

    if (result.type === 'component') {
      html = generateHTML(result.name)
      css = generateCSS(result.name)
    }
    js = generateJS(result.name)
    json = generateJSON(result.name)

    generateFiles(rootPath, result.type, result.name, json, result.jsExt, html, css, js)
  })
  .catch(() => {
    console.log(chalk.red(`Aborted creation of component/utility!`))
  })
