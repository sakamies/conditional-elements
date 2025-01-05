import { If, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("else-", Else);

const form = document.forms['giftifier']
form.addEventListener('input', (e) => derive(e.target.form.elements))

//TODO: move device into ifelse or something so they can orchestrate running order correctly. So all derivations get run first and only after that the if else thingies get run.
function derive($) {
  // console.log($.check)
  $.combined.value = $.first.value + $.second.value
  $.outputtest.value = $.combined.value
  $.expressiontest.value = parseInt($.number.value) * 3 === 30
}
derive(document.forms[0].elements)