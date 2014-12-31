---
layout: post
title:  "The Template Method Design Pattern"
date:   2015-01-01
categories: ['JavaScript', 'Design Patterns']
---

Over the past year I have been reading a lot about design patterns. One of the patterns I learned about was the Template Method pattern. After reading about it, I realized that I had already been using it and found there was a name for it. I wanted to show a practical example of this pattern where I used it to create a reusable class for Autocomplete components.

As defined on [Wikipedia](http://en.wikipedia.org/wiki/Template_method_pattern), the template method pattern states:


> In software engineering, the template method pattern is a behavioral design pattern that defines the program skeleton of an algorithm in a method, called template method, which defers some steps to subclasses.

## The Basic Autocomplete Algorithm

So let's break down this definition in the context of an autocomplete. What would be the template method, or "program skeleton of an algorithm"? In this autocomplete example, the algorithm would be:

1. Queue up a request for data based on user input
2. Cancel any previously queued requests

Rather than making requests immediately on each keystroke from the user, which could really hammer the server, we'll instead queue up a request and wait 300 milliseconds before sending it off. If 300 milliseconds passes without any keystrokes, we can assume the user has paused from typing and is expecting results.

So what parts of this autcomplete might be unique? How the data is fetched and processed would be unique across different autcomplete instances. Maybe in one autocomplete you hit an internal API and in another you work with Facebook's API. Maybe in one autocomplete you can work with the response directly as is and in another you need to preprocess it a little bit. Maybe you have a client-side caching solution where you first check the cache for results, and if it isn't there then you make an API request. These details may vary across autocomplete components, but the general algorithm mentioned above would be the same. The template method in our parent class will control the main autocomplete algorithm and will delegate the unique step of fetching and processing data to a method defined in subclasses.

## The Autocomplete Class

Let's first take a look at the _Autocomplete_ class which contains the template method, _search()_.

~~~js
function Autocomplete() {
  this.timeout = null;
}

Autocomplete.prototype.search = function(searchTerm) {
  var self = this;
  var deferred = new $.Deferred();

  if (this.timeout) {
    clearTimeout(this.timeout);
  }

  this.timeout = setTimeout(function() {
    self.request(searchTerm).then(function(results) {
      deferred.resolve(results);
    });
    self.timeout = null;
  }, 300);

  return deferred.promise();
};
~~~

Here our template method is the _search()_ method. The basic idea of this method is that it uses timeouts to queue up a search request. As the user types into the text input, _search()_ is called with the search term. The actual request for data isn't made immediately. There is a delay of 300 milliseconds before the request is made. The reason for this is so that multiple requests aren't fired off to the server as the user is pressing each key for their search term. If there is a 300 millisecond delay, we can assume the user has stopped typing and can load some results. Each timeout is stored off in the _timeout_ instance variable. Each time _search()_ is called, we'll cancel any previous timeouts set.

If you look at _setTimeout()_, you will notice that it calls a method called _request()_ that returns a promise. This method has not been defined yet and will be deferred to a subclass. The subclass in this example will be the _ItunesAutocomplete_ subclass that hooks into the iTunes Search API.

## The ItunesAutocomplete Subclass

~~~js
// Subclass Autocomplete
function ItunesAutocomplete() {
  Autocomplete.apply(this, arguments);
}

ItunesAutocomplete.prototype = Object.create(Autocomplete.prototype);
ItunesAutocomplete.prototype.constructor = ItunesAutocomplete;

ItunesAutocomplete.prototype.request = function(searchTerm) { 
  var url = 'https://itunes.apple.com/search?' + $.param({
    term: encodeURIComponent(searchTerm)
  });

  url += '&callback=?';

  return $.getJSON(url).then(function(response) {
    return response.results;
  });
};
~~~

Here we define the _request()_ method that gets called in _search()_ defined on _Autocomplete.prototype_. In the example above, a JSONP request is made to the iTunes API and the response is preprocessed so that the actual results stored in _response.results_ are resolved instead of the entire response. Looking at how _request()_ is used in _search()_, it needs to return a promise. Other than that, the data can come from anywhere. The _search()_ template method doesn't care where the data comes from. It's concern is the general autocomplete algorithm and just expects _request()_ to return a promise.

If we wanted an autocomplete for Facebook Pages from Facebook's API, we could do something like this:

~~~js
// Subclass Autocomplete
function FacebookAutocomplete() {
  Autocomplete.apply(this, arguments);
}

FacebookAutocomplete.prototype = Object.create(Autocomplete.prototype);
FacebookAutocomplete.prototype.constructor = FacebookAutocomplete;

FacebookAutocomplete.prototype.request = function(searchTerm) { 
  var url = 'https://graph.facebook.com/' + searchTerm;
  url += '?callback=?';

  return $.getJSON(url);
};
~~~

Again, note how this class contains only the specifics of requesting data and the _search()_ template method uses it.

The full demo can be found <a href="/demos/template-method/">here</a>. 

## Summary

The template method design pattern is a very useful pattern and one are likely using already. It allows a parent class to define a general algorithm, and delegates the parts that will vary to subclasses. In our example, _Autocomplete_ is the parent class with the general algorithm contained in the template method _search()_. _ItunesAutocomplete_ is a subclass of _Autocomplete_ that implements the specifics for requesting data in _request()_.

I will be posting more articles on design patterns in the near future because it is a topic I am very interested in. Let me know in the comments how you have used the template method pattern in your applications!

