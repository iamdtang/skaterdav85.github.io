---
layout: tutorial
title: JavaScript Objects
date: 2017-08-09
description: The fundamentals of objects in JavaScript
keywords: javascript, objects, object literals
---

## What Are Objects?

Before diving into constructor functions and classes in JavaScript, let's review objects. Objects are containers for a collection of related variables (properties) and functions (methods). Some native browser objects that you might be familiar with include the `document` object and the `window` object.

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

Object keys must:

* start with a letter, dollar sign, or underscore
* only contain alphanumeric characters, underscores, and dollar signs
* cannot be a reserved word in JavaScript
* If you must use a reserved word or a special character for the key name, you must put the key in quotes

Object properties can contain:

* strings
* numbers
* booleans
* arrays
* functions
* other objects

We can read properties off of objects using dot notation or bracket notation:

```js
cat.name // Fiona
cat['name'] // Fiona
```

We can also set or change properties on an object:

```js
cat.name = 'Chestnut';
```

## Object Methods

We can give objects custom behaviors / functions called methods. In order to access properties on an object within a method, you use the _this_ keyword.

```js
let cat = {
  name: 'Fiona',
  meow: function() {
    console.log(this.name);
  }
};

cat.meow();
```

In the example above inside the meow method, if I want to access the name property on the cat object, I need to say _this.name_. The value of _this_ is determined when the function is invoked. In the example above when meow is called, _this_ corresponds to the object on which meow is called on, which in this case is the cat object.

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

We can explicitly reference the cat object within the meow method, but this has a drawback. If we rename the cat object to something other than cat, we would have to find every reference to cat within our object and replace it. Using the keyword _this_ makes our methods less coupled to the name of the letiable containing the object.

Methods can also call other methods on the same object:

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

The cat _greet()_ method calls the _meow()_ method using the keyword _this_. Remember, in order to access any properties or methods from within a method on an object, you need to use the _this_ keyword.
