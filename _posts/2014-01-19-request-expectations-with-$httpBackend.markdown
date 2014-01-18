---
layout: post
title:  "Request Expectations with $httpBackend"
date:   2014-01-19 14:23:33
categories: Angular.js
---

So you have an Angular service that communicates with an API, but you're not really sure how to go about testing it. Let's see how we can do that using __Request Expectations__ and _$httpBackend_.

Below I have an angular module for a ficticious marketing application. There is a factory that returns a Campaign class. This Campaign class is responsible for creating and fetching campaigns from a campaign resource on our server. 

```js
var app = angular.module('App', []);

app.factory('Campaign', function($http, $q) {
	function Campaign(data) {
		this.title = data ? data.title : '';
	}

	Campaign.prototype.save = function() { /* implementation */ };

	Campaign.fetch = function(id) {
		var dfd = $q.defer();
        var endpoint = 'http://localhost:4000/campaigns/' + id;

		$http
			.get(endpoint)
            .then(function(resp) {
				var campaignModel = new Campaign(resp.data);
				dfd.resolve(campaignModel);
			});

		return dfd.promise;
	};

	return Campaign;
});
```

The first thing I want to test is that Campaign.fetch makes an HTTP GET request to the correct endpoint for a given ID. Because the Campaign factory makes use of $http, it will make a network request. We don't want our unit test dependent on the API. We just want to verify that _fetch_ sends the request to the correct endpoint without actually communicating with the server. If you've worked with Jasmine before, we essentially want to _spy_ on the XHR request or mock the request. 

To mock out _$http_, we can use _$httpBackend_. This service is available in angular-mocks.js in the extras section.

```
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

By injecting _$httpBackend_ into our test, we can set a __Request Expectation__ or an assertion on the XHR request. We _expect_ there to be a request of type GET and we _expect_ the request to be sent to /campaigns/99 for Campaign.fetch(99).

As stated in the [Angular.js docs](http://docs.angularjs.org/api/ngMock.$httpBackend):

> "Request expectations provide a way to make assertions about requests made by the application and to define responses for those requests. The test will fail if the expected requests are not made or they are made in the wrong order."

In our test, if Campaign.fetch(99) was not called, the test would have failed because the expected request was not made.

In the next post, we'll look at __Backend Definitions__ with _$httpBackend_.

For more details on [$httpBackend](http://docs.angularjs.org/api/ngMock.$httpBackend), please visit the documentation.