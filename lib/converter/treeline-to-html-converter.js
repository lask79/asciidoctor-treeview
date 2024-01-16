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

    return result
  }
}

function convertLine (node, prefix = '', isLast = true, theme) {
  // Base case for empty or undefined node
  if (!node) {
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

function createNameWithIcon (node, theme) {
  const icon = findIcon(node, theme)

  const url = `https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/${icon}`

  return `<span class="tv-line-element"><img src="${url}" alt="${icon}"><span class="tv-item-name">${node.name}</span></span>`
}

function findIcon (node, theme) {
  let foundIcon
  if (node.hasChildren()) {
    foundIcon = getIconForOpenFolder(node.name.replace('/', ''), theme)
  } else if (node.name.endsWith('/')) {
    foundIcon = getIconForFolder(node.name.replace('/', ''), theme)
  } else {
    foundIcon = getIconForFile(node.name, theme)
  }

  return foundIcon
}

module.exports = TreeLineToHtmlConverter
