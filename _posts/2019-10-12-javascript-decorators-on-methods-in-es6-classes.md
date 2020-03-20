---
layout: post
title: JavaScript Decorators on Methods in ES6 Classes
date: 2019-10-12
description: An introduction to JavaScript Decorators on methods in ES6 classes.
keywords: JavaScript Decorators
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

This post covers Stage 1 proposal JavaScript Decorators. If you'd like to learn more about Stage 1 vs. Stage 2 proposal JavaScript Decorators, I recommend watching [Decorators in Depth by Marco Otte-Witte](https://youtu.be/qHkY8Uyd5TE).

Let's say we have the following class:

```js
class Foo {
  bar() {
    return this.baz().join(', ');
  }

  baz() {
    let numbers = [];

    for (let i = 0; i < 100; i++) {
      numbers.push(i);
    }

    return numbers;
  }
}
```

We want to figure out how long it takes for `bar` to execute. One way to do this is to modify `bar` with `console.time()` and `console.timeEnd()`:

```js
class Foo {
  bar() {
    console.time();
    let result = this.baz().join(', ');
    console.timeEnd();
    return result;
  }

  baz() {
    let numbers = [];

    for (let i = 0; i < 100; i++) {
      numbers.push(i);
    }

    return numbers;
  }
}
```

With JavaScript Decorators, we can add this functionality without modifying `bar` at all.

First, we'll add the decorator above our `bar` method:

```js
class Foo {
  @captureTime
  bar() {
    return this.baz().join(', ');
  }

  baz() {
    const numbers = [];

    for (let i = 0; i < 100; i++) {
      numbers.push(i);
    }

    return numbers;
  }
}
```

Decorators use a special syntax that starts with an `@` sign followed by the name of a function.

Let's create our `captureTime` decorator function:

```js
function captureTime(target, name, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    console.time(name);
    const result = original.apply(this, args);
    console.timeEnd(name);
    return result;
  };
}
```

Decorators are just functions that receive information about the function being decorated. Our `captureTime` decorator function will receive the following parameters:

* `target`: The `prototype` of the class that the decorated method belongs to (`Foo.prototype`)
* `name`: The name of the decorated method in the class (`bar`)
* `descriptor`: A descriptor object, which is the same descriptor object that would be passed to [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

The decorated function can be accessed from the descriptor object at `descriptor.value`. Here, we replaced the decorated function with one that adds in time logging.

[Try it out here](https://jsbin.com/teleridahi/1/edit?js,console)

Let's say we want to allow developers the option to specify a label for `console.time()` and `console.timeEnd()` instead of using the method name (`bar` in this example). We can modify our decorator so that it receives a label as an argument:

```js
class Foo {
  @captureTime('my custom label')
  bar() {
    return this.baz().join(', ');
  }

  baz() {
    const numbers = [];

    for (let i = 0; i < 100; i++) {
      numbers.push(i);
    }

    return numbers;
  }
}
```

Then, we can modify our decorator function like so:

```js
function captureTime(label) {
  return function(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args) {
      console.time(label || name);
      let result = original.apply(this, args);
      console.timeEnd(label || name);
      return result;
    };
  }
}
```

[Try it out here](https://jsbin.com/diroguziyi/edit?js,console)
