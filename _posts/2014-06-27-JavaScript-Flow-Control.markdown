---
layout: post
title:  "JavaScript Flow Control"
date:   2014-06-27
categories: JavaScript, Node.js
---

When first coming to JavaScript, learning how to manage asynchronous code can be challenging. In the browser, this will be in the form of AJAX calls and timeouts. In Node.js, asynchronous operations will be for I/O operations like reading/writing to the file system, database queries, and HTTP calls. Let's look at 3 ways how we can manage multiple asynchrounous calls. The examples below were written in Node.js, but the following libraries and techniques also apply to browser JavaScript.

1. Nested callback functions
2. Promises and the q package
3. async.js package

### 1. Nested callback functions

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
