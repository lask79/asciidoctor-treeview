const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const templatePath = path.join(__dirname, '../../data/templates/treeview.css.hbs')

class CSSGenerator {
  generateCss (iconRegistry, iconSource = 'jsdelivr') {
    const templateFile = fs.readFileSync(templatePath, 'utf8')
    const template = Handlebars.compile(templateFile)
    const templateData = {
      iconRules: createIconRules(iconRegistry, iconSource),
    }
    return template(templateData)
  }
}

function createIconRules (iconRegistry, iconSource) {
  const iconRules = []

  const keys = iconRegistry.getIconKeys()

  for (const iconBaseName of keys) {
    const iconName = iconRegistry.getIcon(iconBaseName)
    const icon = createIconData(iconBaseName, iconName, iconSource)
    iconRules.push(icon)
  }

  return iconRules
}

function createIconData (iconBaseName, iconName, iconSource) {
  let iconUrl = ''

  if (iconSource === 'jsdelivr') {
    iconUrl = `https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/${iconName}`
  } else if (iconSource === 'embedded') {
    iconUrl = createIconDataUri(iconName)
  } else if (iconSource === 'antora') {
    iconUrl = `../img/treeview/${iconName}`
  } else {
    iconUrl = `${iconSource}/${iconName}`
  }

  return {
    baseName: iconBaseName,
    url: iconUrl,
  }
}

function createIconDataUri (iconName) {
  const imagePath = require.resolve(`material-icon-theme/icons/${iconName}`)

  const fileData = fs.readFileSync(imagePath)
  const base64Image = Buffer.from(fileData).toString('base64')
  return `data:image/svg+xml;base64,${base64Image}`
}

module.exports = CSSGenerator
