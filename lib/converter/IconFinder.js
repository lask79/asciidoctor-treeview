const { FileExtensions1ToIcon, FileExtensions1ToIconLight } = require('./generated/FileExtensions1ToIcon')
const { FileExtensions2ToIcon, FileExtensions2ToIconLight } = require('./generated/FileExtensions2ToIcon')
const { FileNamesToIcon, FileNamesToIconLight } = require('./generated/FileNamesToIcon')
const { FolderNamesToIcon, FolderNamesToIconLight } = require('./generated/FolderNamesToIcon')
const { LanguagesToIcon } = require('./generated/LanguagesToIcon')

exports.DEFAULT_FOLDER = 'folder.svg'
exports.DEFAULT_FOLDER_OPENED = 'folder-open.svg'
exports.DEFAULT_ROOT = 'folder-root.svg'
exports.DEFAULT_ROOT_OPENED = 'folder-root-open.svg'
exports.DEFAULT_FILE = 'file.svg'

const additionalFileNameMappings = {
  LICENSE: 'certificate.svg',
}
/**
 * Get icon for a folder
 * @param folderName name of folder to find icon for
 * @return icon filename
 */
exports.getIconForFolder = function (folderName, theme = 'dark') {
  if (!folderName) {
    throw new Error('Folder name is empty')
  }

  if (theme === 'light') {
    const folderIcon = FolderNamesToIconLight[folderName]
    return folderIcon || exports.getIconForFolder(folderName, 'dark')
  }

  const folderIcon = FolderNamesToIcon[folderName]
  return folderIcon || exports.DEFAULT_FOLDER
}

let prevExtension
let prevIcon

/**
 * Get icon for a file
 * @param fileName name of file to find icon for
 * @return icon filename
 */
exports.getIconForFile = function (fileName, theme = 'dark') {
  // match by exact FileName

  const iconFromFileName = theme === 'light'
    ? FileNamesToIconLight[fileName] || FileNamesToIcon[fileName]
    : FileNamesToIcon[fileName]

  if (iconFromFileName !== undefined) {
    return iconFromFileName
  }

  if (additionalFileNameMappings[fileName]) {
    return additionalFileNameMappings[fileName]
  }

  // match by File Extension
  const extensions = fileName.split('.')
  if (extensions.length > 2) {
    const ext1 = extensions.pop()
    const ext2 = extensions.pop()
    // check for `.js.map`, `test.tsx`, ...

    const iconFromExtension2 = theme === 'light'
      ? FileExtensions2ToIconLight[ext1] || FileExtensions2ToIcon[`${ext2}.${ext1}`]
      : FileExtensions2ToIcon[ext1]

    if (iconFromExtension2 !== undefined) {
      return iconFromExtension2
    }
    // check for `.js`, `tsx`, ...
    if (!ext1) {
      // If there's no extension, return DEFAULT_ICON
      return exports.DEFAULT_FILE
    }
    if (ext1 === prevExtension) {
      return prevIcon
    }

    const iconFromExtension1 = theme === 'light'
      ? FileExtensions1ToIconLight[ext1] || FileExtensions1ToIcon[ext1]
      : FileExtensions1ToIcon[ext1]

    if (iconFromExtension1 !== undefined) {
      // memoization
      prevExtension = ext1
      prevIcon = iconFromExtension1
      return iconFromExtension1
    }
  } else {
    const ext = extensions.pop()
    if (!ext) {
      // If there's no extension, return DEFAULT_ICON
      return exports.DEFAULT_FILE
    }
    if (ext === prevExtension) {
      return prevIcon
    }

    const iconFromExtension = theme === 'light'
      ? FileExtensions1ToIconLight[ext] || FileExtensions1ToIcon[ext]
      : FileExtensions1ToIcon[ext]

    if (iconFromExtension !== undefined) {
      // memoization
      prevExtension = ext
      prevIcon = iconFromExtension
      return iconFromExtension
    }
  }

  // match by language
  const fileExtension = fileName.split('.').pop()
  if (fileExtension !== undefined) {
    const iconFromLang = LanguagesToIcon[fileExtension]
    if (iconFromLang) {
      return iconFromLang
    }
  }

  // if there's no icon for file, use default one
  return exports.DEFAULT_FILE
}

/**
 * Get icon for an opened folder
 * @param folderName name of opened folder to icon for
 * @return icon filename
 */
exports.getIconForOpenFolder = function (folderName, theme = 'dark') {
  return (
    exports.getIconForFolder(folderName, theme)
      .split('.')
      .shift() + '-open.svg'
  )
}
