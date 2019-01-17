---
layout: post
title:  Overriding Backbone.sync
date:   2015-03-18
keywords: Backbone.sync, Backbone model custom url, Backbone model sync, custom endpoint in Backbone model, custom url in Backbone Models
image: backbone
---

As a frontend developer, you might find yourself in a situation where you have to work with unRESTful endpoints. If you are working with Backbone, Backbone models follow traditional REST. As mentioned in the [docs for Backbone.sync()](http://backbonejs.org/#Sync):

* create → POST   /collection
* read → GET   /collection[/id]
* update → PUT   /collection/id
* patch → PATCH   /collection/id
* delete → DELETE   /collection/id

If you need to modify what verbs and endpoints are used for methods `fetch()`, `save()`, and `destroy()`, you can override `Backbone.sync` on a per model basis to accomodate custom endpoints and HTTP verbs.

For example, imagine you have an `Order` model and it needs to make a POST request to `/api/orders/cancelOrder` when `model.destroy()` is called as opposed to the default DELETE request.

```js
var Order = Backbone.Model.extend({
  sync: function(method, model, options) {
    switch(method) {
      case 'delete':
        options.url = '/api/orders/cancelOrder';
        return Backbone.sync('create', model, options);
      case 'read':
        options.url = '/api/orders/' + model.get('order_id');
        return Backbone.sync(method, model, options);
      case 'update':
        // handle update ...
      case 'create':
        // handle create ...
    }
  }
});
```

And it is as simple as that. And corresponding unit tests using Jasmine 2 for our custom implementation of `Backbone.sync`:

```js
describe('Order', function() {
  describe('destroy()', function() {
    it('should make a post request instead of a delete request', function() {
      var spy = spyOn($, 'ajax');
      var order = new Order(/* data here */);
      order.destroy();

      expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
        type: 'POST',
        url: '/api/orders/cancelOrder'
      }));
    });
  });

  describe('fetch()', function() {
    it('should make a post request instead of a delete request', function() {
      var spy = spyOn($, 'ajax');

      var order = new Order({ id: 99 });
      order.fetch();

      expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
        type: 'GET',
        url: '/api/orders/99'
      }));
    });
  });
});
```
