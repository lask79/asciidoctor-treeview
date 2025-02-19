const { describe, it, expect, beforeEach } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)

const TreeLine = require('../../../lib/parser/treeline')
const AsciiTreeParser = require('../../../lib/parser/asciitree-parser')

describe('AsciiTreeParser.parse', () => {
  let asciiTreeParser

  beforeEach(() => {
    asciiTreeParser = new AsciiTreeParser()
  })

  it('returns empty node when empty String is passed', () => {
    const source = ''

    const result = asciiTreeParser.parse(source)
    expect(result).toStrictEqual(new TreeLine())
  })

  it('returns empty node when only whitespace is passed', () => {
    const source = ' '

    const result = asciiTreeParser.parse(source)

    expect(result).toEqual(new TreeLine())
  })

  it('returns rootNode zeroLevelRootNode when only name is passed', () => {
    const source = 'root'

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root'),
    ])

    expect(result).toStrictEqual(root)
  })

  it('handles a multiple - correctly in name', () => {
    const source = `root-file
    another-root-file`

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root-file'),
      TreeLine.createRootElement('another-root-file'),
    ])

    expect(result).toStrictEqual(root)
  })

  it('returns rootNode with 2 zeroLevelRootNode when 2 names are passed', () => {
    const source = `root1
    root2`

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root1'),
      TreeLine.createRootElement('root2'),
    ])

    expect(result).toStrictEqual(root)
  })

  it('returns root1, empty, root2 when empty line exist', () => {
    const source = `root1

    root2`.split('\n').map((line) => line.trim()).join('\n')

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root1'),
      new TreeLine(),
      TreeLine.createRootElement('root2'),
    ])

    expect(result).toStrictEqual(root)
  })

  it('returns root with level 1 child', () => {
    const source = `root1
    └── settings.json`.split('\n').map((line) => line.trim()).join('\n')

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root1', [
        TreeLine.create('settings.json'),
      ]),
    ])

    expect(result).toStrictEqual(root)
  })

  it('returns root with level 1 children with - in name', () => {
    const source = `
    root1
    └── settings-file.json
    `.split('\n').map((line) => line.trim()).join('\n')

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root1', [
        TreeLine.create('settings-file.json'),
      ]),
    ])

    expect(result).toStrictEqual(root)
  })

  it('handles big structure', () => {
    const source = `
    root1
    ├── .vscode
    │   ├── extensions.json
    │   └── settings.json
    ├── data
    │   ├── config
    │   │   ├── default.json
    │   │   ├── full.json
    │   │   └── minimal.json
    │   └── templates
    │       ├── treeview.css.hbs
    │       └── treeview.js.hbs
    ├── .editorconfig
    ├── .eslintrc
    ├── .gitignore
    ├── .npmignore
    ├── .stylelintrc
    ├── LICENSE
    ├── package.json
    └── test.hcl
    `.split('\n').map((line) => line.trim()).join('\n')

    const result = asciiTreeParser.parse(source)

    const root = TreeLine.createRoot([
      TreeLine.createRootElement('root1', [
        TreeLine.create('.vscode', [
          TreeLine.create('extensions.json'),
          TreeLine.create('settings.json'),
        ]),
        TreeLine.create('data', [
          TreeLine.create('config', [
            TreeLine.create('default.json'),
            TreeLine.create('full.json'),
            TreeLine.create('minimal.json'),
          ]),
          TreeLine.create('templates', [
            TreeLine.create('treeview.css.hbs'),
            TreeLine.create('treeview.js.hbs'),
          ]),
        ]),
        TreeLine.create('.editorconfig'),
        TreeLine.create('.eslintrc'),
        TreeLine.create('.gitignore'),
        TreeLine.create('.npmignore'),
        TreeLine.create('.stylelintrc'),
        TreeLine.create('LICENSE'),
        TreeLine.create('package.json'),
        TreeLine.create('test.hcl'),
      ]),
    ])

    expect(result).toStrictEqual(root)
  })
})
