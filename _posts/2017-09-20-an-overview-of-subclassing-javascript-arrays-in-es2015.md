---
layout: post
title: An Overview of Subclassing JavaScript Arrays in ES2015
date: 2017-09-20
description: TBA
keywords: extend javascript arrays, subclass javascript array, es6 subclassing, es6 classes, ES2015 classes, javascript collections, collection classes, prototypal inheritance with arrays
---

Prior to ES2015 (ES6), you couldn't really subclass JavaScript arrays without a few caveats, which [kangax](https://twitter.com/kangax) outlines in a fantastic post called [How ECMAScript 5 still does not allow to subclass array](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/). Now in ES2015, we can. This can be useful for defining custom collection classes that leverage all of the array methods and properties while also automatically implementing the iterable and iterator protocols, [which I wrote about recently](/2017/08/27/iterables-and-iterators-in-javascript.html). In short, objects that implement these protocols can be looped through with the `for...of` loop or can be used with the spread operator.

## Subclassing `Array` With ES2015 Classes

Let's say we want to define a collection class with an `average` method. We can do that using a class:

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

We can then instantiate the class, passing it several items just like we would with an array, and see it working like a regular array with our custom behavior:

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

## Can You Subclass `Array` Without Classes?

I then wondered if it was possible to extend `Array` without a class. I knew this would be uglier code, but I was more curious for learning purposes. It turns out you can't, and it has to do with an internal `[[Class]]` property.

Arrays and objects have an internal `[[Class]]` property. [As described in the ECMAScript specification](http://ecma-international.org/ecma-262/#sec-object.prototype.tostring), `[[Class]]` is an "internal slot that was used in previous editions of this specification as a nominal type tag for various built-in objects". This property isn't something we have control over, but it can be inspected via `Object.prototype.toString`. For example:

```js
Object.prototype.toString.call([]); // [object Array]
({}).toString(); // [object Object]
```

JavaScript engines do some magic so that the internal `[[Class]]` property is set to "Array" when subclassing `Array` with a class.

kangax goes into more depth on `[[Class]]` in [his post](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#class_limitations) if you're curious.

To subclass `Array` without a class, you can use an approach that he calls "Wrappers. Prototype Injection". Basically this approach leverages an array and changes its prototype to another object that inherits from `Array.prototype`. Here is a modified version of that approach:

```js
function CollectionNotFromClass(...args) {
  let array = new Array(...args);
  Object.setPrototypeOf(array, CollectionNotFromClass.prototype);
  return array;
}
CollectionNotFromClass.prototype = Object.create(Array.prototype);
CollectionNotFromClass.prototype.constructor = CollectionNotFromClass;
CollectionNotFromClass.prototype.average = function(callback) {
  let total = this.reduce((total, item) => {
    return total + callback(item);
  }, 0);

  return total / this.length;
};
```

And all of the same assertions hold true:

```js
const assert = require('assert');

let studentGrades = new CollectionNotFromClass(
  { name: 'Leticia', grade: 95 },
  { name: 'Austen', grade: 85 },
  { name: 'Shane', grade: 90 }
);

assert.ok(studentGrades instanceof Array); // true
assert.ok(studentGrades instanceof CollectionNotFromClass); // true
assert.strictEqual(studentGrades.constructor, CollectionNotFromClass); // true
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

Here, the `CollectionNotFromClass` constructor function returns an array instead of the object being constructed, and this array has its prototype changed to another object that inherits from `Array.prototype`.

This approach leverages [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) which was introduced in ES2015 as a way to set the prototype of an object to another object. Prior to this being introduced, the only way to change the prototype of an object was to use the non-standard `__proto__` property, so `Collection` would look like this instead:

```js
function Collection(...args) {
  let array = new Array(...args);
  array.__proto__ = Collection.prototype;
  return array;
}
```

In ES2015, [`Object.prototype.__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) was standardized, but it is recommened that you use  `Object.getPrototypeOf` / `Reflect.getPrototypeOf` and `Object.setPrototypeOf` / `Reflect.setPrototypeOf`.

## Performance Comparison

If you checked out the documentation for [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf), you may have noticed the big red warning stating that changing the prototype of an object is a slow operation.

![Object.setPrototypeOf performance warning](/images/object-setprototypeof-warning.png)

I ran a [JSPerf test](https://jsperf.com/subclass-array) comparing these two approaches to subclassing arrays, and as expected, subclassing arrays via classes is faster than manual prototypal inheritance.

![Subclassing Array performance comparison](/images/array-subclass-performance-comparison.png)

## Conclusion

To summarize, we can't create custom array objects ourselves without using `Array` or literal notation (brackets). By creating an array using `Array` or literal notation, the only way to add custom methods is by changing its prototype which results in lesser performance. Despite this, I think most people would agree that using classes to extend arrays is the cleaner approach.
