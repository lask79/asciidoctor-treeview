const TreeLine = require('./treeline')

class AsciiTreeParser {
  parse (asciiTree) {
    const lines = asciiTree.trim().split('\n')
    const root = new TreeLine()

    const nodeStack = [root]

    if (lines.length === 0 || lines[0].trim().length === 0) {
      return root
    }

    lines.forEach((line) => {
      if (line.trim().length === 0) {
        root.children.push(new TreeLine())
      } else {
      // Find the depth by counting the number of indentation characters
        const depth = Math.ceil((line.lastIndexOf('─') + 1) / 4)

        // Adjust the stack to the current depth
        while (nodeStack.length > depth + 1) {
          nodeStack.pop()
        }

        // Extract the name and create a new node
        const lastIndex = line.lastIndexOf('─')

        const name = line.substring(lastIndex + 1, line.length).trim()
        const newNode = new TreeLine(name)
        newNode.setRoot(depth === 0)

        // Add the new node to the tree
        nodeStack[nodeStack.length - 1].children.push(newNode)
        nodeStack.push(newNode)
      }
    })

    return root
  }
}

module.exports = AsciiTreeParser
