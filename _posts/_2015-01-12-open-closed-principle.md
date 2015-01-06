---
layout: post
title:  "SOLID JavaScript Part 2: The Open-Closed SOLID Principle"
date:   2015-01-12
categories: ['JavaScript', 'SOLID']
keywords: SOLID JavaScript, Open-Closed Principle in JavaScript, SOLID Principles in JavaScript, Open-Closed Principle
---

SOLID, introduced by Robert Martin (Uncle Bob), is an acronym that represents 5 basic principles to follow in object oriented programming and design. Traditionally these principles are applied to class based languages, but aspects of them can transfer over to JavaScript for maintainable and extendable code. These principles are:

* _S_ - Single responsibility principle
* _O_ - Open-closed principle
* _L_ - Liskov substitution principle
* _I_ - Interface segregation principle
* _D_ - Dependency inversion principle

```js
function addThousandsSeparator(price, separator) {
	
}

function setDecimalSeparator(price, separator) {
	
}

function PriceFormatter(price, currency) {
	this.price = price.toFixed(2);
	this.currency = currency;
}

PriceFormatter.prototype.format = function() {
	switch(this.currency) {
		case 'usd':
			this.price = addThousandsSeparator(this.price, ',');
			return '$' + this.price;
		case 'euro':
			this.price = setDecimalSeparator(this.price, ',');
			this.price = addThousandsSeparator(this.price, '.');
			return '€' + this.price;
		case 'pound':
			this.price = setDecimalSeparator(this.price, ',');
			this.price = addThousandsSeparator(this.price, '.');
			return '£' + this.swapCommasAndPeriods(this.price);
		default:
			throw new Error('Unsupported currency');
	}
};
```

to:

```js
function PriceFormatter(price, currency) {
	this.price = price.toFixed(2);
	this.currency = currency;
	this.formatters = {};
}

PriceFormatter.prototype.format = function() {
		var formatter = this.formatters[this.currency];

		if (formatter) {
			return formatter(this.price);
		}

		throw new Error('Unsupported currency');
};

PriceFormatter.prototype.register = function(name, implementation) {
	return this.formatters[name] = implementation;
};

function swapCommasAndPeriods() { /* implementation here */ }

PriceFormatter.register('usd', function(price) {
	return '$' + price;
});

PriceFormatter.register('euro', function(price) {
	return '€' + swapCommasAndPeriods(price);
});

PriceFormatter.register('pound', function(price) {
	return '£' + swapCommasAndPeriods(price);
});
```


