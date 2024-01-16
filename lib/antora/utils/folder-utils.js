const fs = require('fs')

function createFolder (folderPath, logger) {
  if (!fs.existsSync(folderPath)) {
    logger.debug('  > Create folder: ' + folderPath)
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

module.exports = { createFolder }
