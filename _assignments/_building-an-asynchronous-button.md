---
layout: assignment
title: Building an Asynchronous Button
date: 2017-10-29
---

Taking your new knowledge on one way data flow, also known as data down, actions up in the Ember world, build a button that fires an asynchronous action and shows different states depending on the status of that asynchronous action.

Your component should be used like this:

```hbs
{% raw %}
{{async-button
  default="Save"
  pending="Saving"
  resolved="Saved"
  rejected="Sorry, Try Again"
  onclick=(action "someAsynchronousThing")}}
{% endraw %}
```

where the `someAsynchronousThing` function should return a promise. When the button is rendered, display the default attribute text. While the promise is pending, the button should show the pending attribute text. If the promise resolves, display the resolved attribute text. If the promise rejects, display the rejected attribute text.
