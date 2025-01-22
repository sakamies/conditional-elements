import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);

const form = document.forms[0]
form.addEventListener('input', () => {
  form.elements.combined.value = parseInt(form.elements.first.value) + parseInt(form.elements.second.value)
  form.elements.outputtest.value = form.elements.combined.value
  form.elements.expressiontest.value = parseInt(form.elements.number.value) * 3 === 30
})