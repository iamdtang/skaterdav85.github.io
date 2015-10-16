---
layout: post
title:  "The Adapter Pattern in JavaScript"
date:   2015-10-16
keywords: JavaScript design patterns, adapter pattern, adapter design pattern
---

The adapter design pattern is very useful in JavaScript when it comes to data fetching and persistence. The travel adapter is the most common comparison for this pattern. If you have a three-pronged electrical plug, it won't fit in a two-prong wall outlet. Instead, you need to use a travel adapter to convert energy from the wall outlet to the plug you have.  

[Wikipedia](https://en.wikipedia.org/wiki/Adapter_pattern) defines the adapter pattern as:

> "In software engineering, the adapter pattern is a software design pattern that allows the interface of an existing class to be used from another interface. It is often used to make existing classes work with others without modifying their source code."

A great example of the adapter pattern in JavaScript is Ember Data. Ember Data creates a layer for managing your data. By default it will assume standard REST conventions for fetching, creating, updating, and deleting your data. However, not everyone follows REST for their APIs. Ember Data allows you to create custom adapters so you can work with non-RESTful APIs. If your API changes, you can simply update your custom adapter, or opt-in to one of the provided adapters, and the rest of your application code doesn't have to change. Have you ever been in the situation where a backend developer introduces a new API and to use it requires a lot of changes? If this is you, the adapter pattern can help you!

Let's build something practical of our own using the adapter pattern. If you think about a shopping cart for an e-commerce site, there are a couple ways you are likely to implement it. You could store the shopping cart items on the server, or you could store them on the client-side in local storage. Each approach has its advantages and disadvantages.

## Shopping Cart Example with Local Storage

Let's say we decide to implement the shopping cart using local storage. Here is an implementation:

```js
function ShoppingCart() {}

ShoppingCart.prototype.add = function(item) {
  var items = localStorage.getItem('cart');
  if (items) {
    items = JSON.parse(items);

    if (items[item.id]) {
      items[item.id].quantity += 1;
    } else {
      item.quantity = 1;
      items[item.id] = item;
    }
  } else {
    items = {};
    item.quantity = 1;
    items[item.id] = item;
  }

  items = JSON.stringify(items);
  localStorage.setItem('cart', items);
  return item;
};
```

Working with the `ShoppingCart` class would look like the following:

```js
var cart = new ShoppingCart();
cart.add({ id: 1, product: 'movie 1' }); // quantity is 1 for product 1
cart.add({ id: 2, product: 'movie 2' }); // quantity is 1 for product 2
cart.add({ id: 1, product: 'movie 1' }); // quantity is 2 for product 1
```
The basic idea here is that I only want to add an item to the cart __once__ based on the item's `id`. If a duplicate item is added to the cart (adding an item with the same `id` more than once) then the cart will simply increment the quantity.

So far this implementation is ok. It works. However, imagine your boss comes to you and asks you to implement it using a server side approach. Now you have to change everything that deals with local storage in the `ShoppingCart` class and swap it with an AJAX call. Furthermore, if you have tests for `ShoppingCart`, all of those tests would need to change as well.

A better approach to this implementation is to separate out the shopping cart logic from the data persistence layer and leave that up to an adapter. Adapters can be created that deal with data persistence for local storage, sending AJAX requests to a server, or using a Backend-as-a-Service. As long as the adapters all abide by a common "interface" / code contract, the `ShoppingCart` class and its corresponding tests can remain untouched and any adapter can be used interchangeably. Simply tell the `ShoppingCart` instance to use a different adapter and everything should work as is.

## Shopping Cart Example with Adapters

Let's start off by creating two adapters; one for storing items in local storage and one for sending items through AJAX to our server. One issue with these two approaches is that working with local storage is synchronous and working with AJAX is asynchronous. The solution around this is to implement the local storage adapter as asynchronous so both return promises. In my example, I will use jQuery deferreds and promises.

Here is the local storage adapter:

```js
var localStorageAdapter = {
  findAll: function() {
    var deferred = new $.Deferred();
    var items = localStorage.getItem('cart');

    if (items) {
      items = JSON.parse(items);
    }

    deferred.resolve(items);
    return deferred.promise();
  },

  save: function(items) {
    var deferred = new $.Deferred();

    items = JSON.stringify(items);
    localStorage.setItem('cart', items);
    deferred.resolve();
    return deferred.promise();
  }
};
```

And here is an adapter for sending an AJAX request to our server:

```js
var serverSideAdapter = {
  findAll: function() {
    return $.ajax({
      url: '/shopping-cart'
    }).then(function(response) {
      return response.items;
    });
  },

  save: function(items) {
    return $.ajax({
      url: '/shopping-cart',
      type: 'post',
      data: {
        items: items
      }
    });
  }
};
```

These two adapters abide by a contract of having methods `findAll()` and `save()`. Both of these methods take the same arguments and return promises. Now let's reimplement `ShoppingCart` to use either adapter.

```js
function ShoppingCart(adapter) {
  this.adapter = adapter;
}

ShoppingCart.prototype.add = function(item) {
  var adapter = this.adapter;
  var deferred = new $.Deferred();

  adapter.findAll().then(function(items) {
    if (items) {
      if (items[item.id]) {
        items[item.id].quantity += 1;
      } else {
        item.quantity = 1;
        items[item.id] = item;
      }
    } else {
      items = {};
      item.quantity = 1;
      items[item.id] = item;
    }

    adapter.save(items).then(function() {
      deferred.resolve(item);
    });
  });

  return deferred.promise();
};
```

To hook our `ShoppingCart` with the local storage adapter, we can pass it in and use it as follows:

```js
var cart = new ShoppingCart(localStorageAdapter);
cart.add({ id: 1, product: 'movie 1' }).then(function(item) { }); // quantity is 1 for product 1
cart.add({ id: 2, product: 'movie 2' }).then(function(item) { }); // quantity is 1 for product 2
cart.add({ id: 1, product: 'movie 1' }).then(function(item) { }); // quantity is 2 for product 1
```

If we wanted to use the `serverSideAdapter`, we can pass that in:

```js
var cart = new ShoppingCart(serverSideAdapter);
```

Nothing in `ShoppingCart` needs to change! If our boss comes along and wants to switch to using a Backend-as-a-Service, we can simply write a new adapter that follows the same contract, pass it in to our `ShoppingCart` instance, and no code has to change.

## Conclusion

Hopefully from this practical example you can see the power of the adapter pattern. Creating adapters for data fetching and persistence tends to be a common scenario. You never know when APIs and backends will change, so it is great when you can write your JavaScript code in such a way that requires little change on your end. Hope this helped, and let me know how you've used the adapter pattern in your JavaScript code in the comments!
