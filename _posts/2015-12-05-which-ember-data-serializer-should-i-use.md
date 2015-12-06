---
layout: post
title: Which Ember Data Serializer Should I Use?
date: 2015-12-05
description: TBA
keywords: ember, ember data, ember data serializer, jsonserializer, jsonapiserializer, restserializer, data store, DS, serializer, api
---

A serializer in Ember Data is used to massage data as it is transferred between the client and the persistence layer. This includes manipulating attribute values, normalizing property names, serializing relationships, and adjusting the structure of request payloads and responses. Ember Data comes with a few serializers:

1. `DS.JSONSerializer`
2. `DS.RESTSerializer`
3. `DS.JSONAPISerializer`
4. `DS.Serializer`

Which one should you use? The answer is, choose the one that fits your API data format, or is as close to it as possible. But what format do each of these serializers expect? Let's find out.

## 1. JSONSerializer

`JSONSerializer`, not to be confused with `JSONAPISerializer`, is a serializer that can be used for APIs that simply send the data back and forth without extra meta information. For example, let's say I make a request to `/api/users/8`. The expected JSON response is:

```json
{ "id": 8, "first": "David", "last": "Tang" }
```

The response is very flat and only contains the data. The data isn't nested under any keys like `data` as you often find with other APIs and there is no metadata. Similarly, if you are creating, updating, and deleting records, respond with the record that was created, modified, or deleted:

```json
{ "id": 99, "first": "David", "last": "Tang" }
```

What about endpoints like `/api/users` that return arrays? As you'd probably guess, the expected response contains just the array of users:

```json
[
  { "id": 8, "first": "David", "last": "Tang" },
  { "id": 9, "first": "Jane", "last": "Doe" }
]
```

If your model is related to other models with `hasMany` and `belongsTo` relationships:

```js
export default DS.Model.extend({
  first: DS.attr('string'),
  last: DS.attr('string'),
  pets: DS.hasMany('pet', { async: true }),
  company: DS.belongsTo('company', { async: true })
});
```

then your JSON response would look like:

```json
{
  "id": 99,
  "first": "David",
  "last": "Tang",
  "pets": [ 1, 2, 3 ],
  "company": 7
}
```

The `pets` and `company` attributes contains the unique identifiers for each individual pet and company respectively. Ember Data will asynchronously load these related models when you need them, such as asking for them in your template.

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

This time the root key, `users`, is the plural of the model name since an array is being returned. It can also be in the singular form. Both work, but I tend to use the model name in its plural form for array responses and in its singular form for single object responses.

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

The response has keys `pets` and `companies` that correspond to the sideloaded data. This was not possible with the `JSONSerializer`. Using sideloaded data also enables you to make your model relationships synchronous:

```js
export default DS.Model.extend({
  first: DS.attr('string'),
  last: DS.attr('string'),
  pets: DS.hasMany('pet', { async: false }), // synchronous
  company: DS.belongsTo('company', { async: false }) // synchronous
});
```

If you wanted your relationships to be synchronous with the `JSONSerializer`, you would need to make sure that all companies and pets were in the store prior to requesting the user.

## 3. JSONAPISerializer

`JSONAPISerializer` is the last serializer and it expects data to adhere to the [JSON API specification](http://jsonapi.org/). For an endpoint that returns a single object, like `/api/users/8`, a JSON API compliant response would be:

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

The `attributes` property contains the data, the `type` property contains the plural form of the model name, and the `id` property contain the model's id. One thing to note is that attributes need to be dash-cased. If our attribute was `firstName` instead of `first`, the attribute key name would need to be `first-name`.

For an endpoint that returns an array of objects, such as `/api/users`, a JSON API compliant response would be:

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

What about relationships? To handle the `hasMany` pet relationship when a user is requested, this is the expected JSON API structure:

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

As you can see, there is a `relationships` object in the primary `data` object. This example just shows the `pets` relationship but you can have as many as you need in the `relationships` object. If you look carefully at `data.relationships.pets.data`, each element in the array is not the `pet` definition. It simply contains the `id` and the `type`.

Lastly, what about sideloading data?

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

Even though JSON API seems a little verbose, I like that there is a documented specification so that those who use it can have a common understanding of their API data structure. This is particularly useful in large teams. There is a lot more to JSON API, so check out the specification for more information.

## 4. Serializer

`DS.Serializer` is an abstract class that `RESTSerializer`, `JSONSerializer`, and `JSONAPISerializer` extend from. As mentioned in the Ember Guides, you would use this serializer if your API is wildly different and one of the other serializers cannot be used. Personally I haven't found myself in a situation where I've needed to do this, and hopefully you don't either!

## Conclusion

There is a lot more to these serializers, especially the `JSONAPISerializer`, but hopefully this helped point you in the right direction. To work efficiently with Ember Data, figure out what structure your API data is in and choose the serializer that best matches it. If you are starting from scratch and you have control over your API, try and go with a format that one of the serializers expects so that you don't have to massage your data too much. Also, following the expected format for one of the serializers makes it that much easier for other developers to hop onto your project. Hopefully this provided a good overview of what is expected by each serializer so you can easily determine which one fits your project's needs.
