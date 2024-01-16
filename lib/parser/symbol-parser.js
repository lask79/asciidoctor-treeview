const TreeLine = require('./treeline')

class SymbolParser {
  constructor (marker = '*') {
    this.marker = marker
  }

  parse (source) {
    const lines = Array.isArray(source) ? source : source.split('\n')

    // Check if there are any lines to parse
    if (lines.length === 0) {
      throw new Error('Source is empty')
    }

    // The first line is the root node
    const root = new TreeLine()

    const stack = []

    // Start parsing from the second line
    lines.forEach((line) => {
      const depth = this.getDepth(line)
      const name = line.trim().substring(depth).trim()

      const node = new TreeLine(name, depth === 0)
      if (depth === 0) {
        root.addChild(node)
        stack.length = 0
        stack.push(node)
      } else if (depth <= stack.length) {
        const currentNode = stack[depth - 1]
        if (currentNode.name === '') {
          currentNode.setName('.')
        }

        stack[depth - 1].addChild(node)
        stack.length = depth
        stack.push(node)
      } else {
        throw new Error(`Invalid depth at line: "${line}"`)
      }
    })
    return root
  }

  getDepth (line) {
    let depth = 0
    while (line[depth] === this.marker) {
      depth++
    }
    return depth
  }
}

module.exports = SymbolParser
