
// TODO: How to do or? Ands can be done via two nested ifs. Ors could be done sibling if elements, but that would mean duplicating content.

export class If extends HTMLElement {
  //TODO: `name` attribute could refer to formData name and `for´ attribute could refer to a specific input element, just like <label for=""> does? That then would need a check so the code would use formData.get() with `for` attribute and getAll() with `name` attribute
  static observedAttributes = ['form', 'name', 'value', 'not']
  static debounceDelay = 33.333 //Maybe use throttle for ifs instead of debounce? Max 30fps ok? This isn't heavy at all and even less so if the form property was cached. I don't want this to be synchronous because I might want to modify some hidden inputs in response to an input event and have this if react to those hidden inputs too.
  //Debouce won't help if some form elements value is modified in a delayd async way, like based on a fetch request. When populating the value into the input, it would need to fire an input or change event.
  //A mutationobserver would handle any case of a form being modified, but that's just so heavy handed.

  state = false
  get form() {
    //This could cache the form node on any form attribute change and on connectedCallback if we don't want to query the dom on every event.
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
    this.evaluateDebounced = debounce(this.evaluateIf.bind(this), If.debounceDelay)
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent(e) {
    if (e.target.form === this.form) this.evaluateDebounced()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //This may run while the dom is parsing and form is not ready yet. Like if you have an if element at the top of your page and your form is at the bottom. This might cause the element to console.warn about missing form if the dom is super large and takes a long time to load. Debounce should take care for most cases so this doesn't happen, and evaluate will run once on domready, so even if the form is missing while loading a huge dom, the if will end up in its correct state.
    this.evaluateDebounced()
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
    this.evaluateDebounced()
  }
  disconnectedCallback() {this.unlisten()}
  adoptedCallback() {this.relisten()}

  #listening
  listen() {
    //Maybe there should be an attribute to define if this runs on every input or only on change?
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

  evaluateDebounced
  evaluateIf() {
    if (!this.form) return
    const {name, value, data} = this

    const hasName = name !== null
    const hasValue = value !== null
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

    if (this.not) state = !state
    this.state = state
    this.hidden = !state
    this.evaluateElse(state)

    return state
  }

  evaluateElse(state) {
    const elseElement = this.nextElementSibling
    if (elseElement && elseElement instanceof Else) {
      elseElement.hidden = state
    }
    return !state
  }
}

export class Or extends If {
  constructor() {
    super()
    this.evaluateDebounced = debounce(this.evaluateOr.bind(this), If.debounceDelay)
  }
  evaluateOr() {
    //TODO: Is there a guarantee that the or gets run only after if? I dunno
    const parent = this.parentElement
    if (parent.constructor.name === 'If') {
      if (parent.state === true) {
        this.hidden = false
      } else {
        parent.hidden = false
        const isTrue = this.evaluateIf()
        parent.evaluateElse(isTrue)
      }
    }
  }
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