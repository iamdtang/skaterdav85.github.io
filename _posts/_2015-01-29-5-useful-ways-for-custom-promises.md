---
layout: post
title:  "5 Useful ways to use custom promises"
date:   2014-01-29
keywords: JavaScript flow control, async.js, promises, q.js, nested callback functions, callback hell, asynchronous programming in JavaScript, AJAX
---

### 1. Creating both a synchronous and asynchronous freindly API for a function

A consistent interface

### 

```js
var cache = {};
var search = function(term) {
	var dfd = $q.defer();

	if (cache[term]) {
		dfd.resolve(cache[term]);
	} else {
		$http
			.get('/api/search', { term: term })
			.then(function(response) {
				cache[term] = response.data;
				dfd.resolve(cache[term]);
			});
	}

	return dfd.promise;
};
```

also, identity mapping

show identity mapping example from Ember


### 2. Working with non-RESTful endpoints

```js
posts = {
	applyTag: function(tag, postIds) {
		var dfd = $q.defer();

		$http.put('/api/posts', {
			tag: tag,
			posts: postIds
		}).then(function(response) {
			if ( !(response.data instanceof Array) ) {
				return dfd.reject({
	              error: response.data["00000"]
	            });
			}

			if (containsInvalidPostIds(response.data)) {
				return dfd.reject(getInvalidPostIds(response.data));
			}

			dfd.resolve(response.data);
		});

		return dfd.promise;
	}
};
```

