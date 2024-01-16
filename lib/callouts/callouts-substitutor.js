// Based on https://raw.githubusercontent.com/jirutka/asciidoctor-highlight.js/master/src/calloutsSubstitutor.js
const { regexpEscape, ExtMap } = require('./utils')

// FIXME: Fake types just for documentation purposes.
// AbstractNode and Processor types are just placeholders for actual types.

// Copied from Asciidoctor::Substitutors::RS
const ESCAPE_CHAR = '\\'

// Copied from Asciidoctor::CalloutExtractRx
const EXTRACT_RX = /((?:(?:\/\/|#|--|;;) ?)?(\\)?<!?(|--)(\d+|\.)\3>(?=(?: ?\\?<!?\3(?:\d+|\.)\3>)*$))/g

// Copied from Asciidoctor::CalloutExtractRxt
const EXTRACT_RXT = '(\\\\)?<()(\\d+|\\.)>(?=(?: ?\\\\?<(?:\\d+|\\.)>)*$)'

/**
 * Creates a substitutor for processing callouts inside a source listing block.
 */
module.exports = (processor, node) => {
  const callouts = new ExtMap()
  const lineComment = node.getAttribute('line-comment')
  let docCallouts
  let autoNumber = 1

  const calloutRx = lineComment
    ? new RegExp(`(?:${regexpEscape(lineComment)} )?${EXTRACT_RXT}`, 'g')
    : EXTRACT_RX

  function convertCallout (colnum) {
    return processor
      .createInline(node, 'callout', colnum, { id: nextCalloutId() })
      .convert()
  }

  function nextCalloutId () {
    if (!docCallouts) {
      docCallouts = node.getDocument().getCallouts()
    }
    return docCallouts.readNextId()
  }

  return {
    get callouts () { return callouts },

    extract (lines) {
      callouts.clear()

      return lines.map((line, ln) =>
        line.replace(calloutRx, (match, escape, _, callnum) => {
          if (callnum === '') {
            callnum = `${autoNumber++}`
          }

          if (escape === ESCAPE_CHAR) {
            return match.replace(ESCAPE_CHAR, '')
          }
          const calloutValue = parseInt(callnum, 10)

          callouts.set(ln, [...(callouts.get(ln, [])), calloutValue])
          return ''
        })
      )
    },
    convertLine (lineNum) {
      if (!callouts.has(lineNum)) { return '' }

      return '&nbsp;' + callouts.get(lineNum, [])
        .map(convertCallout)
        .join('&nbsp;')
    },
  }
}
