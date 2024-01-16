// based on https://github.com/jirutka/asciidoctor-highlight.js/blob/master/src/utils.js
class ExtMap extends Map {
  get (key, defaultValue) {
    const value = super.get(key)
    return value !== undefined ? value : defaultValue
  }
}

function regexpEscape (str) {
  // Based on https://github.com/ljharb/regexp.escape.
  return str.replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&')
}

module.exports = {
  ExtMap,
  regexpEscape,
}
