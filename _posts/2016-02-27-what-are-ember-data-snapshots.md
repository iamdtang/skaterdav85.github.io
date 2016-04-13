---
layout: post
title: What are Ember Data Snapshots?
date: 2016-02-27
description: If you've had to work with Ember Data and non-standard APIs, you may have dug into the adapters and serializers a bit and seen snapshot as a parameter to a few of the methods. Let me show you what a snapshot is and why you might need to use it.
keywords: Ember Data snapshot, DS.Snapshot, snapshots, snapshot, nested resources, custom API, nested URL, nested endpoint, override serialize method, RESTSerializer, JSONSerializer, customizing serializers, customizing adapters, custom adapters, custom serializer
---

If you've had to work with Ember Data and non-standard APIs, you may have dug into the adapters and serializers a bit and seen `snapshot` as a parameter to a few of the methods. If you dug a little deeper, you may have learned that a snapshot is an instance of `DS.Snapshot`, a private class in Ember Data. If you visit the API docs for this class, it doesn't really tell you what it is. It just tells you what methods and properties are available on snapshots. So what is a snapshot and why do you care?

In a <a href="https://vimeo.com/146840596" target="blank">great video on Ember Data</a> by Ember Data Core Team member <a href="https://twitter.com/christofferp" target="blank">@ChristofferP</a>, Christoffer defines a snapshot as something that:

> "Represents a record that you can inspect without causing side-effects."

He goes on to explain that snapshots were introduced to the library because there were issues when trying to inspect asynchronous model relationships during serialization that might trigger fetches which required dealing with promises making things complicated. Check out the video at 37:42 as he does a great job at explaining it.

So anyways, why might you need to use a snapshot? You probably won't have to instantiate a snapshot yourself as it is a private class, but you may run into situations where you'll need to know how to use it if you're dealing with a custom API. The API of a snapshot is the following:

```js
// Get the ID of the record
snapshot.id

// Get an attribute of the record
snapshot.attr('name')

// Get a hasMany relationship for the record
// Returns another snapshot
snapshot.hasMany('toys')

// Get a belongsTo relationship for the record
// Returns another snapshot
snapshot.belongsTo('user')

// Get the original record
snapshot.record
```

With `snapshot.belongsTo()` and `snapshot.hasMany()`, you can access relationships synchronously regardless if those relationships were declared on your model as asynchronous or synchronous. That data will be returned in another snapshot if it has been loaded into the store. `null` will be returned if the relationship is known but data for that relationship wasn't loaded into the store. And lastly, `undefined` will be returned if the relationship is unknown.

Let's look at a practical example.

## Handling Nested Resource Paths

One situation you might need to use a snapshot is in the adapter when determining a URL before a request is made. For example, what if you want to create a `pet` record, and the endpoint for creation has a nested resource path like `/api/users/:id/pets` instead of the default `api/pets`? In the adapter, we can use the snapshot to compute this URL in `urlForCreateRecord()`.

```js
// app/adapters/pet.js
export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    let userID = snapshot.belongsTo('user').id;
    return `/${this.namespace}/users/${userID}/pets`;
  }
});
```

Here we are grabbing the `belongsTo` `user` relationship which gives us another snapshot for the `user`, and accessing the ID. This same technique can be used for computing the URL for other operations like deleting and updating records.

If you need to access a model's computed property in the adapter, you can use:

```js
snapshot.record.get('someComputedProperty');
```

If you'd like to work with nested resources for data retrieval, read more about it in my other blog post [Handling Nested Resources in Ember Data](/2016/02/21/handling-nested-resources-in-ember-data.html).

## Serializing Data Sent to the Persistence Layer

Another reason you might have to use a snapshot is when serializing data sent to your API when saving it, if your API doesn't follow the conventions expected by the serializer you are using. The `serialize()` method can be overridden to control the outgoing data format and its argument is a snapshot.

```js
// app/serializers/pet.js
export default DS.JSONSerializer.extend({
  serialize(snapshot) {
    // send the new pet data as an array instead of an object
    // with the first item containing the new pet data
    return [
      {
        name: snapshot.attr('name'),
        age: snapshot.attr('age'),
        user_id: snapshot.belongsTo('user').id
      }
    ];
  }
});
```

In this example, maybe the backend requires that the payload is an array where the first object contains the newly created data. This format isn't really common in APIs, but it is a situation I have run into. You can customize the format to whatever you need in this method.

## Conclusion

Snapshots represent records that you can inspect without causing side effects. This means you can access attributes and relationships off of a record in a synchronous manner without having to deal with promises or causing side effects like triggering Ember Data to request that related data.

{% include promo.html %}
