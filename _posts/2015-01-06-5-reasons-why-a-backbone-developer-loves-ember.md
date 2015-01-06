---
layout: post
title:  "5 Reasons Why A Backbone Developer Loves Ember"
date:   2015-01-06
categories: ['JavaScript', 'Ember', 'Backbone']
keywords: 
---

Last year I started a new job as Senior JavaScript Developer where I am currently tasked with rebuilding an ecommerce site for the company. The JavaScript stack is using Backbone, Lodash, Handlebars, Zepto, Require.js, and CoffeeScript. I had played with Backbone when it first came out and used it for small things but this has definitely been my biggest Backbone project. Prior to this job I had been using a lot of Angular. As I learned more and more about Backbone, I kept missing some of the features and structure Angular had and wish it had a fe. So I thought to myself, maybe I am doing something wrong. I went on to read [Building Backbone Plugins by Derick Bailey](https://leanpub.com/building-backbone-plugins), looked at Marionette.js, and incorporated several of those ideas into our own abstractions. This definitely helped remove some of the boilerplate code since Backbone is really minimalistic. Even with these abstractions, certain things felt wrong and messy. At that point, I decided to learn Ember just to hopefully learn and borrow some new concepts despite knowing that Ember was something we wouldn't use for this project. So here is my list of 5 things that I learned and borrowed from Ember for Backbone.

## 1. Computed Properties

As the Ember documentation defines computed properties:

> "In a nutshell, computed properties let you declare functions as properties. You create one by defining a computed property as a function, which Ember will automatically call when you ask for the property. You can then use it the same way you would any normal, static property."

You can simulate computed properties in Backbone already.

```js
var Person = Backbone.Model.extend({
	initialize: function() {
		this.computeFullName();
		this.on('change:firstName change:lastName', this.computeFullName, this);
	},

	computeFullName: function() {
		this.set('fullName', this.get('firstName') + ' ' + this.get('lastName'));
	}
});
```

Whenever _Person_ is instantiated or a person's _firstName_ or _lastName_ changes, _fullName_ will recompute. Now although you can do it this way, this approach is kind of messy and all over the place. Just by reading the source code, it is not immediately clear that there is a _fullName_ computed property. This gets even more unwieldy if you have several computed properties defined in this style.

```js
var Product = Backbone.Model.extend({
	initialize: function() {
		this.computeHasDiscount();
		this.on('change:price', this.computeHasDiscount, this);
		this.computeSavePercentage();
		this.on('change:hasDiscount', this.computeSavePercentage, this);
		this.computeStartingAtPrice();
		this.on('change:sizes', this.computeStartingAtPrice, this);
	},

	computeHasDiscount: function() {
		if (this.get('disciountprice') < this.get('price')) {
			this.set('hasDiscount', true);
		}
	},

	computeSavePercentage: function() {
		/* implementation */
	}

	computeStartingAtPrice: function() {
		/* implementation */
	}
});
```

Not the cleanest. Here is an example of a _fullName_ computed property defined in Ember. 

```js
App.Person = Ember.Object.extend({
	fullName: Ember.computed('firstName', 'lastName', function() {
		return this.get('firstName') + ' ' + this.get('lastName');
	})
});
```

In my opinion, this is much more clear and readable. You can easily see the name of the computed property, the dependent properties, and the function to run when the dependent properties change. The solution I came up with is very similar to Ember's computed properties API on top of Backbone. 

```js
var Person = Backbone.Model.extend({
  fullName: Backbone.Computed('first', 'last', function() {
    return this.get('first') + ' ' + this.get('last');
  })
});
```

The initial implementation of this feature took 53 lines of code with lots of white space. The library for this can be found at [backbone-computed-properties](https://github.com/skaterdav85/backbone-computed-properties).


## 2. A Data Store

Another feature of Ember that I really like is its data store, Ember Data. I really like how it has automatic model caching and identity mapping. If you're unfamiliar with identity mapping, [Wikipedia](http://en.wikipedia.org/wiki/Identity_map_pattern) defines it as:

> "The identity map pattern is a database access design pattern used to improve performance by providing a context-specific, in-memory cache to prevent duplicate retrieval of the same object data from the database."

For example, in your application if you make a request for a user object with an id of 1, and you make another AJAX request for the user with an id of 1, you're going to have two user objects with an id of 1 which represent the same person but they are different objects in memory. That second trip to the server for user with an id of 1 is a wasted trip when it could have been cached. Also, many times in web applications you need a reference to the same "user with an id of 1" instance, not a copy of it. Identity mapping is a pattern that allows you to return the same user with an id of 1 instance, regardless of how many times you look it up. 

I had already been thinking about caching but I wasn't settled on how to go about implementing it in the context of Backbone. After learning the basics of Ember Data, and then later angular-data, I went and built a small data store library for Backbone for my own use called [Backbone Data](https://github.com/skaterdav85/backbone-data). Starting to see a pattern here?

## 3. A Container

In pages with a decent amount of JavaScript, you'll often run into the situation where you'll need an object to be long-lived so that other objects can find it and interact with it. For example, thinking about a _ShoppingCart_ constructor/class. When the page loads, you create an instance of _ShoppingCart_ and you have various views that need to interact with it. Where do you put this shopping cart instance so that other views can access it? You could make it globally accessible, but that kind of defeats the purpose of using a module system. Ember's container exists for this very reason. The Ember container basically gives a place for any long-lived objects to be stored and accessed. Now Ember's container does much more than giving long-lived objects a home, but this idea alone of having a central registry for housing certain objects like a shopping cart instance can be pretty useful.

The container API I wrote looks somethine like this:

```js
// store an instance of Foo into the container
container.singleton('foo', new Foo());

// Returns that same Foo instance
container.lookup('foo')
```

## 4. Naming conventions

If you've worked with Ember for a little, one thing you'll see is how consistent the naming conventions are among the various components. It makes working with Ember a joy because of how intuitive and readable the code is. I strive to follow that same consistency when defining my views, models, collections, templates, and routes to make the code much easier to maintain.

## 5. Controllers

The last thing I really liked about Ember is how it defines controllers as a way to decorate models with display logic properties. These would be things like _isActive_, _inEditMode_, and _isExpanded_. Prior to learning Ember, I never really thought about separating my models from display logic properties. My Backbone models would just get polluted with UI specific properties. Now I wish I had an Ember-like solution for this in Backbone, but I don't. In the current site I am working on, the API is pretty sensitive. You can only send over certain properties and if you accidentally send one that it doesn't expect, it errors. To mitigate this, I have instead created an abstraction that extends _Backbone.Model_ where you can declare whitelisted or blacklisted properties. This list of properties is consulted before being persisted to the server. My implementation looks something like this:

```js
var Person = BaseModel.extend({
	blacklist: ['inEditMode', 'isExpanded']
});
```

or the opposite:

```js
var Person = BaseModel.extend({
	whitelist: ['id', 'firstName', 'lastName', 'age']
});
```


I'd love to hear how others separate out display logic from their models in Backbone.

## Summary

Having seriously worked with Backbone for the past 8 months, I can say that I have learned a lot and can appreciate its simplicity and flexibility. However, with this flexibility comes great responsibility. I really like how Tom Dale put it in the [Fluent 2014 interview](https://www.youtube.com/watch?v=VI__nGPT9kk) where Ember "acts as a guard rail" and it "nudges you in the right direction". Having to put so much thought into architecting Backbone code, sometimes I wish Backbone nudged you more in a certain direction. Even as an Ember noob, I can definitely appreciate its philosophies and I have found that by learning it, it has helped give me opinions to work more effectively with Backbone.
