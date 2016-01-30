---
layout: post
title: Ember Data and Custom APIs - 5 Common Serializer Customizations
date: 2016-01-23
description: When I first started working with Ember Data in the 1.X days, one of the most frustrating things was having to work with custom APIs. In this post, I'd like to share a few common ways to customize serializers that others might be wanting to make as well, especially those new to the framework.
keywords: ember data, custom api, custom serializers, customizing adapters, customizing ember data, ember, primary key, foreign key, ember embedded model, nested data, data root key, adapter vs serializer, custom apis, custom backends
---

When I first started working with Ember Data in the 1.X days, one of the most frustrating things was having to work with custom APIs. This wasn't because of Ember Data but because I was new to it and there is a lot to learn. I was motivated to use Ember Data but I just couldn't get it to work with whatever API I was using at the time. Do I massage the data in an adapter or a serializer? What is the difference between `normalizeReponse()` and `normalize()` in serializers? How do I handle related data that is nested? I had lots of questions like these. Even today I see a lot of the same questions being asked on the Ember Discussion Forum about getting Ember Data to work with custom APIs. In this post, I'd like to share a few common ways to customize serializers that others might be wanting to make as well, especially those new to the framework.

If your API is built with Rails, then it's likely it is following the conventions expected by Ember Data and everything just works. For those who don't have control over the API, some customizations might be needed to manipulate responses before they are handed off to the data store or data is sent back to the server. This data massaging happens in the serializer layer.

> A serializer in Ember Data is used to massage data as it is transferred between the client and the persistence layer. This includes manipulating attribute values, normalizing property names, serializing relationships, and adjusting the structure of request payloads and responses.

Before we get started, it might be useful to read my other post [Which Ember Data Serializer Should I Use?](2015/12/05/which-ember-data-serializer-should-i-use.html) which goes into detail about the serializers built into Ember and their expected formats.

## 1. normalizeResponse() and normalize()

Imagine you make a GET request to `/cats` and your API returns a JSON response containing an array of items under a root key called `data`.

```json
{
  "data": [
    { "id": 1, "name": "Tubby" },
    { "id": 2, "name": "Frisky" },
    { "id": 3, "name": "Tabitha" }
  ]
}
```

This format is pretty similar to the `RESTSerializer` format, except the root key is `data` as opposed to the model name. One way we can manipulate this is by creating a model specific serializer that extends `RESTSerializer` and override `normalizeResponse()`:

```
ember generate serializer cat
```

```js
// app/serializers/cat.js
export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload = {
      cats: payload.data
    };

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
```

The `normalizeResponse()` method is used to normalize a payload from the server to a JSON-API document (the JSON API spec). Rather than creating and returning the JSON-API document directly, we can instead modify the payload to fit the `RESTSerializer` conventions, that is, a payload with a root key containing the model name, and calling `this._super()` which will return a JSON-API compliant document. I have found this approach to be simpler than massaging the data to fit the JSON-API format directly.

Another way we could have handled this is by using the `JSONSerializer`.

```js
// app/serializers/cat.js
export default DS.JSONSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, payload.data, id, requestType);
  }
});
```

Because `JSONSerializer` expects the payload to contain the data without any root keys, we can simply extract that `data` property.

Similar to `normalizeResponse()`, serializers also have methods that match specific data store calls. For example, if you want to normalize data only when `store.findAll()` is called, you can use `normalizeFindAllResponse()` instead.

To normalize only a single model for an endpoint such as `/cats/1`, use the `normalize()` method.

```js
export default DS.JSONSerializer.extend({
  normalize(modelClass, resourceHash, prop) {
    return this._super(modelClass, resourceHash.data, prop);
  }
});
```

Both `RESTSerializer` and `JSONSerializer` can be extended, but which approach is better? This brings us to the next customization: handling relationships.


## 2. Handling Relationships

Now imagine your payload looks like this:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Tubby",
      "breed": { "id": 4, "name": "Bengal cat" }
    },
    {
      "id": 2,
      "name": "Frisky",
      "breed": { "id": 6, "name": "Persian cat" }
    }
  ]
}
```

and your model looks like this:

```js
// app/models/cat.js
export default DS.Model.extend({
  name: DS.attr('string'),
  breed: DS.belongsTo('breed', { async: false })
});
```

Each cat has a `belongsTo` relationship to another model called `breed`. The related data is nested within each cat object as opposed to being sideloaded. In its current format, the `breed` relationship won't be setup properly. Let's change that by overriding `normalizeResponse()`:

```js
// app/serializers/cat.js
export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    let breeds = this._collectBreeds(payload.data);
    let cats = this._normalizeCats(payload.data);
    let normalizedPayload = {
      cats: cats,
      breeds: breeds
    };

    return this._super(store, primaryModelClass, normalizedPayload, id, requestType);
  },

  _collectBreeds(cats) {
    return cats.map((cat) => {
      return cat.breed;
    });
  },

  _normalizeCats(cats) {
    return cats.map((cat) => {
      cat.breed = cat.breed.id;
      return cat;
    });
  }
});
```

By extending `RESTSerializer`, we can extract `breed` from each `cat` and create a payload where the related data is sideloaded under the key `breeds`. We also need to modify `breed` on each `cat` so that it equals `breed.id` as opposed to the full `breed` object.

__EDIT:__ [There is a simpler way to do this using embedded records.](/2016/01/29/working-with-nested-data-in-ember-data-models.html)

So back to the question, should you extend `RESTSerializer` or `JSONSerializer`? If you have nested models, extend `RESTSerializer` so that you can normalize the related data to be sideloaded.

## 3. Mapping Attributes to Model Properties

Many APIs return properties that are snake_cased:

```json
[
  {
    "id": 1,
    "first_name": "Tubby",
    "years": 4
  }
]
```

Although you could work with snake_cased attributes in your app, this isn't the JavaScript convention. If you'd like to map these to camelCased properties, or map any attribute to another property on your model for that matter, you can specify this mapping in the `attrs` attribute.

```js
// app/serializers/cat.js
export default DS.RESTSerializer.extend({
  attrs: {
    firstName: 'first_name',
    age: 'years'
  }
});
```

`first_name` gets mapped to `firstName` and `years` gets mapped to `age` on your model.

Note there is an ember addon to help automate mapping snake_cased attributes to camelCased attributes called
Ember Data ActiveModel Adapter that you might find useful.

## 4. Relationship Attributes

Using the `attrs` attribute can be useful if you want to map specific attributes. But what if your API follows a convention of `xxx_id` for every `belongsTo` relationship? This is a pretty common convention in relational databases that you end up seeing in APIs. For every model you'd have to create a serializer and specify the attribute mappings in `attrs`. Instead, a better way might be to override the method `keyForRelationship` in an `application` serializer.

```js
// app/serializers/application.js
export default DS.RESTSerializer.extend({
  keyForRelationship(key, relationship) {
    if (relationship === 'belongsTo') {
      return `${key}_id`;
    }
  }
});
```

Now a JSON payload with foreign keys like `home_id` and `owner_id` can map to our model attributes `home` and `owner` containing `belongsTo` relationships:

```json
{
  "cat": {
    "id": 1,
    "name": "Fiona",
    "home_id": 3,
    "owner_id": 2
  }
}
```

```js
// app/models/cat.js
export default DS.Model.extend({
  name: DS.attr('string'),
  home: DS.belongsTo('home'),
  owner: DS.belongsTo('owner')
});
```

## 5. Setting the Primary Key

Ember Data expects every record to have an attribute called `id`. If a record needs to use another field as its id, you can specify this using the `primaryKey` property:

```js
// app/serializers/user.js
export default DS.RESTSerializer.extend({
  primaryKey: 'socialSecurityNumber'
});
```

Here we are changing the `id` attribute to be `socialSecurityNumber` instead for the `user` model. When you want to access `socialSecurityNumber` throughout your application, you can do:

```js
model.get('id');
```

If all of your records use a property like `_id` as the `id`, then you might want to override `primaryKey` in an application serializer. If you want to override `id` for a specific model such as in this example, then you might want to create a model specific serializer.

## Conclusion

There are different takes on what API payloads should look like and they won't always follow the formats expected by the default Ember Data serializers. Hopefully this post helps reduce some of the frustration that I experienced when I first started using Ember Data with custom APIs. What serializer customizations have you made? Let me know in the comments!
