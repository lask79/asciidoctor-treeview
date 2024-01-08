'use strict'

const toProc = require('./util/to-proc')
const { readFileSync, createWriteStream } = require('fs')

const TreeViewRenderer = require('./renderer/TreeViewRenderer')
const treeViewRenderer = new TreeViewRenderer()

function register (registry) {
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

      const theme = attrs.theme || parent.document.getAttribute('treeview-theme') || 'dark'

      const renderedSource = treeViewRenderer.render(lines, theme, attrs)

      const listingBlock = this.createPassBlock(parent, enclose(renderedSource, theme, attrs))
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
      const css = readFileSync(require.resolve('./css/treeview.css'), { encoding: 'utf8' })
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
