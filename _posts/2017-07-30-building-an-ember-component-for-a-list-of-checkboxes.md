---
layout: post
title: Building an Ember Component for a List of Checkboxes
date: 2017-07-30
description: How I built a checkbox list Ember component using contextual components and an ES 2015 Set
keywords: checkbox list component, ember component, checkboxes, contextual components, data down actions up, DDAU, component helper, hash helper, contextual input component, yield checkbox, ES 2015 Set, ES6 Set
---

This week I found myself needing to build a component for a list of checkboxes. I wanted to render a checkbox for a list of items. Each time a checkbox was clicked, a specified action would get fired with an argument containing all the checked items. I also wanted to make the component flexible enough to handle a few checkbox and label markup variations. Given those requirements, this was the component API that I settled on:

```hbs
{% raw %}
<!-- templates/application.hbs -->
{{#checkbox-list items=permissions onCheck=(action "handleCheck") as |list|}}
  <div class="checkbox">
    <label>
      {{list.checkbox}} {{list.item.name}}
    </label>
  </div>
{{/checkbox-list}}
{% endraw %}
```

[Ember Twiddle Demo](https://ember-twiddle.com/c7947e38b59df947735ac15b6f8abe21)

This component takes a list of items and renders the component's block for each item. Each checkbox gets exposed as `list.checkbox` via contextual components. Each item also gets exposed as `list.item`.

I wanted to expose the checkbox as a contextual component so that the `checkbox-list` component could manage the list of checked items each time a checkbox was clicked. I wanted to pre-wire the checkbox with a click action without having to expose that in the component's public API, which might have looked something like this:

```hbs
{% raw %}
{{#checkbox-list items=permissions onCheck=(action "handleCheck") as |list|}}
  <div class="checkbox">
    <label>
      <input type="checkbox" onclick={{action list.handleCheck}}> {{list.item.name}}
    </label>
  </div>
{{/checkbox-list}}
{% endraw %}
```

Here is the `checkbox-list` template:

```hbs
{% raw %}
<!-- templates/components/checkbox-list.hbs -->
{{#each items as |item|}}
  {{yield (hash
    item=item
    checkbox=(component "checkbox-list-checkbox" click=(action "onCheck" item)))}}
{{/each}}
{% endraw %}
```

One interesting thing I discovered was that the component helper can't be used with the built-in input component. Hence, this doesn't work:

```hbs
{% raw %}
{{#each items as |item|}}
  {{yield (hash
    item=item
    checkbox=(component "input" type="checkbox" click=(action "onCheck" item)))}}
{{/each}}
{% endraw %}
```

According to [this issue](https://github.com/emberjs/ember.js/issues/13119), it has to do with Glimmer Components and `input` being a reserved word.

To get around this, I created a component called `checkbox-list-checkbox` that simply extends from `Ember.TextField`:

```js
// components/checkbox-list-checkbox.js
import Ember from 'ember';

const { TextField } = Ember;

export default TextField.extend({
  attributeBindings: ['type'],
  type: 'checkbox'
});
```

This allowed me to use a checkbox as a contextual component.

Last was the implementation to manage which items got checked and unchecked:

```js
// components/checkbox-list.js
import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('checkedItemsSet', new Set());
  },
  actions: {
    onCheck(item) {
      let checkedItemsSet = this.get('checkedItemsSet');
      if (checkedItemsSet.has(item)) {
        checkedItemsSet.delete(item);
      } else {
        checkedItemsSet.add(item);
      }
      this.get('onCheck')(Array.from(checkedItemsSet));
    }
  }
});
```

Creating a list of checked items using an array is pretty simple using `push` or `concat`. When you have to remove items when a checkbox gets unchecked, you either have to loop through the entire list to find the one you want to remove, and then remove it via `splice`, or create a new array without the removed item using `filter`. Instead of using a standard JavaScript `Array`, I used an ES 2015 `Set` since it already has methods for checking if an item is in a set, adding an item to a set, and deleting an item from a set.

Lastly, because I wanted the `onCheck` action to get invoked with an `Array` of checked items instead of a `Set` of checked items, I converted the `Set` to an `Array` using `Array.from`.
