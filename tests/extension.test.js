/* eslint-disable no-undef */
const { unlink, existsSync } = require('fs')
const path = require('path')

const { describe, it, expect } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)

const asciidoctor = require('@asciidoctor/core')()
const asciidoctorTreeView = require('../lib/index.js')

const example3Result = 'README.adoc'

describe('Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create()

    expect(registry.getGroups()).toStrictEqual({})
    asciidoctorTreeView.register(registry)
    expect(registry.getGroups()).toHaveProperty('treeview')
  })
})

describe('Conversion', () => {
  describe('When extension is not registered', () => {
    it('should not convert the treeview', () => {
      const source = `.Test
[treeview]
----
README.adoc
----`

      const html = asciidoctor.convert(source)
      // console.log(html)
      expect(html).toContain(example3Result)
    })
  })

  describe('When is registered', () => {
    it('should convert README.adoc 1', () => {
      const source = `.Test
[treeview]
----
README.adoc
----`

      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)
      const html = asciidoctor.convert(source, { extension_registry: registry })

      expect(html).toInclude('<span class="tv-line-element"><img src="https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/asciidoc.svg" alt="asciidoc.svg"><span class="tv-item-name">README.adoc</span></span>')
    })

    it('should convert bigger structure 1', () => {
      const source = `.Test
[treeview]
----
.
├── .vscode
├── docs
├── gulp.d
├── preview-src
├── src
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .gitlab-ci.yml
├── .gulp.json
├── .nvmrc
├── .stylelintrc
├── gulpfile.js
├── index.js
├── LICENSE
├── package-lock.json
├── package.json
└── README.ad
----
`

      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)
      const html = asciidoctor.convert(source, { extension_registry: registry })
      // console.log(html)

    // expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f604.svg" alt="smile" width="24px" height="24px"></span>')
    })

    it('should convert bigger structure 2', () => {
      const source = `.Test
[treeview,asciitree]
----
.
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
├── dist
│   ├── css
│   │   ├── treeview-default.css
│   │   └── treeview-min.css
│   ├── data
│   │   ├── config
│   │   │   ├── default.json
│   │   │   ├── full.json
│   │   │   └── minimal.json
│   │   └── templates
│   │       ├── treeview.css.hbs
│   │       └── treeview.js.hbs
│   ├── js
│   │   ├── treeview-default.js
│   │   └── treeview-min.js
│   └── lib
│       ├── css-generator.js
│       ├── generator.js
│       └── rules-generator.js
├── lib
│   ├── css-generator.js
│   ├── rules-generator.js
│   └── treeview-assets-generator.js
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .npmignore
├── .stylelintrc
├── LICENSE
├── package.json
└── rollup.config.js
----
`

      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)
      const html = asciidoctor.convert(source, { extension_registry: registry })

    // expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f604.svg" alt="smile" width="24px" height="24px"></span>')
    })

    it('should convert to folder if a / is used at the end', () => {
      const source = `[treeview]
├── converter/
└── converter
`

      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)
      const html = asciidoctor.convert(source, { extension_registry: registry })
      // console.log(html)

      expect(html).toInclude('<span class="tv-line-element"><img src="https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/folder-open.svg" alt="folder-open.svg"><span class="tv-item-name">converter/</span></span>')
      expect(html).toInclude('<span class="tv-line-element"><img src="https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/file.svg" alt="file.svg"><span class="tv-item-name">converter</span></span>')
    // expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f604.svg" alt="smile" width="24px" height="24px"></span>')
    })

    it('should render full page', async () => {
      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)

      const input = path.join(__dirname, 'inputs/index.adoc')
      const output = path.join(__dirname, 'inputs/index.html')

      asciidoctor.convertFile(input, { to_file: false, extension_registry: registry, standalone: true, safe: 'safe', attributes: { linkcss: false } })
    })

    it('render custom symbol', async () => {
      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)

      const source = `
.Uses Symbol #
[treeview,symbol="-"]
----
root1
- .vscode
-- extensions.json
--  settings.json
- data
--  config
--- default.json
--- full.json
--- minimal.json
-- templates
--- treeview.css.hbs
--- treeview.js.hbs
- .editorconfig
- .eslintrc
- .gitignore
- .npmignore
- .stylelintrc
- LICENSE
- package.json
- test.hcl
----`

      const html = asciidoctor.convert(source, { extension_registry: registry })
    })

    it('should not render icon in empty line', async () => {
      const registry = asciidoctor.Extensions.create()
      asciidoctorTreeView.register(registry)

      const source = `
.Uses Symbol #
[treeview,symbol="-"]
----

----`

      const html = asciidoctor.convert(source, { extension_registry: registry })
      expect(html).not.toInclude('<span class="tv-line-element"><img src="https://cdn.jsdelivr.net/npm/material-icon-theme@4.32.0/icons/file.svg" alt="file.svg"><span class="tv-item-name"></span></span>')
    })
  })
})
