const { describe, it, expect, beforeEach } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)

const TreeLine = require('../../lib/parser/TreeLine')
const SymbolParser = require('../../lib/parser/SymbolParser')

describe('SymbolParser', () => {
  describe('General features', () => {
    let symbolParser

    beforeEach(() => {
      symbolParser = new SymbolParser('*')
    })

    it('returns empty node when empty String is passed', () => {
      const source = ''

      const result = symbolParser.parse(source)
      expect(result).toStrictEqual(TreeLine.createRoot([
        TreeLine.createRootElement(),
      ]))
    })

    it('throws error when empty array is passed', () => {
      expect(() => symbolParser.parse([])).toThrow(Error)
    })

    it('root becomes . when empty and has children', () => {
      const source = [
        '',
        '* child1',
        '* child2',
      ]

      const result = symbolParser.parse(source)

      const root = TreeLine.createRoot([
        TreeLine.createRootElement('.', [
          TreeLine.create('child1'),
          TreeLine.create('child2'),
        ]),
      ])

      expect(result).toStrictEqual(root)
    })

    it('parses bigger structure', () => {
      const source = [
        'root1',
        '* .vscode',
        '** extensions.json',
        '**  settings.json',
        '* data',
        '**  config',
        '*** default.json',
        '*** full.json',
        '*** minimal.json',
        '** templates',
        '*** treeview.css.hbs',
        '*** treeview.js.hbs',
        '* .editorconfig',
        '* .eslintrc',
        '* .gitignore',
        '* .npmignore',
        '* .stylelintrc',
        '* LICENSE',
        '* package.json',
        '* test.hcl',
      ]

      const result = symbolParser.parse(source)
      expect(result).toStrictEqual(TreeLine.createRoot([
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
      ]))
    })

    it('first line is empty', () => {
      const source = [
        '',
        '',
        '* child1',
        '* child2',
      ]

      const result = symbolParser.parse(source)

      const root = TreeLine.createRoot([
        TreeLine.createRootElement(''),
        TreeLine.createRootElement('.', [
          TreeLine.create('child1'),
          TreeLine.create('child2'),
        ]),
      ])

      expect(result).toStrictEqual(root)
    })
  })

  describe('SymbolParser for *', () => {
    let symbolParser

    beforeEach(() => {
      symbolParser = new SymbolParser('*')
    })

    it('parses structure with 1 level', () => {
      const source = [
        'root',
        '* child1',
        '* child2',
      ]

      const result = symbolParser.parse(source)

      const root = TreeLine.createRoot([
        TreeLine.createRootElement('root', [
          TreeLine.create('child1'),
          TreeLine.create('child2'),
        ]),
      ])

      expect(result).toStrictEqual(root)
    })
  })

  describe('SymbolParser for #', () => {
    let symbolParser

    beforeEach(() => {
      symbolParser = new SymbolParser('#')
    })

    it('parses structure with 1 level', () => {
      const source = [
        'root',
        '# child1',
        '# child2',
      ]

      const result = symbolParser.parse(source)

      const root = TreeLine.createRoot([
        TreeLine.createRootElement('root', [
          TreeLine.create('child1'),
          TreeLine.create('child2'),
        ]),
      ])

      expect(result).toStrictEqual(root)
    })
  })
})
