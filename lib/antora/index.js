'use strict'

const { getInstance: getIconRegistry } = require('../icons/icon-registry')
const CSSGenerator = require('../css/css-generator')


function register (context, { playbook, config }) {
  const iconRegistry = getIconRegistry()
  const cssGenerator = new CSSGenerator()
  
  return require('./extension')(context, { playbook, config }, iconRegistry, cssGenerator)
}

module.exports = { register }
