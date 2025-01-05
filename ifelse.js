export class If extends HTMLElement {

  //Not really needed, but a nice reminder of all the attributes this element officially accepts.
  static observedAttributes = ['form', 'for', 'value']

  get form() {
    return document.forms[this.getAttribute('form')]
    || this.closest('form')
    || console.warn('No form found for', this)
  }
  get for() {return this.getAttribute('for')}
  get value() {return this.getAttribute('value')}

  constructor() {
    super()

    // Let's make this async, so any value manipulations on the form and stuff have been run before this gets evaluated.
    // TODO: probably use requestAnimationFrame instead and let browser decide the debounce threshold.
    this.evaluateDebounced = debounce(this.evaluate.bind(this), 16)
    this.form && this.form.addEventListener('input', this.evaluateDebounced)
    this.evaluateDebounced()
  }

  evaluateDebounced
  evaluate() {
    // console.log(this.for, this.for.value, this.value, )
    //TODO: how to handle checkboxes? Maybe this should check against FormData instead?
    const data = new FormData(this.form)
    console.log(this.for, data.get(this.for), this.value)
    const isTrue = data.get(this.for) === this.value
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