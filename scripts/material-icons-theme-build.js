const fss = require('fs-extra')
const { readFileSync, createWriteStream } = require('fs')

const materialIconsJSONFile = readFileSync(require.resolve('material-icon-theme/dist/material-icons.json'))
const vsiLanguagesFile = readFileSync(require.resolve('vscode-icons-js/data/generated/languages-vsi.json'))
const vscodeLanguagesFile = readFileSync('./node_modules/vscode-icons-js/data/static/languages-vscode.json')

const PATH_ICONSDATA = './lib/converter/generated/'

const materialIcons = JSON.parse(materialIconsJSONFile.toString())

// materialIcons.light.folderNames = Object.assign(materialIcons.folderNames, materialIcons.light.folderNames)
// materialIcons.light.fileExtensions = Object.assign(materialIcons.fileExtensions, materialIcons.light.fileExtensions)
// materialIcons.light.fileNames = Object.assign(materialIcons.fileNames, materialIcons.light.fileNames)
// materialIcons.light.languageIds = Object.assign(materialIcons.languageIds, materialIcons.light.languageIds)

const vsiLanguages = JSON.parse(vsiLanguagesFile.toString())
const vscodeLanguages = JSON.parse(vscodeLanguagesFile.toString())

// Icon To Path
const iconToPath = Object.keys(materialIcons.iconDefinitions).reduce((acc, icon) => ({
  ...acc,
  [icon]: materialIcons.iconDefinitions[icon].iconPath.split('/').pop(),
}), {})

function getIconPath (icon) {
  return iconToPath[icon]
}

// FolderNames to Icon
(async function () {
  console.debug('creating table for foldernames')
  fss.ensureFileSync(PATH_ICONSDATA + 'FolderNamesToIcon.js')
  const folderIcons = createWriteStream(PATH_ICONSDATA + 'FolderNamesToIcon.js', { flags: 'w' })
  folderIcons.write('exports.FolderNamesToIcon = {\n')
  // for (const [folderName, icon] of Object.entries(materialIcons.light.folderNames)) {
  for (const [folderName, icon] of Object.entries(materialIcons.folderNames)) {
    folderIcons.write(`\t'${folderName}': '${getIconPath(icon)}',\n`)
  }
  folderIcons.write('};\n')

  // light
  folderIcons.write('exports.FolderNamesToIconLight = {\n')
  // for (const [folderName, icon] of Object.entries(materialIcons.light.folderNames)) {
  for (const [folderName, icon] of Object.entries(materialIcons.light.folderNames)) {
    folderIcons.write(`\t'${folderName}': '${getIconPath(icon)}',\n`)
  }
  folderIcons.write('};\n')
  folderIcons.end()
})();

// FileExtensions to Icon
(async function () {
  console.debug('creating table for filextensions')
  fss.ensureFileSync(PATH_ICONSDATA + 'FileExtensions1ToIcon.js')
  fss.ensureFileSync(PATH_ICONSDATA + 'FileExtensions2ToIcon.js')
  const fileExtensions1 = createWriteStream(PATH_ICONSDATA + 'FileExtensions1ToIcon.js', { flags: 'w' })
  const fileExtensions2 = createWriteStream(PATH_ICONSDATA + 'FileExtensions2ToIcon.js', { flags: 'w' })
  fileExtensions1.write('exports.FileExtensions1ToIcon = {\n')
  fileExtensions2.write('exports.FileExtensions2ToIcon = {\n')
  // for (const [extension, icon] of Object.entries(materialIcons.light.fileExtensions)) {
  for (const [extension, icon] of Object.entries(materialIcons.fileExtensions)) {
    if (extension.indexOf('.') === -1) {
      fileExtensions1.write(`\t'${extension}': '${getIconPath(icon)}',\n`)
    } else {
      fileExtensions2.write(`\t'${extension}': '${getIconPath(icon)}',\n`)
    }
  }
  fileExtensions1.write('};\n')
  fileExtensions2.write('};\n')

  // light
  fileExtensions1.write('exports.FileExtensions1ToIconLight = {\n')
  fileExtensions2.write('exports.FileExtensions2ToIconLight = {\n')
  // for (const [extension, icon] of Object.entries(materialIcons.light.fileExtensions)) {
  for (const [extension, icon] of Object.entries(materialIcons.light.fileExtensions)) {
    if (extension.indexOf('.') === -1) {
      fileExtensions1.write(`\t'${extension}': '${getIconPath(icon)}',\n`)
    } else {
      fileExtensions2.write(`\t'${extension}': '${getIconPath(icon)}',\n`)
    }
  }
  fileExtensions1.write('};\n')
  fileExtensions2.write('};\n')

  fileExtensions1.end()
  fileExtensions2.end()
})();

// FileNames to Icon
(async function () {
  console.debug('creating table for filenames')
  const alreadyIncludedNames = []
  fss.ensureFileSync(PATH_ICONSDATA + 'FileNamesToIcon.js')
  const filenames = createWriteStream(PATH_ICONSDATA + 'FileNamesToIcon.js', { flags: 'w' })
  filenames.write('exports.FileNamesToIcon = {\n')
  // get folder names from vsi langauges definitions
  // for (const [filename, icon] of Object.entries(materialIcons.light.fileNames)) {
  for (const [filename, icon] of Object.entries(materialIcons.fileNames)) {
    filenames.write(`\t'${filename}': '${getIconPath(icon)}',\n`)
    alreadyIncludedNames.push(filename)
  }
  // get folder names from vscode languages definitions
  for (const [language, data] of Object.entries(vscodeLanguages)) {
    if (data.filenames && Object.keys(vsiLanguages).includes(language) && getIconPath(`${language}`)) {
      for (const filename of data.filenames) {
        if (!alreadyIncludedNames.includes(filename)) {
          filenames.write(`\t'${filename}': '${getIconPath(`${language}`)}',\n`)
          alreadyIncludedNames.push(filename)
        }
      }
    }
  }
  filenames.write('};\n')
  // light
  filenames.write('exports.FileNamesToIconLight = {\n')
  // get folder names from vsi langauges definitions
  for (const [filename, icon] of Object.entries(materialIcons.light.fileNames)) {
    filenames.write(`\t'${filename}': '${getIconPath(icon)}',\n`)
    alreadyIncludedNames.push(filename)
  }
  // get folder names from vscode languages definitions
  for (const [language, data] of Object.entries(vscodeLanguages)) {
    if (data.filenames && Object.keys(vsiLanguages).includes(language) && getIconPath(`${language}`)) {
      for (const filename of data.filenames) {
        if (!alreadyIncludedNames.includes(filename)) {
          filenames.write(`\t'${filename}': '${getIconPath(`${language}`)}',\n`)
          alreadyIncludedNames.push(filename)
        }
      }
    }
  }

  filenames.write('};\n')
  filenames.end()
})();

// Languages to Icon
(async function () {
  console.debug('creating table for languages')
  const alreadyIncludedLangs = []
  fss.ensureFileSync(PATH_ICONSDATA + 'LanguagesToIcon.js')
  const languages = createWriteStream(PATH_ICONSDATA + 'LanguagesToIcon.js', { flags: 'w' })
  languages.write('exports.LanguagesToIcon = {\n')
  for (const [language, icon] of Object.entries(vsiLanguages)) {
    const iconFileName = materialIcons.languageIds[language]
    if (iconFileName) {
      // const withoutPrefix = iconFileName.slice(3); // remove prefix "_f_";
      // const withoutPrefix = iconFileName // remove prefix "_f_";
      // const lightIconFilename = `${withoutPrefix}`
      // eslint-disable-next-line max-len
      // const existsLightTheme = materialIcons.iconDefinitions[lightIconFilename] // try to find light theme of icon
      // const iconPath = existsLightTheme
      //   ? getIconPath(lightIconFilename)
      //   : getIconPath(iconFileName)
      const iconPath = getIconPath(iconFileName)

      // Are there any language extensions supported by vscode ?
      if (vscodeLanguages[language]) {
        const supportedExtensions = vscodeLanguages[language].extensions
        const languageExtensions = {}
        for (const extension of supportedExtensions) {
          languageExtensions[extension.slice(1)] = iconPath // .cpp => cpp
        };
        // Override default extension
        // languageExtensions[icon.defaultExtension] = iconPath;

        for (const [extIcon, extIconPath] of Object.entries(languageExtensions)) {
          if (!alreadyIncludedLangs.includes(extIcon)) {
            languages.write(`\t'${extIcon}': '${extIconPath}',\n`)
            alreadyIncludedLangs.push(extIcon)
          }
        }
      } else {
        if (!alreadyIncludedLangs.includes(icon.defaultExtension)) {
          languages.write(`\t'${icon.defaultExtension}': '${iconPath}',\n`)
          alreadyIncludedLangs.push(icon.defaultExtension)
        }
      }
    }
    // languages.write(`\t"${filename}": "${getIconPath(icon)}",\n`);
  }
  languages.write('};\n')
  languages.end()
})()
