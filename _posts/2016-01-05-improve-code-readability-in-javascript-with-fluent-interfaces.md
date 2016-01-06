---
layout: post
title: Improve Code Readability In JavaScript With Fluent Interfaces
date: 2016-01-05
description: TBA
keywords: readable code, clean javascript, fluent api, fluent interface, method chaining, design patterns, readable javascript, chain methods, jquery chaining, code readability, clean code
---

In today's post, I want to show you how a fluent interface, also known as a fluent API, can help improve the
readability of your code. Imagine you have an array of objects, maybe a list of
products, and you want to filter these objects based on some criteria.
There are several ways you can achieve this, but let's look at how using a
fluent API can improve the readability of this.

Let's start off with the criteria. We need to:

* filter products by a specific color
* filter products by a maximum price
* filter products by a size

One way to achieve this might be:

```js
let products = productSearch.filterByColor(productData, 'red');
products = productSearch.filterByPrice(products, 50);
products = productSearch.filterBySize(products, '10');
```

Although it works, the problem with this implementation is that you are forced to reassign the `products` variable with the new filtered down data, which I've done here, or introduce new variables. You could also write this all on one line like so:

```js
productSearch.filterBySize(productSearch.filterByPrice(productSearch.filterByColor(productData, 'red'), 50), '10');
```

I doubt you want to do that.

With the first approach, you have to repeatedly pass in `products` to each
`filterByXXX()` method. Will you always remember the order of those arguments?
Wouldn't it be nice if this was abstracted away so the only parameter required was the criteria value? We can do better using a
fluent interface.

A fluent interface, coined by Eric Evans and Martin Fowler, is defined on [Wikipedia](https://en.wikipedia.org/wiki/Fluent_interface?WT.mc_id=14123-DEV-tuts-article14)
as:

> An implementation of an object oriented API that aims to provide more
readable code.

A fluent interface is also referred to as a fluent API or method chaining,
depending on the language community. I first learned this pattern in the
JavaScript/jQuery world as method chaining, and then later on in the PHP
world as fluent interfaces/APIs.

You are probably already using this pattern and may not even know it! Have you
ever used jQuery? If so, then you have used it.

```js
$(this)
  .val('Saving...')
  .prop('disabled', true)
  .addClass('processing');
```

jQuery's fluent API let's us chain together methods by returning the
constructed jQuery object each time. An extremely simplified implementation of
this could be:

```js
function $(element) {
  if (this instanceof $) {
    this.element = element;
  } else {
    return new $(element);
  }
}

$.prototype.val = function(newValue) {
  this.element.value = newValue;
  return this;
};

$.prototype.prop = function(property, value) {
  this.element[property] = value;
  return this;
};

$.prototype.addClass = function() {
  // implementation
  return this;
};
```

Notice how each instance method on the prototype is returning `this`? Each call
returns the `$` instance, which allows for jQuery methods to be chained.

One other thing to note here is the `$` constructor function. The `if`
statement in there basically checks if `$` was called with the `new` keyword or
not. If it wasn't, then it reinvokes `$` with `new` so that we can have the
instance property `element`. This part isn't necessary for having a fluent API
though. jQuery does something similar so that users don't have to remember to
use `new` each time, resulting in fewer key strokes and a cleaner API. You could however
write your jQuery like this:

```js
new $(this)
  .val('Saving...')
  .prop('disabled', true)
  .addClass('processing');
```

This would work and still follows a fluent API.

Let's revisit our previous example and rework the API so that it is easier to read using a fluent interface:

```js
let products = new ProductSearch(productData)
  .filterByColor('red')
  .filterByPrice(50)
  .filterBySize('10')
  .get();
```

You can probably agree that this is easier to read and feels more intuitive
right? You no longer need to pass in `products` to each `filterByXXX()`
instance method. There is an additional `get()` method. What is that? Because each
`filterByXXX()` method returns an instance of `ProductSearch`, we need some
way of getting the filtered array out. That is the purpose of the `get()` method.
Let's look at the implementation:

```js
function ProductSearch(productData) {
  this._filteredProducts = productData;
}

ProductSearch.prototype.filterByColor = function(color) {
  this._filteredProducts = this._filteredProducts.filter(function() {
    /* implementation */
  });
  return this;
};

ProductSearch.prototype.filterByPrice = function(price) {
  this._filteredProducts = this._filteredProducts.filter(function() {
    /* implementation */
  });
  return this;
};

ProductSearch.prototype.filterBySize = function(size) {
  this._filteredProducts = this._filteredProducts.filter(function() {
    /* implementation */
  });
  return this;
};

ProductSearch.prototype.get = function() {
  return this._filteredProducts;
};
```

The implementation now has a fluent API that uses a `ProductSearch` constructor
function. Each `filterByXXX()` method no longer needs `products` passed to it.
Instead, it uses the "private" instance property `_filteredProducts`. Each
`filterByXXX()` method also returns `this`, the `ProductSearch` instance so
that method calls can be chained.

Fluent APIs can help provide more readable code. What scenarios have you
used fluent APIs for? Let me know in the comments!
