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

Below are the two modules, expedia and orbitz using promises from the q library.

expedia.js

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

orbitz.js

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

The findFlights() methods are asynchronous. Here I am faking asynchronous calls using setTimeout but you can image this being database or web service calls. Using the q library, each method returns a promise. A promise is an object that manages the state of an asynchronous operation. The most noteworthy states of a promise are:

* Resolved - a successful asynchronous operation
* Rejected - a failed asynchronous operation
* Pending - Neither resolved nor rejected

You may see other states but these are the ones you'll typically utilize most often. Ok so back to our findFlights() methods. Because the results are not immediately available when findFlights() is invoked, we instead return a promise object. This promise object is in a pending state. We can attach callback functions to the promise object to be executed during the various promise states. When the results from the asynchronous operation come back, we can tell our promise object to resolve with a set of results or reject. Resolving a promise will then execute any success callback functions we register with the promise. Rejecting a promise will execute any error callback functions we register with a promise.

You might be wondering what is 'dfd' in the example above. dfd stands for deferred. You can think of deferreds as the thing (object) that creates the promise object and it has control over resolving and rejecting the promise. Typically the promise acts a passive object where you can register your callback functions to it using the .then() method of the promise.

So how can we be notified when both of our promise objects from expedia.findFlights() and orbitz.findFlights() have been resolved and we can do something with the results? You could use a counter variable and watch that yourself manually, but that isn't the most elegant solution. Instead, q offers a really useful method, q.all(). This method allows us to pass it a bunch of promises and turn it into 1 promise. We can register a success callback function that will execute when all of the promises have been resolved or an error callback function that will execute when any of the promises fail.

[Full example with promises and q](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-promises)

### 3. async.js

The last popular approach to managing flow control in JavaScript is using the async.js library. This works in both the browser and Node.js, but the example below is using Node.js.

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

To be notificed when both of our async operations are done, we can use the parallel method from async.js.

```js
async.parallel(tasks, [callback])
```

* tasks is an array of functions that we want to fire off in parallel
* callback is an optional function that we can specify to be executed when all of the tasks have completed

So how does async know when all of tasks have completed if they are asynchronous? If you look at each task, it receives a callback function. When you invoke this callback function you are notifying async that the task has completed. The first argument you pass to the callback is for an error if there is one and the second argument is for the results. If you pass an error to the callback, your main callback will execute with that specific error.

This example highlights just one method from async, but it comes with several other powerful methods for mananging flow control.

* [async.js](https://www.npmjs.org/package/async)
* [q](https://www.npmjs.org/package/q)

[Full example with async.js](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-async)
