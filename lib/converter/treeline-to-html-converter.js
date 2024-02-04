const { getIconForFile, getIconForFolder, getIconForOpenFolder } = require('./icon-finder')

class TreeLineToHtmlConverter {
  convert (root, theme) {
    let result = ''
    const children = root.children
    const lastChildIndex = children.length - 1

    // Start from the root's children
    for (let i = 0; i < children.length; i++) {
      result += convertLine(children[i], '', i === lastChildIndex, theme)
    }

    return removeLastEmptyValue(result.split('\n')).join('\n')
  }
}

function convertLine (node, prefix = '', isLast = true, theme) {
  // Base case for empty or undefined node
  if (!node || node.name === '') {
    return createLineElement('')
  }

  const asciiTreeLinePrefix = createAsciiTreeLinePrefix(node, prefix, isLast)
  const nameWithIcon = createNameWithIcon(node, theme)

  let result = createLineElement(`${asciiTreeLinePrefix}${nameWithIcon}`) + '\n'

  const childPrefix = !node.isRoot() ? prefix + (isLast ? '    ' : '│   ') : ''
  // Recursively call this function for all children
  for (let i = 0; i < node.children.length; i++) {
    result += convertLine(node.children[i], childPrefix, i === node.children.length - 1, theme)
  }

  return result
}

function createLineElement (content) {
  return `<span class="tv-line">${content}</span>`
}

function createAsciiTreeLinePrefix (node, prefix, isLast) {
  let linePrefix = ''
  if (!node.isRoot()) {
    linePrefix = prefix + (isLast ? '└── ' : '├── ').replace(/ /g, '&nbsp;')
  }

  return `<span class="tv-line-prefix">${linePrefix}</span>`
}

// TODO might need some refactoring to get the comments before this function during parsing
function createNameWithIcon (node, theme) {
  const splitName = node.name.split(' ')
  const name = splitName[0]
  const reducedName = name.replace('/', '')
  splitName[0] = reducedName

  const icon = findIcon(node, name, theme)
  const url = `https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/${icon}`

  return `<span class="tv-line-element"><img src="${url}" alt="${icon}"><span class="tv-item-name">${splitName.join(' ')}</span></span>`
}

function findIcon (node, name, theme) {
  const reducedFolderName = name.replace('/', '')

  let foundIcon
  if (node.hasChildren()) {
    foundIcon = getIconForOpenFolder(reducedFolderName, theme)
  } else if (name.endsWith('/')) {
    foundIcon = getIconForFolder(reducedFolderName, theme)
  } else {
    foundIcon = getIconForFile(name, theme)
  }

  return foundIcon
}

function removeLastEmptyValue (arr) {
  if (arr.length > 0 && arr[arr.length - 1] === '') {
    arr.pop()
  }
  return arr
}

module.exports = TreeLineToHtmlConverter
