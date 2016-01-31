---
layout: post
title: Working With Nested Data In Ember Data Models
date: 2016-01-29
description: In today's post, I'd like to share a few ways of how you can work with nested data in Ember Data models.
keywords: ember data, nested models, embedded models, nested data, nested records, embedded records, model relationships, belongsTo, hasMany, nesting models, embedding models, nesting data, embedding data
---

In today's post, I'd like to share a few ways of how you can work with nested data in Ember Data models.

## 1. Nested Objects

Let's say you have the following JSON for a `user`:

```json
{
  "id": 5,
  "name": "David",
  "address": {
    "street": "123 Main St.",
    "zip": 90003
  }
}
```

You might not need `address` to be its own model. If that's the case, don't specify a transform when declaring the `address` attribute on the model:

```js
// app/models/user.js
export default DS.Model.extend({
  name: DS.attr('string'),
  address: DS.attr()
});
```

By not using a transform for `address` (nothing is passed to `DS.attr()`), Ember Data will just pass through the data and set it on the model. To change a specific property on the address, you can do:

```js
model.set('address.street', '1234 New St.');
```

## 2. Nested Arrays

Now let's say you have the following JSON for a `user`.

```json
{
  "id": 5,
  "name": "David",
  "history": [
    { "url": "http://google.com", "time": "2015-10-01T20:12:53Z" },
    { "url": "http://apple.com",  "time": "2014-10-01T20:12:53Z" },
    { "url": "http://yahoo.com",  "time": "2013-10-01T20:12:53Z" }
  ]
}
```

This time it has a `history` property containing an array of items. The model won't use any transform so the history data will be passed through and set on the model.

```js
export default DS.Model.extend({
  name: DS.attr('string'),
  history: DS.attr()
});
```

Similar to before, maybe each history item doesn't need to be its own model. If that's the case, there are two ways to work with the data. You might think you could modify a history item like below and expect the UI to update, especially if you are coming from the Angular world:

```js
model.get('history')[0].url = 'http://amazon.com';
```

However, this won't work. If you need to modify a specific history item, you will need to use `Ember.set`. For example:

```js
let googleItem = model.get('history')[0];
Ember.set(googleItem, 'url', 'http://amazon.com');
```

Using `Ember.set()` will change the property and notify Ember to rerender.

Alternatively, you can change the entire array, like if you were using `map()` or `filter()` on `Array.prototype`, and reassign the `history` attribute.

```js
model.set('history', modifiedHistory);
```

## 3. Embedded Records

The last approach to work with nested data is with embedded records using the mixin `DS.EmbeddedRecordsMixin`. Let's assume the JSON now looks like this:

```json
{
  "id": 5,
  "name": "David",
  "skills": [
    { "id": 2, "name": "JavaScript" },
    { "id": 6, "name": "PHP" },
    { "id": 9, "name": "Ember" }
  ]
}
```

Now you want each object under `skills` to be its own model and there to be a `hasMany` relationship between `user` and `skill`.

```js
// app/models/user.js
export default DS.Model.extend({
  name: DS.attr('string'),
  skills: DS.hasMany('skill')
});
```

To have Ember Data create the `hasMany` relationship, use the <a href="http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html" target="_blank">`DS.EmbeddedRecordsMixin`</a> in your serializer.

```js
// app/serializers/user.js
export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    skills: { embedded: 'always' }
  }
});
```

In the `attrs` property, set `skills` to `{ embedded: 'always' }`. This also works for a `belongsTo` relationship. This example is using the `JSONSerializer` but the same technique can apply to an API based on the `RESTSerializer`. However, this does not work with the `JSONAPISerializer` at the time of this writing when I used Ember Data 2.3.3.
