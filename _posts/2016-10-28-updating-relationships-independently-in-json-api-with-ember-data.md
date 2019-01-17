---
layout: post
title: Updating Relationships Independently in JSON:API with Ember Data
date: 2016-10-28
description: Did you know that JSON:API supports updating relationships independently at URLs from relationship links? Learn how to do this with Ember Data.
keywords: ember data, updating relationships, json:api, json-api, updating relationships independently at URLs from relationships links, updating resources, resource relationships, relationship links, adapterOptions
image: ember
---

In JSON:API, relationships can be modified when updating resources. For example, if you wanted to add or remove tags from an article, you could make a PATCH request to `/articles/:id` with the following request payload:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "Updating Relationships Independently with Ember Data and JSON:API"
    },
    "relationships": {
      "tags": {
        "data": [
          { "type": "tags", "id": "2" },
          { "type": "tags", "id": "3" }
        ]
      }
    }
  }
}
```

The tags listed under `relationships` will replace every tag for article 1. This is the default behavior in Ember Data when updating models. The code to trigger this request payload might look something like:

```js
model.get('tags').pushObject(tag); // tag = an existing tag record
model.save();
```

Did you know that JSON:API also supports updating relationships independently at URLs from relationship links? Instead of sending the associated tags in an article resource, we could make a PATCH request to `/articles/1/relationships/tags` that only contains the tags. For example:

```json
{
  "data": [
    { "type": "tags", "id": "2" },
    { "type": "tags", "id": "3" }
  ]
}
```

To clear every tag for article 1, we can similarly do:

```json
{
  "data": []
}
```

You can learn more about updating relationships in JSON:API in the [spec](http://jsonapi.org/format/#crud-updating-relationships).

How can we do this in Ember Data? It turns out, the model's `save()` method can take in an options object with a key called `adapterOptions`, which gets set on the snapshot that is passed to both the adapter and serializer.

With `adapterOptions`, we can pass in a flag so that we can change the URL in the adapter and serialize the request payload in the serializer accordingly. For example, instead of `model.save()`, we could do:

```js
model.save({
  adapterOptions: { updateRelationship: 'tags' }
});
```

You can create whatever key you want in `adapterOptions`, but I've called it `updateRelationship` and set its value to `"tags"`.

First, let's change the URL from `/articles/:id` to `/articles/:id/relationships/tags` by overriding the `urlForUpdateRecord()` method.

```js
// app/adapters/article.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  urlForUpdateRecord(id, modelName, snapshot) {
    let originalUpdateURL = this._super(...arguments);
    let { adapterOptions } = snapshot;
    if (adapterOptions && adapterOptions.updateRelationship === 'tags') {
      return `${originalUpdateURL}/relationships/tags`;
    }

    return originalUpdateURL;
  }
});
```

We'll check if `adapterOptions` is available on the snapshot and change the URL accordingly.

Next, let's change the request payload:

```js
// app/serializers/article.js
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot) {
    let serialized = this._super(...arguments);
    let { adapterOptions } = snapshot;
    if (adapterOptions && adapterOptions.updateRelationship === 'tags') {
      return serialized.data.relationships.tags;
    }

    return serialized;
  }
});
```

Because `serialize()` already serializes the relationship, we can call the original behavior and pick off the serialized relationship data if `adapterOptions.updateRelationship` was supplied.

If the API returns a 204 No Content response without a response document, we're done! If there is a response document, then you'll have to normalize it to the article resource or have the promise resolve with `null` in the adapter.

```js
// app/adapters/article.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  // ...
  updateRecord(store, type, snapshot) {
    let promise = this._super(...arguments);
    let { adapterOptions } = snapshot;
    if (adapterOptions && adapterOptions.updateRelationship) {
      return promise.then(() => {
        return null;
      });
    }
    return promise;
  }
});
```

For the purposes of this post, I've hardcoded `"tags"` in the adapter and serializer, but you could make this more generic for updating other relationships independently and use this approach in your application adapter and serializer.

One last thing. I've found my calling code to be slightly less readable with the following:

```js
model.save({
  adapterOptions: { updateRelationship: 'tags' }
});
```

Instead, I'd prefer something like:

```js
model.save('tags');
```

To achieve this, we can override `save()` in the model:

```js
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  tags: DS.hasMany(),
  save(relationshipKey) {
    if (typeof relationshipKey === 'string') {
      let adapterOptions = {
        updateRelationship: relationshipKey
      };
      return this._super({ adapterOptions });
    }

    return this._super(...arguments);
  }
});
```

{% include promo.html %}
