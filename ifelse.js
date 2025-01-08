/*TODO:
- This needs a way to do or and not conditions on the if elements. Ands can be done via two nested ifs. Ors could be done sibling if elements, but that would mean duplicating content. Else works as not, but again with sibling or elements would need duplicate content.
Fun idea: <if- number="10">Value is 10</if-> Like what if the name, value pair is just attribute name and its value. So number="10" would match input <name="number" value="10">. This would introduce either reserved attribute names or
- This is crazy, linters will yell at you, but again fun! <if- for="number" not "value1" "value2"></if->
*/

//TODO: sama event listener dokumentille homma tähän kun filter.js komponentissa, et ei oo väliä onko domia tai formia tai mitään olemassa kun tän instanssi tehään.

export class If extends HTMLElement {
  //TODO: `name` attribute could refer to formData name and `for´ attribute could refer to a specific input element, just like <label for=""> does? That then would need a check so the code would use formData.get() with `for` attribute and getAll() with `name` attribute
  static observedAttributes = ['form', 'name', 'value', 'not']

  get form() {
    return document.forms[this.getAttribute('form')]
    || this.closest('form')
    || console.warn('No form found for', this)
  }
  get name() {return this.getAttribute('name')}
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