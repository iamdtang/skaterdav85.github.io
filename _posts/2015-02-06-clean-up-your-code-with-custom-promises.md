---
layout: post
title:  "Clean Up Your Code With Custom Promises"
date:   2015-02-06
keywords: JavaScript flow control, async.js, promises, q.js, nested callback functions, callback hell, asynchronous programming in JavaScript, AJAX
---

Custom promises can really clean up your code in certain situations. For me, I have found that using custom promises can clean up consumers of my data services and models. I wanted to show a couple examples where I have found them really useful. The following examples use Angular's `$http` service, but the same ideas can likely be applied if you are working with another deferred and promise implementation.

## 1. Data Caching

One area where I have found custom promises to be really useful is client-side data caching. Imagine you have a single page application dealing with products. Caching product objects returned from the server in memory can make the site feel snappier for the user as they browse previously visited products. If a product is already in the cache, the application can use that one. Otherwise, a request can be made to the server to fetch that product data and then store it in the cache. An API like `products.find(5)` could return product 5 if it is in the cache, or a promise if it needs to be fetched from the server. However, doing it this way does have a downside. Everytime `products.find()` is called, the return type would need to be checked by the consumer/client to see if a product or a promise was returned. Instead, a better approach might be to create both a synchronous and asynchronous friendly API. Rather than returning different types of data, keep a consistent interface and return a promise.

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


## 2. Preprocessing Raw Responses

Another scenario where custom promises have been really useful is when you need to preprocess the raw response. For example, traditionally in an API, if a bad request is made, the response comes back with a status code of 500-something (or 400-something if the endpoint can't be found). Maybe you're in a situation where you're not the one writing the API and for invalid requests, a 200 HTTP status code is sent back with a particular key in the response that signifies there was an error.

```js
function Post() {}

Post.prototype.create: function() {
	var dfd = $q.defer();

	$http.post('/api/posts', this.attributes).then(function(response) {
		if ( !(response.data instanceof Array) ) {
			return dfd.reject({
        		error: "There was an error."
      		});
		}

		dfd.resolve(response.data);
	});

	return dfd.promise;
};
```

__Example Usage:__

```js
var post = new Post({ title: 'Clean up your code with custom promises', content: '...' });
post.create();
```

In this example, calling `create()` will make a POST request to the server to save a new blog post. The response that comes back is always 200 regardless if the operation was successful or not. As mentioned before, let's assume the API is outside of our control. Here I have chosen to return a custom promise that gets resolved if the response is an array, and rejected otherwise. By implementing it this way and using a custom promise, consumers of this code can attach success __and__ error functions to the returned promise. Let's look at the alternative:

```js
function Post() {}

Post.prototype.create: function() {
	return $http.post('/api/posts', this.attributes);
};
```

The alternative, that is returning the `$http` promise directly, would force __all__ consumers to check the response in a __single__ success callback since the promise is always resolved and never rejected. This approach would likely lead to duplicate code among consumers.

## Conclusion

Caching data in memory on the client and preprocessing HTTP responses are two common scenarios where custom promises can be really useful. I am sure there are plenty of other scenarios to use custom promises, but I have found these two to be the most common and simple to refactor. Let me know how you have used custom promises in the comments!
