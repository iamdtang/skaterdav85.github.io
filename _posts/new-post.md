Recently I started working with the Marionette Router and Controller. I like how in version > 2.1, they gave a clear defintion to what a controller is. Separating out route definitions with the actual methods that do the work makes a lot of sense and cleans things up a bit so that the router isn't this one monolithic thing.

However, having separated out my route handlers into the controller, you no longer have access to the router which you might need if you want to navigate somewhere from within your controller. For example, say from within a controller method you want to redirect to another route based on some condition. The Marionette router doesn't give you this by default, but I have come up with a small solution that makes it a little cleaner.

Let's look at an example.

```js
// MyAccountRouter
define(['marionette'], function() {
	return Marionette.AppRouter.extend({
		appRoutes: {
			'':           'dashboard',
			'orders':     'orders',
			'orders/:id': 'orderDetails'
		}
	});
});

// MyAccountController
define(['marionette'], function() {
	return Marionette.Controller.extend({
		dashboard: function() {},
		orders: function() {},
		orderDetails: function() {
			// navigate to /orders if an invalid order ID is passed through the URL
		}
	});
});

// main.js
require(['MyAccountRouter', 'MyAccountController'], function() {
	new MyAccountRouter({
		controller: new MyAccountController({
			applicationView: new ApplicationView({ el: 'body' })
		})
	});
});
``` 

Here I have defined a simple Marionette Router and Controller. What if in the orderDetails route handler I want to redirect back to `/orders` if an invalid order ID was passed through the URL. A Marionette controller on its own doesnt have access to the router that owns it.


```js
// MyAccountController
define(['marionette'], function() {
	return Marionette.Controller.extend({
		dashboard: function() {},
		orders: function() {},
		orderDetails: function() {
			this.navigate('orders');
		}
	});
});
``` 

```js
// MyAccountRouter
define(['marionette'], function() {
	return Marionette.AppRouter.extend({
		initialize: function(options) {
			var router = this;
			options.controller.navigate = function() {
			  router.navigate.apply(this, arguments)
			};
		},

		appRoutes: {
			'':           'dashboard',
			'orders':     'orders',
			'orders/:id': 'orderDetails'
		}
	});
});
```

```js
var router = new MyAccountRouter({
	controller: new MyAccountController({
		applicationView: new ApplicationView({ el: 'body' })
	})
});
```