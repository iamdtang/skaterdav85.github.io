---
layout: post
title:  "Unit Testing with $httpBackend in Angular.js - Backend Definitions"
date:   2014-01-20
categories: Angular.js
---

In the [last post on Request Expectations]({% post_url 2014-01-18-request-expectations-with-httpBackend %}), we looked at how we can set expectations that certain requests are made. Here we will look at how we can define our backend with fake responses for our unit tests.

Say we have a music application and a Song class. The Song class has a method to get the average price of all songs for an artist (maybe for an analytics dashboard). However, let's pretend that the server will only return a list of songs and not the computed average. Our method will then have to handle this computation on the client once it gets the list of songs.

Below we have _Song.getAverageSongPrice()_. It returns a promise that will be resolved with the average song price for a given artist.

```js
var app = angular.module('App', []);

app.factory('Song', function($http, $q) {
	function Song() {}

	Song.getAverageSongPrice = function(artist) {
		var dfd = $q.defer();

		$http
			.get('http://localhost:4000/artists/eminem/songs')
			.then(function(resp) {
				var total = 0;
				var average = 0;

				resp.data.forEach(function(song) {
					total += song.price;
				});

				average = total / (resp.data.length);
				dfd.resolve(average);
			});

		return dfd.promise;
	};

	return Song;
});
```

Let's write a unit test for this. Here we'll want to define a server response so that our unit test doesn't make a network request when _Song.getAverageSongPrice()_ is called, thus keeping our unit test isolated.

```js
it('should return the average price of songs', inject(function(Song, $httpBackend) {
	$httpBackend
		.when('GET', 'http://localhost:4000/artists/eminem/songs')
		.respond(200, [
			{ title: 'Legacy', price: 0.99 },
			{ title: 'Love the way you lie', price: 1.29 },
			{ title: 'Stan', price: 1.29 }
		]);

	Song.getAverageSongPrice('eminem').then(function(average) {
		expect(average).toEqual( (0.99 + 1.29 + 1.29) / 3 );
	});

	$httpBackend.flush();
}));
```

Through the use of _$httpBackend_, a response can be defined for when a request is made to /artists/eminem/songs using _$http_. The _$httpBackend_ service essentially provides a way to spy on requests that use _$http_. So in this scenario, the endpoint was configured to respond with some JSON containing 3 songs. Now the unit test won't make any network requests when _Song.getAverageSongPrice()_ is called, and an assertion can be written to verify that the returned promise is resolved with the correct average price.

As stated in the [Angular documentation](http://docs.angularjs.org/api/ngMock.$httpBackend):

> "Backend definitions allow you to define a fake backend for your application which doesn't assert if a particular request was made or not, it just returns a trained response if a request is made. The test will pass whether or not the request gets made during testing."

In the test above, if a call to _Song.getAverageSongPrice()_ was not made (which would in turn make an XHR request using $http), the unit test would not fail. Unlike request expectations where we expect a certain type of request to be made within our test, here we are merely defining a static response for the backend so that our unit test can be isolated and tested independently from the server.