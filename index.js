import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);

document.addEventListener('input', derive)

//TODO: move derive into ifelse or something so they can orchestrate running order correctly. So all derivations get run first and only after that the if else thingies get run.
function derive({target: {form: {elements: $}}}) {
  // console.log($.check)
  $.combined.value = parseInt($.first.value) + parseInt($.second.value)
  $.outputtest.value = $.combined.value
  $.expressiontest.value = parseInt($.number.value) * 3 === 30
}

//This should rather make an object proxy with setters and getters so you can get and set form.combined = value and so on. Saves typing .value after every getter and setter so not really any kind of magical byte saver. Just slightly nicer though. Could offer some niceties like parsing number inputs with parseFloat?
// function form (formElement) {
//   return {
//     (name, value) => value ? (formElement.elements[name].value = value) : formElement.elements[name].value
//   }
// }
// const f = form(document.forms[0])
// function derive2({target: {form: {elements: $}}}) {
//   f('combined', parseInt(f('first')) + parseInt(f('second'))
//   f('outputtest', f('combined'))
//   f('expressiontest', parseInt(f('number')) * 3 === 30)
// }