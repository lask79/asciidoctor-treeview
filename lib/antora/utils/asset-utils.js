const LazyReadable = require('./lazy-readable')
const fs = require('fs')
const path = require('path')

const ASSET_TYPE = 'asset'
const PARTIAL_TYPE = 'partial'
const DATA_DIR = path.join(__dirname, '../../../data')

function handleFile (
  type,
  packageName,
  uiCatalog,
  logger,
  uiOutputDir,
  assetDir,
  basename,
  createContents,
  overwrite
) {
  const assetPath = path.join(assetDir, basename)
  const outputDir = path.join(uiOutputDir, assetDir)
  const existingFiles = uiCatalog.findByType(type)
  const existingFile = existingFiles.find((file) => file.path === assetPath)

  if (existingFile) {
    if (overwrite) {
      logger.warn(` > Please remove the following file from your UI since it is managed by ${packageName}: ${assetPath}`)
      existingFile.contents = createContents(assetPath)
      delete existingFile.stat
    } else {
      logger.warn(' > The following file already exists in your UI => skipping ...')

      const isUIBundle = !existingFile._cwd.endsWith('/supplemental-ui')

      logger.info(`   > ${assetPath} from ${existingFile._cwd} ${isUIBundle ? '(UI Bundle)' : ''}`)
    }
  } else {
    const fileDetails = {
      contents: createContents(assetPath),
      type: type,
      path: assetPath,
      out: { dirname: outputDir, path: path.join(outputDir, basename), basename },
    }

    if (type === PARTIAL_TYPE) {
      fileDetails.stem = basename.replace('.hbs', '')
    }

    logger.info(` > Copying ${assetPath} to ${outputDir}`)
    uiCatalog.addFile(fileDetails)
  }
}

function assetFile (packageName, uiCatalog, logger, uiOutputDir, assetDir, basename, overwrite = false) {
  handleFile(
    ASSET_TYPE,
    packageName,
    uiCatalog,
    logger,
    uiOutputDir,
    assetDir,
    basename,
    (assetPath) => new LazyReadable(() => fs.createReadStream(path.join(DATA_DIR, assetPath))),
    overwrite
  )
}

function partialFile (packageName, uiCatalog, logger, uiOutputDir, assetDir, basename, overwrite = false) {
  handleFile(
    PARTIAL_TYPE,
    packageName,
    uiCatalog,
    logger,
    uiOutputDir,
    assetDir,
    basename,
    (assetPath) => Buffer.from(fs.readFileSync(path.join(DATA_DIR, assetPath))),
    overwrite
  )
}

function getPartialFileContent (packageName, uiCatalog, logger, uiOutputDir, assetDir, basename) {
  const assetPath = path.join(assetDir, basename)
  const existingFiles = uiCatalog.findByType(PARTIAL_TYPE)
  const existingFile = existingFiles.find((file) => file.path === assetPath)

  return existingFile.contents.toString()
}

module.exports = { assetFile, partialFile, getPartialFileContent }
