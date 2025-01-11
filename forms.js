export class Form {
  static event = new Event('change', {bubbles: true})
  static atomicEvents = false

  constructor(form) {
    this.form = form
    this.values = new Proxy(this.form, this.handler)
  }

  handler = {
    get(form, name) {
      //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
      return form.elements[name].value
    },
    set(form, name, value) {
      //TODO: support checkboxes, maybe by passing an array of truthy / falsy values? Null or undefined array items could mean that don't modify this one.
      //Like values.check = [true, undefined, false]
      if (form.elements[name]) {
        form.elements[name].value = value
        if (this.atomicEvents) form.elements[name].dispatchEvent(Form.event)
        return true
      }
      else {
        return false
      }
    }
  }

  //Arrow function so `this` is correct regardless of where or how it's called outside the class.
  batch = (callback) => {
    callback(this.values)
    this.form.dispatchEvent(Form.event)
  }
}