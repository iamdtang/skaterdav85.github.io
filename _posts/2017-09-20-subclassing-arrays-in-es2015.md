---
layout: post
title: Subclassing Arrays in ES2015
date: 2017-09-20
description: In this post, I cover how you can subclass an array in JavaScript in ES2015 (ES6).
keywords: extend javascript arrays, subclass javascript array, es6 subclassing, es6 classes, ES2015 classes, javascript collections, collection classes, prototypal inheritance with arrays
---

Prior to ES2015 (ES6), you couldn't really subclass an array in JavaScript without a few caveats, which [kangax](https://twitter.com/kangax) outlines in a fantastic post called [How ECMAScript 5 still does not allow to subclass array](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/). Now in ES2015, you can. This can be useful for defining custom collection classes that leverage all of the array methods and properties while also automatically implementing the iterable and iterator protocols, [which I wrote about recently](/2017/08/27/iterables-and-iterators-in-javascript.html). In short, objects that implement these protocols can be looped through with the `for...of` loop or can be used with the spread operator.

## Subclassing An Array With ES2015 Classes

Let's say you want to define a collection class with an `average` method. You can do that using a class:

```js
class Collection extends Array {
  average(callback) {
    let total = this.reduce((total, item) => {
      return total + callback(item);
    }, 0);

    return total / this.length;
  }
}
```

You can then instantiate the class, passing in several items just like you would with an array, and see it work like a regular array with a custom `average` method:

```js
const assert = require('assert');

let studentGrades = new Collection(
  { name: 'Leticia', grade: 95 },
  { name: 'Austen', grade: 85 },
  { name: 'Shane', grade: 90 }
);

assert.ok(studentGrades instanceof Array); // true
assert.ok(studentGrades instanceof Collection); // true
assert.strictEqual(studentGrades.constructor, Collection); // true
assert.equal(studentGrades.length, 3); // true
studentGrades[3] = { name: 'Samantha', grade: 86 };
assert.equal(studentGrades.length, 4); // true
assert.equal(studentGrades.average(student => student.grade), 89); // true
studentGrades.push({ name: 'Leticia', grade: 95 });
assert.equal(studentGrades.length, 5); // true
studentGrades[10] = { name: 'Tom', grade: 75 };
assert.equal(studentGrades.length, 11); // true
studentGrades.length = 4;
assert.deepEqual(studentGrades, [
  { name: 'Leticia', grade: 95 },
  { name: 'Austen', grade: 85 },
  { name: 'Shane', grade: 90 },
  { name: 'Samantha', grade: 86 }
]); // true
```

## Can You Subclass An Array Without A Class?

I then wondered if it was possible to subclass an array without a class. It turns out you can't, but you can read about several different approaches in [How ECMAScript 5 still does not allow to subclass array](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/). However, in that post kangax goes over an approach that does work, which uses something that is now standardized in ES2015, and that is `__proto__`. Basically this approach takes an array and changes its prototype to another object that inherits from `Array.prototype`. Here is a slightly modified version of that approach:

```js
function Collection(...args) {
  Object.setPrototypeOf(args, Collection.prototype);
  return args;
}
Collection.prototype = Object.create(Array.prototype);
Collection.prototype.constructor = Collection;
Collection.prototype.average = function(callback) {
  let total = this.reduce((total, item) => {
    return total + callback(item);
  }, 0);

  return total / this.length;
};
```

Here, the `Collection` constructor function returns an array instead of the object being constructed, and this array has its prototype changed to another object that inherits from `Array.prototype`.

This approach leverages [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) which was introduced in ES2015 as a way to set the prototype of an object to another object. Prior to this being introduced, the only way to change the prototype of an object was to use the non-standard `__proto__` property, so `Collection` would look like this instead:

```js
function Collection(...args) {
  args.__proto__ = Collection.prototype;
  return args;
}
```

In ES2015, [`Object.prototype.__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) was standardized, but it is recommended that you use  `Object.getPrototypeOf` / `Reflect.getPrototypeOf` and `Object.setPrototypeOf` / `Reflect.setPrototypeOf`.

And all of the same assertions hold true:

```js
const assert = require('assert');

let studentGrades = new Collection(
  { name: 'Leticia', grade: 95 },
  { name: 'Austen', grade: 85 },
  { name: 'Shane', grade: 90 }
);

assert.ok(studentGrades instanceof Array); // true
assert.ok(studentGrades instanceof Collection); // true
assert.strictEqual(studentGrades.constructor, Collection); // true
assert.equal(studentGrades.length, 3); // true
studentGrades[3] = { name: 'Samantha', grade: 86 };
assert.equal(studentGrades.length, 4); // true
assert.equal(studentGrades.average(student => student.grade), 89); // true
studentGrades.push({ name: 'Leticia', grade: 95 });
assert.equal(studentGrades.length, 5); // true
studentGrades[10] = { name: 'Tom', grade: 75 };
assert.equal(studentGrades.length, 11); // true
studentGrades.length = 4;
assert.deepEqual(studentGrades, [
  { name: 'Leticia', grade: 95 },
  { name: 'Austen', grade: 85 },
  { name: 'Shane', grade: 90 },
  { name: 'Samantha', grade: 86 }
]); // true
```

## Performance Comparison

If you checked out the documentation for [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf), you may have noticed the big red warning stating that changing the prototype of an object is a slow operation.

![Object.setPrototypeOf performance warning](/images/object-setprototypeof-warning.png)

I ran a [JSPerf test](https://jsperf.com/subclassing-arrays) comparing these two approaches to subclassing an array, and unexpectedly, subclassing an array via classes is slower than taking an array and changing its prototype.

![Subclassing Array performance comparison](/images/array-subclass-performance-comparison.png)

## Support

In terms of support, subclassing an array with a class isn't something that Babel can polyfill without a few caveats, since `__proto__` wasn't standardized until ES2015, and `Object.setPrototypeOf` wasn't added until ES2015. However, browser and Node support is pretty good, which you can see [here](https://kangax.github.io/compat-table/es6/#test-Array_is_subclassable).

## Conclusion

To summarize, you can subclass an array using a class. Without a class, you can subclass an array by creating an array using the `Array` constructor or literal notation (`[]`) and changing its prototype to another object that inherits from `Array.prototype`. Although this approach is faster, I would still recommend using a class for better readability until performance becomes a problem.
