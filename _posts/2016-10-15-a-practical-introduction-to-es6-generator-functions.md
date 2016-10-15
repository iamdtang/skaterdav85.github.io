---
layout: post
title: A Practical Introduction to ES6 Generator Functions
date: 2016-10-15
description: TBA
keywords: es6, generators, generator function, iterator, es2015, function star, asterisk function, generator tutorial, function*
---

Generator functions, also called generators for short, are an ES6/ES2015 feature that might seem confusing at first with little practicality. However, once you take the time to learn how they work and see some practical examples, you'll really see how powerful and useful they can be. In this post, we'll cover the following:

* [What are Generator Functions](#what-are-generator-functions)
* [How Generator Functions Work](#how-generator-functions-work)
* [Generator Functions and Promises](#generator-functions-and-promises)
* [Generator Examples in the Wild](#generator-examples-in-the-wild)

## What are Generator Functions?

Functions in JavaScript are known as "run to completion". When a function is invoked, the body of the function will execute until it reaches the end of the body. The function can't be paused for other code to execute.

Generator functions however are not "run to completion". Generator functions can be paused and resumed so that other code can execute in between. The great thing about this behavior is that we can use generators to manage flow control. Because generators allow us to pause execution, we can easily cancel asynchronous operations. Generators also allow us to turn asynchronous code into synchronous-looking code.

For example, instead of our code looking like this:

```js
Artist.findByID(id).then((artist) => {
  artist.getSongs().then((songs) => {
    console.log(songs);
  });
});
```

Imagine if our code looked like this instead:

```js
let artist = yield Artist.findByID(id);
let songs = yield artist.getSongs();
console.log(songs);
```

This code is much more synchronous-looking and easier to read.

## How Generator Functions Work

A generator function is declared just like a regular function but with an asterisk after the `function` keyword:

```js
function *doSomethingAsync() {}
// or
function* doSomethingAsync() {}
// or
function*doSomethingAsync() {}
```

These are all functionally the same, just stylistically different. You can also have anonymous generator functions:

```js
function*() {}
// or
function *() {}
// or
function* () {}
```

When you invoke a generator function, it won't execute the body of the function like a regular function. Instead, it will return a generator object called an iterator. Iterators are a topic for another blog post, but in the context of a generator, it is an object that controls the execution of the generator function via a `next()` method. Let's look at an example.

```js
function *myGenerator() {
  console.log(1);
  let a = yield 'first yield';
  console.log(a);
  let b = yield 'second yield';
  console.log(b);
  return 'hi';
}

let iterator = myGenerator();
let firstYield = iterator.next(); // { value: 'first yield', done: false }
```

Here, we've defined a generator function called `myGenerator` and we've created the iterator object by invoking the generator function `myGenerator`. At this point, the body of `myGenerator` hasn't started executing. It isn't until we call `iterator.next()` when the body of `myGenerator` starts executing. By calling `iterator.next()`, the generator's body will execute until the first `yield` statement and then pause. With the code above, we'll see `1` and `{ value: 'first yield', done: false }` logged to the console. Calling `iterator.next()` returned an object in the format `{ value: 'Any value', done: 'Boolean' }`. The `value` property in this object is the value next to the `yield` statement. The `done` property is a boolean indicating whether the generator has finished executing or not. Basically the `yield` statement allows us to send values to the caller of the generator function. Let's resume the generator function.

```js
function *myGenerator() {
  console.log(1);
  let a = yield 'first yield';
  console.log(a); // 2
  let b = yield 'second yield';
  console.log(b); // 3
  return 'hi';
}

let iterator = myGenerator();
let firstYield = iterator.next(); // { value: 'first yield', done: false }
let secondYield = iterator.next(2); // { value: 'second yield', done: false }
let generatorReturnValue = iterator.next(3); // { value: 'hi', done: true }
```

When we call `iterator.next()` a second time but pass in `2` (`iterator.next(2)`), we'll see that we can pass values back into the generator function as the result of a `yield` statement, and thus the variable `a` gets assigned `2`. The generator will resume execution until the second `yield` statement, and then pause again. By calling `iterator.next(3)`, the generator will resume and the variable `b` in the generator will get assigned `3`, and the generator will finish executing, resulting in `iterator.next(3)` returning `{ value: 'hi', done: true }`. Notice how `done` is now `true`, and `value` is the return value of the generator function.

This example illustrates the basics of how generators work. We used the `yield` keyword to pause the generator and send values to the caller. We can resume the execution of the generator by calling `next()` on the iterator, optionally passing in an argument which allows us to send data back to the generator.

## Generator Functions and Promises

Generators work really well with promises. We can create an abstraction that allows us to yield promises, and only resume the generator function if yielded promises resolve.

Our end goal is that we want to write some asynchronous code like this:

```js
task(function *() {
  let artist = yield Artist.findByID(1);
  let songs = yield artist.getSongs();
  console.log(artist, songs);
});
```

This code has 2 asynchronous calls, `Artist.findByID()` and `artist.getSongs()`.

To enable synchronous-looking code like this, we'll create a wrapper function called `task` that will accept a generator function and invoke it. It will keep calling `iterator.next()` each time a _promise_ is yielded and resolves.

```js
function task(generator) {
  let iterator = generator(); // create generator object
  recursivelyNext();

  // this functions keeps calling next() if a promise is yielded
  function recursivelyNext(data) {
    let yielded = iterator.next.apply(iterator, arguments); // { value: Any, done: Boolean }

    if (isPromise(yielded.value)) {
      yielded.value.then((data) => {
        recursivelyNext(data);
      });
    }
  }
}

function isPromise(val) {
  return val && typeof val.then === 'function';
}
```

This is a small abstraction for learning purposes. Turns out, there are already great libraries out there that do this better, like [co](https://github.com/tj/co).


## Generator Examples in the Wild

### 1. co

The [co](https://github.com/tj/co) library is a Node.js generator-based library for managing flow control. Similar to the abstraction written above, we can achieve the same with `co`:

```js
co(function *() {
  let artist = yield Artist.findByID(1);
  let songs = yield artist.getSongs();
  console.log(artist, songs);
}).catch(function(err) {
  console.error(err);
});
```

The `co` function takes a generator function, invokes it, and returns a promise. In this example, instead of calling `.then()` for `Artist.findByID(1)` and `artist.getSongs()`, we're using `yield` statements to wait for the promises to resolve before continuing. Check out the library for more examples.

### 2. koa

[koa](http://koajs.com/) has labeled itself as "the next generation web framework for node.js". It is a lot like Express, but makes use of generator functions. In fact, koa was created by the team behind Express. koa doesn't ship with a router. At the time of this writing, [koa-router](https://github.com/alexmingoia/koa-router) is a popular option. Here is an example of an API endpoint to delete a song resource.

```js
router.del('/api/songs/:id', function *(next) {
  let song = yield Song.findById(this.params.id); // async
  if (!song) {
    let response = new NotFoundResponse(`Song ${this.params.id} not found`);
    this.status = response.status;
    return this.body = response.body;
  }

  yield song.destroy(); // async
  this.status = 204;
});
```

### 3. Ember Concurrency

Even if you don't work in Ember, you've probably experienced the problem I'm about to describe in your client-side JavaScript application.

> "[ember-concurrency](http://ember-concurrency.com/) enables you to write Tasks, which are asynchronous, cancelable operations that are bound to the lifetime of the object they live on, which means when the host object is destroyed (e.g. a component is unrendered), the task is automatically canceled."

For example, say you have a button component that takes in a function that performs some asynchronous action when that button is clicked. The button might show a spinner when it is pending and goes back to the default state when the promise resolves.

In Ember, it might look something like this:

{% raw %}
```html
{{#async-button action=(action "someAsyncFunction")}}Save{{/async-button}}
```
{% endraw %}

and the component definition:

```js
export default Ember.Component.extend({
  tagName: 'button',
  click(e) {
    e.preventDefault();
    this.set('pending', true);
    this.get('action')().then(() => {
      // what if the user navigates to another route before
      // this promise resolves?
      this.set('pending', false);
    });
  }
});
```

In the success handler of the promise, the `pending` flag is set back to `false` since the async action has resolved. But what if the component is no longer on the page? The user could have navigated away. If the component is no longer on the page, your app will throw an error saying that you cannot call `this.set()` on a destroyed object. ember-concurrency solves this problem with the use of generators.

```js
export default Ember.Component.extend({
  tagName: 'button',
  clickTask: task(function *() {
    this.set('pending', true);
    yield this.get('action')();

    // never executed if user navigates away and component is destroyed
    this.set('pending', false);
  }),
  click(e) {
    e.preventDefault();
    this.get('clickTask').perform();
  }
});
```

Because generators are functions that can be paused in the middle, ember-concurrency can decide whether to continue executing the generator function if the component is still on the page or not. If the button is no longer on the page, the iterator's `next()` method won't be called, and anything after `yield` won't get executed. Through generators, ember-concurrency allows us to cancel asynchronous operations.

## Conclusion

Generators are functions that are not "run to completion". They are functions that can be paused and resumed, allowing for abstractions to be written so that we can do things like turn asynchronous code into synchronous-looking code and cancel asynchronous operations.
