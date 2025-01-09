/*TODO:
- This needs a way to do or and not conditions on the if elements. Ands can be done via two nested ifs. Ors could be done sibling if elements, but that would mean duplicating content. Else works as not, but again with sibling or elements would need duplicate content.
Fun idea: <if- number="10">Value is 10</if-> Like what if the name, value pair is just attribute name and its value. So number="10" would match input <name="number" value="10">. This would introduce either reserved attribute names or
- This is crazy, linters will yell at you, but again fun! <if- for="number" not "value1" "value2"></if->
*/

//TODO: sama event listener dokumentille homma tähän kun filter.js komponentissa, et ei oo väliä onko domia tai formia tai mitään olemassa kun tän instanssi tehään.

export class If extends HTMLElement {
  //TODO: `name` attribute could refer to formData name and `for´ attribute could refer to a specific input element, just like <label for=""> does? That then would need a check so the code would use formData.get() with `for` attribute and getAll() with `name` attribute
  static observedAttributes = ['form', 'name', 'value', 'not']
  static debounceDelay = 33.333 //Maybe use throttle for ifs instead of debounce? Max 30fps ok? This isn't heavy at all and even less so if the form property was cached. I don't want this to be synchronous because I might want to modify some hidden inputs in response to an input event and have this if react to those hidden inputs too.

  get form() {
    return document.forms[this.getAttribute('form')]
    || this.closest('form')
    || console.warn('No form found for', this)
  }
  get name() {return this.getAttribute('name')}
  get value() {return this.getAttribute('value')}

  constructor() {
    super()
    this.evaluate = debounce(this.evaluate.bind(this), If.debounceDelay)
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent(e) {
    if (e.target.form === this.form) this.evaluate()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.evaluate()
  }

  connectedCallback() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded",
        this.connectedCallback.bind(this),
        {once: true}
      )
      return
    }
    this.listen()
    this.evaluate()
  }
  disconnectedCallback() {
    this.unlisten()
  }
  adoptedCallback() {
    this.relisten()
  }

  #listening
  listen() {
    !this.#listening && document.addEventListener('input', this.handleEvent)
    !this.#listening && document.addEventListener('change', this.handleEvent)
    this.#listening = true
  }
  unlisten() {
    document.removeEventListener('input', this.handleEvent)
    document.removeEventListener('change', this.handleEvent)
    this.#listening = false
  }
  relisten() {
    this.unlisten()
    this.listen()
  }

  evaluate() {
    if (!this.form) return
    const data = new FormData(this.form)
    // Using formData semantics for value check, so works fine with multiple inputs of the same name, like is often the case with lists of checkboxes, but using this requires that you understand how forms work.
    let isTrue = data.getAll(this.name).includes(this.value)
    if (this.getAttribute('not') !== null) {
      isTrue = !isTrue
    }
    this.hidden = !isTrue

    const elseElement = this.nextElementSibling
    if (elseElement && elseElement instanceof Else) {
      elseElement.hidden = isTrue
    }

    return isTrue
  }
}

export class Else extends HTMLElement {
  constructor() {
    super()
  }
}

function debounce (fn, delay) {
  let id;
  return function (...args) {
    if (id) clearTimeout(id)
    id = setTimeout(() => fn(...args), delay)
  }
}