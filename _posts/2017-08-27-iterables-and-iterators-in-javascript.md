---
layout: post
title: Iterables and Iterators in JavaScript
date: 2017-08-27
description: In this post, I go over the iterable and iterator protocols and show some examples of making your own objects iterable so that they can be used with the for...of loop or the spread operator.
keywords: iterable, iterator, introduction, tutorial, javascript, protocol, next, done, Symbol.iterator, for...of, custom iterable, custom iterator, spread operator, iterable example, iterator example, es6, es 2015, es2015
image: javascript
---

## What are Iterables?

The iterable protocol was introduced to JavaScript in ES2015, and it allows us to define custom iteration behavior on objects so that we can control what values are looped over in a `for...of` loop, which was also introduced in ES2015.

A few built-in objects that implement the iterable protocol include `Array`, `String`, `Map`, `Set` and `NodeList`.

Not familiar with the new `Set` class? Read my other post [An Introduction to Sets in JavaScript](/2017/08/21/an-introduction-to-sets-in-javascript.html).

To loop through every letter in a string, you can do:

```js
let name = 'David Tang';

for (let letter of name) {
  console.log(letter);
}
```

You can also loop through elements in an array:

```js
let users = [
  { first: 'Yehuda', last: 'Katz' },
  { first: 'Tom', last: 'Dale' },
  { first: 'Taylor', last: 'Otwell' }
];

for (let user of users) {
  console.log(user);
}
```

You can also loop through `NodeList` references, which are returned from methods like `document.querySelectorAll`:

```js
let listItems = document.querySelectorAll('li');

for (let li of listItems) {
  console.log(li.textContent);
}
```

[Try it here](http://jsbin.com/mupevefuco/1/edit?html,js,console)

## User-defined Iterables

So how do we implement the iterable protocol on our own objects? We do that by defining a method with a key of `Symbol.iterator`. This method needs to return an object conforming to the iterator protocol, which is a standardized way of producing a sequence of values. To conform to the iterator protocol, the `Symbol.iterator` method must return an object with a method called `next`, which produces each value in the sequence each time it gets called. The return value of the `next` method must be an object with two properties: `done` and `value`. Let's look at an example to make this more concrete.

Say we have a class called `UserCollection` for managing a list of users, kind of like a Backbone collection if you've worked with Backbone before.

```js
class UserCollection {
  constructor(users) {
    this.users = [].concat(users);
  }
}

let users = new UserCollection([
  { first: 'Yehuda', last: 'Katz' },
  { first: 'Tom', last: 'Dale' },
  { first: 'Taylor', last: 'Otwell' }
]);

for (let user of users) {
  console.log(user);
}
```

How can we get that `for...of` loop to log each user to the console?

```js
class UserCollection {
  constructor(users) {
    this.users = [].concat(users);
  }

  [Symbol.iterator]() {
    let i = 0;
    let users = this.users;

    return {
      next() {
        if (i < users.length) {
          return { done: false, value: users[i++] };
        }

        return { done: true };
      }
    };
  }
}
```

Here we've defined our `Symbol.iterator` method which returns an iterator (an object with a `next` method). When `next` gets invoked, it needs to return an object containing a property called `done`, holding a boolean of whether the iterator has gone through the entire sequence of values, and a property called `value` containing the value in the sequence. Behind the scenes, the `for...of` loop will keep calling `next` on the iterator until `done` is true. It is up to you to control when that happens and what the values are. Note that the `value` property doesn't need to be specified when `done` is `true`.

[Try it here](http://jsbin.com/fotusenude/1/edit?js,console)

Although less common, you can also interact with the iterator itself by invoking `users[Symbol.iterator]` to grab a reference to the iterator and calling `next` for each value in the sequence. Each call to `next` will return an object with the `done` boolean flag and the value in the sequence. For example:

```js
let iterator = users[Symbol.iterator]();
console.log(iterator.next()); // { done: false, value: { first: 'Yehuda', last: 'Katz' } }
console.log(iterator.next()); // { done: false, value: { first: 'Tom', last: 'Dale' } }
console.log(iterator.next()); // { done: false, value: { first: 'Taylor', last: 'Otwell' } }
console.log(iterator.next()); // { done: true  }
```

[Try it here](http://jsbin.com/yihivuluvu/1/edit?js,console)

The `for...of` loop isn't the only way to consume an iterable. You can also use the spread operator to create an array from a sequence of values. For example, the following will spread out the values in the `UserCollection` into an array.

```js
console.log([...users]);
// [
//   { first: 'Yehuda', last: 'Katz' },
//   { first: 'Tom', last: 'Dale' },
//   { first: 'Taylor', last: 'Otwell' }
// ]
```

## A Linked List Example

Here's another example. I've created a `LinkedList` class. If you're not familiar with what a linked list is, [Wikipedia defines it as](https://en.wikipedia.org/wiki/Linked_list):

> A linear collection of data elements, in which linear order is not given by their physical placement in memory. Each pointing to the next node by means of a pointer. It is a data structure consisting of a group of nodes which together represent a sequence.

My linked list implementation doesn't have all of the features that you'd expect in a linked list, but it is enough for this example.

Each item in the linked list will be represented as a `Node` instance, containing the value and a reference to the next node in the list:

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

And the `LinkedList` class:

```js
class LinkedList {
  find(value) {
    let node = this.first;
    while (node.value !== value) {
      node = node.next;
    }
    return node;
  }
  addFirst(value) {
    let newNode = new Node(value);
    this.first = newNode;
  }
  addAfter(newValue, beforeValue) {
    let newNode = new Node(newValue);
    let beforeNode = this.find(beforeValue);
    newNode.next = beforeNode.next;
    beforeNode.next = newNode;
  }
}

let cities = new LinkedList();
cities.addFirst('Los Angeles');
cities.addAfter('Miami', 'Los Angeles');
cities.addAfter('Las Vegas', 'Miami');

console.log(cities.first.value); // Los Angeles
console.log(cities.first.next.value); // Miami
console.log(cities.first.next.next.value); // Las Vegas
console.log(cities.first.next.next.next); // null
```

[Try it out here](http://jsbin.com/zonumexado/edit?js,console)

Say you want to loop over this linked list using `for...of` or turn it into an array using the spread operator. Let's make this iterable by defining a `Symbol.iterator` method that returns an iterator:

```js
class LinkedList {
  // ...
  [Symbol.iterator]() {
    let currentNode = this.first;

    return {
      next() {
        if (currentNode) {
          let result = { done: false, value: currentNode.value };
          currentNode = currentNode.next;
          return result;
        }

        return { done: true };
      }
    };
  }
}
```

Now we can loop over the linked list using `for...of`:

```js
for (let city of cities) {
  console.log(city);
}
```

[Try it here](http://jsbin.com/xabulefeqo/1/edit?js,console)

## Conclusion

That's a quick overview of iterables and iterators. If you're interested in learning more, check out the [MDN docs on iterables and iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). One thing I didn't cover was how generators, another ES2015 feature, return iterator objects. If you're interested in learning about generators, check out my other post [A Practical Introduction to ES6 Generator Functions](/2016/10/15/a-practical-introduction-to-es6-generator-functions.html).
