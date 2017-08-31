---
layout: tutorial
title: Client-side Templating with Handlebars.js
date: 2017-08-31
description: Client-side templating with Handlebars.js
keywords: client-side templating, handlebars.js, handlebars
---

There are a few ways to write HTML and create DOM in JavaScript:

### String Concatenation

One approach is to use string concatenation and insert the string of HTML into the DOM using `innerHTML` or `.html()` in jQuery. You can create strings of HTML in your JavaScript and concatenate your dynamic data.

```js
element.innerHTML = '<div class="cat-count">' + cats.length + '</div>';
```

However, with complicated HTML, this can become quite messy and difficult to maintain.

### Native DOM Methods

Alternatively, we can generate DOM using native DOM methods / properties like:

* document.createElement()
* element.appendChild(node)
* document.removeElement()
* element.innerHTML

```js
var div = document.createElement('div');
var count = document.createTextNode(cats.length);
div.append(count);
element.append(div);
```

This can be a lot of code and also difficult to maintain with complicated HTML. It is also hard to see what the HTML fragment looks like at a quick glance.

### Client-side Templating

Another approach is to use client-side templating. Client-side templating libraries allow you to create HTML with placeholders for your dynamic data. These libraries allow you to pass data to a template which will replace all instances of the placeholders in a template with the actual data. There are a few templating libraries out there including:

* [Handlebars](http://handlebarsjs.com/)
* [Underscore JS library](http://underscorejs.org/) - more than just templating
* [Mustache](https://github.com/janl/mustache.js/)

Client side templates can be created by placing HTML fragments within the `template` tag. Let's look at a few examples using Handlebars.

### Example 1 - Rendering An Object

Say we want to render the following object:

```js
var fiona = {
  name: 'Fiona',
  age: 4
};
```

Let's define our template:

```html
{% raw %}
<template id="cat-template">
  <div class="cat">
    <h1>{{name}}</h1>
    <p>Age: {{age}}</p>
  </div>
</template>
{% endraw %}
```

To render this to `div#cat` on the page:

```js
var template = document.getElementById('cat-template').innerHTML;
var renderCat = Handlebars.compile(template);
document.getElementById('cat').innerHTML = renderCat(fiona);
```

### Example 2 - Rendering An Array

Say we want to render the following array:

```js
var myCats = [
  { name: 'Fiona', age: 4 },
  { name: 'Spot', age: 12 },
  { name: 'Chestnut', age: 4 },
  { name: 'Frisky', age: false },
  { name: 'Biscuit', age: 4 }
];
```

Let's define a template, this time using the Handlebars `each` helper, which allows you to loop over arrays in your template:

```html
{% raw %}
<template id="cat-list-template">
  {{#each cats}}
    <div class="cat">
      <h1>{{name}}</h1>
      <p>Age: {{age}}</p>
    </div>
  {{/each}}
</template>
{% endraw %}
```

To render the array using this template into `div#cat-list`:

```js
var template = document.getElementById('cat-list-template').innerHTML;
var renderCats = Handlebars.compile(template);
document.getElementById('cat-list').innerHTML = renderCats({
  cats: myCats
});
```

Handlebars is really powerful and offers other helpers like `if` that allow us to use simple if statements in our template. For example:

```html
{% raw %}
<template id="cat-list-template">
  {{#each cats}}
    <div class="cat">
      <h1>{{name}}</h1>
      {{#if age}}
        <p>Age: {{age}}</p>
      {{else}}
        <p>Deceased 😭</p>
      {{/if}}
    </div>
  {{/each}}
</template>
{% endraw %}
```

Check out the [Handlebars documentation](http://handlebarsjs.com/) for more examples.
