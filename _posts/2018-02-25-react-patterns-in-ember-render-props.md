---
layout: post
title: React Patterns in Ember - Render Props
date: 2018-02-25
description: In this blog post, I cover the Render Props pattern in React and what it looks like in Ember.
keywords: react patterns, ember, render props
---

Lately I've been hearing a lot about various component patterns in React. One pattern that has been coming up is the Render Props pattern. I was curious about what problem it solves and what the equivalent is in Ember. 

The [React docs](https://reactjs.org/docs/render-props.html) describe Render Props as:

> A render prop is a function prop that a component uses to know what to render

Here is [an example from the React documentation](https://reactjs.org/docs/render-props.html):

```jsx
<Mouse render={mouse => (
  <Cat mouse={mouse} />
)}/>
```

The `Mouse` component implements some behavior but delegates the rendering to a function prop passed in, which in this example is called `render` (it doesn't have to be called `render`, but it is a common convention that libraries like [downshift](https://github.com/paypal/downshift) follow). If you aren't familiar with React, you can have plain JavaScript functions that return JSX. These types of components are called Stateless Functional Components, as opposed to the stateful components using classes that extend from `React.Component`.

Here are the `Mouse` and `Cat` components for the snippet above:

```jsx
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      {% raw %}
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
      {% endraw %}
    );
  }
}
```

Another way you might see this pattern in React is using the `children` prop, which could look like this:

```jsx
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

or like this:

```jsx
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

In React, the stuff between the opening and closing tag of a component becomes a prop called `children`. In the `Mouse` class, the only change would be that `this.props.render(this.state)` becomes `this.props.children(this.state)`.

So what would this look like in Ember? In Ember, you can achieve this using a component in its block form with a block param:

```hbs
{% raw %}{{#mouse-event as |mouse|}}
  <p>The mouse position is {{mouse.x}}, {{mouse.y}}</p>
{{/mouse-event}}{% endraw %}
```

Currently in Ember, component names must have a hyphen, so I've changed the name from `Mouse` in the React example to `mouse-event`.

```js
// app/components/mouse-event.js
import Component from '@ember/component';

export default Component.extend({
  mouseMove(event) {
    this.set('event', event);
  }
});
```

and the `mouse-event` component's template:

```hbs
{% raw %}{{yield (hash x=event.clientX y=event.clientY)}}{% endraw %}
```

We can `yield` state from within the `mouse-event` component back to the scope that invoked the component as a [block parameter](https://guides.emberjs.com/v3.0.0/components/block-params/) called `mouse`. This ultimately lets the consumer of the component control what to render.
