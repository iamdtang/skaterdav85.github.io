---
layout: post
title:  "The Template Method Design Pattern"
date:   2015-01-01
categories: JavaScript Design-Patterns
---

Over the past year I have been reading a lot about design patterns. One of the patterns I learned about is the Template Method pattern. After reading about it, I realized that I had already been using it and found there was a name for it. I wanted to show a practical example of this pattern where I used it to create reusable Autocomplete components. 

As defined on [Wikipedia](http://en.wikipedia.org/wiki/Template_method_pattern):


> In software engineering, the template method pattern is a behavioral design pattern that defines the program skeleton of an algorithm in a method, called template method, which defers some steps to subclasses.

So let's break down this definition in the context of an autocomplete. What would be the template method, or  "program skeleton of an algorithm"? In an autocomplete, the algorithm would be:

1. listen for a keyup even from the user
2. Fire off a request for data if the user types in a minimum number of characters (we'll say at least 3 characters in this example). As a user is typing after the 3 character minimum, only fire a request when the user has likely finished typing. This way the server isn't hammered with requests as the user is typing.
3. Take the data when the response comes back and render it in a results container
4. Show the results container

These steps are pretty common across all autocompletes. So what parts of an autcomplete might be unique? How the data is fetched and parsed would be unique across different autcomplete instances. When fetching the data, the API endpoint would be different and how the response is handled. Maybe you have to do a little preprocessing on the response. Maybe you have a client-side caching solution where you first check the cache for results, and if it isn't there then you make an API request. Also, how the data is rendered is unique. Maybe you are using a Backbone View or plain client-side templating. The template method doesn't really care about these implementation details. The template method controls the main autocomplete algorithm and delegates the unique details to subclasses.

### The Child Class API

Let's look at the API of the _SearchAutocomplete_ subclass first. _SearchAutocomplete_ will contain the methods for requesting and rendering data, and it extends from a parent class _Autocomplete_ that contains the template method. If you were to have other autocompletes on your site, it would also extend _Autocomplete_ and have methods for requesting and rendering data.

```js
// extends Autocomplete
new SearchAutocomplete({
  input: '#search-autocomplete',
  results: '#search-autocomplete-results'
});
```

The constructor takes in an _options_ object where the text input and the results container are specified.

### The Template Method

```js
function Autocomplete(options) {
  this.$input = $(options.input);
  this.$results = $(options.results);
  this._timeout = null;
  this.setupEventListeners();
}

Autocomplete.prototype.setupEventListeners = function() {
  var self = this;
  
  this.$input.on('keyup', function(e) {
    if (this.value.length > 2) {
      self.throttleSearch(this.value);
      self.$results.show();
    } else {
   	  self.$results.hide();
    }
  });
};

Autocomplete.prototype.throttleSearch = function(searchTerm) {
  var self = this;
  
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  this._timeout = setTimeout(function() {
  	self.request(searchTerm).then(function(data) {
      var el = self.render(data);
      self.$results.html(el);
    });
  }, 300);
};

Autocomplete.prototype.render = function() {
  throw new Error('A child class must specify this functionality!');
};

Autocomplete.prototype.request = function() {
  throw new Error('A child class must specify this functionality!');
};
```

### The Subclass

```js
/**
 * 1. Create a SearchAutocomplete constructor that inherits from Autocomplete
 */
function SearchAutocomplete() {
	Autocomplete.apply(this, arguments);
}

SearchAutocomplete.prototype = Object.create(Autocomplete.prototype);
SearchAutocomplete.prototype.constructor = SearchAutocomplete;

/**
 * 2. Define the abstract methods
 */
SearchAutocomplete.prototype.request = function(query) {
	// Fetches autocomplete data and returns a promise
};

SearchAutocomplete.prototype.render = function(data) {
	// Create HTML using the data from the request and return it
	// Autocomplete::throttleSearch will handle rendering it inside the results element
};
```

