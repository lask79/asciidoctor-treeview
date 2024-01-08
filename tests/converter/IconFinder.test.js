const { describe, it, expect, beforeEach } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)

const { getIconForFile, getIconForFolder, getIconForOpenFolder } = require('../../lib/converter/IconFinder')
describe('IconFinder', () => {
  describe('getIconForFile', () => {
    it('throws error when empty string is passed', () => {
      expect(() => getIconForFile.getIconForFile('')).toThrow(Error)
    })

    it('returns json icon for settings.json', () => {
      expect(getIconForFile('setting.json')).toBe('json.svg')
    })

    it('returns certificate icon for LICENSE', () => {
      expect(getIconForFile('LICENSE')).toBe('certificate.svg')
    })
  })

  describe('getIconForFolder', () => {
    it('throws error when empty string is passed', () => {
      expect(() => getIconForFolder('')).toThrow(Error)
    })

    it('returns folder icon for node_modules', () => {
      expect(getIconForFolder('node_modules')).toBe('folder-node.svg')
    })
  })
})
