export function useForm(form, event) {
  const defaultEvent = new Event('change', {bubbles: true})
  if (event === true) {
    event = defaultEvent
  }
  else if (typeof event === 'string') {
    event = new Event(event, {bubbles: true})
  }
  else if (event instanceof Event) {
    event = event
  } else {
    event = null
  }

  const valuesHandler = {
    get(form, name) {
      return form.elements[name].value
    },
    set(form, name, value) {
      if (form.elements[name]) {
        form.elements[name].value = value
        if (event) dispatchEvent(name)
        return true
      }
      else {
        return false
      }
    },
  }

  const values = new Proxy(form, valuesHandler)

  function dispatchEvent(name) {
    const sendEvent = event || defaultEvent
    if (name) {
      form.elements[name].dispatchEvent(sendEvent)
    }
    else {
      form.dispatchEvent(sendEvent)
    }
  }

  function listen() {
    //Is this even useful? I mean you could listen for changes in a value, but doesn't the ifs and stuff already kinda handle that stuff?
    //???
  }
  //Maybe something like [elementsProxy, fire, listen]
  return [values, dispatchEvent, listen]
}