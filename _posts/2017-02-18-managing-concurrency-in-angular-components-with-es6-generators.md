---
layout: post
title: Managing Concurrency in Angular Components with ES6 Generators
date: 2017-02-18
description: One idea I've been been experimenting with in an Angular 1.5 application I've been working on is using ES6 generators to manage concurrency in components.
keywords: angular 1.5, components, component, generator, es6, generators, generator functions, asychronous, async, ember-concurrency, concurrency, es2015
---

One idea I've been been experimenting with in an Angular 1.5 application I've been working on is using ES6 generators to manage concurrency in components.

Let's say you have a reusable `async-button` component that takes in a function that does something asychronous. When the button is clicked, the function is executed and the component controls the label of the button depending on the state of the asynchronous operation. Invoking the component might look like this:

```html
<async-button action="$ctrl.save" default="Save" pending="Saving ..." />
```

And the corresponding component definition:

```js
app.component('asyncButton', {
  bindings: {
    action: '<',
    pending: '@',
    default: '@'
  },
  template: `
    <button ng-click="$ctrl.handleAction()">
      <span ng-if="$ctrl.isRunning">{{$ctrl.pending}}</span>
      <span ng-if="!$ctrl.isRunning">{{$ctrl.default}}</span>
    </button>
  `,
  controller: function() {
    this.handleAction = function() {
      this.isRunning = true;
      this.action().then(() => {
        this.isRunning = false;
      });
    };
  }
});
```

[Try it out in Plunkr here](https://plnkr.co/edit/P4bLJ5uyCV3mSqQXQylN?p=preview).

## The Problem

This works, but it has a downside. If the user clicks the button and then navigates away from the page, causing this component to be destroyed, the success handler will still execute. That is, the following function still executes:

```js
() => {
  this.isRunning = false;
}
```

This doesn't trigger any errors, but the work is unnecessary. This small example isn't doing a whole lot when `action` resolves, but maybe you have other components that are doing much more. No point in having your app do extra work if it doesn't need to.

## Solution 1

One way to solve this is to set some flags in the component using the lifecycle hooks `$onInit` and `$onDestroy`. However, this isn't very reusable and can affect the clarity of the code.

## Solution 2

In the Ember ecosystem there is an awesome library called [ember-concurrency](http://ember-concurrency.com/#/docs) that was developed to solve challenges like this. This library takes advantage of ES6 generator functions. If you aren't familiar with generator functions, check out my other post [A Practical Introduction to ES6 Generator Functions](/2016/10/15/a-practical-introduction-to-es6-generator-functions.html). Because generator functions are not "run to completion" and can be paused, ember-concurrency can effectively cancel an asynchronous operation if a component goes out of scope.

So how can we do something similar with our Angular 1.5 components?

First, I've created a base controller class to set flags in the `$onInit` and `$onDestroy` lifecycle hooks that indicate if the component has been destroyed or not. This class can be a base controller class for any component. You don't have to use ES6 classes if you don't want to, but I find it cleaner than doing inheritance the ES3/ES5 way.

```js
class ConcurrentController {
  $onInit() {
    this._isDestroyed = true;
  }
  $onDestroy() {
    this._isDestroyed = false;
  }
}
```

Next, I've modified the `async-button` component so that the controller property is a class that extends from `ConcurrentController`.

```js
app.component('asyncButton', {
  bindings: {
    action: '<',
    pending: '@',
    default: '@'
  },
  template: `
    <button ng-click="$ctrl.handleAction()">
      <span ng-if="$ctrl.isRunning">{{$ctrl.pending}}</span>
      <span ng-if="!$ctrl.isRunning">{{$ctrl.default}}</span>
    </button>
  `,
  controller: class AsyncButtonController extends ConcurrentController {
    constructor() {
      super();
      this.handleAction = task(function *() {
        try {
          this.isRunning = true;
          yield this.action();
          console.log('only executed if component still exists');
        } catch (e) {
          console.log(e);
        } finally {
          this.isRunning = false;
        }
      }, this);
    }
  }
});
```

The basic idea here is that `handleAction` will be a function on our controller that executes our generator function containing all of our original async code. Instead of calling `this.action().then()`, we can `yield` promises, and the code will only continue once a promise resolves. If the promise rejects, the catch block will get triggered.

The `task` function, designed similarly to ember-concurrency, takes in a generator and returns a new function that executes our generator. When `task` is executing the generator, it checks in the promise handlers if the component has been destroyed. If a component has been destroyed, the generator will not execute any success or rejection promise handlers, resulting in the component not having to do any extra work.

Here is the implementation of `task`. The basic idea of `task` is that we can `yield` out promises and only continue executing the generator once the asynchronous operation has completed AND if the component hasn't been destroyed.

```js
function task(generator, controller) {
  return function() {
    let iterator = generator.call(controller);
    recursivelyCallNextOnIterator();

    // this function keeps calling next() if a promise is yielded
    function recursivelyCallNextOnIterator(data) {
      let yielded = iterator.next.apply(iterator, arguments);
      // yielded = { value: Any, done: Boolean }

      if (yielded.done) {
        return;
      }

      if (isPromise(yielded.value)) {
        yielded.value.then((data) => {
          if (controller._isDestroyed) {
            recursivelyCallNextOnIterator(data);
          }
        }, (e) => {
          if (controller._isDestroyed) {
            iterator.throw(e);
          }
        });
      }
    }
  };

  function isPromise(value) {
    return value && typeof value.then === 'function';
  }
}
```

[Try this out in Plunkr](https://plnkr.co/edit/ohRuZ0BSoNtC8iuEmmla?p=preview).

Now, if you click on the `async-button` component, it still triggers the async operation, but if you click to another route before the async operation has completed (under 3 seconds in the Plunkr), effectively destroying the component, then the generator will stop executing, preventing the component from doing any unnecessary work.

## Summary

Generator functions can be paused and resumed so that other code can execute in between. We can take advantage of this feature to check whether a component should continue to execute asynchronous handlers based on if the component has been destroyed or not. I like this approach because not only is it reusable, it also has the side effect of making async code look synchronous. How do you manage concurrency in your Angular apps? Let me know in the comments.
