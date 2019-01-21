---
layout: post
title: What's New with Components as of Ember 3.4
date: 2018-09-25
description: This post covers new Ember component features as of 3.4.
twitter_image: ember-3.4-components-600x335.png
twitter_image_alt: Screenshot of invoking an Ember component with angle bracket syntax
keywords: ember, component, angle bracket syntax, components, spreading HTML attributes, named arguments, template-only glimmer components
image: ember
---

## Named Arguments (as of 3.1)

In short, with Named Arguments, `{% raw %}{{title}}{% endraw %}` becomes `{% raw %}{{@title}}{% endraw %}` in the template of `{% raw %}{{my-header title=title}}{% endraw %}`. This helps distinguish component arguments from component properties such as local component state and computed properties.

[Here is the original blog post on Named Arguments.](https://www.emberjs.com/blog/2018/04/13/ember-3-1-released.html#toc_named-arguments-1-of-4)

## Angle Bracket Invocation (as of 3.4)

Prior to Ember 3.4, components were invoked using double curlies. Now we can invoke them using angle bracket invocation.

### Non-Block Component

```hbs
{% raw %}
{{characters-remaining max=36 value=name}}
{% endraw %}
```

becomes

```hbs
{% raw %}
<CharactersRemaining @max={{36}} @value={{name}} />
{% endraw %}
```

### Block Component

```hbs
{% raw %}
{{#characters-remaining max=36 value=name as |charactersRemaining|}}
  {{charactersRemaining}} characters remaining
{{/characters-remaining}}
{% endraw %}
```

becomes

```hbs
{% raw %}
<CharactersRemaining @max={{36}} @value={{name}} as |charactersRemaining|>
  {{charactersRemaining}} characters remaining
</CharactersRemaining>
{% endraw %}
```

Because component arguments are prefixed with `@`, any other attributes on the component invocation will become HTML attributes. For example:

```hbs
{% raw %}
<CharactersRemaining
  @max={{36}}
  @value={{name}}
  data-test="characters-remaining" />
{% endraw %}
```

The `data-test` attribute will automatically be set as an HTML data attribute on the component's element. No need for `attributeBindings` here!

We can even use single word component names with angle bracket invocation! However, this doesn't work when generating a component via Ember CLI at the moment. We can get around this by generating a component with a hyphen and then renaming it to a single word.

If your app isn't on Ember 3.4 or above, you can install the [`ember-angle-bracket-invocation-polyfill`](https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill), which allows you to use angle bracket invocation all the way back to Ember 2.12.

[Here is the RFC on Angle Bracket Invocation.](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md)

## Template-only Glimmer Components (as of 3.1)

Template-only glimmer components are an optional feature that allow us to have components without a JavaScript file. This is great for those cases where we had components with an empty class definition. To get started, install the optional features addon:

```
ember install @ember/optional-features
```

Next, enable it with the following in `config/option-features.json`:

```json
{
  "template-only-glimmer-components": true
}
```

Now, create a template and that is your component! One thing to note is that your curly expressions need to be prefixed with `@`. If we have a component called `my-header` with a `title` attribute, the template would go from this:

```hbs
{% raw %}
<header>
  {{title}}
</header>
{% endraw %}
```

to this:

```hbs
{% raw %}
<header>
  {{@title}}
</header>
{% endraw %}
```

## HTML Attribute Spreading with `...attributes`

One of my favorite features of angle bracket invocation is being able to capture all HTML attributes and spread them over another element via `...attributes`. I have found this particularly useful with template-only Glimmer components. For example, let's say we created a template-only Glimmer component called `required-action-callout` with a template like this:

```hbs
{% raw %}
<div class="alert alert-warning">
  ...
</div>
{% endraw %}
```

We can invoke it as such:

```hbs
{% raw %}
<RequiredActionCallout class="mt-2" data-test="required-action-callout">
  ...
</RequiredActionCallout>
{% endraw %}
```

In order for `div.alert.alert-warning` to get the class `mt-2` and the `data-test` attribute, we can modify our template as such:

```hbs
{% raw %}
<div class="alert alert-warning" ...attributes>
  ...
</div>
{% endraw %}
```

The final result will be:

```hbs
{% raw %}
<div class="alert alert-warning mt-2" data-test="required-action-callout">
  ...
</div>
{% endraw %}
```

If you put `...attributes` first, such as:

```hbs
{% raw %}
<div ...attributes class="alert alert-warning">
  ...
</div>
{% endraw %}
```

any attributes in `...attributes` that are present on the element will win out resulting in:

```hbs
{% raw %}
<div class="mt-2" data-test="required-action-callout">
  ...
</div>
{% endraw %}
```

Personally, I have found myself only using `...attributes` as the last thing on an element. Another thing to note is that `...attributes` can only be used within an element position. `{% raw %}{{log attributes}}{% endraw %}` logs `undefined`.

[Here is the original blog post on Template-only Glimmer Components.](https://www.emberjs.com/blog/2018/04/13/ember-3-1-released.html#toc_introducing-optional-features-3-of-4)
