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
    this.onContexts(['listing', 'paragraph'])
    this.positionalAttributes(['theme'])

    this.process((parent, reader, attrs) => {
      const lines = reader.readLines()

      const parentBlock = this.createListingBlock(parent, [], {})
      parentBlock.setAttribute('role', 'treeview')

      removeSubstitution(parentBlock, 'callouts')
      const callouts = calloutsSubs(this, parentBlock)
      const updatedLines = callouts.extract(lines)

      const theme = attrs.theme || parent.document.getAttribute('treeview-theme') || 'dark'

      const renderedSource = treeViewRenderer.render(updatedLines, theme, attrs)
      let renderedLines = renderedSource.split('\n')

      if (callouts) {
        renderedLines = renderedLines.map((line, ln) => insertBeforeLastSpan(line, `${callouts.convertLine(ln) || ''}`))
      }

      const listingBlock = this.createPassBlock(parentBlock, enclose(renderedLines.join('\n'), theme, attrs))
      listingBlock.setAttribute('role', 'treeview')

      return listingBlock
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

function createExtensionGroup () {
  return function () {
    registerBlockProcessor(this)
    registerDocInfoProcessor(this)
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

const enclose = (source, theme, attrs) => {
  const tags = [
    '<div class="listingblock">',
    `${attrs.title ? `<div class="title">${attrs.title}</div>` : ''}`,
    '<div class="content">',
    `<pre class="treeview" data-theme="${theme}">`,
    `${source}`,
    '</pre>',
    '</div>',
    '</div>',
  ]

  return Array.from(tags).join('')
}

module.exports = { register }
