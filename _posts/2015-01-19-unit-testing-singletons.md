---
layout: post
title:  "Unit Testing Singletons"
date:   2015-01-19
keywords: unit testing singletons, unit test, singleton, singleton in javascript, singleton design pattern
---

Often times in web applications you only want a single instance of a class/constructor/reference type to ever be created. This is called the singleton pattern. [Wikipedia defines the singleton pattern](http://en.wikipedia.org/wiki/Singleton_pattern) as:

>  "In software engineering, the singleton pattern is a design pattern that restricts the instantiation of a class to one object."

In short, what this means is that you can only have one instance of a particular object. One practical use case of the singleton pattern is modeling an authenticated user in an application. There is only one instance of that authenticated user in memory on that user's browser. There are a few ways that you can implement this in JavaScript.

## Implementing the singleton pattern

One approach is to use an immediately invoked function expression (IIFE) to hide the single instance.

```js
var User = (function() {
  var instance;

  function User() {
    if (instance) {
      return instance;
    }

    instance = this;
  }

  return User;
})();
```

The first time `User` is newed up, it will create an instance and store it in the private static variable `instance`. Each subsequent time `User` is newed up, it will always return the same `User` instance stored in `instance`.

Another approach is to just store the single instance on the `User` function itself as a public static property. It would be publicly accessible but we can denote that it is private by prefixing the property that stores it with an underscore.

```js
function User() {
  if (User._instance) {
    return User._instance;
  }

  User._instance = this;
}
```

## Unit Testing A Singleton

Let's add a little more to this `User` example.

```js
function User(data) {
  if (User._instance) {
    return User._instance;
  }

  if (data) {
    this.name = data.name;
    this.loggedInAt = data.loggedInAt;
  }

  User._instance = this;
}

User.prototype.isLoggedIn = function() {
  if (this.loggedInAt) {
    return true;
  }

  return false;
};
```

First we'll allow the name and logged-in time to be set. This data could come from the server on page load. We'll also implement an `isLoggedIn()` method that returns either true or false. Now let's look at a unit test for `isLoggedIn()`.

```js
describe('User', function() {
  describe('isLoggedIn()', function() {
    it('should be true if there is data from the server', function() {
      // this could be dumped onto the page from the server
      var APP = {
        user: {
          name: 'David',
          loggedInAt: 1421543590
        }
      };

      var user = new User(APP.user);
      expect(user.isLoggedIn()).to.equal(true);
    });


    it('should be false if there is no data from the server', function() {
      var APP = {
        user: {}
      };

      var user = new User(APP.user);
      expect(user.isLoggedIn()).to.equal(false);
    });
  });
});
```

This test looks pretty straightforward and you might think it would work. However, the second test does not pass. The reason for this is because during the execution of the second test, `User._instance` has already been set from the previous test, so the user is still considered logged in. The second test is not executing with a fresh state. To fix this, we can reset `User._instance`.

```js
describe('User', function() {
  describe('isLoggedIn()', function() {
    it('should be true if there is data from the server', function() {
      // this could be dumped onto the page from the server
      var APP = {
        user: {
          name: 'David',
          loggedInAt: 1421543590
        }
      };

      var user = new User(APP.user);
      expect(user.isLoggedIn()).to.equal(true);
    });


    it('should be false if there is no data from the server', function() {
      var APP = {
        user: {}
      };

      // Reset the User singleton
      delete User._instance;

      var user = new User(APP.user);
      expect(user.isLoggedIn()).to.equal(false);
    });
  });
});
```

Even though all the tests now pass, the second test is now dependent on an internal implementation detail. That is, the static `User._instance` property. This is no good. `User._instance` is meant to be "private" data and not part of the public API. If we ever want to refactor and change internal details of `User` like the `User._instance` property, we'll also have to modify our tests. Our tests should really only be dependent on our public API.

## A Solution

In our test suite, if we could just reload the script that contains this `User` constructor function, then we can ensure that `User` will always be in a fresh state. However, not all test frameworks do that.

Instead, the approach that I have been taking lately is separating out the singleton pattern into another object or method. For example, rather than implementing the singleton pattern in the `User` constructor function which makes it a little difficult to unit test, I instead extract it out into a static method on `User`, like `User.get()`. This way, the `User` constructor's only responsibility is to create `User` instances and `User.get()`'s responsibility is to just manage a single `User` instance.

```js
User.get = function() {
  if (User._instance) {
    return User._instance;
  }

  User._instance = new User(window.APP.user);
  return User._instance;
};
```

A single unit test can be written for `User.get()` to ensure that every time it is called, the same `User` instance is returned.


```js
describe('static get()', function() {
  beforeEach(function() {
    window.APP = {
      user: {
        name: 'David',
        loggedInAt: 1421543590
      }
    };
  });

  afterEach(function() {
    delete window.APP;
  });

  it('should return the same instance every time', function() {
    expect(User.get()).to.equal(User.get());
  });
});
```

This is just one approach to separating out the singleton pattern from the class itself. Another approach I have taken is delegating the singleton pattern to another object. For example:

```js
container.singleton('user', new User(APP.user));
```

Any time I want access to the user, I can look it up from the container with something like:

```js
container.lookup('user');
```

## Conclusion

There are several ways you can implement the singleton pattern. From my experience, implementing the singleton pattern in the constructor itself makes for difficult unit testing. Each test might not always be executing with a clean, fresh state. One of the reasons I like using constructors is that it makes it easy to spin up new instances with fresh state. By implementing the singleton pattern within a constructor function, you end up losing that advantage. Instead, I like to move the responsibility of managing a single instance of something to a static method like `User.get()` or even to a completely different object like a container. This makes for easier unit testing and helps follow the single responsibility principle.
