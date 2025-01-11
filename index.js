import { useForm } from './forms.js'
import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);

const form = document.forms[0]
const [values, dispatchChanges] = useForm(form)
values.number = 20
values.expressiontest = parseInt(values.number) * 3 === 30
dispatchChanges()

function derive() {
  values.combined = parseInt(values.first) + parseInt(values.second)
  values.outputtest = values.combined
  values.expressiontest = parseInt(values.number) * 3 === 30
}

document.addEventListener('input', derive)

/*
TODO: much nices and more encapsulated
const [_, batch] = useForm(form)
batch((values) => {

})
*/