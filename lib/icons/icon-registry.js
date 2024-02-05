class IconRegistry {
  constructor () {
    this.icons = {}
  }

  addIcon (baseName, iconName) {
    this.icons[baseName] = iconName
  }

  getIcon (baseName) {
    return this.icons[baseName]
  }

  getIconKeys () {
    return Object.keys(this.icons)
  }

  getIconValues () {
    return Object.values(this.icons)
  }

  toString () {
    return JSON.stringify(this.icons)
  }
}

module.exports = IconRegistry
