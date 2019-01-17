---
layout: post
title: An Introduction to Sets in JavaScript
date: 2017-08-21
description: This post is an introduction to the Set class in JavaScript.
keywords: Set tutorial, Set class, Set example, example of Set, removing duplicates in an array, JavaScript Set, Set, js Set, ES6 Set, ES2015 Set
image: javascript
---

A set is a collection of distinct objects. In ES2015, a `Set` class was introduced.

To create a set, invoke `Set` with `new`.

```js
let interests = new Set();
```

A set can also be created with items:

```js
let skills = new Set([
  'JavaScript',
  'php',
  'Ember',
  'Elixir',
  'JavaScript',
  'Ember'
]); // Set(4) {"JavaScript", "php", "Ember", "Elixir"}
```

Before I mentioned that a set is a collection of _distinct_ objects. In the example above, there are a few duplicate skills. When you create a set with duplicate objects, the duplicates will be removed.

## Working with a Set

The `Set` class provides methods for adding and removing items:

```js
let skills = new Set([
  'JavaScript',
  'php'
]); // Set(2) {"JavaScript", "php"}
skills.add('HTML'); // Set(3) {"JavaScript", "php", "HTML"}
skills.delete('JavaScript'); // Set(2) {"php", "HTML"}
```

You can also check to see if an item is in a set:

```js
let skills = new Set([
  'JavaScript',
  'php'
]); // Set(2) {"JavaScript", "php"}
skills.has('JavaScript'); // true
skills.has('CSS'); // false
```

## Iterating Over a Set

There are a few ways to iterate over a `Set`. One way is to use `Set.prototype.forEach`:

```js
let skills = new Set([
  'JavaScript',
  'php'
]);

skills.forEach(function(skill) {
  console.log(skill);
});
```

Another approach is to use the new `for ... of` loop introduced in ES2015, which allows you to loop over an iterable object like an `Array` or `Set`:

```js
for (let skill of skills) {
  console.log(skill);
}
```

## Converting a Set to an Array

Now you may want to convert a `Set` instance to an array so that you can use methods like `filter`, `reduce`, `map`, etc. Here are two concise ways of doing that:

First, you can use `Array.from`:

```js
let arrayOfSkills = Array.from(skills);
```

The second way is to use the spread operator:

```js
let arrayOfSkills = [...skills];
```

## Conclusion

The new ES 2015 `Set` class allows you to create a collection of distinct items, and can be a good alternative to an array. When removing items from an array, you either have to loop through the entire array to find the one you want to remove, and then remove it via `splice`, or create a new array without the removed item using `filter`. The `Set` class makes this easier with a `delete` method. If you need to convert a set to an array, you can easily achieve this through the spread operator or `Array.from`. To learn more `Set`, check out the [`Set` documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
