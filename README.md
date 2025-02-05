# If, Or & Else custom elements

Define your elements. Name them whatever you like. I like them short.

```js
import { If, Or, Else } from './ifelse.js'
customElements.define("if-", If);
customElements.define("or-", Or);
customElements.define("else-", Else);
```

Show/hide stuff based on input element values.

```html
<form>
  <input id="animal" name="animal">
  <label for="animal">What's your favourite animal?</label>
  <p>
    <if- name="animal" value="Giraffe" hidden>No way, mine too!</if->
    <else- hidden>What a lovely animal!</else->
  </p>
</form>
```

- Name attribute checks if FormData includes an entry with that name.
- Value attribute checks if FormData includes that value
- Name + value check if FormData includes that value for that name.
- Reacts to user input & change events. Send an event manually if you need to re-evaluate the ifs in response to something other than user input.
- If you need more complex conditions, run your condition expression in javascript and set the expression result as a value on a hidden input.

Check more complete example usage in `index.html` & `index.js`.
