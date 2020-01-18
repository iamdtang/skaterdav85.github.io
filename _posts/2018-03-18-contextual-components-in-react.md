---
layout: post
title: Contextual Components in React
date: 2018-03-18
last_modified_at: 2018-03-28
description: Contextual Components are one of my favorite features in Ember. In this post, I show how you can implement the same pattern in React components using the Render Props pattern.
twitter_image: contextual-components-in-react.png?cache-bust
twitter_image_alt: Code snippet of a contextual component in React
keywords: ember, react, contextual components, Render Props pattern
image: react
---

Contextual Components are one of my favorite features in Ember. They allow you to expose components pre-wired with state and actions as part of a component's public API, without having to directly expose that state or those actions. This same pattern can be applied to React components using the Render Props pattern. Let's look at an example to make this more concrete.

[If you're coming from Ember, check out this example on Ember Twiddle](https://ember-twiddle.com/5db1999f616689f58c3950390fab6e6c?openFiles=templates.application.hbs%2Ctemplates.components.checkbox-list-checkbox.hbs), as the rest of this post will be implementing the equivalent in React.

## A `<CheckboxList />` Component

Let's say you want to build a `<CheckboxList />` component that handles rendering checkboxes for a list of items and managing which items are checked. The component might be used like this:

```jsx
<CheckboxList
  items={this.state.items}
  checkedItems={this.state.checkedItems}
  onCheck={this.handleCheck}
>
  {CheckboxListItem => {
    return (
      <span key={CheckboxListItem.item.firstName}>
        <input
          type="checkbox"
          style={checkboxStyles}
          checked={CheckboxListItem.isChecked}
          onChange={CheckboxListItem.handleCheck}
        />
        {CheckboxListItem.item.firstName}
      </span>
    );
  }}
</CheckboxList>
```

The `<CheckboxList />` component has 3 props. The `items` and `checkedItems` props look like this:

```js
this.state = {};
this.state.items = [{ firstName: "Tom" }, { firstName: "Yehuda" }];
this.state.checkedItems = [this.state.items[0]];
```

The `checkedItems` prop is an array containing any number of `items`.

The `onCheck` prop is a function that is invoked whenever a checkbox is checked or unchecked, and it receives an array of all of the currently checked items as its argument, which can be used to set `checkedItems`.

[See the full demo on Code Sandbox](https://codesandbox.io/s/l51qw7vj8q)

We're using the Render Props pattern to give consumers of this component the flexibility of what to render for each item in the list via the `children` prop.

However, every time someone wants to reuse this component, they will need to wire up a checkbox input with the `CheckboxListItem.handleCheck` action and the `CheckboxListItem.isChecked` property. Wouldn't it be nice if the `<CheckboxList />` component exposed a `<Checkbox />` component that was already wired up with the `CheckboxListItem.handleCheck` action and the `CheckboxListItem.isChecked` property? This way we wouldn't have to expose `CheckboxListItem.handleCheck` and `CheckboxListItem.isChecked` as part of this component's public API, allowing us to easily refactor and change the underlying implementation in the future. Something like this instead:

```jsx
<CheckboxList
  items={this.state.items}
  checkedItems={this.state.checkedItems}
  onCheck={this.handleCheck}
>
  {CheckboxListItem => {
    return (
      <span key={CheckboxListItem.item.firstName}>
        <CheckboxListItem.Checkbox style={checkboxStyles} />
        {CheckboxListItem.item.firstName}
      </span>
    );
  }}
</CheckboxList>
```

This pattern is referred to as Contextual Components in Ember, and it is a way to allow components like `<CheckboxList />` to yield components like `<Checkbox />` pre-wired with state and actions, such as `isChecked` and `handleCheck` without having to publicly expose that data. `<Checkbox />` can have access to the context of outer components like `<CheckboxList />` without breaking encapsulation.

## The Implementation

```jsx
class CheckboxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItemsSet: this.createSet(props.checkedItems)
    };
  }
  createSet(checkedItems) {
    return new Set(checkedItems);
  }
  handleCheck = item => {
    let { checkedItemsSet } = this.state;
    if (checkedItemsSet.has(item)) {
      checkedItemsSet.delete(item);
    } else {
      checkedItemsSet.add(item);
    }
    this.props.onCheck(Array.from(checkedItemsSet));
  };
  render() {
    return this.props.items.map(item => {
      return this.props.children({
        item,
        Checkbox: props => {
          return (
            <Checkbox
              attrs={props}
              item={item}
              checkedItemsSet={this.state.checkedItemsSet}
              onChange={this.handleCheck}
            />
          );
        }
      });
    });
  }
}
```

In the `render` function, we are invoking the `children` prop (the function between the opening and closing `<CheckboxList>` tags) for each item in `items`, and passing it the item and a function assigned to `Checkbox` for rendering a checkbox. `<Checkbox />` is pre-wired with the `handleCheck` function, which is used for keeping track of which items are checked and unchecked any time the user changes the state of any of the checkboxes. This component is taking advantage of the [`Set` class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), introduced in ES2015.

Here is the implementation of the `<Checkbox />` contextual component:

```jsx
class Checkbox extends React.Component {
  handleCheck = () => {
    let { onChange, item } = this.props;
    this.props.onChange(item);
  };
  render() {
    let { checkedItemsSet, item, attrs } = this.props;
    let isChecked = checkedItemsSet.has(item);
    return (
      <input
        type="checkbox"
        {...attrs}
        checked={isChecked}
        onChange={this.handleCheck}
      />
    );
  }
}
```

`<Checkbox />` receives all of the attributes that were passed in from the calling context and spreads those across the checkbox input that is returned. This allows the caller to pass in regular input attributes, like styles, CSS classes, data-\* attributes, etc. This component receives the `Set` containing the checked items, and uses it to determine if its `item` is checked or not.

[See the full demo on Code Sandbox](https://codesandbox.io/s/oql1k85zx6)

## Conclusion

The use of contextual components can help encapsulate state and actions, which can result in a more concise API. Callers of `<CheckboxList />` can write less boilerplate when using this component and no longer have to know about internal actions and state like `CheckboxListItem.handleCheck` or `CheckboxListItem.isChecked`.

When building components with contextual components, I often find it most useful to start with the public API that I want, and implement from there, only exposing the state and actions that are necessary for the caller. This helps maintain encapsulation and can make it easier to refactor in the future without breaking backwards compatibility.

## Updated on {{page.last_modified_at | date: "%B %e, %Y"}}

It turns out there are some issues with using `<CheckboxListItem.Checkbox />` as a faux type, as [Dan Abramov pointed on](https://twitter.com/iamdtang/status/975970972489588736). The problem is that React thinks it is a different component type and will unmount and remount on every single render. In the [previous example on Code Sandbox](https://codesandbox.io/s/oql1k85zx6), you will see that I have added a `componentDidMount` lifecycle method on the `<Checkbox />` component, and it logs to the console. Toggle the checkboxes, and you will see that it gets invoked on every checkbox change. The problem with this is that each `<Checkbox />` will lose local state. [See Dan's example](https://codesandbox.io/s/9366yy02nr).

The fix is simple. Modify this:

```jsx
<CheckboxListItem.Checkbox style={checkboxStyles} />
```

to this:

```jsx
{CheckboxListItem.Checkbox({
  style: checkboxStyles
})}
```

Now toggle the checkboxes and see the `componentDidMount` lifecycle method on the `<Checkbox />` component only get called twice (once for each `<Checkbox />`).

[Code Sandbox Demo](https://codesandbox.io/s/ko6jr981j3)
