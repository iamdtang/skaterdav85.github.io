---
layout: post
title:  "JavaScript Flow Control"
date:   2014-06-27
categories: JavaScript, Node.js
---

Learning how to manage asynchronous code in JavaScript can be challenging. In the browser, asynchronous operations come in the form of AJAX requests and timers. In Node.js, asynchronous operations are typically for I/O operations like reading and writing to the file system, database operations, and HTTP calls. Let's look at 3 popular ways of handling multiple asynchrounous operations. The examples below were written in Node.js, but the following libraries and techniques also apply to browser JavaScript.

1. Nested callback functions
2. Promises and the q package
3. async.js package

### 1. Nested callback functions

The first approach to managing flow control in JavaScript is using nested callback functions. This apporach is probably the most intuitive and straighforward way to managing asynchronous operations and the first you are likely to learn when starting with Node.js. The basic idea here is that within each success callback function, you perform the next asynchronous operation. By nesting callbacks, you can guarantee a consistent execution order. Let's look at an example. 

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

Above I have 2 modules, expedia and obritz, both with findFlights() methods that perform asynchronous operations. The details of these methods are not important but just know that they are asynchronous and could be doing something like an HTTP request to some API. This code might be used on a site to aggregate flights for a particular destination. What I want to do is aggregate all of the flight search results before doing something with all of this data (like displaying it to the user). After expedia.findFlights() executes, orbitz.findFlights() executes.

This small example works fine, but it does have some downsides. First, these 2 asynchronous operations are not fired in parallel. Instead, they are fired asynchonously in series, so the amount of the time for both of these to complete is longer than if both asynchronous operations were fired off in parallel. The orbitz request cannot be made until the expedia request has finished. 

Second, if more flight search requests were added to the picture, you would have to further nest this call within orbitz.findFlights(). Your code will start moving to the right as more nested callback functions are added. That is why nested callbacks is sometimes referred to as the pyramid of doom or callback hell.

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

[Full example with promises and q](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-promises)

### 3. async.js

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

[Full example with async.js](https://github.com/ITP-Webdev/flow-control-exercises/tree/solution-async)
