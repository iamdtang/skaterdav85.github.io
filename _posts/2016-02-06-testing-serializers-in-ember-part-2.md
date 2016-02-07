---
layout: post
title: Testing Serializers in Ember - Part 2
date: 2016-02-06
description: Not too long ago I wrote about Testing Serializers in Ember. The examples in the post went over testing the serialization process on responses and verifying methods like normalizeResponse and keyForRelationship worked correctly. But what if you want to verify that data is serialized correctly when it is sent to your API? Let me show you my approach that has worked well for me.
keywords: Ember, testing, serializers, JavaScript, unit test, Ember.js, EmberJS, Ember Data, adapter, serialize, RESTSerializer
---

Not too long ago I wrote about [Testing Serializers in Ember](/2015/11/04/testing-serializers-in-ember.html). The examples in the post went over testing the serialization process on responses and verifying methods like `normalizeResponse` and `keyForRelationship` worked correctly. But what if you want to verify that data is serialized correctly when it is sent to your API? Let me show you my approach that has worked well for me.

Let's say I have a `cat` model. When I create a new `cat` and call `save()`, imagine the API expects the request payload to look like this:

```json
{
  "cats": [
    { "name": "Frisky" }
  ]
}
```

as opposed to the expected request payload format (we are using the `RESTSerializer` but this process could work for the other serializers as well):

```json
{
  "cats": {
    "name": "Frisky"
  }
}
```

The `serialize` method can be overridden to control the outgoing data format:

```js
// app/serializers/cat.js
export default DS.RESTSerializer.extend({
  serialize(snapshot) {
    return {
      cats: [
        { name: snapshot.attr('name') }
      ]
    };
  }
});
```

I want to test that the outgoing data is formatted correctly.

## The Test

Whenever I am testing serializers, I use Pretender to mock out the backend. One of the great things about Pretender is that keeps track of requests that were handled and those that were not in 2 public properties: `handledRequests` and `unhandledRequests`.

For this situation, we can use `handledRequests` to access the POST request that was made and inspect the request payload to verify that the data was formatted correctly.

First we need to set up Pretender and mock our endpoint:

```js
moduleForModel('cat', 'Unit | Serializer | cat', {
  needs: ['serializer:cat'],
  beforeEach() {
    this.server = new Pretender(function() {
      this.post('/api/cats', function() {
        let response = {
          cat: { id: 1, name: 'frisky' }
        };

        return [ 200, {}, JSON.stringify(response) ];
      });
    });
  },
  afterEach() {
    this.server.shutdown();
  }
});
```

Next, we can write our test:

```js
test('save() sends the data formatted correctly', function(assert) {
  assert.expect(1);
  let store = this.store();

  Ember.run(() => {
    let cat = store.createRecord('cat', {
      name: 'frisky'
    });

    cat.save().then(() => {
      let [ request ] = this.server.handledRequests;
      let requestPayload = JSON.parse(request.requestBody);
      assert.deepEqual(requestPayload, {
        cats: [
          { name: 'frisky' }
        ]
      });
    });
  });
});
```

Here we are simply creating a `cat` record and calling `save()`. `handledRequests` is an array containing objects for each handled request. Because we are only dealing with 1 request here, we can access the first array element using array destructuring. Each handled request object has a property `requestBody`, which contains the request payload as a JSON string. With that, we can check to make sure the data sent across correctly.

## Conclusion

I have to deal with a lot of APIs that don't follow the conventions of the `JSONSerializer`, `RESTSerializer`, or `JSONAPISerializer` so I find it necessary to test every serializer customization. This process has worked great for me so far. However, if your persistence layer isn't HTTP based, such as a local storage backend, this approach wouldn't work since you wouldn't be using Pretender. Have you tested a similar situation differently? If so, I would love to hear about it in the comments!
