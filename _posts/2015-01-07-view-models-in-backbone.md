---
layout: post
title:  "An Approach to View-Models in Backbone"
date:   2015-01-07
categories: ['JavaScript', 'Backbone']
keywords: Backbone View-Models, Backbone View Models, Backbone Controllers, View Models in Backbone, View-Models in Backbone
image: backbone
---

One of the difficult parts I am experiencing when working with Backbone is separating out display logic properties from models. Let's look at a simple example where we display a user model in a view and allow the user's email address to be edited.

## The Problem

```js
var User = Backbone.Model.extend({
  url: '/users'
});

var UserView = Backbone.View.extend({
  template: Handlebars.compile($('script[data-template-name="user"]').html()),
  events: {
    'click .edit-email': 'editEmail',
  },

  editEmail: function(e) {
    e.preventDefault();
    this.model.set('editEmail', true);
  }
});

var user = new User({
  id: 1,
  first: 'David',
  last: 'Tang',
  email: 'dtang85@gmail.com'
});

var userView = new UserView({
  model: user
});

userView.render();
```

And the corresponding _UserView_ template using Handlebars.

```html
{% raw %}
{{#if editEmail}}
  <input type="text" value="{{email}}">
{{else}}
  {{email}}
  <a href="#" class="edit-email">Edit</a>
{{/if}}
{% endraw %}
```

Whenever the edit button is clicked, the template switches from displaying the email and edit button to a text input where the email can be edited.

So imagine I click on that edit button. If I call `user.toJSON()`, the object will be:

```js
{
  "id": 1,
  "first": "David",
  "last": "Tang",
  "email": "dtang85@gmail.com",
  "editEmail": true
}
```

Now let's say the API I am working with only allows certain properties to be sent across. In the case of this example, the API expects only properties _id_, _first_, _last_, and _email_. If unexpected properties are sent across, like _editEmail_, the API returns an error response.

Essentially the _User_ model has beome polluted with display specific properties. One solution you might consider would be to write a custom AJAX call and override the `save()` method. This could work, but do you really want to do that for all your models? Probably not.

One of the things I really liked about Ember is how it defines controllers as a way to decorate models with display logic properties. There is a clear separation between the data models and the UI specific properties. Similarly in Angular, you can bind data to `$scope` or `this` if you are using the _controller-as_ syntax, both which act as view-models and can be decorated with display specific properties.

## A Solution

A solution I came up with was to introduce a _view-model_ into Backbone called `ViewModel` that extends `Backbone.Model`. Here are the requirements:

#### 1. The view-model should accept any number of properties containing Backbone models

```js
var vm = new ViewModel({
  user: user, // a User model instance
  address: address // an Address model instance
});
```

This could be improved to allow for infinite nested models, but this should suffice.

#### 2. The view-model should call toJSON() on the data models attached to it

```js
var vm = new ViewModel({
  user: user
});

vm.toJSON();
// { user: { id: 1, first: 'David', last: 'Tang', email: 'dtang85@gmail.com' } }

vm.set('editEmail', true);
// { user: { id: 1, first: 'David', last: 'Tang', email: 'dtang85@gmail.com' }, editEmail: true }
```

#### 3. The view-model should emit "change" and "change:{property}" events when its models change.

```js
var vm = new ViewModel({
  user: user
});

vm.on('change', function() {
  console.log('change event emitted');
});

vm.on('change:user', function() {
  console.log('change:user event emitted');
});

vm.get('user').set('email', 'davidtang@someemail.com');

// "change" event emitted
// "change:user" event emitted
```

## The Implementation

```js
var ViewModel = Backbone.Model.extend({
  constructor: function(options) {
    Object.keys(options).forEach(function(key) {
      var vm = this;

      if (options[key] instanceof Backbone.Model) {
        options[key].on('change', function() {
          vm.trigger('change');
          vm.trigger('change:' + key);
        });
      }
    }, this);

    return Backbone.Model.apply(this, arguments);
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

    Object.keys(json).forEach(function(key) {
      var value = this.get(key);

      if (value instanceof Backbone.Model) {
        json[key] = value.toJSON();
      }
    }, this);

    return json;
  }
});
```

## Conclusion

This is just one implementation I am experimenting with. I haven't tried it in the application I am building at work, but I am considering it. Please let me know what you think in the comments and what solutions you have tried/considered.

## Related Posts

* [5 Reasons Why A Backbone Developer Loves Ember](http://davidtang.io/javascript/ember/backbone/2015/01/06/5-reasons-why-a-backbone-developer-loves-ember.html)
