---
layout: post
title:  "Backend Definitions with $httpBackend"
date:   2014-01-19
categories: Angular.js
---

In the [last post on Request Expectations]({% post_url 2014-01-18-request-expectations-with-httpBackend %}), we looked at how we can set expectations that certain requests are made. Here we will look at how we can define our backend with fake responses for our various endpoints.

One reason I have found myself wanting to define static responses for endpoints is in unit testing Angular services that fetch data from a server. For example, say you have a function that makes an XHR request using _$http_ or _$resource_ and you want that service to return a __model__ instead of a plain old JavaScript object. You want to wrap that data coming back from the server in a class so that particular resource can be modeled on the client having its own propeties and methods.

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

The example above is the same example from the previous post. There is a factory that returns a Campaign class for a ficticious Marketing application. The _.fetch(id)_ method fetches a single campaign from the server given an id. On the client, I want to have a Campaign model with its own methods for saving, deleting, calculating various things, etc. The server response is passed to an instance of the Campaign class where it can handle setting certain properties. The _.fetch()_ method now returns an instance of Campaign.

For the unit test, it shouldn't make a network request. Otherwise the test is dependent on the server which makes it brittle. Instead, I merely want to fake out the server response and test that the _.fetch()_ method returns a Campaign instance.

```js
describe('Campaign', function() {
	beforeEach(module('App'));

	it('should return a Campaign model', inject(function(Campaign, $httpBackend) {
		$httpBackend.when('GET', 'http://localhost:4000/campaigns/99')
			.respond(200, { title: 'some title', stats: [1, 2, 3] });

		Campaign.fetch(99).then(function(campaign) {
			expect(campaign instanceof Campaign).toBeTruthy();
            expect(campaign.title).toEqual('some title');
		});

		$httpBackend.flush();
	}));
});
```

In the unit test above, a static server response for when a request is made to /campaigns/99 has been defined. It is configured to respond with some JSON containing a title and stats. Now the unit test won't make any network requests when the _.fetch()_ method is called. The _.fetch()_ method can be tested for whether the promise returned is resolved with a Campaign model or not. 

Now you might ask yourself, why not just use _$resource_? In this example you would probably want to do that since _$resource_ gives you objects with save, delete, etc, and you can add your own custom methods to your resource's prototype. However imagine that _.fetch()_ had some other logic in there that manipulated the server response. In that case, you would want to see how _.fetch()_ handles various server responses without having to make network requests.

As stated in the [Angular documentation](http://docs.angularjs.org/api/ngMock.$httpBackend):

> "Backend definitions allow you to define a fake backend for your application which doesn't assert if a particular request was made or not, it just returns a trained response if a request is made. The test will pass whether or not the request gets made during testing."

In the test above, if a call to Campaigh.fetch() was not made (which would in turn make an XHR request using $http), the unit test would not fail. Unlike request expectations where we expect a certain type of request to be made, here we are merely defining a static response for the backend so that our unit test for _.fetch()_ can be isolated.