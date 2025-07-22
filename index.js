import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If)
customElements.define("or-", Or)
customElements.define("else-", Else)

const form = document.forms[0]
form.addEventListener('input', () => {
  // The if evaluation is debounced, so any synchronous modifications to values are safe to do in event listeners, they will be evaluated.
  // If you set values async, send a change event manually to have the elements re-evaluate.
  form.elements.combined.value = parseInt(form.elements.first.value) + parseInt(form.elements.second.value)
  form.elements.outputtest.value = form.elements.combined.value
  form.elements.expressiontest.value = parseInt(form.elements.number.value) * 3 === 30
})