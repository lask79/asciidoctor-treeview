const defaultIconSource = 'antora' // jsdelivr, embedded

function validateConfig (config, packageName, logger) {
  const { iconSource = defaultIconSource, ...unknownOptions } = config

  if (Object.keys(unknownOptions).length) {
    throw new Error(`Unrecognized options specified for ${packageName}: ${Object.keys(unknownOptions).join(', ')}`)
  }

  if (![defaultIconSource, 'jsdelivr', 'embedded'].includes(iconSource)) {
    throw new Error(`Invalid icon path specified for ${packageName}: ${iconSource}`)
  }

  const validatedConfig = { iconSource }

  logger.info(`Registering ${packageName} with config`)
  logger.info(` > Icon Path: ${validatedConfig.iconPath}`)

  return validatedConfig
}

module.exports = validateConfig
