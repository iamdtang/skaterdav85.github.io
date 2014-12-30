---
layout: post
title:  "The Template Method Design Pattern"
date:   2015-01-01
categories: ['JavaScript', 'Design Patterns']
---

Over the past year I have been reading a lot about design patterns. One of the patterns I learned about is the Template Method pattern. After reading about it, I realized that I had already been using it and found there was a name for it. I wanted to show a practical example of this pattern where I used it to create reusable Autocomplete components. 

As defined on [Wikipedia](http://en.wikipedia.org/wiki/Template_method_pattern), the template method pattern states:


> In software engineering, the template method pattern is a behavioral design pattern that defines the program skeleton of an algorithm in a method, called template method, which defers some steps to subclasses.

### The Basic Autocomplete Algorithm

So let's break down this definition in the context of an autocomplete. What would be the template method, or "program skeleton of an algorithm"? In an autocomplete, the algorithm would be:

1. Listen for keyup events from the user on a text input
2. Fire off a request for data if the user types in a minimum number of characters (we'll say at least 3 characters in this example). Once 3 characters have been typed:
3. Fire a request when the user has likely paused typing and is waiting for results. This way the server isn't hammered with requests after each keypress. We'll assume that the user has stopped typing if they pause for at least 300 milliseconds.
4. Take the data when the response comes back and render it in a results container.
5. Show the results container.

These steps are pretty common across all autocompletes. So what parts of an autcomplete might be unique? First, how the data is fetched and parsed would be unique across different autcomplete instances. This includes the API endpoint and how the response is resolved. Maybe you have to do a little preprocessing on the response to get to the actual data you want to render. Maybe you have a client-side caching solution where you first check the cache for results, and if it isn't there then you make an API request. Second, how the data is rendered is unique across different autocomplete instances. Maybe you are using a Backbone View or plain client-side templating. The template method doesn't really care about these implementation details. The template method controls the main autocomplete algorithm and delegates the unique details to subclasses, in this case, _SearchAutcomplete_.

### The Search Autocomplete API

Let's look at the API of the _SearchAutocomplete_ subclass first. _SearchAutocomplete_ will contain the methods for requesting and rendering data, and it extends from a parent class _Autocomplete_ that contains the template method. If you were to have other autocompletes on your site, they would also extend _Autocomplete_ and have methods for requesting and rendering data.

```js
// extends Autocomplete
new SearchAutocomplete({
  input: '#search-autocomplete',
  results: '#search-autocomplete-results'
});
```

We'll create a new instance of _SearchAutocomplete_ and pass it the selectors for the text input that will trigger the autocomplete on keyup and a selector for where the results will be placed.

### The Template Method

Now we'll define the parent class that _SearchAutocomplete_ extends from. This parent class will contain the general autocomplete algorithm (the template method).

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
```

The _Autocomplete_ class takes in an options object containing the text input and results container selectors. We'll use these selectors to grab these elements from the DOM using jQuery and store them as instance properties.

The constructor calls a method _setupEventListeners()_ which binds a keyup event to the text input. If the input contains more than 2 characters, a search request is queued up through the method _throttleSearch()_ (more on this next), and the results element is shown. Otherwise the results element is hidden.

```js
Autocomplete.prototype.throttleSearch = function(searchTerm) {
  var self = this;
  
  // if a previous search was made, cancel it 
  // in favor of the current search taking place
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
```

Next is the _throttleSearch()_ method which contains the general autcomplete algorithm. The basic idea of this method is that it is using timeouts to queue up a search request. As the user types into the text input, _throttleSearch()_ is called with the search term. The actual request for data isn't made immediately. There is a delay of 300 milliseconds before the request is made. The reason for this is so that multiple requests aren't fired off to the server as the user is pressing each key for their search term. If there is a 300 millisecond delay, we can assume the user has stopped typing and can load some results. Each timeout is stored off in the __timeout_ instance variable. Each time _throttleSearch()_ is called, we'll cancel any previous timeouts set.

If you look at _throttleSearch()_, you will notice that it calls a method called _request()_ that returns a promise. When this promise resolves, it will then call a method called _render()_ with the response from the request. Neither of these methods have been defined yet. They will be deferred to the _SearchAutocomplete_ subclass.


### The "Abstract Methods"

To show that subclasses of _Autocomplete_ need to have methods _render()_ and _request()_, we can create them on _Autocomplete_ and have them throw custom errors, thus mimicking how abstract methods behave in classical object oriented languages. This isn't required but it can be useful to document that these methods need to be defined in a subclass. It can also be useful in case another developer tries to instantiate _Autocomplete_ on its own.

```js
Autocomplete.prototype.render = function() {
  throw new Error('A child class must specify this functionality!');
};

Autocomplete.prototype.request = function() {
  throw new Error('A child class must specify this functionality!');
};
```

### The Search Autocomplete Subclass



```js

// 1. Create a SearchAutocomplete constructor that inherits from Autocomplete
function SearchAutocomplete() {
	Autocomplete.apply(this, arguments);
}

SearchAutocomplete.prototype = Object.create(Autocomplete.prototype);
SearchAutocomplete.prototype.constructor = SearchAutocomplete;

// 2. Define the "abstract" methods in the SearchAutocomplete subclass

/**
 * Fetches autocomplete data and returns a promise
 * @param  {String}   query  The term being searched for
 * @return {Promise}         Must return a promise
 */
SearchAutocomplete.prototype.request = function(query) {
  return $.ajax({
    url: '/some/endpoint',
    dataType: 'json',
    data: {
      term: query
    }
  });
};

/**
 * Create HTML using the data from the request and return it
 * @param  {Mixed}   data   The data that request() resolves with
 * @return {Mixed}          Can return anything that jQuery .html() accepts as a parameter
 */
SearchAutocomplete.prototype.render = function(data) {
  return '<div>Dynamically created HTML</div>';
};
```

I have given the required methods _request()_ and _render()_ example definitions here. If you look back at the _setTimeout_ in _Autocomplete_ _throttleSearch()_, _request()_ must return a promise. _render()_ can return anything that jQuery's _.html()_ accepts as a parameters.

### Summary

The template method design pattern is a very useful pattern and one you could likely be using already. It lets a parent class define a general algorithm, and delegates the parts that will vary to subclasses. In the autocomplete example, _Autocomplete_ is the parent class with the general algorithm. _SearchAutocomplete_ is a subclass of _Autocomplete_ that implements the specifics for requesting and rendering data.

Let me know in the comments how you have used the template method pattern in your applications!

