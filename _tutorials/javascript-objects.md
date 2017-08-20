---
layout: tutorial
title: JavaScript Objects
date: 2017-08-09
description: The fundamentals of objects in JavaScript
keywords: javascript, objects, object literals
---

## What Are Objects?

Objects are containers for a collection of related variables (properties) and functions (methods). Some native browser objects that you might be familiar with include the `document` object and the `window` object.

The document object contains related methods for querying the DOM:

* `document.getElementById()`
* `document.getElementsByTagName()`
* `document.querySelector()`
* `document.querySelectorAll()`
* `document.getElementsByClassName()`

The window object contains properties and methods like:

* `document`
* `alert()`
* `parseFloat()`
* `parseInt()`

Properties and methods on `window` are part of the global scope, so you can either access them with `window.***` such as `window.document` or `window.alert()`, or more concisely `document` and `alert()`.

## Object Literals

You can also create your own objects in a few different ways. One approach is to use the object literal syntax, which uses curly braces and key-value pairs separated by commas:

```js
let cat = {
  name: 'Fiona',
  age: 1.5,
  siblings: ['Chestnut', 'Biscuit']
};
```

Object keys follow the same rules as variable definitions. If you want to use special characters or reserved words as keys, you can put the key in quotes:

```js
let obj = {
  '$%#': 'some value'
};
```

Object properties can contain any value, so strings, numbers, booleans, arrays, functions, and other objects.

Properties can be accessed using dot notation or bracket notation:

```js
let name = cat.name; // Fiona
name = cat['name']; // Fiona
```

Properties on an object can also be changed through dot or bracket notation:

```js
cat.name = 'Chestnut';
cat['name'] = 'Fiona';
```

## Object Methods

We can give objects custom behaviors / functions called methods. Inside a method, the object can be referenced using the _this_ keyword.

```js
let cat = {
  name: 'Fiona',
  meow: function() {
    console.log(this.name);
  }
};

cat.meow();
```

Inside the meow method, the name property on the cat object can be accessed by _this.name_. The value of _this_ is determined when the function is invoked. When meow is called via `cat.meow()`, _this_ corresponds to the object on which meow is called on, which in this case is the `cat` object.

Alternatively, you could write the meow method like this:

```js
let cat = {
  name: 'Fiona',
  age: 1.5,
  siblings: ['Chestnut', 'Biscuit'],
  meow: function() {
    console.log(cat.name);
  }
};
```

We can explicitly reference the `cat` object within the `meow` method, but this has a drawback. If we rename the `cat` variable to something else, we would have to find every reference to `cat` within our object and replace it. Using the keyword _this_ makes our methods less coupled to the name of the variable.

Methods can also call other methods:

```js
let cat = {
  name: 'Fiona',
  age: 1.5,
  siblings: ['Chestnut', 'Biscuit'],
  meow: function(catWords) {
    console.log(catWords);
  },
  greet: function() {
    this.meow('Hi, my name is ' + this.name);
    this.meow('Give me food');
  }
};

cat.greet();
```

The cat `greet()` method calls the `meow()` method using the _this_ keyword.

Before wrapping up, I want to mention that ES 2015 has introduced a new way to defining methods:

```js
let cat = {
  name: 'Fiona',
  meow() {
    console.log(this.name);
  }
};
```

Notice how the `: function` part can be removed. Much more concise!
