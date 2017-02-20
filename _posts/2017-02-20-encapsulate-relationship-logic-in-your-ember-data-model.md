---
layout: post
title: Encapsulate Relationship Logic In Your Ember Data Model
date: 2017-02-20
description: One technique I often like to do when I am refactoring is move relationship logic outside of an action into the Ember Data model behind a custom method. Let me show you.
keywords: ember, ember data, relationship, relationships, model, belongsTo, hasMany
---

One technique I often like to do when I am refactoring is move relationship logic outside of an action into the Ember Data model behind a custom method. Here's an example:

```js
export default Ember.Controller.extend({
  actions: {
    addComment(post, body) {
      let comment = this.store.createRecord('comment', { body });
      post.get('comments').pushObject(comment);
      comment.save().then(() => {
        post.save();
      });
    }
  }
});
```

Let's say in my app I have a button that is wired up to the `addComment` controller action. When the action is fired, the `comment` record is created, associated with the `post`, and both the `comment` and `post` are saved.

Instead of interacting with the store and the `comments` relationship on the `post` model, I like to move this logic into a custom method on the `post` model. This way, the controller action can be simplified to this:

```js
export default Ember.Controller.extend({
  actions: {
    addComment(post, body) {
      post.addComment({ body });
    }
  }
});
```

The advantage of this is that the controller action becomes much more expressive because it is using the language of the domain instead of the CRUD language of the store. The data concerns can be left to the model while the UI concerns can be left to the action. If the action doesn't have to deal with too many details related to records and relationships, maintenance can be much easier.

Here is what the `post.addComment` implementation might look like:

```js
// app/models/post.js
export default DS.Model.extend({
  body: DS.attr(),
  comments: DS.hasMany(),
  addComment(commentData) {
    let store = Ember.getOwner(this).lookup('service:store');
    let comment = store.createRecord('comment', commentData);
    this.get('comments').pushObject(comment);
    return comment.save().then(() => {
      return this.save();
    });
  }
});
```

Now, the `post` model has a custom method `addComment` that encapsulates the `comment` relationship logic instead of it being handled directly in the controller action.

One thing to note here is that models already have a property on them called `store`. However, according to the API docs for [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html), it isn't public. Therefore, I've opted to look up the store from the container via the `getOwner` API.

Here's another example. Let's say you have an action where a user can buy movie tickets.

```js
export default Ember.Controller.extend({
  actions: {
    buyMovieTickets(movie, seats) {
      let order = this.store.createRecord('order', { movie });
      seats.forEach((seat) => {
        order.get('seats').pushObject(seat);
      });
      return order.save();
    }
  }
});
```

First we have to create an `order` record and associate the `order` with the `movie`. Maybe the user had an interface to select seats, so we'll need to add each `seat` record to the `order`. Finally we'll need to save the `order`. This works, but if this action has presentation logic in there as well, the action can get long and maintenance can become more difficult.

Instead, I'd like the action to be simpler and express the intent more clearly in the language of the domain. So maybe something like this:

```js
export default Ember.Controller.extend({
  actions: {
    buyMovieTickets(movie, seats) {
      return movie.buyTickets(seats);
    }
  }
});
```

Now, the `movie` model can handle the specifics of creating an `order`, associating the `movie` with the `order`, associating the selected seats with the `order`, and finally saving the `order` record. Here is what `movie.buyTickets` might look like:

```js
// app/models/movie.js
export default DS.Model.extend({
  orders: DS.hasMany(),
  buyTickets(seats) {
    let store = Ember.getOwner(this).lookup('service:store');
    let order = store.createRecord('order', { movie: this });
    seats.forEach((seat) => {
      order.get('seats').pushObject(seat);
    });
    return order.save();
  }
});
```

Pushing off relationship logic into a custom method in the model can make actions much more expressive, and helps separate data responsibilities from controller/UI logic.

Thanks for reading!
