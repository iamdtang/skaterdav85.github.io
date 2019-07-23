---
layout: post
title: Embedded Records in Ember Data with JSON:API
date: 2019-07-21
description: This post covers how I used embedded records with a JSON:API-ish response.
twitter_image: ember.png
twitter_image_alt: Ember.js logo
card_style: summary
keywords: Ember Data, EmbeddedRecordsMixin, embedded records, JSON:API, JSON-API, embedded attributes, embedded relationships
image: ember
---

Let's say we have a `GET /posts` API endpoint and it returns the following JSON:API-ish response:

```json
{
  "data": [
    {
      "id": "1",
      "type": "posts",
      "attributes": {
        "title": "Post A",
        "body": "...",
        "tags": [
          {
            "id": "1",
            "name": "JavaScript"
          },
          {
            "id": "2",
            "name": "Node.js"
          }
        ]
      }
    },
    {
      "id": "2",
      "type": "posts",
      "attributes": {
        "title": "Post B",
        "body": "...",
        "tags": [
          {
            "id": "1",
            "name": "JavaScript"
          },
          {
            "id": "3",
            "name": "Ember.js"
          }
        ]
      }
    }
  ]
}
```

In Ember Data, we'd probably want to model `tags` as a `hasMany` relationship to a `post` model:

```js
import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  title: attr('string'),
  tags: hasMany('tag', { async: false })
});
```

Unfortunately, this API isn't responding with `tags` as a JSON:API relationship. What can we do? If you're familiar with the [`EmbeddedRecordsMixin`](https://api.emberjs.com/ember-data/3.10/classes/DS.EmbeddedRecordsMixin), you might think to try using that:

```js
import DS from 'ember-data';

const { JSONAPISerializer, EmbeddedRecordsMixin } = DS;

export default JSONAPISerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    tags: {
      embedded: 'always'
    }
  }
});
```

However, this doesn't work, since the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPISerializer) expects JSON:API relationships as opposed to nested attributes.

One approach to get this working would be to normalize the payload and turn `tags` into a JSON:API relationship, which means transforming the above payload into the following:

```json
{
  "data": [
    {
      "id": "1",
      "type": "posts",
      "attributes": {
        "title": "Post A",
        "body": "..."
      },
      "relationships": {
        "tags": {
          "data": [
            {
              "id": "1",
              "type": "tags"
            },
            {
              "id": "2",
              "type": "tags"
            }
          ]
        }
      }
    },
    {
      "id": "2",
      "type": "posts",
      "attributes": {
        "title": "Post B",
        "body": "..."
      },
      "relationships": {
        "tags": {
          "data": [
            {
              "id": "1",
              "type": "tags"
            },
            {
              "id": "3",
              "type": "tags"
            }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "id": "1",
      "type": "tags",
      "attributes": {
        "name": "JavaScript"
      }
    },
    {
      "id": "2",
      "type": "tags",
      "attributes": {
        "name": "Node.js"
      }
    },
    {
      "id": "3",
      "type": "tags",
      "attributes": {
        "name": "Ember.js"
      }
    }
  ]
}
```

We could do this by creating a custom `post` serializer that extends [`JSONAPISerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPISerializer) and override the `normalizeFindAllResponse` method (assuming `store.findAll('post')` is being called):

```
ember g serializer post
```

```js
// app/serializers/post.js
import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data.forEach((resource) => {
      resource.relationships = {
        tags: {
          data: resource.attributes.tags.map((tag) => {
            return {
              id: tag.id,
              type: 'tags'
            };
          })
        }
      };
    });

    payload.included = payload.data
      .map((resource) => {
        return resource.attributes.tags;
      })
      .flat()
      .map((tag) => {
        let resource = {
          id: tag.id,
          type: 'tags'
        };

        delete tag.id;
        resource.attributes = tag;
        return resource;
      });

    return this._super(...arguments);
  }
});
```

[Check out a demo if you'd like to see this in action.](https://github.com/skaterdav85/json-api-embedded-records/pull/2)

What do you think? Personally I found this solution to be a lot of code to have to write and maintain.

If we look at the `GET /posts` response again, if we remove the keys `data`, `type`, and `attributes`, it looks pretty similar to the expected payload structure of the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONSerializer). Although unconventional, why not try using the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONSerializer) alongside the [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPIAdapter) instead of the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPISerializer)? By doing so, we can then leverage the [`EmbeddedRecordsMixin`](https://api.emberjs.com/ember-data/3.10/classes/DS.EmbeddedRecordsMixin) for `tags`. Let's try it!

If you'd like to learn more about the different serializers, read my other blog post [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html).

```js
// app/serializers/post.js
import DS from 'ember-data';

const { JSONSerializer, EmbeddedRecordsMixin } = DS;

export default JSONSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    tags: {
      embedded: 'always'
    }
  },
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    let newPayload = payload.data.map(({ id, attributes }) => {
      return { id, ...attributes };
    });

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }
});
```

I also need to create a serializer for the `tag` model that extends from [`JSONSerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONSerializer), since each tag in the payload follows the structure expected by that serializer:

```
ember g serializer tag
```

```js
// app/serializers/tag.js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend();
```

[Check out a demo if you'd like to see this in action.](https://github.com/skaterdav85/json-api-embedded-records/pull/1)

What do you think? To me, it is less code and much simpler.

Here is another way we could implement the `post` serializer:

```js
// app/serializers/post.js
import DS from 'ember-data';

const { JSONSerializer, EmbeddedRecordsMixin } = DS;

export default JSONSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    tags: {
      embedded: 'always'
    }
  },
  normalize(typeClass, { id, attributes }) {
    return this._super(typeClass, { id, ...attributes });
  },
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, payload.data, id, requestType);
  }
});
```

Instead of mapping over the array in `normalizeFindAllResponse` as we did in our previous implementation, we can let Ember Data do that and just override the `normalize` hook which gets called for each resource. I _think_ this approach might result in one less loop than our last implementation since we eliminated the `map` call, but I could be wrong. If anyone knows, please drop a line in the comments!

## Conclusion

Ideally, this API would use a JSON:API relationship for `tags`. However, for one reason or another, I have run into this scenario enough times where relationships aren't used and the API won't be changed. Although unconventional, in these cases I found it useful to use the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONSerializer) alongside the [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPIAdapter) instead of the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/3.10/classes/DS.JSONAPISerializer).

{% include ember-data-promo.html %}
