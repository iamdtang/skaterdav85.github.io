---
layout: post
title:  "Data Modeling in Angular.js with angular-data - Part 1"
date:   2014-11-06
categories: Angular.js
---

In this series we're going to look at a 3rd party library, [angular-data](http://angular-data.pseudobry.com/), for managing our data models in Angular.js. 

### Why use angular-data?

There are many ways to model your data in Angular. You can use the built in $http or $resource services, or you can use popular 3rd party libraries like Restangular, Breeze, or angular-data, all of which are great choices. 

When I started using Angular, I, like most people, started using $http. $http feels very familiar to $.ajax from jQuery and gives you a simple API for making AJAX requests. This works great for small applications. Then I got to the point where I wanted custom methods on my models. I started taking my JSON responses and wrapping them up in custom collection and model classes/constructors. This felt very familiar coming from the Backbone world or working with an ORM on the server, as it allowed me to put business logic on models.

The previous solution works fine, but it was kind of tedious since I never abstracted that out into something reusable. During that time, I started learning Ember and Ember Data and I really liked what it offered. I wanted similar functionality for my Angular models, primarily model relationships and identity mapping. If you're unfamiliar with an identity map, think of a person. A person has a unique identity. Regardless if a person changes jobs, name, and appearance, they still have the same identity. If my name were Douglas Crockford, the real Douglas Crockford and myself would have our own identities despite having the same name. Now think about your data / database records. In your application, if you make a request for a user object with an ID of 1, and you make another AJAX request for the user with an ID of 1, you're going to have 2 user objects with an ID of 1 which represent the same person but they are different objects in memory. Many times in web applications you need a reference to the same "user with an ID of 1" instance, not a copy of it. [Identity mapping](http://en.wikipedia.org/wiki/Identity_map_pattern) is a pattern that allows you to return the same user with an ID of 1 instance, regardless of how many times you look it up. I learned about this pattern as I was digging into Ember Data of the Ember.js framework. The [Ember Guides](http://emberjs.com/guides/models/) have a great explanation on it so be sure to read that.

[angular-data](http://angular-data.pseudobry.com/) was inspired by [Ember Data](http://emberjs.com/guides/models/). If you haven't worked with Ember Data, it is an awesome modeling layer created by the Ember team. angular-data offers more features than what I just mentioned, but these 2 features were the reasons I decided to learn it and use in an application I am building at work. Anyways, let's get into the basics of angular-data.

### Installation

Follow the [angular-data installation instructions](http://angular-data.pseudobry.com/documentation/api/angular-data/angular-data). You can install it either through NPM, Bower, or download manually.

Next, specify _angular-data.DS_ as a module dependency.

```js
var app = angular.module('library', ['angular-data.DS']);
```

### Creating Models

Let's start by creating a Book model:

```js
app.factory('Book', function(DS) {
	return DS.defineResource({
		name: 'book',
		endpoint: '/api/books',
		idAttribute: 'isbn13'
	});
});
```

angular-data has a service we can inject called _DS_, which stands for Data Store. We can call the _defineResource()_ method on _DS_ to create a new resource model.

The _name_ attribute allows us to specify a name for our resource. Think of it like a table name in your database and it can be used to look up _book_ records in your application. Next I provided an _endpoint_ property. If you don't specify an endpoint, it will have a sensible default using the resource's _name_. Lastly, I specified the unique id / primary key property name of all book records. By default this is set to _id_, but if you need something different, you can set it, such as in the example above.

### Fetching Data with Models

So we have a Book model defined. How can we fetch books, store the records in our data store, and bind them to our view from our controller?

```js
app.controller('BooksController', function($scope, Book) {
  Book.findAll().then(function(books) {
    $scope.books = books;
  });
});
```

or alternatively using DS in our controller:

```js
app.controller('BooksController', function($scope, DS) {
  DS.findAll('book').then(function(books) {
    $scope.books = books;
  });
});

app.run(function(Book) {

});
```

Personally, I like the latter approach. My controllers only ever need to know about the _DS_ service injected in order to fetch data. With the former approach, if I need other resources in my controller, like Author, Book, etc, then I'd have to inject each one, making my list of dependencies for the controller longer. However, in the latter approach, by not injecting the _Book_ service into the controller, the _book_ resource is never set up. Remember, the _book_ resource is in a factory called _Book_. If that factory is never injected anywhere, _DS.defineResource()_ is never called and the _book_ resource is never initialized.

One other thing to note is that your custom resources have all the methods that are on the _DS_ service. As you are looking through the docs and see references to _DS_, you call call those methods directly on your resources too.

The neat thing about making the _findAll()_ call is that it will load all book objects from the server into memory in the data store. If I want to find a particular book, say with an _isbn13_ of 123456789, the data store won't make another request for this book because it was already loaded into the store from _.findAll()_, and it will return that instance to you instead, hence the identity mapping taking effect.

```js
// fetch books from endpoint and load into the store
DS.findAll('book').then(function() {
	// no request made here since this book is already in the store
	DS.find('book', '978-0596806750').then(function(book) {
		console.log(book, 'loaded directly from data store');
	});
});
```

### Binding Models to the View

We can also bind _book_ records in the store to a controller's _$scope_ directly with [_DS.bindAll()_](http://angular-data.pseudobry.com/documentation/api/angular-data/DS.sync%20methods_bindAll).

```js
DS.bindAll($scope, propertyName, resourceName);
```

Below we are binding all records of resource name _book_ to _$scope.books_. When _DS.findAll()_ resolves and updates the data store, _$scope.books_ will immediately update. How cool is that!

```js
app.controller('BooksController', function($scope, DS) {
	DS.bindAll($scope, 'books', 'book')

	// fetch books from endpoint and load into the store
	DS.findAll('book').then(function() {
  	// no request made here since this book is already in the store
		DS.find('book', '978-0596806750').then(function(book) {
			console.log(book, 'loaded directly from data store');
		});
	});
});
```

### Bootstrapping Data into the Store

If you have data dumped out onto the page from the server and you need that injected into the store, you can easily do that with the _inject()_ method.

```js
app.run(function(Book) {
	Book.inject(window.jsonCache.books);
});
```

### Conclusion

In this post we looked at how to create models using the _DS_ service that angular-data provides. We also looked at how we can access data using our models and how the data store keeps track of the identity of our records.

In the next part of the tutorial we will look at defining model relationships. Stay tuned!

[View a full working demo](https://github.com/skaterdav85/angular-data-demo/)

### Resources

* [DS documentation](http://angular-data.pseudobry.com/documentation/api/angular-data/DS)





