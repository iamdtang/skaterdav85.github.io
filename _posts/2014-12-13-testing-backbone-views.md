---
layout: post
title:  "Unit Testing Backbone Views"
date:   2014-12-13
categories: JavaScript, Backbone.js
---

Over the past 8 months, I have been working with Backbone.js quite a bit at work. As I was working with it, one of things I struggled with was writing maintainable and unit testable views. I had been writing lots of unit tests for models, collections, services, etc, just not my views.

The reason I didn't write tests for my views was because my views were tightly coupled to HTML templates. Should I test that the rendered HTML was what I expected? I initially tried this approach but quickly found that it did not scale. As soon as some markup changed, my test(s) broke. Additionally, this made my tests difficult to read, having HTML mixed in with JavaScript tests. Not good.

Prior to working with Backbone, I had been working a lot with Angular and writing unit tests for my controllers, services, factories, and filters. As I was working more with Backbone, I realized that Backbone views are similar to Angular controllers. Both control a section of DOM and what data is rendered in that DOM. If you've ever unit tested an Angular controller, from my experience what I usually tested was making sure the right data was bound to $scope. Angular handles rendering that data for you through the digest cycle. Now going back to Backbone, if you treat your Backbone views like an Angular controller and only test the model that is attached to the view as the view manipulates it, testing views becomes much easier, and you adhere to keeping your truth out of the DOM. Let's look at an example.

Imagine your have a list of boxes representing quantities, and the user can select only 1 quantity at a time. When a quantity is selected, a class of "active" is added to that box (a list item element). Each quantity box is managed by a view called _QuantityItemView_.

<style>
	.quantities {
		margin: 0 !important;
		padding: 0;
	}
	.quantities li {
		display: inline-block;
		background-color: #1884BB;
		color: white;
		padding: 5px 13px;
		margin-bottom: 15px;
	}
</style>

<ul class="quantities">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
	<li>5</li>
</ul>

```js
var QuantityItemView = Backbone.View.extend({
	template: _.template('<a href="#" class="<%= isActive %>"><%= quantity %></a>'),
	tagName: 'li',
	events: {
		'click': 'selectQuantity'
	},
	initialize: function() {
		// automatically re-render when the model changes
		this.listenTo(this.model, 'change', this.render);

		// conditionally apply the class 'active' based on applicationState
		this.listenTo(applicationState, 'change:quantity', function() {
			if (applicationState.get('quantity') === this.model.get('quantity')) {
				this.model.set('isActive', 'active');
			} else {
				this.model.set('isActive', null)
			} 
		});
	},
	selectQuantity: function(e) {
		e.preventDefault()
		applicationState.set('quantity', this.model.get('quantity'))
	}
});
```

I have also set up an _applicationState_ object (which is just an instance of Backbone.Model) to keep track of the state of the application. When a user clicks on the box, it will update the applicationState's quantity property. Each item view also listens to the applicationState. When the quantity on the applicationState is equal to the corresponding QuantityItemView, it will set a property _isActive_ equal to "active" on the model. As soon as the QuantityItemView's model changes, you can set up your view to automatically re-render. I have left out the render implementation but it isn't anything different than what you'd typically do.

And here is the view's unit test:

```js
describe('QuantityItemView', function() {
	var quantities;
	var view1, view2, view3;

	beforeEach(function() {
		quantities = new Backbone.Collection([
			{ quantity: 1 },
			{ quantity: 2 },
			{ quantity: 3 }
		]);

		view1 = new QuantityItemView({ model: quantities.at(0) });
		view2 = new QuantityItemView({ model: quantities.at(1) });
		view3 = new QuantityItemView({ model: quantities.at(2) });
	});

	it('should set a property "isActive" to "active" on the correct model', function() {
		applicationState.set('quantity', 3);

		expect(quantities.at(0).get('isActive')).toEqual(null);
		expect(quantities.at(1).get('isActive')).toEqual(null);
		expect(quantities.at(2).get('isActive')).toEqual('active');
	});

	it('should set isActive on the model when clicked', function() {
		view2.$el.click();
		expect(applicationState.get('quantity')).toEqual(2);
	});
});
```

Notice how the view isn't manually manipulating the DOM and adding and removing the "active" class based on which one the user selected? From my experience, doing this can often lead to inconsistent states between your model and your view, especially in a more complicated scenario. Using this approach, your view becomes much easier to test. You can simply set up your views, interact with the view or manipulate things that the view listens to (like _applicationState_), and test that the model of the view gets updated correctly. This is similar to how you would test $scope is getting updated in an Angular controller unit test. You don't have to test that HTML markup renders a certain way which does not lend itself well to changing markup. If you set up your view to automatically re-render whenever the model changes, you can be sure that your view will be in sync with your model.