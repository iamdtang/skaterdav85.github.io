---
layout: post
title: Extracting Metadata from a Custom API with Ember Data
date: 2018-04-06
last_modified_at: 2018-09-20
description: This post covers how to extract metadata from a custom API with Ember Data.
twitter_image: extracting-metadata-with-ember-data.png
twitter_image_alt: screenshot of code from this blog post
keywords: ember data, metadata, meta, ember, custom, API, backend, non-standard, extractMeta
image: ember
---

When querying an API, sometimes metadata is returned such as pagination information. For example:

```js
{
  post: [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
    { id: 3, title: 'Post 3' }
  ],
  meta: {
    total: 100
  }
}
```

With the response above, we can access `meta` off of the result of our `store.query()` call:

```js
export default Route.extend({
  model() {
    return this.store.query('post', { page: 1 });
  },
  afterModel(posts) {
    console.log('Meta: ', posts.get('meta')); // { total: 100 }
  }
});
```

Great, but what if our API isn't structured like above? Let's say we have something like this instead:

```js
{
  total: 100,
  items: [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
    { id: 3, title: 'Post 3' }
  ]
}
```

This response doesn't match what any of the built-in serializers expect. If you're not familiar with the different Ember Data serializers, check out my other post, [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html).

Let's try normalizing this response for `JSONSerializer`:

```js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  normalizeQueryResponse(store, ModelClass, payload, id, requestName) {
    return this._super(store, ModelClass, payload.items, id, requestName);
  }
});
```

Cool, that works. Next, let's extract the metadata. Looking at the API documentation for `JSONSerializer`, my first thought was to use the [`extractMeta(store, ModelClass, payload)`](https://www.emberjs.com/api/ember-data/3.0/classes/JSONSerializer/methods/extractMeta?anchor=extractMeta) method. I tried something like this:

```js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  normalizeQueryResponse(store, ModelClass, payload, id, requestName) {
    return this._super(store, ModelClass, payload.items, id, requestName);
  },
  extractMeta(store, ModelClass, payload) {
    console.log('payload', payload);
  }
});
```

Unfortunately, the payload logged to the console in `extractMeta` was the following:

```js
[
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
  { id: 3, title: 'Post 3' }
]
```

No sight of that `total` property. It turns out, `extractMeta()` gets called after `normalizeQueryResponse()`, so `payload` in `extractMeta` isn't the original payload; it is the normalized one. If we think about it, `JSONSerializer` expects an array of resources and doesn't allow for a `meta` object in the payload. You may be asking, why is this method even present on this class? Good question! If you know the answer, please let me know in the comments 😃. (See the end of this post for an update.)

So how can we make this work? Instead of extending `JSONSerializer`, we can extend `RESTSerializer`:

```js
import DS from 'ember-data';

const { RESTSerializer } = DS;

export default RESTSerializer.extend({
  normalizeQueryResponse(store, ModelClass, payload, id, requestName) {
    payload[ModelClass.modelName] = payload.items;
    delete payload.items;
    return this._super(...arguments);
  },
  extractMeta(store, ModelClass, payload) {
    let { total } = payload;
    payload.meta = { total };
    delete payload.total;
    return this._super(...arguments);
  }
});
```

Here we are normalizing the payload to match what `RESTSerializer` expects, which involves changing the `items` key to `post`. The normalized payload gets passed into `extractMeta`, which still has `total`. We can then assign `total` as a property in a `meta` object.

That's it! Now the result of `store.query()` has a `meta` property. 🙌

In closing, although we could have used either `JSONSerializer` or `RESTSerializer` to normalize this payload, `RESTSerializer` allows for extracting metadata off of collection responses. This might be one thing to consider when working with a custom API and deciding on which serializer to extend.

[Here is the code from this post.](https://github.com/skaterdav85/extracting-metadata-in-ember-data)

## UPDATE - {{page.last_modified_at | date: "%B %e, %Y"}}

After talking with [@Runspired](https://twitter.com/Runspired), it turns out you can use `JSONSerializer` to extract metadata.

```js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  normalizeQueryResponse(store, ModelClass, payload, id, requestName) {
    let normalized = this._super(store, ModelClass, payload.items, id, requestName);
    normalized.meta = this.extractMeta(store, ModelClass, payload);
    return normalized;
  },
  extractMeta(store, ModelClass, payload) {
    let meta = {
      total: payload.total
    };

    return meta;
  }
});
```

In this implementation with `JSONSerializer`, the payload is first normalized into JSON:API since Ember Data uses that internally. Then, we can call `extractMeta` ourselves with the raw payload and assign the result as the `meta` property on the normalized payload.

{% include ember-data-promo.html %}

Comments for this post can be found [on this GitHub issue.](https://github.com/skaterdav85/extracting-metadata-in-ember-data/issues/1)
