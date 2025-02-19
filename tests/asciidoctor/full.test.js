const { describe, it, expect } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)
const path = require('path')

const asciidoctor = require('@asciidoctor/core')()
const asciidoctorTreeView = require('../../lib/index.js')

describe('Full Test', () => {
  it('should render full page', () => {
    const registry = asciidoctor.Extensions.create()
    asciidoctorTreeView.register(registry)

    const input = path.join(__dirname, 'inputs/index.adoc')

    asciidoctor.convertFile(input, { extension_registry: registry, standalone: true, safe: 'safe', attributes: { linkcss: false } })
  })
})
