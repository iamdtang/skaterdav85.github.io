---
layout: post
title: Handling Nested Resources and Relationship Links in Ember Data
date: 2016-02-21
description: Many APIs use nested resource paths. That is, URL paths that contain a hierarchy of resource types. How do you handle that in Ember Data? Let me show you.
keywords: nested resources, ember data, relationship links, nested resource paths, nested resource URLs
---

__Updated 10/24/2016__

Many APIs use nested resource paths. That is, URL paths that contain a hierarchy of resource types. For example, a nested resource path might look something like: `/users/5/pets`, where there is a collection of `pet` resources under a `user` resource. How do you handle that in Ember Data?

Let's say we have a `user` model with asynchronous `belongsTo` and `hasMany` relationships:

```js
// app/models/user.js
export default DS.Model.extend({
  first: DS.attr('string'),
  last: DS.attr('string'),
  pets: DS.hasMany('pet', { async: true }),
  company: DS.belongsTo('company', { async: true })
});
```

Ember Data supports relationship links. What that means is that we can have a property called `links` on individual resource objects, which is an object that contains URLs that point to related data.

Let's say our API is following the `DS.RESTSerializer` format. Not sure about the differences between the different serializer formats? Check out the post [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html) With the `DS.RESTSerializer` format, that would look like:

```js
{
  "users": [
    {
      "id": 1,
      "first": "David",
      "last": "Tang",
      "links": {
        "company": "/api/v1/users/1/company",
        "pets": "/api/v1/users/1/pets"
      }
    }
    // ...
  ]
}
```

With the `DS.JSONSerializer` format, that would look like:

```js
[
  {
    "id": 1,
    "first": "David",
    "last": "Tang",
    "links": {
      "company": "/api/v1/users/1/company",
      "pets": "/api/v1/users/1/pets"
    }
  }
  // ...
]
```

Note, JSON:API uses `links` too, but the response format is a little different. Check out the [spec](http://jsonapi.org/) for more information on that.

If we made a request to `/api/v1/users`, each `user` resource object in the response can have a `links` property. When you access `user.pets` or `user.company`, Ember Data will trigger a fetch using these URLs defined in `links`.

As noted in the API documentation:

> The format of your links value will influence the final request URL via the urlPrefix method: Links beginning with //, http://, https://, will be used as is, with no further manipulation. Links beginning with a single / will have the current adapter's host value prepended to it. Links with no beginning / will have a parentURL prepended to it, via the current adapter's buildURL.

What if your API doesn't return a `links` property, and this is how your related data needs to be accessed? I have found this to be a pretty common scenario.

To handle this, we can add these relationship links manually in our serializer during the normalization process. Specifically, we can override one of the normalization methods in the serializer like `normalize()`, `normalizeResponse()`, `normalizeFindAllResponse()`, etc, and create a `links` property for each individual resource:

For example, if you are calling `store.findAll('user')`, you can override `normalizeFindAllResponse()`.

```js
// app/serializers/user.js
export default DS.RESTSerializer.extend({
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    payload.users.forEach((user) => {
      user.links = {
        pets: `/api/v1/users/${user.id}/pets`,
        company: `/api/v1/users/${user.id}/company`
      };
    });

    return this._super(...arguments);
  }
});
```

Here I have created a model-specific serializer to add `links` to each `user` resource. You could probably make this a little more dynamic and use it across the board in an `application` serializer. I'll leave that to you.

{% include promo.html %}
