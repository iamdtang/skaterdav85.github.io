---
layout: post
title:  "Testing with Ember Data RecordArrays"
date:   2015-11-09
description: How do you go about testing controllers, components, and services that are given Ember Data objects like DS.AdapterPopulatedRecordArray or DS.RecordArray? Let me show you!
keywords: Ember, testing, unit testing, ember data, JavaScript, unit test, Ember.js, EmberJS, AdapterPopulatedRecordArray, RecordArray, ArrayProxy, DS
---

Recently I was in a situation where I had a list of Ember Data records and I wanted to write a unit test for a computed property in my controller that returned the most recent record. My model hook called `query` on the store for all `cat` objects:

```js
export default Ember.Route.extend({
  model() {
    return this.store.query('cat', {
      alive: true
    });
  }
});
```

When I went to write my test for this computed property, I wasn't sure how to set up my fixture data. The `model` in the controller wasn't a regular array. If you call `query` on the store, you get an instance of `DS.AdapterPopulatedRecordArray`. Similarly, if you call `findAll` on the store, you get an instance of `DS.RecordArray`. You can find out the type of object you are dealing with by calling `toString()` on the `model`.

```js
export default Ember.Route.extend({
  model() {
    return this.store.query('cat', {
      alive: true
    });
  },

  afterModel(model) {
    console.log(model.toString()); // <DS.AdapterPopulatedRecordArray:ember363>
  }
});
```

So I started wondering, how do you create test fixtures using these types to simulate what you'd get from the route? My first thought was to manually create an instance of `DS.AdapterPopulatedRecordArray`. Seemed reasonable, but I didn't find much in the documentation on how to do that. After a few failed attempts, I figured that wasn't the way to go. Then I clicked on the class it extended from [DS.RecordArray](http://emberjs.com/api/data/classes/DS.RecordArray.html) and noticed that it states:

> A record array is an array that contains records of a certain type. The record array materializes records as needed when they are retrieved for the first time. __You should not create record arrays yourself.__ Instead, an instance of DS.RecordArray or its subclasses will be returned by your application's store in response to queries.

That eliminated the first two options. After some digging and thanks to Jason Mitchell on [Ember Discussion Forum](http://discuss.emberjs.com/t/how-do-i-fake-out-the-data-that-a-component-receives-from-the-store/9044/5), I was pointed to `Ember.ArrayProxy`. Turns out that both `DS.AdapterPopulatedRecordArray` and `DS.RecordArray` extend from `Ember.ArrayProxy`. This is the full class hierarchy:

<div style="text-align:center;">
  <img src="/images/ember-data-class-hierarchy.jpeg" alt="Ember Data DS.AdapterPopulatedRecordArray hierarchy" style="width:inherit;">
</div>

With that, I was able to write my unit test by simulating `DS.AdapterPopulatedRecordArray` with an `Ember.ArrayProxy`.

```js
// tests/unit/controllers/dashboard-test.js
test('it shows the latest cat added to my family', function(assert) {
  var controller = this.subject();

  controller.set('model', Ember.ArrayProxy.create({
    content: [
      Ember.Object.create({
        id: 1,
        name: 'Tubby',
        adopted_at: new Date('2015-09-25T21:44:24.6496202Z')
      }),
      Ember.Object.create({
        id: 2,
        name: 'Biscuit',
        adopted_at: new Date('2015-10-21T23:30:54.217Z')
      }),
      Ember.Object.create({
        id: 3,
        name: 'Chester',
        adopted_at: new Date('2015-09-29T21:37:33.1677559Z')
      }),
      Ember.Object.create({
        id: 4,
        name: 'Fiona',
        adopted_at: new Date('2015-10-07T19:24:36.763Z')
      })
    ]
  }));

  assert.equal(controller.get('mostRecentAdoptedCat.name'), 'Biscuit');
});
```

Each element in the `Ember.ArrayProxy` is an `Ember.Object` simulating the `cat` model. Here is the implementation of the `mostRecentAdoptedCat` computed property:

```js
// app/controllers/dashboard.js
export default Ember.Controller.extend({
  mostRecentAdoptedCat: Ember.computed('model', function() {
    return this.get('model')
      .sortBy('adopted_at')
      .reverseObjects()
      .objectAt(0);
  })
});
```

__Edit__

Thanks to Andrey and Jakub in the comments, I've learned you can simply use a regular array instead of an `Ember.ArrayProxy`. If prototype extensions are enabled, which they are by default, Ember extends `Array.prototype` with a mixin `Ember.Array`. As noted in the API documentation:

> This mixin implements Observer-friendly Array-like behavior. It is not a concrete implementation, but it can be used up by other classes that want to appear like arrays.

`Ember.ArrayProxy` also uses the `Ember.Array` mixin. If you have turned off prototype extensions, then you simply use `Ember.A` to create your array. The test can be revised to the following:

```js
test('it shows the latest cat added to my family', function(assert) {
  var controller = this.subject();

  controller.set('model', [
    Ember.Object.create({
      id: 1,
      name: 'Tubby',
      adopted_at: new Date('2015-09-25T21:44:24.6496202Z')
    }),
    Ember.Object.create({
      id: 2,
      name: 'Biscuit',
      adopted_at: new Date('2015-10-21T23:30:54.217Z')
    }),
    Ember.Object.create({
      id: 3,
      name: 'Chester',
      adopted_at: new Date('2015-09-29T21:37:33.1677559Z')
    }),
    Ember.Object.create({
      id: 4,
      name: 'Fiona',
      adopted_at: new Date('2015-10-07T19:24:36.763Z')
    })
  ]);

  assert.equal(controller.get('mostRecentAdoptedCat.name'), 'Biscuit');
});
```

This feels much more natural!

## Summary

In your unit tests you can often times use a standard array as a substitute for an array-like object from the store, such as `DS.AdapterPopulatedRecordArray` or `DS.RecordArray`, because Ember extends both with the `Ember.Array` mixin.
