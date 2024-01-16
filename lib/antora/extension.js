'use strict'

const ospath = require('path')
const { name: packageName } = require('../../package.json')
const { assetFile, partialFile } = require('./utils/asset-utils')

module.exports = function (context, { playbook, config }) {
  const logger = context.getLogger(packageName)

  logger.info('Start extension')
  logger.info(' > Register asciidoctor-treeview as asciidoc extension')
  playbook.asciidoc.extensions.push('asciidoctor-treeview')

  context.on('uiLoaded', async ({ playbook, uiCatalog }) => {
    logger.info('Handle UICatalog files ...')

    const extensionContext = {
      logger,
    }

    const { uiOutputDir, cacheDir = './.cache/antora' } = getDirectories(playbook)
    extensionContext.playbook = playbook
    extensionContext.uiCatalog = uiCatalog
    extensionContext.uiOutputDir = uiOutputDir
    extensionContext.cacheDir = cacheDir
    extensionContext.extensionCacheDir = ospath.join(cacheDir, '..', packageName)

    await processAssets(extensionContext)
  })

  function getDirectories (playbook) {
    return {
      uiOutputDir: playbook.ui.outputDir,
      cacheDir: playbook.runtime.cacheDir,
    }
  }

  async function processAssets (extensionContext) {
    copyTreeViewStyleCss(extensionContext)
    copyTreeViewStyleHbs(extensionContext)
  }

  function copyTreeViewStyleCss (extensionContext) {
    const { uiCatalog, uiOutputDir, logger } = extensionContext

    const basename = 'treeview.css'
    const cssDir = 'css'
    assetFile(packageName, uiCatalog, logger, uiOutputDir, cssDir, basename)
  }

  function copyTreeViewStyleHbs (extensionContext) {
    const { uiCatalog, uiOutputDir, logger } = extensionContext

    const basename = 'treeview-styles.hbs'
    const assetDir = 'partials'

    partialFile(packageName, uiCatalog, logger, uiOutputDir, assetDir, basename)
  }
}
