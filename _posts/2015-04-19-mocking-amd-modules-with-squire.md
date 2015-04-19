---
layout: post
title:  "Mocking AMD Modules with Squire.js"
date:   2015-04-20
keywords: mocking amd modules, unit testing require.js, unit testing requireJS, requireJS unit testing, require.js unit testing, mocking AMD, AMD unit testing, mocking window object
---

Writing unit tests when working with Require.js is tough. Out of the box, Require.js does not make mocking very easy. It involves setting up a separate Require.js context and a complicated setup in a `beforeEach`. 

Imagine you have a module called `qs` (stands for query string) that parses the query string on page load and creates an object containing all query string parameters.

## A Query String AMD Module

```js
define([], function() {
    var parse = function(qs) {
      if (qs[0] === '?') {
        qs = qs.substring(1);
      }

      return qs.split('&').reduce(function(prev, str) {
        var pair;
        pair = str.split('=');
        prev[pair[0]] = decodeURIComponent(pair[1]);
        return prev;
      }, {});
    };
    
    var params = parse(window.location.search);

    return {
      params: params
    };
  });
```

The implementation of `parse()` doesn't matter. The thing that makes this module difficult to unit test is that `window` cannot be mocked. In a unit test, `window.location.search` doesn't exist. When I load up this module into a unit test, I can't really test that `qs.params` is the parsed query string because `window.location.search` was an empty string (the default value if no query string exists). So how can we mock out the window object? [Squire.js](https://github.com/iammerrick/Squire.js), makes mocking AMD modules extremely simple and intuitive.

## Mocking the Window Object

First, let's wrap `window` in its own AMD module:

```js
// window.js
define(function() {
	return window;
});
```

Next, we can specify the AMD module `window` as a dependency for the `qs` AMD module:

```js
// qs.js
define(['window'], function(window) {
    var parse = function(qs) {
      if (qs[0] === '?') {
        qs = qs.substring(1);
      }

      return qs.split('&').reduce(function(prev, str) {
        var pair;
        pair = str.split('=');
        prev[pair[0]] = decodeURIComponent(pair[1]);
        return prev;
      }, {});
    };
    
    var params = parse(window.location.search);

    return {
      params: params
    };
  });
```

## Unit Testing with Squire

Once you install Squire, you can simply create an instance of it and use the `mock` method to specify a mock for a particular AMD module.

```js
define(['qs', 'Squire'], function(qs, Squire) {
	describe('qs.params', function() {
	    var injector;

	    beforeEach(function() {
	        injector = new Squire();
	    });

	    afterEach(function() {
	        injector.remove();
	    });

	    it('should contain an objet of all query string params', function() {
	        injector
	            .mock('window', {
	                location: {
	                    search: '?t=veg&color=blue'
	                }
	            })
	            .require(['qs'], function(qs) {
	                expect(qs.params).toEqual({
	                    t: 'veg',
	                    color: 'blue'
	                });
	            });
	    });
	});
});
```

In the example above, I am mocking the `window` AMD module that I created with a simple JavaScript object containing a static location object. After creating the `window` mock, I can then chain a call to `require` to load up the `qs` module using the `window` mock instead of the `window` AMD module (which just returns the real window object). How awesome is that!

## Squire and Karma

If you are using Require.js with Karma and want to use Squire, you might run into some issues when you simply run `new Squire()`. I found the solution on [Stack Overflow](http://stackoverflow.com/questions/17205904/squirejs-causing-random-tests-to-intermittently-fail-or-not-run-at-all). In short, this is what I did to get it working:

```js
// test-main.js
requirejs.config({
    // Karma serves files from "/base"
    baseUrl: "/base",

    paths: {
        Squire:        "path/to/Squire",
    }

    // ask Require.js to load these files (all our tests)
    // deps: tests,

    // start test run, once Require.js is done
    // callback: 
});

require(tests, function() {
    window.__karma__.start();
});
```

Simply comment out the `deps` and `callback` keys in the `requirejs.config` call and place a separate `require` call after it. I'm not entirely sure what is going on here but if someone knows, please let me know in the comments! =)