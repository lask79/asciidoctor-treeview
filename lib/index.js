'use strict'

const toProc = require('./util/to-proc')
const { readFileSync } = require('fs')

const calloutsSubs = require('./callouts/callouts-substitutor')

const registerAntoraExtension = require('./antora/extension')

const TreeViewRenderer = require('./renderer/treeview-renderer')
const treeViewRenderer = new TreeViewRenderer()

function register (registry, context) {
  if (context?.playbook) {
    registerAntoraExtension(registry, context)
    return
  }

  if (!registry) return this.register('treeview', createExtensionGroup())
  registry.$groups().$store('treeview', toProc(createExtensionGroup()))
  return registry
}

function registerBlockProcessor (context) {
  context.block(function () {
    this.named('treeview')
    this.onContexts(['paragraph'])

    this.process((parent, reader, attrs) => {
      const block = this.createBlock(parent, 'listing', reader.getLines(), attrs)
      // This is a temporary role for easier identification. Will be removed while rendering
      block.addRole('new-treeview')
      return block
    })
  })
}

function registerDocInfoProcessor (context) {
  context.docinfoProcessor(function () {
    const self = this
    self.atLocation('header')
    self.process(function (doc) {
      const css = readFileSync(require.resolve('../data/css/treeview.css'), { encoding: 'utf8' })
      return `<style>${css}</style>`
    })
  })
}

function registerTreeProcessor (context) {
  context.treeProcessor(function () {
    this.process((doc) => {
      processListings(this, doc)

      doc.findBy({ context: 'table' }, (table) =>
        table.getRows().getBody().forEach((row) =>
          row.forEach((cell) => {
            const inner = cell.getInnerDocument()
            if (inner) { processListings(this, inner) }
          })
        )
      )
    })
  })
}

function processListings (processor, doc) {
  doc.findBy({ context: 'listing', style: 'treeview' },
    (block) => processListing(processor, block, doc))

  doc.findBy({ context: 'listing', role: 'new-treeview' },
    (block) => processListing(processor, block, doc))
}

function processListing (processor, block, doc) {
  const attrs = block.getAttributes()
  const theme = attrs.theme || block.document.getAttribute('treeview-theme') || 'dark'

  removeSubstitution(block, 'callouts')
  const lines = block.getSourceLines()

  const callouts = calloutsSubs(processor, block)
  const updatedLines = callouts.extract(lines)

  const renderedSource = treeViewRenderer.render(updatedLines, theme, attrs)

  block.removeSubstitution('specialcharacters')

  let renderedLines = renderedSource.split('\n')

  if (callouts) {
    renderedLines = renderedLines.map((line, ln) => insertBeforeLastSpan(line, `${callouts.convertLine(ln) || ''}`))
  }

  block.addRole('treeview')
  block.addRole(theme)
  block.removeRole('new-treeview') // remove temporary role

  block.lines = renderedLines
}

function createExtensionGroup () {
  return function () {
    registerBlockProcessor(this)
    registerDocInfoProcessor(this)
    registerTreeProcessor(this)
  }
}

function removeSubstitution (block, name) {
  if (block.hasSubstitution(name)) {
    block.removeSubstitution(name)
    return name
  }
}

function insertBeforeLastSpan (text, insertion) {
  const lastIndex = text.lastIndexOf('</span>')
  if (lastIndex === -1) {
    return text + insertion // If </span> is not found, append insertion at the end.
  } return text.substring(0, lastIndex) + insertion + text.substring(lastIndex)
}

module.exports = { register }
