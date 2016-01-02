---
layout: post
title:  "Jasmine vs. Mocha, Chai, and Sinon"
date:   2015-01-12
keywords: Jasmine unit testing, Jasmine vs. Mocha, Jasmine spies vs Sinon, JavaScript unit testing, Introduction to Sinon.js, Sinon Tutorial
---

__This article was updated on 4/15/15 to reflect Jasmine 2.x and updated again on 1/2/16__

Testing in JavaScript is becoming expected by developers more and more. But where do you start? There are so many framework choices out there. It can feel pretty overwhelming. This post is a quick overview of the differences between two popular JavaScript testing frameworks: [Jasmine 2](http://jasmine.github.io/) and [Mocha](https://mochajs.org/). We will also discuss commonly used libraries, [Chai](http://chaijs.com/) and [Sinon](http://sinonjs.org/), that are often used in conjunction with Jasmine and Mocha.

## 1. API

The APIs of Jasmine and Mocha are very similar. They both allow you to write your tests in the behaviour driven development (BDD) style. You might ask, "What is BDD?". In short, BDD is simply a style of writing tests that focusses on the language used.

```js
describe('calculator', function() {
  describe('add()', function() {
    it('should add 2 numbers togoether', function() {
      // assertions here
    });
  });
});
```

The assertions, or expectations as they are often called, are where things start to differ. Mocha does not have a built in assertion library. There are several options though for both Node and the browser: Chai, should.js, expect.js, and better-assert. A lot of developers choose Chai as their assertion library. Because none of these assertion libraries come with Mocha, this is another thing you will need to load into your test harness. Chai comes with three different assertion flavors. It has the `should` style, the `expect` style, and the `assert` style. The `expect` style is similar to what Jasmine provides. For example, if you want to write an expectation that verifies `calculator.add(1, 4)` equals 5, this is how you would do it with both Jasmine and Chai:

__Jasmine__

```js
expect(calculator.add(1, 4)).toEqual(5);
```

__Chai__

```js
expect(calculator.add(1, 4)).to.equal(5);
```

Pretty similar right? If you are switching from Jasmine to Mocha, the path with the easiest learning curve is to use Chai with the `expect` style.

## 2. Test Doubles

Test doubles are often compared to stunt doubles, as they replace one object with another for testing purposes, similar to how actors and actresses are replaced with stunt doubles for dangerous action scenes. In Jasmine, test doubles come in the form of spies. A spy is a function that replaces a particular function where you want to control its behavior in a test and record how that function is used during the execution of that test. Some of the things you can do with spies include:

* See how many times a spy was called
* Specify a return value to force your code to go down a certain path
* Tell a spy to throw an error
* See what arguments a spy was called with
* Tell a spy to call the original function (the function it is spying on). By default, a spy will not call the original function.

In Jasmine, you can spy on existing methods like this:

```js
var userSaveSpy = spyOn(User.prototype, 'save');
```

You can also create a spy if you do not have an existing method you want to spy on.

```js
var spy = jasmine.createSpy();
```

In contrast, Mocha does not come with a test double library. Instead, you will need to load in Sinon into your test harness. Sinon is a very powerful test double library and is the equivalent of Jasmine spies with a little more. One thing to note is that Sinon breaks up test doubles into three different categories: [spies](http://sinonjs.org/docs/#spies), [stubs](http://sinonjs.org/docs/#stubs), and [mocks](http://sinonjs.org/docs/#mocks), each with subtle differences.

A spy in Sinon calls through to the method being spied on whereas you have to specify this behavior in Jasmine. For example:

```js
spyOn(user, 'isValid').andCallThrough() // Jasmine
// is equivalent to
sinon.spy(user, 'isValid') // Sinon
```

In your test, the original `user.isValid` would be called.

The next type of test double is a stub, which acts as a controllable replacement. Stubs are similar to the default behavior of Jasmine spies where the original method is not called. For example:

```js
sinon.stub(user, 'isValid').returns(true) // Sinon
// is equivalent to
spyOn(user, 'isValid').andReturns(true) // Jasmine
```

In your code, if `user.isValid` is called during the execution of your tests, the original `user.isValid` would not be called and a fake version of it (the test double) that returns `true` would be used.

From my experience, Jasmine spies cover almost everything I need for test doubles so in many situations you won't need to use Sinon if you are using Jasmine, but you can use the two together if you would like. One reason I do use Sinon with Jasmine is for its fake server (more on this later).


## 3. Asynchronous Tests

Asynchronous testing in Jasmine 2.x and Mocha is the same.

```js
it('should resolve with the User object', function(done) {
  var dfd = new $.Deferred();
  var promise = dfd.promise();
  var stub = sinon.stub(User.prototype, 'fetch').returns(promise);

  dfd.resolve({ name: 'David' });

  User.get().then(function(user) {
    expect(user instanceof User).toBe(true);
    done();
  });
});
```

Above, `User` is a constructor function with a static method `get`. Behind the scenes, `get` uses `fetch` which performs the XHR request. I want to assert that when `get` resolves successfully, the resolved value is an instance of `User`. Because I have stubbed out `User.prototype.fetch` to return a pre-resolved promise, no real AJAX request is made. However, this code is still asynchronous.

By simply specifying a parameter in the `it` callback function (I have called it `done` like in the documentation but you can call it whatever you want), the test runner will pass in a function and wait for this function to execute before ending the test. The test will timeout and error if `done` is not called within a certain time limit. This gives you full control on when your tests complete. The above test would work in both Mocha and Jasmine 2.x.

If you are working with Jasmine 1.3, asynchronous testing was not so pretty.

__Example Jasmine 1.3 Asynchronous Test__

```js
it('should resolve with the User object', function() {
  var flag = false;
  var david;

  runs(function() {
    var dfd = new $.Deferred();
    var promise = dfd.promise();

    dfd.resolve({ name: 'David' });
    spyOn(User.prototype, 'fetch').andReturn(promise);

    User.get().then(function(user) {
      flag = true;
      david = user;
    });
  });

  waitsFor(function() {
    return flag;
  }, 'get should resolve with the model', 500);

  runs(function() {
    expect(david instanceof User).toBe(true);
  });
});
```

In this Jasmine 1.3 asynchronous test example, Jasmine will wait a maximum of 500 milliseconds for the asynchronous operation to complete. Otherwise, the test will fail. `waitsFor()` is constantly checking to see if `flag` becomes true. Once it does, it will continue to run the next `runs()` block where I have my assertion.


## 4. Sinon Fake Server

One feature that Sinon has that Jasmine does not is a fake server. This allows you to setup fake responses to AJAX requests made for certain URLs.

```js
it('should return a collection object containing all users', function(done) {
  var server = sinon.fakeServer.create();
  server.respondWith("GET", "/users", [
    200,
    { "Content-Type": "application/json" },
    '[{ "id": 1, "name": "Gwen" },  { "id": 2, "name": "John" }]'
  ]);

  Users.all().done(function(collection) {
    expect(collection.toJSON()).to.eql([
      { id: 1, name: "Gwen" },
      { id: 2, name: "John" }
    ]);

    done();
  });

  server.respond();
  server.restore();
});
```

In the above example, if a `GET` request is made to `/users`, a 200 response containing two users, Gwen and John, will be returned. This can be really handy for a few reasons. First, it allows you to test your code that makes AJAX calls regardless of which AJAX library you are using. Second, you may want to test a function that makes an AJAX call and does some preprocessing on the response before the promise resolves. Third, maybe there are several responses that can be returned based on if the request succeeds or fails such as a successful credit card charge, an invalid credit card number, an expired card, an invalid CVC, etc. You get the idea. If you have worked with Angular, Sinon's fake server is similar to the _$httpBackend_ service provided in angular mocks.

## Conclusion

In conclusion, the Jasmine framework has almost everything built into it including assertions/expectations and test double utilities (which come in the form of spies). On the other hand, Mocha is just a test runner and does not include assertion and test double utilities. There are several choices for assertions when using Mocha, and Chai tends to be the most popular. Test doubles in Mocha also requires another library, and Sinon.js is often the de-facto choice. Sinon can also be a great addition to your test harness for its fake server implementation.

Trying to figure out testing libraries/frameworks to use for JavaScript can be tough but hopefully this article has made it more
clear as to what some of the main differences are between Jasmine and Mocha. You can't really go wrong with either choice.
Happy testing!

## Related Posts

* [Upgrading Jasmine from 1.3 to 2.x](/2015/01/29/Upgrading-Jasmine-from-1.3-to-2.1.html)
* [End To End Testing with PhantomJS and CasperJS](/2015/02/28/end-to-end-testing-with-phantomsjs-and-casperjs.html)
* [Angular Backend Definitions with _$httpBackend_](/angular.js/javascript/2014/01/20/backend-definitions-with-httpBackend.html)
* [Angular Request Expectations with _$httpBackend_]({% post_url 2014-01-18-request-expectations-with-httpBackend %})
