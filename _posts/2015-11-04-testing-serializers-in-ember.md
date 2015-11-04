---
layout: post
title:  "Testing Serializers in Ember"
date:   2015-11-04
keywords: Ember, testing, serializers, JavaScript, unit test, Ember.js, EmberJS
---

Every time you generate a serializer in Ember, it generates a corresponding unit test file.

```
ember g serializer cat
# create app/serializers/cat.js
# create tests/unit/serializers/cat-test.js
```

The template for the serializer unit test looks something like this:

```js
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('cat', 'Unit | Serializer | cat', {
  // Specify the other units that are required for this test.
  needs: ['serializer:cat']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
```

But how do you go about testing methods like `normalizeResponse`, `keyForRelationship`, or any of the other serializer methods? In the generated code above, neither `record` nor `serializedRecord` are instances of the serializer. Even if they were, I typically don't interact with serializers directly. I use serializers indirectly through the data store. Because of that, I have found it most useful to write my unit tests for serializers by using the store.

## Testing normalizeResponse()

I have an API endpoint `/cats` that returns the following JSON:

```json
[
  { "id": 1, "name": "Tubby" },
  { "id": 2, "name": "Spot" },
  { "id": 3, "name": "Chestnut" }
]
```

Because I am using the `RESTSerializer`, I want to make sure the serializer transforms this JSON payload into the proper format that it expects. If you are using the `RESTSerializer`, your JSON payload is expected to be in the format:

```json
{
  "cats": [
    { "id": 1, "name": "Tubby" },
    { "id": 2, "name": "Spot" },
    { "id": 3, "name": "Chestnut" }
  ]
}
```

So here is my following unit test:

```js
import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

var server;

moduleForModel('cat', 'Unit | Serializer | cat', {
  needs: ['serializer:cat'],
  beforeEach() {
    server = new Pretender(function() {
      this.get('/cats', function() {
        var response = [
          { "id": 1, "name": "Tubby" },
          { "id": 2, "name": "Spot" },
          { "id": 3, "name": "Chestnut" }
        ];

        return [200, { "Content-Type": "application/json" }, JSON.stringify(response)];
      });
    });
  },
  afterEach() {
    server.shutdown();
  }
});

test('it serializes array responses', function(assert) {
  return this.store().findAll('cat').then((cats) => {
    assert.equal(cats.get('length'), 3);
  });
});
```

I am using Pretender to fake out requests made to `/cats` and specified a static response in the same format that I expect the backend to return. Next, in my test I can access an instance of the data store (`DS.Store`) by calling `this.store()`. In order for this to be an asynchronous test, you return a promise from the test. This is noted on the `ember-qunit` [documentation](https://github.com/rwjblue/ember-qunit):

> If you return a promise from a test callback it becomes an asyncTest. This is a key difference between ember-qunit and standard QUnit.

Inside the success callback, I write my assertions. Here I am simply checking that the length of the `RecordArray` is 3 which corresponds to the number of cats returned from the API.

Here is the implementation of the serializer:

```js
// serializers/cat.js

import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload = {
      cats: payload
    };

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
```

## Testing keyForRelationship()

Testing `keyForRelationship` is similar. Every `cat` belongs to a `home`. In this example the relationship between `cat` and `home` is not asynchronous, but that doesn't matter. Here are the models:

```js
// models/cat.js
export default DS.Model.extend({
  name: DS.attr('string'),
  home: DS.belongsTo('home', { async: false })
});

// models/home.js
export default DS.Model.extend({
  address: DS.attr('string')
});
```

This time, each cat returned from `/cats` has a foreign key `home_id` that points to the home the cat belongs to. By default, the `RESTSerializer` does not relate models using the `XXX_id` convention. Instead, it uses the relationship key name as the default. So if I wanted my JSON to fit what Ember Data expects, it would need to look like this:

```json
{ "id": 1, "name": "Tubby",    "home": 1 },
{ "id": 2, "name": "Spot",     "home": 1  },
{ "id": 3, "name": "Chestnut", "home": 1  }
```

Here is the test for the JSON using the `XXX_id` convention for related models:

```js
import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';
import Ember from 'ember';

var server;

moduleForModel('cat', 'Unit | Serializer | cat', {
  needs: ['serializer:cat', 'model:home'],
  beforeEach() {
    server = new Pretender(function() {
      this.get('/cats', function() {
        var response = [
          { "id": 1, "name": "Tubby",    "home_id": 1 },
          { "id": 2, "name": "Spot",     "home_id": 1  },
          { "id": 3, "name": "Chestnut", "home_id": 1  }
        ];

        return [200, { "Content-Type": "application/json" }, JSON.stringify(response)];
      });
    });
  },
  afterEach() {
    server.shutdown();
  }
});

test('belongsTo relationship uses foreign keys in the format XXX_id', function(assert) {
  Ember.run(() => {
    this.store().push({
      data: {
        id: '1',
        type: 'home',
        attributes: {
          address: '123 Ocean Boulevard, Miami, FL'
        }
      }
    });
  });

  return this.store().findAll('cat').then((cats) => {
    assert.equal(cats.objectAt(0).get('home.address'), '123 Ocean Boulevard, Miami, FL');
  });
});
```

In the `needs` array, I need to specify the related `home` model. Because my relationship is synchronous, I need to put the corresponding `home` into the store. Now when I retrieve all cats, I take the first one from the result and check if the related home model is correct by simply checking the `address` property.

Here is the implementation of `keyForRelationship`:

```js
// serializers/cat.js

import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload = {
      'deploy-requests': payload
    };

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  keyForRelationship: function(key, relationship) {
    if (relationship === 'belongsTo') {
      return key.underscore() + "_id";
    }
  }
});
```

## Conclusion

Here is the [full source code](https://github.com/skaterdav85/ember-cats) for the examples used in this post and all the passing tests.

Personally I have found testing serializers through the store to be the most straightforward since I never directly interact with serializers. If you test serializers differently, let me know your approach in the comments!
