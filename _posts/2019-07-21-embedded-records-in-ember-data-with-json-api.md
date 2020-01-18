---
layout: post
title: Embedded Records in Ember Data with JSON:API
date: 2019-07-21
last_modified_at: 2020-01-18
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
// app/models/post.js
import Model, { attr, hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') title;
  @hasMany('tag', { async: false }) tags;
});
```

Unfortunately, this API isn't responding with `tags` as a JSON:API relationship. What can we do? If you're familiar with the [`EmbeddedRecordsMixin`](https://api.emberjs.com/ember-data/release/classes/EmbeddedRecordsMixin), you might think to try using that:

```js
// app/serializers/post.js
import JSONAPISerializer from '@ember-data/serializer/json-api';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONAPISerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    tags: {
      embedded: 'always'
    }
  };
}
```

However, this doesn't work, since the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer) expects JSON:API relationships as opposed to nested attributes.

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

We could do this by creating a custom `post` serializer that extends [`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer) and override the `normalizeFindAllResponse` method (assuming `store.findAll('post')` is being called):

```
ember g serializer post
```

```js
// app/serializers/post.js
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PostSerializer extends JSONAPISerializer {
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

    return super.normalizeFindAllResponse(...arguments);
  }
}
```

[Check out a demo if you'd like to see this in action.](https://github.com/skaterdav85/json-api-embedded-records/pull/2)

What do you think? Personally I found this solution to be a lot of code to have to write and maintain.

If we look at the `GET /posts` response again, if we remove the keys `data`, `type`, and `attributes`, it looks pretty similar to the expected payload structure of the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.15/classes/JSONSerializer). Although unconventional, why not try using the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.15/classes/JSONSerializer) alongside the [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter) instead of the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer)? By doing so, we can then leverage the [`EmbeddedRecordsMixin`](https://api.emberjs.com/ember-data/release/classes/EmbeddedRecordsMixin) for `tags`. Let's try it!

If you'd like to learn more about the different serializers, read my other blog post [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html).

```js
// app/serializers/post.js
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    tags: {
      embedded: 'always'
    }
  };

  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    let newPayload = payload.data.map(({ id, attributes }) => {
      return { id, ...attributes };
    });

    return super.normalizeFindAllResponse(store, primaryModelClass, newPayload, id, requestType);
  }
}
```

I also need to create a serializer for the `tag` model that extends from [`JSONSerializer`](https://api.emberjs.com/ember-data/3.15/classes/JSONSerializer), since each tag in the payload follows the structure expected by that serializer:

```
ember g serializer tag
```

```js
// app/serializers/tag.js
import JSONSerializer from '@ember-data/serializer/json';

export default class TagSerializer extends JSONSerializer {}
```

[Check out a demo if you'd like to see this in action.](https://github.com/skaterdav85/json-api-embedded-records/pull/1)

What do you think? To me, it is less code and much simpler.

Here is another way we could implement the `post` serializer:

```js
// app/serializers/post.js
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    tags: {
      embedded: 'always'
    }
  };

  normalize(typeClass, { id, attributes }) {
    return super.normalize(typeClass, { id, ...attributes });
  }

  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    return super.normalizeFindAllResponse(store, primaryModelClass, payload.data, id, requestType);
  }
};
```

Instead of mapping over the array in `normalizeFindAllResponse` as we did in our previous implementation, we can let Ember Data do that and just override the `normalize` hook which gets called for each resource. I _think_ this approach might result in one less loop than our last implementation since we eliminated the `map` call, but I could be wrong. If anyone knows, please drop a line in the comments!

## Conclusion

Ideally, this API would use a JSON:API relationship for `tags`. However, for one reason or another, I have run into this scenario enough times where relationships aren't used and the API won't be changed. Although unconventional, in these cases I found it useful to use the [`JSONSerializer`](https://api.emberjs.com/ember-data/3.15/classes/JSONSerializer) alongside the [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter) instead of the [`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer).

{% include ember-data-promo.html %}
