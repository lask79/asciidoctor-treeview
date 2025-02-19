'use strict'

// const path = require('path')
// const { name: packageName } = require('../../package.json')
// const { assetCacheFile, partialFile, copyAssetFiles } = require('./utils/asset-utils')
// const { createFolder } = require('./utils/folder-utils')
// const validateConfig = require('./utils/validate-config')
const { getInstance: getIconRegistry } = require('../icons/icon-registry')
const CSSGenerator = require('../css/css-generator')

// const DATA_DIR = path.join(__dirname, '../../data')

function register (context, { playbook, config }) {
  const iconRegistry = getIconRegistry()
  const cssGenerator = new CSSGenerator()
  
  return require('./extension')(context, { playbook, config }, iconRegistry, cssGenerator)
}

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
  const { logger, cssGenerator, uiCatalog, uiOutputDir } = extensionContext
  logger.info(' > Generating treeview.css ...')
  const css = cssGenerator.generate()
  assetCacheFile(packageName, uiCatalog, logger, uiOutputDir, 'css', 'treeview.css', extensionContext.cacheDir, true)
}

function copyTreeViewIcons (extensionContext) {
  const { logger, iconRegistry, uiCatalog, uiOutputDir } = extensionContext
  
  // Get icon files from registry
  const iconFiles = iconRegistry.getIconFiles()
  for (const iconFile of iconFiles) {
    logger.info(` > Copying ${iconFile.source} to ${iconFile.target}`)
    copyAssetFiles(packageName, uiCatalog, logger, uiOutputDir, path.dirname(iconFile.target), DATA_DIR, [path.basename(iconFile.source)])
  }
}

function copyTreeViewStyleHbs (extensionContext) {
  const { logger, uiCatalog, uiOutputDir } = extensionContext
  logger.info(' > Copying partials/treeview-styles.hbs to _/partials')
  partialFile(packageName, uiCatalog, logger, uiOutputDir, 'partials', 'treeview-styles.hbs')
}

module.exports = { register }
