export class Meme {
  constructor(root) {
    this.root = root || document

    this.ids = new Proxy({}, {
      get: this.idsGet,
      has: this.idsHas,
      set: this.idsSet,
      deleteProperty: this.idsDelete,
    })

    this.classes = new Proxy({}, {
      get: this.classesGet,
      has: this.classesHas,
    })

    this.forms = new Proxy({}, {
      has: this.formsHas,
      get: this.formsGet,
      set: this.formsSet,
    })
  }

  // Arrow functions so this always means the instance of Meme class
  idsGet = (_, name) => {
    return this.root.getElementById(name)
  }

  idsHas = (_, name) => {
    return !!this.root.getElementById(name)
  }

  idsSet = (_, name, value) => {
    //set element textContent or innerHTML? some way to set either or?
    //html("string") to set some prop like `.html_safe = true` to mark string as pure html
    //Then check if string has html_safe to set innerHTML or otherwise set textContent
    const node = this.root.getElementById(name)
    if (node) {
      node.textContent = value
    }
    return true //May throw if false
  }

  idsDelete = (_, name) => {
    //Wheeee `delete ids.test` just removes that node, fun!
    const node = this.root.getElementById(name)
    if (node) {
      this.root.getElementById(name).remove()
    }
    return true
  }

  classesHas = (_, name) => {
    return this.classesGet(_, name).length !== 0
  }

  classesGet = (_, name) => {
    return Array.from(this.root.getElementsByClassName(name))
  }

  formsHas = (_, name) => {
    return !!this.formsGet(name)
  }

  formsGet = (_, name) => {
    return this.root.forms[name]
  }

  formsSet = (_, name, data) => {
    //TODO: set form entries with given data somehow?)
  }
}