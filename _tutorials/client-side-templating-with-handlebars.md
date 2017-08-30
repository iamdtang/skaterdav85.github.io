---
layout: tutorial
title: Client-side Templating with Handlebars.js
date: 2017-08-29
description: Client-side templating with Handlebars.js
keywords: client-side templating, handlebars.js, handlebars
---

There are a few ways to create HTML / DOM in JavaScript and rendering it on the page:

### String Concatenation

One approach is to use string concatenation. You can create strings of HTML and concatenate your dynamic data. However, with complicated HTML chunks, this can become quite messy and hard to maintain.

### Native DOM Methods

Alternatively, we can generate HTML using native DOM methods / properties like:

* document.createElement()
* element.appendChild(node)
* document.removeElement()
* element.innerHTML

This can be a lot of code and also difficult to maintain with complicated HTML chunks. It is also hard to see what the HTML fragment looks like at a quick glance.

### Client-side Templating

Another approach is to use client-side templating. Client-side templating libraries allow you to create HTML chunks with placeholders for your dynamic data. These libraries allow you to pass data to a template which will replace all instances of the placeholders in a template with the actual data. There are a few templating libraries out there including:

* [Handlebars](http://handlebarsjs.com/)
* [Underscore JS library](http://underscorejs.org/) - more than just templating
* [Mustache](https://github.com/janl/mustache.js/)

Client side templates can be created by placing HTML fragments within a script tag with a __type="template"__ as an attribute. Scripts without a `type` specified default to "text/javascript". With a type attribute set to 'template' (or anything the browser can't interpret), the browser will not recognize this type and won't evaulate what is inside the script tag as JavaScript.  Other common script type attribute values for templates include "text/template", 'handlebars/template', etc. This makes for a good place to store HTML templates.

Let's look at an example using Handlebars. Say we want to render the following object:

```js
var fiona = {
  name: 'Fiona',
  age: 4
};
```

Let's define our template:

```html
<script type="text/handlebars">
  <div class="cat">
    <h1>{{name}}</h1>
    <p>Age: {{age}}</p>
  </div>
</script>
```
