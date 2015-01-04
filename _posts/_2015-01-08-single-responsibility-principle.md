---
layout: post
title: "SOLID JavaScript Part 1: The Single Responsibility Principle"
date:   2015-01-08
categories: ['JavaScript', 'SOLID']
keywords: SOLID JavaScript, Single Responsibility Principle in JavaScript, SOLID Principles in JavaScript
---

SOLID is an acronym that represents 5 basic principles to follow in object oriented programming and design. Traditionally they are applied to class based languages, but they can transfer over to JavaScript with some modification. These principles are:

* _S_ Single responsibility principle
* _O_ Open-closed principle
* _L_ Liskov substitution principle
* _I_ Interface segregation principle
* _D_ Dependency inversion principle

In this post, we will look at the Single Responsibility Principle (SRP). The Single Responsibility Principle states that a class should have a single responsibility, or in other words, it should do one thing, and one thing only. It can also be phrased as: a class should only have a single reason to change. Let's look at an example to clarify these definitions.

Imagine you are building an ecommerce site that supports multiple locales. You need to display product prices formatted to the user's locale.

```js
new CurrencyFormatter(45.99).format(); // $45.99 if locale is en-US or en-CA
```

And the implementation:

```js
function CurrencyFormatter(price) {
	this.price = price;
}

CurrencyFormatter.prototype.format = function() {
	var locale = this.getLocale();
	var price;

	switch(locale) {
		case 'en-US':
			return '$' + this.price.toFixed(2);
		case 'en-CA':
			return '$' + this.price.toFixed(2);
		case 'en-GB':
			price = this.price;
			// implementation for transforming price to UK format
			return '£' + price;

		default:
			throw new Error('Locale ' + locale + ' not supported!');
	}
};

CurrencyFormatter.prototype.getLocale = function() {
	// returns the locale from the URL
};
```