---
layout: post
title: Stubbing "Today" in JavaScript Unit Tests
date: 2016-06-21
description: One of the challenges of working with dates is unit testing code that depends on the current date. Let's look at how to stub out "today".
keywords: unit test, testing, moment, momentJS, current date, today, now, mocking Date, mock Date, fake Date, sinon Date, fake Date, stub Date, spy Date, spy moment, mock moment
image: javascript
---

One of the challenges of working with dates is unit testing code that depends on the current date. For example, let's say we have a purchase history, and we want to find all purchase transactions for today. Let's write a test for this:

```js
// purchases-test.js
var chai = require('chai');
var expect = chai.expect;
var purchases = require('./purchases');

describe('purchases', function() {
  beforeEach(function() {
    this.transactions = [
      { items: 3, timestamp: '2016-06-19T04:55:04.255892' },
      { items: 2, timestamp: '2016-06-19T01:33:04.255892' },
      { items: 4, timestamp: '2016-06-19T08:03:04.255892' },
      { items: 1, timestamp: '2016-06-17T05:40:04.255892' }
    ];
  });

  it('should return all the purchases for today', function () {
    expect(purchases(this.transactions).forToday()).to.eql([
      { items: 3, timestamp: '2016-06-19T04:55:04.255892' },
      { items: 2, timestamp: '2016-06-19T01:33:04.255892' },
      { items: 4, timestamp: '2016-06-19T08:03:04.255892' }
    ]);
  });
});
```

This test is written using Mocha and Chai. We have a module `purchases` that accepts an array of purchase transactions, and we call the `forToday()` method to filter this list of transactions to those that happened today. Here's the implementation of the `purchases` function.

```js
// purchases.js
var moment = require('moment');

module.exports = function(transactions) {
  return {
    forToday() {
      return transactions.filter(function(purchase) {
        var today = new Date();
        return moment(purchase.timestamp).isSame(today, 'day');
      });
    }
  }
};
```

Right now as I'm writing this post, the current day is 6/19/2016 and my test passes. However, if I run this same test tomorrow, or any other day in the future, the test will fail because my fixture data will no longer have items that represent the current day.

One way to fix this is to create a helper function for each transaction item that sets `timestamp` to the current day. This can work, but might sacrifice test readability a bit, especially if you need to account for very specific times. Also, if you're writing a test based on API data, you can't just copy that JSON data into your test. You'll have to go through it and modify your timestamp properties to use your helper function(s), which could get a little annoying.

An alternative approach I've taken is to override the native `Date` constructor with a mock, similar to how test libraries like Sinon and Pretender override `XMLHttpRequest`. The benefit to this is that you don't have to have helper function(s) to create that `timestamp` property. Instead, we can tell our test what the current date is in the setup phase, which will override `Date` behind the scenes. Whenever `new Date()` or `Date.now()` is called, the date you supplied will be used as today. Then in the tear down phase, we can restore `Date` back to the original implementation. Thankfully there is a library that can do this for us called <a href="https://www.npmjs.com/package/mockdate" target="_blank">mockdate</a>. Here is the updated test:

```js
// purchases-test.js
var chai = require('chai');
var expect = chai.expect;
var purchases = require('./purchases');
var MockDate = require('mockdate');

describe('purchases', function() {
  beforeEach(function() {
    MockDate.set('6/19/2016');
    this.transactions = [
      { items: 3, timestamp: '2016-06-19T04:55:04.255892' },
      { items: 2, timestamp: '2016-06-19T01:33:04.255892' },
      { items: 4, timestamp: '2016-06-19T08:03:04.255892' },
      { items: 1, timestamp: '2016-06-17T05:40:04.255892' }
    ];
  });

  afterEach(function() {
    MockDate.reset();
  });

  // ...
});
```

Notice how 6/19/2016, a date in the past, is being set as today in the test set up. Then in the test teardown, the original `Date` is restored. Take a look at the <a href="https://github.com/boblauer/MockDate/blob/master/src/mockdate.js" target="_blank">implementation of mockdate</a>. You can see that when `MockDate.set()` is called, the global `Date` is overridden.
