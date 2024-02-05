'use strict'

const ospath = require('path')
const fs = require('fs')
const { name: packageName } = require('../../package.json')
const { assetCacheFile, partialFile, copyAssetFiles } = require('./utils/asset-utils')
const { createFolder } = require('./utils/folder-utils')
const validateConfig = require('./utils/validate-config')

module.exports = function (context, { playbook, config }, iconRegistry, cssGenerator) {
  const logger = context.getLogger(packageName)
  const validatedConfig = validateConfig(config, packageName, logger)

  logger.info('Start extension')
  logger.info(' > Register asciidoctor-treeview as asciidoc extension')
  playbook.asciidoc.extensions.push('asciidoctor-treeview')

  context.on('documentsConverted', async ({ playbook, uiCatalog }) => {
    logger.info('Handle UICatalog files ...')

    const extensionContext = {
      logger,
      config: validatedConfig,
    }

    const { uiOutputDir, cacheDir = './.cache/antora' } = getDirectories(playbook)
    extensionContext.playbook = playbook
    extensionContext.uiCatalog = uiCatalog
    extensionContext.uiOutputDir = uiOutputDir
    extensionContext.cacheDir = cacheDir
    extensionContext.extensionCacheDir = ospath.join(cacheDir, '..', packageName)
    extensionContext.iconRegistry = iconRegistry
    extensionContext.cssGenerator = cssGenerator

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
    copyTreeViewIcons(extensionContext)
    copyTreeViewStyleHbs(extensionContext)
  }

  function copyTreeViewStyleCss (extensionContext) {
    const { uiCatalog, uiOutputDir, cacheDir, logger, iconRegistry, cssGenerator, config } = extensionContext
    const basename = 'treeview.css'
    const cssDir = 'css'

    createFolder(ospath.join(cacheDir, cssDir), logger)

    logger.info(' > Generating treeview.css ...')
    const cssContent = cssGenerator.generateCss(iconRegistry, config.iconSource)
    const cssPath = ospath.resolve(cacheDir, cssDir, basename)
    fs.writeFileSync(cssPath, cssContent)

    assetCacheFile(packageName, uiCatalog, logger, uiOutputDir, cssDir, basename, cacheDir)
  }

  function copyTreeViewIcons (extensionContext) {
    const { uiCatalog, uiOutputDir, cacheDir, logger, iconRegistry, config } = extensionContext

    if (config.iconSource !== 'antora') return

    const assetDir = 'img/treeview'
    const materialIconsModule = require.resolve('material-icon-theme/icons/file.svg')
    const sourceDir = ospath.dirname(materialIconsModule)

    copyAssetFiles(packageName, uiCatalog, logger, uiOutputDir, assetDir, sourceDir, iconRegistry.getIconValues())
  }

  function copyTreeViewStyleHbs (extensionContext) {
    const { uiCatalog, uiOutputDir, logger } = extensionContext

    const basename = 'treeview-styles.hbs'
    const assetDir = 'partials'

    partialFile(packageName, uiCatalog, logger, uiOutputDir, assetDir, basename)
  }
}
