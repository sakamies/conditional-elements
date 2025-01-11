//TODO: Maybe use throttle for ifs instead of debounce? Max 30fps ok? This isn't heavy at all and even less so if the form property would be cached. I don't want this to be synchronous because I might want to modify some hidden inputs in response to an input event and have this if element react to those hidden inputs.

//Debouce won't help if some form elements value is modified in a delayd async way, like based on a fetch request. When populating the value into the input, it would need to fire an input or change event.

//A mutationobserver would handle any case of a form being modified, but that's just so heavy handed. I think I only want this to react to user input. You can re-evaluate a form manually by sending an input or change event manually.

export class If extends HTMLElement {
  static observedAttributes = ['form', 'name', 'value', 'not']
  static debounceDelay = 33.333

  state = false
  get form() {
    //This could cache the form node on any form attribute change, connectedCallback or adoptedCallback if we don't want to query the dom on every event.
    return document.forms[this.getAttribute('form')]
    || this.closest('form')
    || console.warn('No form found for', this)
  }
  get name() {return this.getAttribute('name')}
  get value() {return this.getAttribute('value')}
  get not() {return this.getAttribute('not') !== null}
  get data() {return new FormData(this.form)}

  constructor() {
    super()
    this.evaluateDebounced = debounce(this.evaluate.bind(this), If.debounceDelay)
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent(e) {
    const form = this.form
    if (e.target.form === form || e.target === form) {
      this.evaluateDebounced()
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //This may run while the dom is parsing and form is not ready yet. Like if you have an if element at the top of your page and your form is at the bottom. This might cause the element to console.warn about missing form if the dom is super large and takes a long time to load. Debounce should take care for most cases so this doesn't happen, and evaluate will run once on domready, so even if the form is missing while loading a huge dom, the if will end up in its correct state.
    this.evaluateDebounced()
  }

  connectedCallback() {
    this.listen()
    this.evaluateDebounced()
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", this.evaluateDebounced)
    }
  }
  disconnectedCallback() {this.unlisten()}
  adoptedCallback() {this.relisten()}

  #listening
  listen() {
    //Maybe there should be an attribute to define if this runs on every input or only on change?
    !this.#listening && document.addEventListener('input', this.handleEvent)
    !this.#listening && document.addEventListener('change', this.handleEvent)
    !this.#listening && document.addEventListener('reset', this.handleEvent)
    this.#listening = true
  }
  unlisten() {
    document.removeEventListener('input', this.handleEvent)
    document.removeEventListener('change', this.handleEvent)
    document.removeEventListener('reset', this.handleEvent)
    this.#listening = false
  }
  relisten() {
    this.unlisten()
    this.listen()
  }

  evaluateDebounced

  evaluate() {
    if (!this.form) return

    const {name, value, data} = this
    const state = this.evaluateCondition(name, value, data, this.not)

    this.state = state
    this.hidden = !state

    if (this.constructor.name === 'If') {
      this.evaluateElse()
    }
    if (this.constructor.name === 'Or') {
      this.evaluateOr()
    }

    return state
  }

  evaluateOr() {
    let parents = []
    let parent = this.parentElement

    while (parent.constructor.name === 'If' || parent.constructor.name === 'Or') {
      parents.push(parent)
      if (parent.constructor.name === 'If') {
        break
      }
      parent = parent.parentElement
    }
    if (parents.some(p => p.state === true)) {
      this.hidden = false
    }
    if (this.state === true) {
      parents.map(p => p.hidden = false)
    }

    const parentIf = parents[parents.length - 1]
    if (parentIf?.constructor.name === 'If') {
      parentIf.evaluateElse()
    } else {
      console.warn(this, 'must be nested inside an element that is an instance of', If)
    }

    return !this.hidden
  }

  evaluateElse() {
    const elseElement = this.nextElementSibling
    if (elseElement?.constructor.name === 'Else') {
      elseElement.hidden = !this.hidden
    }
  }

  evaluateCondition(name, value, data, negate) {
    const hasName = name !== null && name !== undefined
    const hasValue = value !== null && value !== undefined
    let state

    if (!hasName && !hasValue) {
      state = false
    }
    else if (hasName && !hasValue) {
      state = data.has(name)
    }
    else if (!hasName && hasValue) {
      state = Array.from(data.values()).includes(value)
    }
    else {
      state = this.data.getAll(name).includes(value)
    }
    if (negate){
      state = !state
    }

    return state
  }
}

export class Or extends If {
  constructor() {super()}
}

export class Else extends HTMLElement {
  constructor() {super()}
}

function debounce (fn, delay) {
  let id;
  return function (...args) {
    if (id) clearTimeout(id)
    id = setTimeout(() => fn(...args), delay)
  }
}