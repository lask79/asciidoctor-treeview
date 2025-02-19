const { describe, it, expect } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)
const path = require('path')

const asciidoctorModule = require('@asciidoctor/core')
const asciidoctor = (() => {
  try {
    // Try Asciidoctor 3.0 initialization
    return asciidoctorModule.default()
  } catch (e) {
    // Fallback to Asciidoctor 2.x initialization
    return asciidoctorModule()
  }
})()
const asciidoctorTreeView = require('../../lib/index.js')

describe('Full Test', () => {
  it('should render full page', () => {
    const registry = asciidoctor.Extensions.create()
    asciidoctorTreeView.register(registry)

    const input = path.join(__dirname, 'inputs/index.adoc')

    asciidoctor.convertFile(input, { extension_registry: registry, standalone: true, safe: 'safe', attributes: { linkcss: false } })
  })
})
