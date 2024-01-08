'use strict'

module.exports = (fn) => Object.defineProperty(fn, '$$arity', { value: fn.length })
