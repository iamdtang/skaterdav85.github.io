---
layout: post
title: Examples of React's Render Props Pattern Extracted From An Ember App
date: 2018-03-04
description: TBA
keywords: React, render props, pattern, ember, children
---

Recently I learned about the Render Props pattern in React after seeing it come up a few times in podcasts and newsletters. When I searched for Render Props, I actually didn't find very many practical examples. I work on a large Ember app day to day, and since learning about Render Props, I've noticed how many components I've written using Ember's equivalent of the Render Props pattern. I decided to rewrite those examples in React and share them in this post.

The [React docs](https://reactjs.org/docs/render-props.html) describe Render Props as:

> A render prop is a function prop that a component uses to know what to render

Basically it is a way for a component implement some behavior and delegate rendering to a prop.

Let's look at some examples to make this more concrete.

## A `CharactersRemaining` Component

```hbs
{% raw %}{{#characters-remaining max=30 value=value as |charactersRemaining|}}
  <span>{{charactersRemaining}} remaining</span>
{{/characters-remaining}}{% endraw %}
```

```jsx
<CharactersRemaining max={30} value={this.state.value}>
  {charactersRemaining => (
    <span>{charactersRemaining} characters remaining</span>
  )}
</CharactersRemaining>
```

```js
export default props => {
  let { max, value } = props;
  let charactersRemaining = calculateCharactersRemaining(max, value);
  return props.children(charactersRemaining);
};

function calculateCharactersRemaining(max, value) {
  if (!value) {
    return max;
  }

  let difference = max - value.length;

  if (difference < 0) {
    return 0;
  }

  return difference;
}
```

[Try it here](https://codesandbox.io/s/zqq9kx2xzl)

## A `SortButton` Component

https://codesandbox.io/s/m1vxjv5vy

https://codesandbox.io/s/6wy2ly966w
