---
layout: post
title:  "Testing Services in Angular.js"
date:   2015-01-13
keywords: Testing services in Angular, Unit Testing Angular services, Unit tests, Jasmine unit testing
image: angular
---

Getting started with unit testing your Angular code can be tricky due to setting up your test runner, learning some of the conventions, and figuring out how dependency injection works with your tests. One of the first things you will probably want to test are your services. There are two ways to inject services into your unit tests.

__Note:__ Angular mocks provides global functions like `module()` and `inject()`. These functions are just shortcuts to `angular.mocks.module()` and `angular.mocks.inject()`.

## Approach 1 - Inject per Test

```js
describe('Some test', function() {
  beforeEach(module('catalog'));

  it('should test something', inject(function($rootScope, Product) {
    console.log($rootScope, Product);
  }));

  it('should test another thing', inject(function($rootScope, Product) {
    console.log($rootScope, Product);
  }));
});
```

Because services are not globally accessible, they need to be injected into your tests first. Here we can use the global `inject` function (a shortcut to `angular.mocks.inject`) provided in Angular mocks to inject services into each test function. This isn't too different than our standard Jasmine unit tests. The one downside to this approach is that you have to constantly wrap your test function in `inject`.

## Approach 2 - The Underscore Convention

```js
describe('Some test', function() {
  var $log, Product;

  beforeEach(module('catalog'));

  beforeEach(inject(function(_$log_, _Product_) {
    $log = _$log_;
    Product = _Product_;
  }));

  it('should...', function() {
    // access to $log and Product here
  });
});
```

The underscore convention approach uses the global `inject` function within a `beforeEach` block. If you look at the function passed to `inject`, the parameters of the function are the `$log` and `Product` services wrapped with underscores. Angular will `toString()` this function and strip away the underscores to figure out the names of the services to inject, in this case the `$log` and `Product` services. It is a little wierd at first, but this approach allows you to inject services once, store them off into other variables (in this case `$log` and `Product`) that can be accessed by all unit tests within this test case. If Angular didn't use the underscore convention, then you would have to save off the service into a variable named something different than the service name. This wouldn't be as intuitve. As a hypothetical example:

```js
// hypothetical example
describe('Some test', function() {
  var $logService, ProductModel;

  beforeEach(inject(function($log, Product) {
    $logService = $log;
    ProductModel = Product;
  }));
});
```

## Conclusion

My personal preference is to use the underscore convention (approach 2). I like this approach because it allows my tests to look less Angularish which can be confusing since I switch between Angular and non-Angular test suites frequently. In the end, the approach you choose really comes down to personal preference.
