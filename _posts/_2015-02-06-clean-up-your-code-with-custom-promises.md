---
layout: post
title:  "Clean up your code with custom promises"
date:   2015-02-06
keywords: JavaScript flow control, async.js, promises, q.js, nested callback functions, callback hell, asynchronous programming in JavaScript, AJAX
---

Custom promises can really clean up your code in certain situations. I wanted to highlight a couple examples where I have found them really useful.

## 1. Data Caching

One area where I have found custom promises to be really useful is client-side data caching. Imagine you have a single page application dealing with products. Caching product objects returned from the server in memory can make the site feel snappier for the user as they browse previously visited products. If a product is already in the cache, the application can use that one. Otherwise, a request can be made to the server to fetch that product data and then store it in the cache. An API like `products.find(5)` could return product 5 if it is in the cache, or a promise if it needs to be fetched from the server. This approach does have a downside. Everytime `products.find()` is called, the return type would need to be checked by the consumer/client to see if a product or a promise was returned. Instead, a better approach might be to create both a synchronous and asynchronous friendly API. Rather than returning different types of data, keep a consistent interface and return a promise.

```js
var cache = {};
var products = {
	find: function(id) {
		var dfd = $q.defer();

		if (cache[id]) {
			dfd.resolve(cache[id]);
		} else {
			$http
				.get('/api/products/' + id)
				.then(function(response) {
					cache[id] = response.data;
					dfd.resolve(cache[id]);
				});
		}

		return dfd.promise;
	}
};
```

In this example, `products.find()` returns a custom promise. If data is already in the cache, the custom promise can be resolved immediately with the cached product. Otherwise, an AJAX call can be made to fetch the product, stored in the cache, and then the custom promise can be resolved with this product. This technique is also called identity mapping which is used in Ember Data.


## 2. Working with non-RESTful endpoints

Another scenario where custom promises have been really useful is when working with non-RESTful endpoints. Traditionally in an API, if a bad request is made, the response comes back with a status code of 500-something (or 400-something if the endpoint can't be found). Maybe you're in a situation where you're not the one writing the API and for invalid requests, a 200 HTTP status code is sent back. 

```js
function Post() {}

Post.prototype.addTag: function(tag, postIds) {
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
};
```

__Example Usage:__

```js
var post = new Post({ title: '', content: '' });
post.addTag(tag)
```

In this example, 

Instead of letting the client of this