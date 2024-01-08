const AsciiTreeParser = require('../parser/AsciiTreeParser')
const TreeLineToHtmlConverter = require('../converter/TreeLineToHtmlConverter')

class TreeViewRenderer {
  constructor () {
    this.asciiTreeParser = new AsciiTreeParser()
    this.treeLineToHtmlConverter = new TreeLineToHtmlConverter()
  }

  render (source, theme, attrs) {
    // check if source is an array
    if (Array.isArray(source)) {
      source = source.join('\n')
    }

    const parsedSource = this.asciiTreeParser.parse(source)
    const html = this.treeLineToHtmlConverter.convert(parsedSource, theme)

    return html
  }
}

module.exports = TreeViewRenderer
