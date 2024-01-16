function convertLine (node, prefix = '', isLast = true) {
  // Base case for empty or undefined node
  if (!node) {
    return ''
  }

  let result = prefix + (isLast ? '└── ' : '├── ') + node.name + '\n'
  const childPrefix = prefix + (isLast ? '    ' : '│   ')

  // Recursively call this function for all children
  for (let i = 0; i < node.children.length; i++) {
    result += convertLine(node.children[i], childPrefix, i === node.children.length - 1)
  }

  return result
}

class AsciiTreeConverter {
  convert (root) {
    let result = ''
    const children = root.children
    const lastChildIndex = children.length - 1

    // Start from the root's children
    for (let i = 0; i < children.length; i++) {
      result += convertLine(children[i], '', i === lastChildIndex)
    }

    return result
  }
}

module.exports = AsciiTreeConverter
