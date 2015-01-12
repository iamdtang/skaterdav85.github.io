---
layout: post
title:  "Jasmine vs. Mocha, Chai, and Sinon"
date:   2015-01-12
keywords: Jasmine unit testing, Jasmine vs. Mocha, Jasmine spies vs Sinon, JavaScript unit testing
---

I first got into JavaScript testing with the Jasmine 1.3 framework. At the time, it was probably the most popular unit testing framework for JavaScript. Even to this day, Jasmine has almost everything I need to write unit tests. It has a very readable API and a mocking library (spies) already built in. Recently, I started a couple open source projects to add some Ember-like features to the Backbone project I am building at work and I decided to try Mocha, Chai, and Sinon. This post is a quick overview of the differences between Jasmine 1.3 and Mocha, Chai, and Sinon.

__Note: I am aware of the Jasmine 2.x releases. I have not played with them yet, so my points are solely based on version 1.3.__

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

The assertions or expectations are where things start to differ. Mocha has a built in assertion library but from what I've seen, everyone seems to use Mocha with Chai.js. I don't have much experience with the standard assertions that Mocha provides but the examples in the documentation were pretty readable. Chai does not come with Mocha so this is another thing you will need to load into your setup. Chai comes with 3 different assertion flavors. It has the `should` style, the `expect` style, and the `assert` style. The `expect` style is similar to Jasmine.

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

Sinon breaks up mocking into 3 different groups: [spies](http://sinonjs.org/docs/#spies), [stubs](http://sinonjs.org/docs/#stubs), and [mocks](http://sinonjs.org/docs/#mocks). I don't know all of the differences between the 3 types, but a few differences that I have noticed are:

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


From my experience, Jasmine spies cover almost everything I need. In Jasmine, I like the fact that in order to mock a method, I just have to remember the Jasmine spy API instead of having to refer to different Sinon APIs for stubs, mocks, and spies. This could just be due to the fact that I have not worked with Sinon enough. Maybe as I work more with Sinon, I will come to appreciate the separation.


## 3. Asynchronous Tests

I have found asynchronous testing in Mocha to be much cleaner than in Jasmine 1.3. Here is an example of an asynchronous test in Jasmine 1.3:

__Example Jasmine Asynchronous Test__

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

`User` is a constructor function with an instance method `fetch()`. I want to assert that when `fetch()` resolves successfully, the resolved value is an instance of `User`. The way this test works is that Jasmine will wait a maximum of 500 milliseconds for the asynchronous operation to complete. Otherwise, the test will fail. `waitsFor()` is constantly checking to see if `flag` becomes true. Once it does, it will continue to run the next `runs()` block where I have my assertion. Because I have mocked out `User.prototype.fetch()` to return a pre-resolved promise, no real AJAX request is made.

__Example Mocha Asynchronous Test__

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

In Mocha, by simply specifying a parameter in the `it()` callback function (I have called it `done()` like in the documentation but you can call it whatever you want), the test runner will pass in a function and wait for this function to execute before ending the test runner. The test will timeout and error if `done()` is not called within a certain time limit. This is much cleaner and simpler than the polling technique used in Jasmine 1.3. It looks like asynchronous testing in Jasmine 2.x is very much improved.

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

If you have worked with Angular, Sinon's fake server is similar to the _$httpBackend_ service provided in angular mocks. You might ask yourself, why not simply spy on the AJAX call, like `$.ajax`? The issue with that is it does not allow you to test that a request is made to a particular URL. You could accidentally change the URL in your code and your tests will still pass, but your code will be making a request to the wrong URL in the running application, and you'd have to manually verify this or write an integration test.

## Conclusion

Mocha, Chai, and Sinon definitely have some advantages over Jasmine 1.3. With the release of 2.x though, both seem pretty comparable from what I have looked at. Whether you choose Jasmine or Mocha, Sinon can be a great addition to your test harness especially for the fake server. After doing some research on upgrading from Jasmine 1.3 to 2.x, it looks like it has to be done manually since it is not backwards compatible. 