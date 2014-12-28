---
layout: post
title:  "The Template Method Design Pattern"
date:   2014-12-31
categories: JavaScript Design-Patterns
---

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

```js
new SearchAutocomplete({
  input: '#search-autocomplete',
  results: '#search-autocomplete-results'
});
```