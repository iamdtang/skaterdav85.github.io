---
layout: post
title:  "Unit Testing with $httpBackend in Angular.js - Request Expectations"
date:   2014-01-18
categories: Angular.js JavaScript
---

So you have an Angular service that communicates with an API, but you're not really sure how to go about testing it. Maybe you read the documentation on _$httpBackend_, but you were a little confused by the examples. I know I was. Let's see how we can set __Request Expectations__ using _$httpBackend_.

Below I have an angular module for a ficticious marketing application. There is a factory that returns a Campaign class. This Campaign class is responsible for creating and fetching campaigns from a campaign resource on our server. 

```js
var app = angular.module('App', []);

app.factory('Campaign', function($http) {
	function Campaign(data) {}

	Campaign.fetch = function(id) {
		var endpoint = 'http://localhost:4000/campaigns/' + id;
		return $http.get(endpoint)
	};

	return Campaign;
});
```

I want to test that _Campaign.fetch()_ makes an HTTP GET request to the correct endpoint for a given ID. Because the Campaign factory makes use of _$http_, it will make a network request. We don't want our unit test dependent on the API. We just want to verify that _fetch_ sends the request to the correct endpoint without actually communicating with the server. If you've worked with Jasmine before, we essentially want to _spy_ on or mock the XHR request. 

To mock out _$http_, we can use _$httpBackend_. This service is available in angular-mocks.js in the extras section.

```js
describe('Campaign', function() {
	beforeEach(module('App'));

	it('should fetch a campaign by ID', inject(function(Campaign, $httpBackend) {
		$httpBackend
			.expectGET('http://localhost:4000/campaigns/99')
			.respond(200);

		Campaign.fetch(99);
		$httpBackend.flush();
	}));
});
```

By injecting _$httpBackend_ into our test, we can set a __Request Expectation__ on the test. In other words, our test will fail if there isn't a GET request to /campaigns/99. By making a call to _Campaign.fetch(99)_, our test will pass.

As stated in the [Angular.js docs for $httpBackend](http://docs.angularjs.org/api/ngMock.$httpBackend):

> "Request expectations provide a way to make assertions about requests made by the application and to define responses for those requests. The test will fail if the expected requests are not made or they are made in the wrong order."

In the next post, we'll look at __Backend Definitions__ with _$httpBackend_.