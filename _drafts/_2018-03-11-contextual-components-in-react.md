---
layout: post
title: Contextual Components in React
date: 2018-03-11
description: TBA
keywords: ember, react, contextual components, render props
---

- what are contextual components

Contextual components

- why are they useful?
- ember example
- how to do this in React using combination of render props

https://embermap.com/topics/contextual-components/pre-wired-data-and-actions

https://ember-twiddle.com/177d045c5694dbb8a160022c0788f6c7?openFiles=components.flippable-card.js%2Ctemplates.components.flippable-card-side.hbs


```hbs
{%raw%}{{#collapsible-panel as |panel|}}
  {{#panel.header}}
    Panel header
  {{/panel.header}}
  {{#panel.content}}
    Panel content
  {{/panel.content}}
{{/collapsible-panel}}{%endraw%}
```

```hbs
{%raw%}{{!-- app/templates/collapsible-panel.hbs --}}
{{yield (hash
  header=(component "collapsible-panel-header" onClick=(action "togglePanel"))
  content=(component "collapsible-panel-content" isOpen=isOpen)
)}}{%endraw%}
```

```js
// app/components/collapsible-panel.js
export default Component.extend({
  isOpen: false,
  actions: {
    togglePanel() {
      this.toggleProperty('isOpen');
    }
  }
});
```

```js
// app/components/collapsible-panel-header.js
export default Component.extend({
  click() {
    this.get('onClick')();
  }
});
```

```hbs
{%raw%}{{!-- app/templates/collapsible-panel-content.hbs --}}
{{#if isOpen}}
  {{yield}}
{{/if}}{%endraw%}
```

[Try it out on Ember Twiddle](https://ember-twiddle.com/bca9bfc2a0f99bec764e6b8fa57d449a?openFiles=templates.application.hbs)

```jsx
const headerStyles = {
  padding: "10px",
  backgroundColor: "#ddd",
  cursor: "pointer"
};

const contentStyles = {
  padding: "10px",
  backgroundColor: "#eee"
};

class App extends React.Component {
  render() {
    return (
      <CollapsiblePanel>
        {(Header, Content) => {
          return (
            <div>
              <Header style={headerStyles}>Header</Header>
              <Content style={contentStyles}>Panel content here</Content>
            </div>
          );
        }}
      </CollapsiblePanel>
    );
  }
}

render(<App />, document.getElementById("root"));
```

```jsx
export default class CollapsiblePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
  }
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    let { isOpen } = this.state;
    return (
      <div>
        {this.props.children(
          props => {
            return <Header {...props} onClick={this.toggle} />;
          },
          props => {
            return <Content {...props} isOpen={isOpen} />;
          }
        )}
      </div>
    );
  }
}
```

```jsx
const Header = props => {
  return <header {...props}>{props.children}</header>;
};

const Content = props => {
  if (props.isOpen) {
    return <div {...props}>{props.children}</div>;
  }

  return <div />;
};
```

[Try it here](https://codesandbox.io/s/ww96598q0w)
