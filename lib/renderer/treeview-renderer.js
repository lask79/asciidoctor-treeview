const AsciiTreeParser = require('../parser/asciitree-parser')
const SymbolParser = require('../parser/symbol-parser')
const TreeLineToHtmlConverter = require('../converter/treeline-to-html-converter')

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

    let marker
    if (attrs.symbol) {
      marker = attrs.symbol
    } else {
      marker = detectMarker(source)
    }

    console.log('marker', marker)

    let parsedSource
    if (marker === 'ASCII') {
      parsedSource = this.asciiTreeParser.parse(source)
    } else {
      parsedSource = new SymbolParser(marker).parse(source)
    }

    const html = this.treeLineToHtmlConverter.convert(parsedSource, theme)

    return html
  }
}

function detectMarker (source) {
  let lines = source
  if (!Array.isArray(source)) {
    lines = lines.split('\n')
  }

  let asciiTreeDetected = false
  let marker = null

  const asciiTreePatterns = [/│/, /├──/, /└──/]
  const possibleMarkers = ['*', '#']

  for (const line of lines) {
    // Check for ASCII tree patterns
    if (asciiTreePatterns.some((pattern) => pattern.test(line))) {
      if (marker) {
        throw new Error('Mixed ASCII tree and symbol markers detected.')
      }
      asciiTreeDetected = true
      continue
    }

    if (asciiTreeDetected) {
      throw new Error('Mixed ASCII tree and symbol markers detected.')
    }

    // Detect symbol marker
    const currentMarker = possibleMarkers.find((m) => line.trim().startsWith(m))
    if (currentMarker) {
      if (marker && currentMarker !== marker) {
        throw new Error('Multiple symbol markers detected.')
      }
      marker = currentMarker
    }
  }

  if (asciiTreeDetected || !marker) {
    return 'ASCII'
  }

  return marker
}

module.exports = TreeViewRenderer
