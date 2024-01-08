class TreeLine {
  constructor (name = '', root = false) {
    this.name = name
    this.children = []
    this.root = false
  }

  addChild (child) {
    this.children.push(child)
  }

  addChildren (children = []) {
    // for each
    children.forEach((child) => {
      this.addChild(child)
    })
  }

  hasChildren () {
    return this.children.length > 0
  }

  isRoot () {
    return this.root
  }

  setRoot (root) {
    this.root = root
  }

  static create (name, children = []) {
    const node = new TreeLine(name)
    node.addChildren(children)
    return node
  }

  static createRoot (children = []) {
    return TreeLine.create('', children)
  }

  static createRootElement (name, children = []) {
    const node = TreeLine.create(name, children)
    node.setRoot(true)
    return node
  }
}

module.exports = TreeLine
