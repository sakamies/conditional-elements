# If, Or & Else custom elements

Show/hide stuff based on input element values.

Works inside forms, but you can also put these outside forms and use the [form attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form), just like you would on input elements.

Uses FormData to evaluate the conditions, so works with any type of input elements and any custom elements that participate in forms.

Grab ifelse.js into your project. Define your elements. Name them whatever you like. I like them short.

```js
import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);
```

```html
<form>
  <label for="animal">What's your favourite animal?</label>
  <input id="animal" name="animal">
  <p>
    <if- name="animal" value="Giraffe" hidden>No way, mine too!</if->
  </p>
</form>
```

- Name attribute checks if FormData includes an entry with that name.
- Value attribute checks if FormData includes that value
- Name + value check if FormData includes that value for that name.
- Reacts to user input & change events. Send a change event manually if you need to re-evaluate the ifs in response to something other than user input.
- If you need more complex conditions, run your condition expression in javascript and set the expression result as a value on a hidden input.

Check more complete example usage in `index.html` & `index.js`. (https://sakamies.github.io/conditionals-customelement/)

This element is not on NPM, but feel free to learn from this, fork the code and make a package. Just give credit. I don't expect the API of this element to ever change, but I'm not sure I want to be a package maintainer.