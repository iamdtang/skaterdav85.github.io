---
layout: post
title: Which Ember Data Serializer Should I Use?
date: 2015-12-05
last_modified_at: 2020-01-18
description: A serializer in Ember Data is used to normalize response payloads and serialize request payloads as data is transferred between the client and the server. This post covers the serializers that ship with Ember Data.
keywords: ember, ember data, ember data serializer, jsonserializer, jsonapiserializer, restserializer, data store, DS, serializer, api
image: ember
---

A serializer in Ember Data is used to normalize response payloads and serialize request payloads as data is transferred between the client and the server. Ember Data comes with a few serializers:

1. `JSONSerializer`
2. `RESTSerializer`
3. `JSONAPISerializer`
4. `Serializer`

Which one should we use? The answer depends on what our API looks like. Let's dig into each one.

## 1. JSONSerializer

The `JSONSerializer`, not to be confused with the `JSONAPISerializer`, is a serializer that can be used for APIs that simply send the data back and forth without extra metadata. For example, let's say we make a request to `/api/users/8`. The expected JSON response is:

```json
{ "id": 8, "first": "David", "last": "Tang" }
```

The response is very flat and only contains the data. The data isn't nested under any keys like `data` as you often find with other APIs and there is no metadata. Similarly, if we are creating or updating records, the expected response is the record that was created or modified:

```json
{ "id": 99, "first": "David", "last": "Tang" }
```

What about endpoints like `/api/users` that return arrays? As we might guess, the expected response is an array of users:

```json
[
  { "id": 8, "first": "David", "last": "Tang" },
  { "id": 9, "first": "Jane", "last": "Doe" }
]
```

If our model is related to other models with `hasMany` and `belongsTo` relationships:

```js
// app/models/user.js
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') first;
  @attr('string') last;
  @hasMany('pet', { async: true }) pets;
  @belongsTo('company', { async: true }) company;
}
```

then our JSON response would look like the following:

```json
{
  "id": 99,
  "first": "David",
  "last": "Tang",
  "pets": [ 1, 2, 3 ],
  "company": 7
}
```

The `pets` and `company` attributes contains the unique identifiers for each individual pet and company respectively. If the relationships are asynchronous (`{ async: true }`), Ember Data will asynchronously load these related models when we need them, like if we access the related data in our template.

## 2. RESTSerializer

The `RESTSerializer` differs from the `JSONSerializer` in that it introduces an extra key in the response that matches the model name. For example, if a request is made to `/api/users/8`, the expected JSON response is:

```json
{
  "user": {
    "id": 8,
    "first": "David",
    "last": "Tang",
    "pets": [ 1, 2, 3 ],
    "company": 7
  }
}
```

The root key is `user` and matches the model name. Similarly if a request is made to `/api/users`, the expected JSON response is:

```json
{
  "users": [
    {
      "id": 8,
      "first": "David",
      "last": "Tang",
      "pets": [ 1, 2, 3 ],
      "company": 7
    },
    {
      "id": 9,
      "first": "Jane",
      "last": "Doe",
      "pets": [ 4 ],
      "company": 7
    }
  ]
}
```

This time the root key, `users`, is the plural of the model name since an array is being returned. It can also be in the singular form as both work.

In the previous `user` example using the `JSONSerializer`, `pets` and `company` were asynchronously loaded from the server. One of the benefits of using the `RESTSerializer` is that it supports sideloading of data, which allows us to embed related records in the response of the primary data requested. For example, when a request is made to `/api/users/8`, a response with sideloaded data would look like:

```json
{
  "user": {
    "id": 8,
    "first": "David",
    "last": "Tang",
    "pets": [ 1, 3 ],
    "company": 7
  },
  "pets": [
    { "id": 1, "name": "Fiona" },
    { "id": 3, "name": "Biscuit" }
  ],
  "companies": [
    { "id": 7, "name": "Company A" }
  ]
}
```

The response has keys `pets` and `companies` that correspond to the sideloaded data. This was not possible with the `JSONSerializer`. Using sideloaded data also enables us to make our model relationships synchronous:

```js
// app/models/user.js
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') first;
  @attr('string') last;
  @hasMany('pet', { async: false }) pets; // synchronous
  @belongsTo('company', { async: false }) company; // synchronous
}
```

If we wanted our relationships to be synchronous with the `JSONSerializer`, we would need to make sure that all companies and pets were loaded in the store prior to requesting the user, or use embedded records, which you can learn about in my post [Working With Nested Data In Ember Data Models](/2016/01/29/working-with-nested-data-in-ember-data-models.html#3-embedded-records).

## 3. JSONAPISerializer

The `JSONAPISerializer` is the last serializer and it expects data to adhere to the [JSON:API specification](http://jsonapi.org/). For an endpoint that returns a single object, like `/api/users/8`, a JSON:API compliant response would be:

```json
{
  "data": {
    "type": "users",
    "id": "8",
    "attributes": {
      "first": "David",
      "last": "Tang"
    }
  }
}
```

The `attributes` property contains the data, the `type` property contains the plural form of the model name, and the `id` property contain the model's id. One thing to note is that attributes need to be hyphenated. If our attribute was `firstName` instead of `first`, the attribute key name would be `first-name`.

For an endpoint that returns an array of objects, such as `/api/users`, a JSON:API compliant response would be:

```json
{
  "data": [
    {
      "type": "users",
      "id": "8",
      "attributes": {
        "first": "David",
        "last": "Tang"
      }
    },
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "first": "Jane",
        "last": "Doe"
      }
    }
  ]
}
```

Again, there is a `data` key but this time it contains an array. Each element in the array matches the same structure as when fetching a single resource. That is, an object with keys `type`, `id`, and `attributes`.

What about relationships? To handle the `hasMany` pet relationship when a user is requested, this is the expected JSON:API structure:

```json
{
  "data": {
    "type": "users",
    "id": "8",
    "attributes": {
      "first": "David",
      "last": "Tang"
    },
    "relationships": {
      "pets": {
        "data": [
          { "id": 1, "type": "pets" },
          { "id": 3, "type": "pets" }
        ]
      }
    }
  }
}
```

As you can see, there is a `relationships` object in the primary `data` object. This example just shows the `pets` relationship but we can have as many as we need in the `relationships` object. If we look carefully at `data.relationships.pets.data`, each element in the array is not the `pet` definition. It just contains the `id` and the `type`.

Lastly, what about sideloading data? We can use `included` for sideloading:

```json
{
  "data": {
    "type": "users",
    "id": "8",
    "attributes": {
      "first": "David",
      "last": "Tang"
    },
    "relationships": {
      "pets": {
        "data": [
          { "id": 1, "type": "pets" },
          { "id": 3, "type": "pets" }
        ]
      }
    }
  },
  "included": [
    {
      "type": "pets",
      "id": "1",
      "attributes": {
        "name": "Fiona"
      }
    },
    {
      "type": "pets",
      "id": "3",
      "attributes": {
        "name": "Biscuit"
      }
    }
  ]
}
```

The `included` key is used for sideloading data and contains an array of all related data. User 8 has 2 pets declared under `relationships`. The data in the `included` array contains the associated records using the same object structure for a single resource (having keys for `type`, `id`, and `attributes`).

There is a lot more to JSON:API, so check out the specification for more information.

## 4. Serializer

The `Serializer` class is an abstract class that `RESTSerializer`, `JSONSerializer`, and `JSONAPISerializer` extend from. As mentioned in the Ember Guides, we could use this serializer if our API is wildly different and one of the other serializers cannot be used.

## Conclusion

Hopefully this provids a good overview of what is expected by each serializer so you can easily determine which one fits your project's needs.

{% include ember-data-promo.html %}
