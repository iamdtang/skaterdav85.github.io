---
layout: post
title:  "Jasmine vs. Mocha, Chai, and Sinon"
date:   2015-01-12
keywords: Jasmine unit testing, Jasmine vs. Mocha, Jasmine spies vs Sinon, JavaScript unit testing, Introduction to Sinon.js, Sinon Tutorial
---

__This article was updated on 4/15/15 to reflect Jasmine 2.x__

I first got into JavaScript testing with the Jasmine framework. At the time of this writing, Jasmine is still probably the most popular unit testing framework for JavaScript. Jasmine has almost everything I need to write unit tests. It has a very readable API and a simple mocking library (spies) already built in. Recently, I started a couple open source projects and I decided to try Mocha (with Chai and Sinon), another popular JavaScript testing framework. This post is a quick overview of the differences between Jasmine 2.x and Mocha using Chai and Sinon.

## 1. Jasmine vs Mocha Syntax

The APIs of these two frameworks are very similar. They both allow you to write your tests in the `describe` block format.

```js
describe('calculator', function() {
	describe('add()', function() {
		it('should add 2 numbers togoether', function() {
			// assertions here
		});
	});
});
```

The assertions or expectations are where things start to differ. Mocha does not have a built in assertion library. There are several options though for both Node and the browser: Chai, should.js, expect.js, and better-assert. A lot of developers seem to choose Chai as the assertion library. Because none of these assertion libraries come with Mocha, this is another thing you will need to load into your setup. Chai comes with 3 different assertion flavors. It has the `should` style, the `expect` style, and the `assert` style. The `expect` style is similar to Jasmine.

__Jasmine__

```js
expect(calculator.add(1, 4)).toEqual(5);
```

__Chai__

```js
expect(calculator.add(1, 4)).to.equal(5);
```

Pretty similar right? So if you are switching from Jasmine to Mocha, the path with the easiest learning curve is to use Chai with the `expect` style syntax.

## 2. Mocking

Mocking in JavaScript comes in the form of spies. A spy is a function that replaces a particular function where you want to control its behavior in a test and record how that function is used during the execution of that test. Some of the things you can do with spies include:

* See how many times a spy was called
* Specify a return value to force your code to go down a certain path
* Tell a spy to throw an error
* See what arguments a spy was called with
* Tell a spy to call the original function (the function it is spying on). By default, a spy will not call the original function.

Mocha does not come with a mocking/spy library unlike Jasmine. Instead you will need to load in Sinon.js into your test harness. Sinon is a very powerful mocking library and is the equivalent of Jasmine spies with a little more. In Jasmine, you can spy on existing methods like this:

```js
var userSaveSpy = spyOn(User.prototype, 'save');
``` 

You can also create a spy if you do not have an existing method you want to spy on.

```js
var spy = jasmine.createSpy();
```

Sinon breaks up mocking into 3 different groups: [spies](http://sinonjs.org/docs/#spies), [stubs](http://sinonjs.org/docs/#stubs), and [mocks](http://sinonjs.org/docs/#mocks), each with subtle differences. A few of these differences that I have noticed are:

A spy in Sinon calls through to the method being spied on whereas you have to specify this behavior in Jasmine. For example: 

```js
spyOn(user, 'isValid').andCallThrough() // Jasmine
// is equivalent to 
sinon.spy(user, 'isValid') // Sinon
```

Stubs are similar to the default behavior of Jasmine spies where the original method is not called. For example:

```js
sinon.stub(user, 'isValid').returns(true) // Sinon
// is equivalent to
spyOn(user, 'isValid').andReturns(true) // Jasmine
```


From my experience, Jasmine spies cover almost everything I need for mocking so in many situations you won't need to use Sinon if you are using Jasmine, but you can use the two together if you'd like. In Jasmine, I like the fact that in order to mock a method, I just have to remember the Jasmine spy API instead of having to refer to different Sinon APIs for stubs, mocks, and spies. This could just be due to the fact that I have not worked with Sinon enough. Maybe as I work more with Sinon, I will come to appreciate the separation.


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

Above, `User` is a constructor function with an instance method `fetch()`. I want to assert that when `fetch()` resolves successfully, the resolved value is an instance of `User`. Because I have mocked out `User.prototype.fetch()` to return a pre-resolved promise, no real AJAX request is made.

The above test would work in both Mocha and Jasmine 2.x. By simply specifying a parameter in the `it()` callback function (I have called it `done()` like in the documentation but you can call it whatever you want), the test runner will pass in a function and wait for this function to execute before ending the test. The test will timeout and error if `done()` is not called within a certain time limit. This gives you full control on when your tests completes. 

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

This is really handy if you want to test your code that makes AJAX calls and some preprocessing needs to be done on the response. If you have worked with Angular, Sinon's fake server is similar to the _$httpBackend_ service provided in angular mocks. An alternative to using Sinon's fake server that can get you by in a lot of situations is to simply spy on `$.ajax` instead or whatever AJAX library you are using.

## Conclusion

In conclusion, the Jasmine framework has everything built into it including assertions and mocking utilities (which are called spies). Mocha is just a test runner and does not include assertion and mocking utilities. There are several choices for assertions when using Mocha, and Chai seems to be very popular choice. Mocking in Mocha also requires another library, and Sinon.js is a very popular choice. Sinon can also be a great addition to your test harness if you are using Jasmine for its fake server implementation.

Trying to figure out testing libraries/frameworks to use for JavaScript can be tough but hopefully this article has made it more clear as to what some of the main differenences are between Jasmine and Mocha. You can't really go wrong with either choice. Happy testing!

## Related Posts

* [Upgrading Jasmine from 1.3 to 2.x](/2015/01/29/Upgrading-Jasmine-from-1.3-to-2.1.html)
* [End To End Testing with PhantomJS and CasperJS](/2015/02/28/end-to-end-testing-with-phantomsjs-and-casperjs.html)
* [Angular Backend Definitions with _$httpBackend_](/angular.js/javascript/2014/01/20/backend-definitions-with-httpBackend.html)
* [Angular Request Expectations with _$httpBackend_]({% post_url 2014-01-18-request-expectations-with-httpBackend %})