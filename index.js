
//Let's meme!

import { Meme } from './memelib.js'
const {ids, classes, forms} = new Meme(document)

console.log('ids', ids.test)
console.log('classes', classes.test)
console.log('forms', forms.examples)

//if I gfigure out a use for apply proxy, there can be ids('stuff') that does something
ids.test = 'Test text'
delete ids.test



//
//
//Actual stuff below
//
//

import { Form } from './forms.js'
import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);

//Configure class if you want to use a custom event, or send an event after every value change
//Form.event = new CustomEvent(...)
//Form.atomicEvents = true
const form = document.forms[0]
const {values, batch} = new Form(form)

//This will run in response to user input and the ifs react async after input events, so they will have these fresh values when they are evaluated.
form.addEventListener('input', () => {
  values.combined = parseInt(values.first) + parseInt(values.second)
  values.outputtest = values.combined
  values.expressiontest = parseInt(values.number) * 3 === 30
})

//Batch allows you to modify mutliple values and sends a change event on form only after running.
batch(values => {
  values.number = 20
  values.expressiontest = parseInt(values.number) * 3 === 30
})