const { describe, it, expect, beforeEach } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)

const TreeLine = require('../../../lib/parser/treeline')

describe('TreeLineToHtmlConverter', () => {
  it('throws error when empty string is passed', () => {
    const root = TreeLine.createRoot([
      TreeLine.create('root1', [
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
  })
})
