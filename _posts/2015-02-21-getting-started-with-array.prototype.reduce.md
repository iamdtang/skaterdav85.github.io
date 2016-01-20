---
layout: post
title:  Getting Started with Array.prototype.reduce()
date:   2015-02-21
description: In this post, learn how to transform code using forEach to using reduce on JavaScript Arrays.
keywords: Array.prototype.reduce tutorial, array reduce tutorial, javascript array reduce, reduce vs forEach, Array.prototype.reduce vs Array.prototype.forEach, javascript reduce vs forEach
---

[Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) is one of those Array methods in JavaScript that I knew existed but I never really looked into it because I could achieve the same output using `Array.prototype.forEach`. Recently I decided to learn how it worked and wanted to show a couple examples of how you can transform some code using `forEach` to using `reduce`.

So to start, what is `Array.prototype.reduce`? `Array.prototype.reduce` is a method that allows you to take an array and reduce it to a single value. For example, maybe you want to create a sum from items in the array, or maybe you want to find the highest or lowest value of something in the array. You can achieve this using standard `forEach` or `for` loops, but I am finding that using `Array.prototype.reduce` requires less code and improves readability once you understand how it works. Let's look at an example.

Let's say we have an array of objects, products in this example, which is a very common scenario in a web application.

```js
var products = [
	{ name: 'Running shoes', price: 75 },
	{ name: 'Golf shoes', 	 price: 85 },
	{ name: 'Dress shoes',   price: 95 },
	{ name: 'Walking shoes', price: 65 },
	{ name: 'Sandals',       price: 55 }
];
```

### Calculating the total

The first thing you might want to do is calculate the total price of all the products. Using `forEach`:

```js
var total = 0;

products.forEach(function(product) {
	total += product.price;
});

console.log(total); // 375
```

Alternatively, using reduce:

```js
var total = products.reduce(function(previousTotal, product) {
	return previousTotal + product.price;
}, 0);

console.log(total); // 375
```

`Array.prototype.reduce` takes 2 arguments. The first argument is a callback function that receives the return value from the previous iteration and the current element in the array being processed. The second argument to `Array.prototype.reduce` is the initial value. In this case, I want the initial value of `previousTotal` to be 0. Note that the intial value is an optional argument but required in this example.

Let's look at another example.

### Finding the most expensive item

Here I want to find the highest priced product. Using `forEach`:

```js
var highestPrice = products[0].price;

products.forEach(function(product, index) {
	if (product.price > highestPrice) {
		highestPrice = product.price;
	}
});

console.log(highestPrice); // 95
```

Inside of the `forEach` callback function, I check if the price of the current processing product element is greater than `highestPrice`, and if so, I set `highestPrice` to that new higher price. And now using reduce:

```js
var highestPrice = products.reduce(function(previousHighestPrice, product) {
	if (product.price > previousHighestPrice) {
		return product.price;
	}

	return previousHighestPrice;
}, products[0].price);

console.log(highestPrice); // 95
```

In this second example, using `reduce` required about the same amount of code as using `forEach`. One minor reason why I like `reduce` a little more in this example is that finding the highest price is all contained in one function, whereas using `forEach` required creating an external variable to keep track of the current highest price.

Hopefully this post has helped you understand `Array.prototype.reduce`. Please let me know what approaches you like in the comments.
