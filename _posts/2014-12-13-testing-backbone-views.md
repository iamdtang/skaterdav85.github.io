---
layout: post
title:  "Treating Backbone Views like Angular Controllers for Easier Unit Testing"
date:   2014-12-13
categories: JavaScript Backbone.js
keywords: Unit testing Backbone Views, Angular Controllers, Testing Backbone Views, Unit Testing, Backbone Views
image: backbone
---

One of the things I have found most challenging when working with Backbone.js is writing maintainable and unit testable views. Based on recent experience, I have been writing lots of unit tests for models, collections, reusable view abstractions, and services, but not for my application's views.

The reason I haven't written tests for my views is because it can be really difficult depending on how you write your views. My first thought was testing that the rendered HTML from a view is what I expect it to be. I initially tried this approach but quickly found that it did not scale well. As soon as some markup changed, my test broke. This can be really difficult to manage when working on a team and you are not the person always updating the HTML. This also made my tests difficult to read, having HTML mixed in with JavaScript tests. Not good. Lastly, it requires that the HTML template your Backbone view controls is available in your test.

For really simple views in an application, not testing them is probably fine. If a view is more complicated and sets multiple properties for rendering based on the data it is passed and application state, you may want to unit test those views. So how do you go about unit testing complicated Backbone views when it can be really challenging as described earlier?

Prior to working with Backbone, I worked a lot with Angular and wrote unit tests for my controllers, services, factories, and filters. As I worked more with Backbone, I realized that Backbone views are very similar to Angular controllers. Both control a portion of the DOM and what data is rendered in that section. If you've ever unit tested an Angular controller, from my experience what I usually test is making sure the right data is bound to _$scope_, the view-model. Angular handles rendering that data for you through the digest cycle. If you treat your Backbone views like an Angular controller and only test the model that is attached to the view as the view manipulates it, testing views becomes much easier, and you adhere to keeping your truth out of the DOM. Instead of manually manipulating the DOM in your view, always manipulate the model and have the view automatically re-render when the model changes.

Let's look at an example.

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

I have also set up an _applicationState_ object (which is just an instance of _Backbone.Model_) to keep track of the state of the application. When a user clicks on the box, it will update the _applicationState_'s quantity property. Each item view also listens to _applicationState_. When the quantity on _applicationState_ is equal to the model of the corresponding _QuantityItemView_, it will set a property _isActive_ equal to "active" on the model which corresponds to a CSS class name to visually show the current selected quantity. As soon as the _QuantityItemView_'s model changes, you can set up your view to automatically re-render. I have left out the render implementation but it isn't anything different than what you'd typically do.

And here is the view's unit test using Jasmine.

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
