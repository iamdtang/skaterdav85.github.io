---
layout: post
title: "SOLID JavaScript Part 1: The Single Responsibility Principle"
date:   2015-01-09
categories: ['JavaScript', 'SOLID']
keywords: SOLID JavaScript, Single Responsibility Principle in JavaScript, SOLID Principles in JavaScript, Single Responsibility Principle, SRP
---

SOLID, introduced by Robert Martin (Uncle Bob), is an acronym that represents 5 basic principles to follow in object oriented programming and design. Traditionally these principles are applied to class based languages, but aspects of them can transfer over to JavaScript for maintainable and extendable code. These principles are:

* _S_ - Single responsibility principle
* _O_ - Open-closed principle
* _L_ - Liskov substitution principle
* _I_ - Interface segregation principle
* _D_ - Dependency inversion principle

<hr>

In this post, we will look at the Single Responsibility Principle (SRP). The Single Responsibility Principle states that a class should have a single responsibility. You may have also heard it phrased as: a class should do one thing, and one thing only. And another variation of the definition: a class should only have a single reason to change. Let's look at an example to clarify these definitions.

Imagine you are building an ecommerce site that supports multiple locales. You need to display product prices formatted to the user's locale. Your price formatter public API might be:

Here is an outline for a rudimentary implementation:

```js
function User(attributes) {
	this.attributes = attributes;
	this.formattedLastLoggedIn = this.formatLastLoggedIn();
}

// formats the time to something like: 2:24:32
User.prototype.formatLastLoggedIn = function() {
	var dateTime = new Date(this.attributes.lastLoggedIn);
	var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();

    if (minutes < 10) {
    	minutes = '0' + minutes;
    }
    	
    if (seconds < 10) {
    	seconds = '0' + seconds;	
    }
     
    return [hours, minutes, seconds].join(':');
};

new User({
	email: 'DAVID@GMAIL.COM',
	lastLoggedIn: Date.now()
});
```

On the surface, this implementation might seem ok. We are pulling the locale from the URL to lookup the currency and then formatting the price based on that currency. However, if we look a little closer, we can see that _PriceFormatter_ is doing more than one job. 

First, why does _PriceFormatter_ need to know where it gets the locale from? The job of _PriceFormatter_ is to format a price by currency, not find the user's locale. It's possible that the locale might not always come from the URL. Maybe this code will run on a page where the locale is not specified in the URL and is instead stored in a cookie, localStorage, or dumped into a JavaScript variable from the server. Furthermore, are there any other places in the application that might need access to the locale? From my experience, this is probably so. Finding the user's locale through _PriceFormatter_ wouldn't be so intuitive. These are all things you'd probably want to consider when designing this utility. As it stands, _PriceFormatter_ is tightly coupled to the URL, and locale retrievel is tightly coupled to _PriceFormatter_. Second, if a new locale is introduced into the site, _localeCurrencyMap_ inside of the _format()_ method will need to be updated. Third, if a new currency is introduced, the _format()_ method will also need to be changed. As you can see, there is more than one reason that this constructor function can change. Hence, it violates the Single Responsibility Principle.

## Let's Refactor

To follow the Single Responsibility Principle, first let's move the locale-currency map into its own configuration object.



This object will deal with accessing the user's locale, allowing other consumers not to care about where the locale is coming from.

Finally, let's update _PriceFormatter_.

```js

```

Rather than having _PriceFormatter_ lookup the user's currency, we'll pass that into the constructor. This way we can easily swap out the currency if necessary.

```js

```



This refactored version of _PriceFormatter_ now has a single reason to change. That is, _PriceFormatter_ only needs to change if a new currency is introduced into the site. It no longer cares where the locale comes from. In fact, it doesn't even need access to the user's locale. It simply formats a price based on a passed in currency without ever having to know the user's locale. The _locale_ object also has its own responsibility of retrieving the user's locale from whatever storage mechanism is being used. If the locale needs to come from somewhere other than the URL (like localStorage, a cookie, or a JavaScript variable), _PriceFormatter_ doesn't have to change.

Now you may be thinking, that switch statement in _format()_ might get unwieldy as more currencies are added. This will be addressed in the next post for the "O" in SOLID, the open-closed principle.

## Conclusion

If you find yourself needing to change a function or object for multiple reasons, it might be violating the single responsibility principle. The next time you create a function or object, ask yourself, is this doing more than one thing or are there multiple reasons for this code to change? If the answer is yes, try extracting out some of the logic into one or more constructors, objects, or functions and separate the responsibilities.

I first learned about the SOLID design principles when I read [Laravel: From Apprentice to Artisan - Advanced Application Architecture with Laravel 4](https://leanpub.com/laravel). I found these principles to be really useful when thinking about the design of my code, not just in PHP but JavaScript as well. Let me know how you've applied the single responsibility principle in JavaScript in your projects. I'd also love to hear how you were introduced to the SOLID design principles. Next, we'll look at the Open-Closed principle. Stay tuned!
