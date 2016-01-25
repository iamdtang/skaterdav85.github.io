---
layout: post
title:  "Mocking Services in Angular with $provide"
date:   2015-01-28
keywords: Mocking in Angular, Testing services in Angular, Unit Testing Angular services, Unit tests, Jasmine unit testing
---

In Angular, we can mock out services using [$provide](https://docs.angularjs.org/api/auto/service/$provide). Let's look at a simple example.

```js
var app = angular.module('my-site', []);

app.factory('locale', function($window) {
  return $window.location.pathname.split('/')[1];
});

app.factory('currency', function(locale) {
  switch(locale) {
    case 'en-us':
    return 'usd';
    case 'de-de':
    return 'euro';
  }
});
```

Here we have two services using the `.factory()` API in our module. The first service is `locale` and it reads the locale from the URL. The locale would be something like _en-us_, _de-de_, etc. The second service is `currency` and it returns the currency based on the user's locale. `currency` is dependent on the `locale` service.

When we unit test `currency`, we want to mock out `locale` because there is no URL to read the locale from in the test environment. We want to test `currency` in isolation and see how `currency` behaves for the different values that `locale` could be. Here is a corresponding unit test:

```js
describe('currency', function() {
  beforeEach(module('my-site'));
  beforeEach(module(function($provide) {
    $provide.value('locale', 'en-us');
  }));

  it('should be usd if the locale is en-us', inject(function(currency) {
    expect(currency).toEqual('usd');
  }));
});
```

In this example `$provide.value()` is used to mock out the value of the `locale` service. Whenever a service asks for `locale` from Angular, Angular will instead inject this mock value instead of trying to get the locale from the URL as defined in the original `locale` service.

`$provide` has methods for mocking out other Angular services including factories, providers, services with the `.service()` API, values, and constants. For example, the above test could also be written using `$provide.factory()`:

```js
describe('currency', function() {
  beforeEach(module('my-site'));
  beforeEach(module(function($provide) {
    $provide.factory('locale', function() {
      return 'en-us';
    });
  }));

  it('should be usd if the locale is en-us', inject(function(currency) {
    expect(currency).toEqual('usd');
  }));
});
```

`$provide` is a useful service in unit testing to mock out service dependencies and isolate the service under test.
