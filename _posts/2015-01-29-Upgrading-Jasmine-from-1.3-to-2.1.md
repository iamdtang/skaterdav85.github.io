---
layout: post
title:  "Upgrading Jasmine from 1.3 to 2.1"
date:   2015-01-29
keywords: Upgrading Jasmine, Jasmine migration path, Jasmine framework, Upgrading jasmine framework
---

Recently I upgraded the unit tests for a work project from using Jasmine 1.3 to Jasmine 2.1. The suite had about 400 tests. When I upgraded, only about 60 tests broke due to Jasmine API changes. Here are some of the differences I found between Jasmine 1.3 and Jasmine 2.1. The process took me about 2 hours. Hopefully this post will make the upgrade path a little faster for someone else.

## Spy Changes

#### 1. .andReturn()

```js
spyOn(calculator, 'add').andReturn(5);
// now becomes
spyOn(calculator, 'add').and.returnValue(5);
```

#### 2. spy.calls

```js
expect(spy.calls[0].args[0]).toEqual(2);
// now becomes
expect(spy.calls.argsFor(0)[0]).toEqual(2);
```

#### 3. .callCount

```js
expect(spy.callCount).toEqual(1);
// now becomes
expect(spy.calls.count()).toEqual(1);
```

#### 4. .andCallThrough()

```js
var renderSpy = spyOn(view, 'render').andCallThrough();
// now becomes
var renderSpy = spyOn(view, 'render').and.callThrough();
```

#### 5. .andCallFake() 

```js
spyOn(ProductAvailability.prototype, 'isAvailable').andCallFake(function() {});
// now becomes
spyOn(ProductAvailability.prototype, 'isAvailable').and.callFake(function() {});
```

#### 6. spy.mostRecentCall

```js
expect(spy.mostRecentCall.args[0]).toEqual(6);
// now becomes
expect(spy.calls.mostRecent().args[0]).toEqual(6);
```

#### 7. .toThrow()

```js
expect(function() { 
    imageView.render();
}).toThrow('A basePath must be set.');

// now becomes

expect(function() {
    imageView.render();
}).toThrowError('A basePath must be set.');
```


## Comparing Objects


When comparing objects in Jasmine 1.3, the following would pass:

```js
expect({ name: 'David', bio: undefined }).toEqual({ name: 'David' });
```

Having a property `bio` set to undefined would be the same as not having the `bio` property at all. This no longer passes in Jasmine 2.1. Instead, the key must exist on both objects.

```js
expect({ name: 'David', bio: undefined }).toEqual({ name: 'David', bio: undefined });
```


## Asynchronous Testing

The change in the asynchronous testing API is one of the main reasons I wanted to upgrade Jasmine to 2.1. In Jasmine 1.3, you had to use `runs()` and `waitsFor()` to test asynchronous code. This was a little clunky, hard to remember, and made tests more difficult to understand.

```js
it('should resolve with the Rewards object', function() {
    var flag = false;
    var resolveValue;

    runs(function() {
        var dfd = new $.Deferred();
        var promise = dfd.promise();

        dfd.resolve({ points: 5 });
        spyOn(Rewards.prototype, 'fetch').and.returnValue(promise);

        Rewards.get().then(function(rewards) {
            flag = true;
            resolveValue = rewards;
        });
    });

    waitsFor(function() {
        return flag;
    }, 'get should resolve with the model', 500);

    runs(function() {
       expect(resolveValue instanceof Rewards).toBe(true);
    });
});
```

In Jasmine 2.1, it works similar to asynchronous testing in Mocha. When `done()` is called, it signifies that this test has completed. Much less code and no more polling!


```js
it('should resolve with the Rewards object', function(done) {
    var dfd = new $.Deferred();
    var promise = dfd.promise();

    dfd.resolve({ points: 5 });
    spyOn(Rewards.prototype, 'fetch').and.returnValue(promise);

    Rewards.get().then(function(rewards) {
        expect(rewards instanceof Rewards).toBe(true);
        done();
    });
});
```

## Conclusion

These are just some of the differences I came across when upgrading from Jasmine 1.3 to 2.1. If there are others, please let me know in the comments and I will be sure to add them to this post.

