---
layout: post
title:  "JavaScript Flow Control"
date:   2014-06-27
categories: JavaScript, Node.js
---

Learning how to manage asynchronous code in JavaScript can be challenging. In the browser, asynchronous operations come in the form of AJAX requests and timers. In Node.js, asynchronous operations are typically for I/O operations like reading and writing to the file system, database operations, and HTTP calls. Let's look at 3 popular ways of handling multiple asynchrounous operations. The examples below were written in Node.js, but the following libraries and techniques also apply to browser JavaScript. We will look at managing control flow using:

1. Nested callback functions
2. Promises and the q library
3. async.js library

### 1. Nested callback functions

The first approach to managing flow control in JavaScript is using nested callback functions. This approach is probably the most intuitive and straighforward way to managing asynchronous operations. It is also likely the first approach you will learn when starting with Node.js. The basic idea here is that within each success callback function, you perform the next asynchronous operation. By nesting callbacks, you can guarantee a consistent execution order. Let's look at an example. 

```js
var searchOptions = {
	to: 'Hawaii',
	from: 'Los Angeles',
	date: new Date(2014, 5, 15)
};

expedia.findFlights(searchOptions, function(expediaResults) {
	orbitz.findFlights(searchOptions, function(orbitzResults) {
		var allResults = expediaResults.concat(orbitzResults);
		console.log('All results:', allResults);
	});
});
```

Above I have 2 modules, expedia and obritz, both with findFlights() methods that perform asynchronous operations. The details of these methods are not important but just know that they are asynchronous and could be doing something like fetching results from a datbase or making an HTTP request to some API. This code might be used on a site to aggregate flights for a particular destination. What I want to do is aggregate all of the flight search results before doing something with all of this data (like displaying it to the user). After expedia.findFlights() executes, orbitz.findFlights() executes.

This small example works fine, but it does have some downsides. First, these 2 asynchronous operations are not fired in parallel. Instead, they are fired asynchonously in series, so the amount of the time for these to complete is longer than if both asynchronous operations were fired off in parallel. The orbitz request cannot be made until the expedia request has finished. 

Second, if more flight search requests were added to the picture, you would have to further nest the additional asynchronous calls. Your code will start moving to the right as more nested callback functions are added. That is why nested callbacks is sometimes referred to as the pyramid of doom or callback hell.

Let's look at a better approach to managing flow control using promises.

[Full example with nested callbacks](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-callbacks)

### 2. Promises and Q

```js
var q = require('q');
var expedia = require('./app/expedia');
var orbitz = require('./app/orbitz');

var searchOptions = {
	to: 'Hawaii',
	from: 'Los Angeles',
	date: new Date(2014, 5, 15)
};

var promise1 = expedia.findFlights(searchOptions);
var promise2 = orbitz.findFlights(searchOptions);

q.all([promise1, promise2]).then(function(results) {
	var expediaResults = results[0];
	var orbitzResults = results[1];

	var allResults = expediaResults.concat(orbitzResults);
	console.log('All results:', allResults);
});
```

The findFlights() methods are performing asynchronous operations and return something called a promise because the flight results are not immediately available. Think of it as the same way as if your friend promises to do something for you in the future. A reliable friend will fulfill, or resolve, the promise. Using the q library, each findFlights() method returns a promise. In more technical terms, a promise is an object that manages the state of an asynchronous operation and the functions that you want executed when the operations succeed or fail. The most noteworthy states of a promise are:

* Resolved - A successful asynchronous operation
* Rejected - A failed asynchronous operation
* Pending - Neither resolved nor rejected

You may see other states and terminology depending on the promise library you use, but these are the ones you'll typically interact with most often. So how can we can attach callback functions to the promise object to be executed when the promise resolves (success) or rejects (fails). If I wanted to run a function when expedia.findFlights() completes, I can attach callback functions using .then(successCallback, errorCallback).

```js
var promise1 = expedia.findFlights(searchOptions);
var successCb = function(results) { };
var errorCb = function(err) { };
promise1.then(successCb, errorCb);
```

Now this is useful if we have one asynchronous call, but what if we have multiple promises like in the example above? How can we be notified when all of our promises resolve? You could use a counter variable and watch that yourself manually, but that isn't the most elegant solution. Instead, q offers a really useful method, q.all([promises...]). This method allows us to pass in an array of promises and turn it into 1 promise. We can register a success callback function that will execute when all of the promises have been resolved or an error callback function that will execute when any of the promises fail.

Below are the two modules, expedia and orbitz using promises from the q library.

__expedia module__

```js
var q = require('q');

module.exports = {
	findFlights: function(options) {
		var dfd = q.defer();

		setTimeout(function() {
			dfd.resolve([
				{ departure: 17, arrival: 19, airline: 'Delta Airlines', price: 500 },
				{ departure: 15, arrival: 17, airline: 'American Airlines', price: 490 },
				{ departure: 21, arrival: 23, airline: 'American Airlines', price: 505 }
			]);
		}, 700);

		return dfd.promise;
	}
};
```

__orbitz module__

```js
var q = require('q');

module.exports = {
	findFlights: function(options) {
		var dfd = q.defer();

		setTimeout(function() {
			dfd.resolve([
				{ departure: 8, arrival: 10, airline: 'Hawaian Airlines', price: 520 },
				{ departure: 11, arrival: 13, airline: 'Hawaian Airlines', price: 480 },
				{ departure: 13, arrival: 15, airline: 'Delta Airlines', price: 500 }
			]);
		}, 900);

		return dfd.promise;
	}
};
```

You might be wondering what is 'dfd' in the expedia and orbitz modules above. dfd stands for deferred. You can think of deferreds as the thing (object) that creates the promise object. It has control over resolving and rejecting its promise. Typically the promise acts a passive object where you can register your callback functions to it using the .then(successCallback, errorCallback) method of the promise.

[Full example with promises and q](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-promises)

### 3. async.js

The last popular approach to managing flow control in JavaScript is using the async.js library. This works in both the browser and Node.js.

```js
var expedia = require('./app/expedia');
var orbitz = require('./app/orbitz');
var async = require('async');

var searchOptions = {
	to: 'Hawaii',
	from: 'Los Angeles',
	date: new Date(2014, 5, 15)
};

async.parallel([
	function(callback) {
		expedia.findFlights(searchOptions, function(expediaResults) {
			callback(null, expediaResults);
		});
	},

	function(callback) {
		orbitz.findFlights(searchOptions, function(orbitzResults) {
			callback(null, orbitzResults);
		});
	}

], function(err, results) {
	var expediaResults = results[0];
	var orbitzResults = results[1];

	var allResults = expediaResults.concat(orbitzResults);
	console.log('All results:', allResults);
});
```


Using the same flight search example, I am going to let async.parallel() manage my asynchronous tasks. The way this works is that we can pass in an array of tasks (functions) that we want executed in parallel. You can see that the first task fires of the expedia request and the second task fires off the orbitz request. The second argument to async.paralle() is a callback function that contains the results from all of tasks.

```js
async.parallel(tasks, [callback])
```

* tasks is an array of functions that we want to fire off in parallel
* callback is an optional function that we can specify to be executed when all of the tasks have completed

So how does async know when all of tasks have completed if they are asynchronous? If you look at each task, it receives a callback function. When you invoke this callback function you are notifying async that the task has completed. The first argument you pass to the callback is for an error if there is one and the second argument is for the results. If you pass an error to the callback, your main callback will execute with that specific error. It is your responsibility to invoke each task's supplied callback function.

This example highlights just one method from async.js, but it comes with several other powerful methods for mananging flow control that I encourage you to explore.

[Full example with async.js](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-async)

### Conclusion

I hope these 3 examples have given some insight into managing multiple asynchronous operations in JavaScript. Being able to write asynchronous code can be really performant, but managing these operations while having maintainable code can be challening. Hopefully these techniques enable you to write more maintainable asynchronous JavaScript. If you have any questions, ask in the comments! Thanks for reading.

### Resources

* [async.js](https://www.npmjs.org/package/async)
* [q](https://www.npmjs.org/package/q)
* [How JavaScript works in the browser - video](http://vimeo.com/96425312?utm_source=javascriptweekly&utm_medium=email)
