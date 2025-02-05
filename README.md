# If, Or & Else custom elements

Show/hide stuff based on input element values.

Works inside forms, but you can also put these outside forms and use the [form attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form), just like you would on input elements.

Uses [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to evaluate the conditions, so works with any type of input elements (includin hidden inputs) and should work for any custom elements that participate in forms.

Uses the [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) attribute, so does not need any styling out of the box, but feel free to style any way you like.

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
    <if- name="animal" value="Giraffe">Giraffes are the best!</if->
  </p>
</form>
```

- Reacts to user input & change events. Send a change event manually if you need to re-evaluate the ifs in response to something other than user input.
- Toggles `hidden` based on given condition. Set initial visibility before elements have been initialized or evaluated ([or in case there's no js](https://piccalil.li/blog/its-about-time-i-tried-to-explain-what-progressive-enhancement-actually-is/#its-not-just-an-anti-javascript-thing-its-a-mental-model-rooted-in-iteration)) by using the `hidden` attribute yourself.
- `name` attribute checks if FormData includes an entry with that name.
- `value` attribute checks if FormData includes that value
- `name` + `value` check if FormData includes that value for that name.

If you need more complex conditions, run your condition expression in javascript and set the expression result as a value on a hidden input. Check more complete example usage in `index.html` & `index.js`. (https://sakamies.github.io/conditionals-customelement/)


-----


## Licence, NPM module?

This repo does not have a licence and is not on NPM. Feel free to learn from this, fork the code or make a package. Give credit and don't use this for anything evil.

I don't expect the API of this element to ever change, but I'm not sure I want to be a package maintainer.
