---
layout: post
title: Handling Foreign Key Attributes in an API with Ember Data
date: 2019-08-02
description: This post covers how to deal with foreign key type of attributes in an API with Ember Data.
twitter_image: ember.png
twitter_image_alt: Ember.js logo
card_style: summary
keywords: Ember Data, foreign key, belongs to, belongsTo, relationship
image: ember
---

Something I see frequently in APIs are attributes that map to foreign key columns. For example, let's say we have the following response from an endpoint `GET /animals/0`:

```json
{
  "id": "0",
  "name": "Faith",
  "species": "cow",
  "sanctuaryId": "3"
}
```

Here, there is an attribute `sanctuaryId` that probably came from a foreign key database column `sanctuary_id`.

Those new to Ember Data might create a model like this:

```js
// app/models/animal.js
import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  species: attr('string'),
  sanctuaryId: attr('number')
});
```

The attribute `sanctuaryId` can then be used to look up a `sanctuary` record with an `id` of `3`.

Now although this can work, what ends up happening is the need to look up the `sanctuary` record by this `sanctuaryId` attribute in other parts of the app.

First, the `store` will need to be injected if the current context doesn't have access to the store. Then, something like the following will happen:

```js
let sanctuary = this.store.peekRecord('sanctuary', animal.sanctuaryId);
```

Maybe the current context already has the full list of sanctuaries. In that case, we'd have to do something like the following:

```js
let sanctuary = sanctuaries.find((sanctuary) => {
  return sanctuary.id === animal.sanctuaryId;
});
```

Or if you're familiar with [`findBy`](https://api.emberjs.com/ember/3.11/classes/EmberArray/methods/findBy?anchor=findBy) in Ember:

```js
let sanctuary = sanctuaries.findBy('id', animal.sanctuaryId);
```

Not bad, but it can be tedious to write if it occurs in multiple places and if there are multiple foreign key type of attributes. Also, this extra code makes the app unnecessarily more complex.

We can do better and eliminate this lookup by leveraging a `belongsTo` relationship.

Instead, we'll define our `animal` model like this:

```js
// app/models/animal.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  species: attr('string'),
  sanctuary: belongsTo('sanctuary', { async: false })
});
```

Here I am assuming that all of the sanctuaries have already been loaded into the Ember Data store (which is often times the scenario) so I made the relationship synchronous.

So how does Ember Data map `sanctuary` to `sanctuaryId`? It won't as it currently stands. If `sanctuaryId` was `sanctuary`, everything would work. If this can't be changed at the API level, we can do this mapping in the `animal` serializer. For example:

```js
// app/serializers/animal.js
import JSONSerializer from '@ember-data/serializer/json';

export default JSONSerializer.extend({
  attrs: {
    sanctuary: 'sanctuaryId'
  }
});
```

Boom! Everything now works!

Now when we need to reference the sanctuary for a given animal, we can simply do `animal.sanctuary`. Much simpler, right?

Assuming that all relationships follow this `Id` suffix convention, we could take this a step further and automatically do this by overriding [`keyForRelationship`](https://api.emberjs.com/ember-data/3.11/classes/JSONSerializer/methods/keyForRelationship?anchor=keyForRelationship) in the `application` serializer. For example:

```js
// app/serializers/application.js
import JSONSerializer from '@ember-data/serializer/json';

export default JSONSerializer.extend({
  keyForRelationship(key, relationship, method) {
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }

    return this._super(...arguments);
  }
});
```

In my experience, foreign key type of attributes have come up frequently in JSON:API responses as well even though JSON:API relationships should be used.  Although unconventional, you can use the `JSONAPIAdapter` with the `JSONSerializer`, which I wrote about in [Embedded Records in Ember Data with JSON:API](/2019/07/21/embedded-records-in-ember-data-with-json-api.html) and follow the same approach I took in this post.

{% include ember-data-promo.html %}
